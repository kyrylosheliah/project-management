import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type JSX } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import ButtonText from "../ButtonText";
import type { SearchParams, SearchResponse } from "./search-schema";
import type { Metadata } from "../../models/Metadata";
import { searchEntities, type Entity } from "../../models/Entity";

export type EntityTableParameters<T extends Entity> = {
  controlled?: { key: keyof T, value: any },
  metadata: Metadata<T>,
  search: SearchParams,
};

export function EntityTable<T extends Entity>(
  params: EntityTableParameters<T>
): JSX.Element {
  const searchPath = params.metadata.apiPrefix + "/search";
  const { data, isPending } = useQuery<SearchResponse<T>>({
    queryKey: [searchPath],
    queryFn: () => searchEntities(params.search, searchPath),
  });
  const entities = data ? data.items : [];
  const pageCount = data ? data.pageCount : 0;

  const navigate = useNavigate();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const columns: ColumnDef<T>[] = (
    Object.keys(params.metadata.fields) as (keyof T)[]
  ).map((key) => ({
    header: params.metadata.fields[key].label,
    accessorKey: key,
    footer: (props) => props.column.id,
  }));

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
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 p-4 max-w-xl">
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="mb-4 p-2 border rounded w-full max-w-sm"
        />
        <ButtonText disabled={isPending}>
          {isPending ? "Creating..." : `New ${params.metadata.label}`}
        </ButtonText>
      </div>

      {isPending ? (
        <p>Loading ...</p>
      ) : data && entities.length ? (
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
                  <td>
                    <ButtonText
                      onClick={() =>
                        navigate({
                          to: `${params.metadata.apiPrefix}/${row.original.id}`,
                        })
                      }
                    >
                      Open
                    </ButtonText>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No {params.metadata.plural} found</div>
      )}

      <div className="flex justify-between items-center mt-4">
        <ButtonText
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </ButtonText>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <ButtonText
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </ButtonText>
      </div>
    </div>
  );
};
