import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type JSX } from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import ButtonText from "./ButtonText";
import { type Entity } from "../models/Entity";
import type { SearchParams, SearchResponse } from "../types/Search";
import ButtonIcon from "./ButtonIcon";
import type EntityService from "../models/EntityService";

const mixInSearchFilter = <T,>(
  search: SearchParams,
  filter: { key: keyof T, value: any },
): SearchParams => {
  let temp: any = { ...search };
  temp.criteria[filter.key] = filter.value;
  return temp as SearchParams;
};

export function EntityTable<T extends Entity, TForm>(params: {
  filter?: { key: keyof T; value: any };
  service: EntityService<T, TForm>;
  search: SearchParams;
  type: "search" | "edit" | "list";
}): JSX.Element {
  const metadata = params.service.metadata;
  const searchPath = metadata.apiPrefix + "/search";
  const search = params.filter
    ? mixInSearchFilter(params.search, params.filter)
    : params.search;
  const { data, isPending } = useQuery<SearchResponse<T>>({
    queryKey: [searchPath],
    queryFn: () => params.service.search(search, searchPath),
  });
  const entities = data ? data.items : [];
  const pageCount = data ? data.pageCount : 0;

  const navigate = useNavigate();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  let columns: ColumnDef<T>[] = [];
  if (params.type === "edit") {
    columns.push({
      id: "select",
      header: () => (
        <ButtonIcon
          props={{
            onClick: () => setSelectedRowId(null),
            disabled: selectedRowId === null,
          }}
          size="w-6 h-6"
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
              d="M5 12h14"
            />
          </svg>
        </ButtonIcon>
      ),
      cell: ({ row }) => {
        const rowId = row.original.id;
        const checked = selectedRowId === rowId;
        return (
          <input
            type="radio"
            checked={checked}
            onChange={() => setSelectedRowId(checked ? null : rowId)}
          />
        );
      },
    });
  }
  columns = columns.concat(
    (Object.keys(metadata.fields) as (keyof T)[]).map((key) => ({
      header: metadata.fields[key].label,
      accessorKey: key,
      //footer: (props) => props.column.id,
    }))
  );
  if (params.type === "search") {
    columns.push({
      id: "open",
      header: "Info",
      cell: ({ row }) => (
        <td>
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
        </td>
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
    <div className="p-4 max-w-xl gap-4 flex flex-col items-center">
      <div className="gap-4 flex flex-row items-center w-full max-w-md">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <ButtonIcon size="w-10 h-10">
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

      <div className="w-full flex flex-row justify-between">
        <div className="self-start">
          <ButtonText props={{ disabled: isPending }}>
            {`New ${metadata.singular} ...`}
          </ButtonText>
        </div>
        {selectedRowId !== null && (
          <div>
            <ButtonText
              props={{
                onClick: () => {},
              }}
            >
              Edit ...
            </ButtonText>
            <ButtonText
              type="danger"
              props={{
                onClick: () => {},
              }}
            >
              Delete ...
            </ButtonText>
          </div>
        )}
      </div>

      {isPending ? (
        <p>Loading ...</p>
      ) : data && entities.length ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer px-4 py-2 text-left"
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
                      <td key={cell.id} className="px-4 py-2 border-t">
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
          <div className="gap-4 flex flex-row items-center">
            <ButtonText
              props={{
                onClick: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
              }}
            >
              Previous
            </ButtonText>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <ButtonText
              props={{
                onClick: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
              }}
            >
              Next
            </ButtonText>
          </div>
        </>
      ) : (
        <div>No {metadata.plural} found</div>
      )}
    </div>
  );
};
