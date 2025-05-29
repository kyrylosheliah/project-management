import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type JSX } from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import ButtonText from "../../ui/ButtonText";
import { type Entity } from "../../entities/Entity";
import { defaultSearchParams, SearchSchema, type SearchParams, type SearchResponse } from "../../types/Search";
import ButtonIcon from "../../ui/ButtonIcon";
import type { z } from "zod";
import type EntityService from "../../entities/EntityService";
import { cx } from "../../utils/cx";
import { EntityFieldDisplay } from "./FieldDisplay";
import { Checkbox } from "../../ui/Checkbox";

const mixInSearchFilter = (
  search: SearchParams,
  filter: { key: string, value: any },
): SearchParams => {
  let temp: any = { ...search };
  temp.criteria[filter.key] = filter.value;
  return temp as SearchParams;
};

export function EntityTable<
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>,
>(params: {
  controlled?: [
    number | null,
    React.Dispatch<React.SetStateAction<number | null>>,
  ];
  filter?: { key: string; value: any };
  service: EntityService<T, TSchema>;
  search?: { // currently, it has 1 use case - search query url parameter
    value: SearchParams;
    set: (partialSearch: Partial<SearchParams>) => void;
  };
  edit?: boolean;
  className?: string;
}): JSX.Element {
  const metadata = params.service.metadata;
  const service = params.service;

  const [rawSearch, setRawSearch] = params.search
    ? [params.search.value, params.search.set]
    : useState<SearchParams>(
        params.filter
          ? mixInSearchFilter(defaultSearchParams, params.filter)
          : defaultSearchParams
      );
  // todo: add external search setter handling
  const [search, setSearch] = [
    rawSearch,
    (partialState: Partial<SearchParams>) => {
      const result = SearchSchema.safeParse({ ...search, ...partialState });
      if (result.success) {
        setRawSearch(result.data);
      } else {
        alert(`Invalid search parameters, ${result.error.format()}`);
      }
    }
  ];

  const searchPath = metadata.apiPrefix + "/search";
  const { data, isPending } = useQuery<SearchResponse<T>>({
    queryKey: [searchPath],
    queryFn: () => service.search(search, searchPath),
  });
  const entities = data ? data.items : [];
  const pageCount = data ? data.pageCount : 0;

  const navigate = useNavigate();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [selectedRowId, setSelectedRowId] = params.controlled
    ? params.controlled
    : useState<number | null>(null);

  let columns: ColumnDef<T>[] = [];
  if (params.edit || params.controlled) {
    columns.push({
      id: "select",
      header: () => {
        return (<Checkbox
          attributes={{
            onClick: () => setSelectedRowId(null),
            disabled: selectedRowId === null,
          }}
          indeterminate={selectedRowId !== null}
        />);
        },
      cell: ({ row }) => {
        const rowId = row.original.id;
        const checked = selectedRowId === rowId;
        return (
          <Checkbox
            attributes={{
              checked: checked,
              onClick: () => setSelectedRowId(checked ? null : rowId),
            }}
          />
        );
      },
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
          service={params.service}
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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable<T>({
    data: entities,
    pageCount,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    //enableRowSelection: true,
    //enableMultiRowSelection: false,
    //getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    //getSortedRowModel: getSortedRowModel(),
    //onGlobalFilterChange: setGlobalFilter,
    //getFilteredRowModel: getFilteredRowModel(),
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
        {selectedRowId !== null && (
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
      ) : data && entities.length ? (
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
                        className="cursor-pointer pr-1 py-0.5 text-left text-nowrap"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="pr-1 py-0.5 border-t">
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
            </ButtonIcon>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <ButtonIcon
              props={{
                onClick: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
              }}
              className="w-8 h-8"
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
                  d="m10 16 4-4-4-4"
                />
              </svg>
            </ButtonIcon>
          </div>
        </div>
      ) : (
        <div>No {metadata.plural} found</div>
      )}
    </div>
  );
};
