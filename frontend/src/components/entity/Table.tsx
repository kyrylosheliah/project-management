import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState, type RowSelectionState, type SortingState } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import ButtonText from "../../ui/ButtonText";
import { type Entity } from "../../entities/Entity";
import { SearchSchema, searchStatesToParameters, type SearchParams } from "../../types/Search";
import ButtonIcon from "../../ui/ButtonIcon";
import type { z } from "zod";
import type EntityService from "../../entities/EntityService";
import { cx } from "../../utils/cx";
import { EntityFieldDisplay } from "./FieldDisplay";
import { Checkbox } from "../../ui/Checkbox";
import { IconChevronDown } from "../../ui/icons/ChevronDown";
import { IconChevronLeft } from "../../ui/icons/ChevronLeft";
import { IconChevronRight } from "../../ui/icons/ChevronRight";
import { IconChevronUp } from "../../ui/icons/ChevronUp";
import { IconEdit } from "../../ui/icons/IconEdit";
import { IconMagnifier } from "../../ui/icons/Magnifier";
import { IconPlus } from "../../ui/icons/Plus";
import { IconTrashBin } from "../../ui/icons/TrashBin";

export function EntityTable<
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>,
>(params: {
  pickerState?: [
    number | null,
    React.Dispatch<React.SetStateAction<number | null>>,
  ];
  relationFilter?: { key: string; value: any };
  service: EntityService<T, TSchema>;
  searchParams: {
    value: SearchParams;
    set: (nextSearch: SearchParams) => void;
  };
  edit?: boolean;
  className?: string;
}): JSX.Element {
  const metadata = params.service.metadata;
  const service = params.service;

  const sourceParameters = params.searchParams.value;

  const pagination: PaginationState = useMemo(() => ({
    pageIndex: sourceParameters.pageNo - 1,
    pageSize: 2, // sourceParameters.pageSize || 10,
  }), [sourceParameters.pageNo, sourceParameters.pageSize]);

  const [optimisticSorting, setOptimisticSorting] = useState<SortingState>(() => [{
    id: sourceParameters.orderByColumn,
    desc: !sourceParameters.ascending,
  }]);

  useEffect(() => {
    const newSorting = [{
      id: sourceParameters.orderByColumn,
      desc: !sourceParameters.ascending,
    }];
    setOptimisticSorting(newSorting);
  }, [sourceParameters.orderByColumn, sourceParameters.ascending]);

  const sorting: SortingState = useMemo(() => [{
    id: sourceParameters.orderByColumn,
    desc: !sourceParameters.ascending,
  },],[sourceParameters.pageNo, sourceParameters.ascending]);

  const [globalFilter, setGlobalFilter] = useState<string>("");

  const searchParams: SearchParams = useMemo(() => {
    let nextSearch = searchStatesToParameters({
      pagination,
      sorting,
      globalFilter,
    });
    if (params.relationFilter) {
      nextSearch.criteria[params.relationFilter.key] =
        params.relationFilter.value;
    }
    const result = SearchSchema.safeParse(nextSearch);
    if (!result.success) {
      console.log(result.error.format());
      console.log(nextSearch);
      alert(`Invalid search parameters, ${result.error.format()}`);
      return sourceParameters;
    }
    return nextSearch;
  }, [
    pagination,
    sorting,
    globalFilter,
    params.relationFilter,
    sourceParameters,
  ]);

  // Update searchParams when table state changes
  const handlePaginationChange = useCallback(
    (updater: any) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      const nextSearch = {
        ...searchParams,
        pageNo: newPagination.pageIndex + 1,
        pageSize: newPagination.pageSize,
      };
      params.searchParams.set(nextSearch);
    },
    [params.searchParams.value, pagination, sourceParameters]
  );

  const handleSortingChange = useCallback(
    (updater: any) => {
      const newSorting: SortingState =
        typeof updater === "function" ? updater(sorting) : updater;
      setOptimisticSorting(newSorting);
      const sortingColumn = newSorting[0]?.id || searchParams.orderByColumn;
      const nextSearch = {
        ...searchParams,
        orderByColumn: sortingColumn,
        ascending: !newSorting[0]?.desc,
        criteria: { [sortingColumn]: globalFilter },
      };
      params.searchParams.set(nextSearch);
    },
    [params.searchParams.value, optimisticSorting, pagination, sourceParameters]
  );

  const { data, isPending } = service.useSearch(searchParams);

  const entities = data !== undefined ? data.items : [];
  const pageCount = data !== undefined ? data.pageCount : 0;

  const navigate = useNavigate();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  if (params.pickerState !== undefined) {
    useEffect(() => {
      const [_, setSelectedRowId] = params.pickerState!;
      const selectedRows = entities.filter((row) => rowSelection[row.id]);
      setSelectedRowId(selectedRows.length ? selectedRows[0].id : null);
    }, [rowSelection]);
  }

  let columns: ColumnDef<T>[] = [];
  if (params.edit || params.pickerState) {
    columns.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          attributes={{
            disabled: !table.getIsSomeRowsSelected(),
            checked: table.getIsAllRowsSelected(),
            onChange: () => {},
            onClick: () => table.resetRowSelection(),
          }}
          indeterminate={table.getIsSomeRowsSelected()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          attributes={{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            onChange: () => {},
            onClick: row.getToggleSelectedHandler(),
          }}
        />
      ),
      enableSorting: false,
      enableResizing: false,
    });
  }
  columns = columns.concat(
    (Object.keys(metadata.fields) as (keyof T)[]).map((key) => ({
      header: metadata.fields[key].label,
      accessorKey: key,
      cell: (context) => (
        <EntityFieldDisplay
          fieldKey={key as any}
          fieldValue={context.getValue()}
          service={service}
        />
      ),
    }))
  );
  if (params.edit !== true) {
    columns.push({
      id: "open",
      header: "Info",
      cell: ({ row }) => (
        <ButtonText
          props={{
            onClick: () =>
              navigate({
                to: `${metadata.apiPrefix}/${row.original.id}`,
              }),
          }}
        >
          Open
        </ButtonText>
      ),
    });
  }

  const table = useReactTable<T>({
    data: entities,
    pageCount,
    columns,
    state: {
      sorting: optimisticSorting,
      globalFilter,
      pagination,
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (r) => r.id.toString(),
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: handlePaginationChange, //setPagination,
    //getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: handleSortingChange, //setSorting,
    //getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    //getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  });

  return (
    <div
      className={cx(
        "p-2 max-w-3xl gap-2 flex flex-col items-center rounded-md",
        params.className
      )}
    >
      <div className="w-full h-8 gap-2 flex flex-row justify-between items-center">
        <ButtonIcon props={{ disabled: isPending }} className="w-8 h-8">
          <IconPlus />
        </ButtonIcon>
        {table.getIsSomeRowsSelected() && (
          <>
            <ButtonIcon
              className="w-8 h-8"
              props={{
                onClick: () => {},
              }}
            >
              <IconEdit />
            </ButtonIcon>
            <ButtonIcon
              className="w-8 h-8"
              type="danger"
              props={{
                onClick: () => {},
              }}
            >
              <IconTrashBin />
            </ButtonIcon>
          </>
        )}
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-2 w-full h-full border rounded-md"
        />
        <ButtonIcon className="w-8 h-8">
          <IconMagnifier />
        </ButtonIcon>
      </div>

      {isPending ? (
        <p>Loading ...</p>
      ) : (entities.length > 0) ? (
        <div className="w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer pl-3 py-0.5 text-left text-nowrap"
                      >
                        <div className="flex flex-row flex-nowrap">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {
                            {
                              asc: <IconChevronDown />,
                              desc: <IconChevronUp />,
                            }[header.column.getIsSorted() as string]
                          }
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      row.getIsSelected() ? "bg-blue-100" : "hover:bg-gray-100"
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="pl-3 py-0.5 border-t">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 gap-4 flex flex-row justify-center items-center">
            <ButtonIcon
              props={{
                onClick: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
              }}
              className="w-8 h-8"
            >
              <IconChevronLeft />
            </ButtonIcon>
            <span>
              {`Page ${pagination.pageIndex + 1} of ${table.getPageCount()}`}
            </span>
            <ButtonIcon
              props={{
                onClick: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
              }}
              className="w-8 h-8"
            >
              <IconChevronRight />
            </ButtonIcon>
          </div>
        </div>
      ) : (
        <div>No {metadata.plural} found</div>
      )}
    </div>
  );
}
