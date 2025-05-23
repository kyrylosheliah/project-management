import { useQuery } from "@tanstack/react-query";
import { fetchAllProjects } from "../../models/project/service";
import { type Project } from "../../models/project/type";
import { useEffect, useState } from "react";
import { projectMetadata } from "../../models/project/metadata";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";

export const ProjectTable: React.FC = () => {
  const {
    data,
    isPending,
  } = useQuery({
    queryKey: ["/project/all"],
    queryFn: fetchAllProjects,
  });
  const projects = data ?? [];

  useEffect(()=>{
    console.log(data);
  }, [data]);

  const columns: ColumnDef<Project>[] = (
    Object.keys(projectMetadata.fields) as (keyof Project)[]
  ).map((key) => ({
    header: projectMetadata.fields[key].label,
    accessorKey: key,
    footer: props => props.column.id,
  }));

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable<Project>({
    data: projects,
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
        <button
          disabled={isPending}
          className="bg-blue-600 text-white text-nowrap px-4 py-2 rounded disabled:opacity-50"
        >
          {isPending ? "Creating..." : "New Project"}
        </button>
      </div>

      {isPending ? (
        <p>Loading ...</p>
      ) : data && data.length ? (
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
                    <Link
                      to={`/project/${row.original.id}`}
                      className="contents"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No projects found</div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

//isPending ? <p>Loading ...</p> :