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
import { useQuery } from "@tanstack/react-query";

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

  const { data, isPending } = useQuery({
    queryKey: [metadata.apiPrefix, "search", searchParams],
    queryFn: () => service.search(searchParams),
    enabled: true,
    placeholderData: (prev) => prev,
  });

  const entities = data !== undefined ? data.items : [];
  const pageCount = data !== undefined ? data.pageCount : 0;

  useEffect(() => {
    console.log("pagination changed");
  }, [pagination]);
  useEffect(() => {
    console.log("sorting changed");
  }, [sorting]);
  useEffect(() => {
    console.log("globalFilter changed");
  }, [globalFilter]);

  console.log("Table");

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
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14m-7 7V5"
            />
          </svg>
        </ButtonIcon>
        {table.getIsSomeRowsSelected() && (
          <>
            <ButtonIcon
              className="w-8 h-8"
              props={{
                onClick: () => {},
              }}
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"
                />
              </svg>
            </ButtonIcon>
            <ButtonIcon
              className="w-8 h-8"
              type="danger"
              props={{
                onClick: () => {},
              }}
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                />
              </svg>
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
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
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
                              asc: <ChevronDown />,
                              desc: <ChevronUp />,
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
          <div className="gap-2 flex flex-row justify-between items-center">
            <ButtonIcon
              props={{
                onClick: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
              }}
              className="w-8 h-8"
            >
              <ChevronLeft />
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
              <ChevronRight />
            </ButtonIcon>
          </div>
        </div>
      ) : (
        <div>No {metadata.plural} found</div>
      )}
    </div>
  );
}

const ChevronLeft = () => (
  <svg
    className="w-6 h-6"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m14 8-4 4 4 4"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    className="w-6 h-6"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m10 16 4-4-4-4"
    />
  </svg>
);

const ChevronDown = () => (
  <svg
    className="w-24px h-24px text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m8 10 4 4 4-4"
    />
  </svg>
);

const ChevronUp = () => (
  <svg
    className="w-24px h-24px text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m16 14-4-4-4 4"
    />
  </svg>
);