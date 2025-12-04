import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import type {
  ColumnFiltersState,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/table-pagination";

import { useState } from "react";

import DataTableFilter from "./data-table-filter";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServerPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enablePagination?: boolean;
  hideTableInPrint?: boolean;

  filterOptions?: {
    enableFilter: boolean;
    filterPlaceholder: string;
    filterCol: string;
  };

  serverPagination?: ServerPaginationProps;

  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterOptions,
  enablePagination = false,
  hideTableInPrint = true,
  serverPagination,
  pageSize = 10,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverPagination
      ? undefined
      : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
    manualPagination: !!serverPagination,
    pageCount: serverPagination ? serverPagination.totalPages : undefined,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div
      className={`${
        hideTableInPrint ? "print:hidden" : ""
      } bg-white overflow-hidden`}
    >
      {filterOptions?.enableFilter && (
        <div className="flex w-full px-4 py-3 bg-zinc-100">
          <DataTableFilter
            table={table}
            placeholder={filterOptions.filterPlaceholder}
            filterCol={filterOptions.filterCol}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-zinc-300">
        <Table className="w-full border-collapse">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-zinc-300">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`text-black text-xs font-medium uppercase tracking-wider py-4 px-6 text-left`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="bg-zinc-50 hover:bg-zinc-100 border-b border-zinc-300"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-black text-sm py-4 px-6"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-zinc-500"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <div className="bg-zinc-50 border rounded-b-lg border-zinc-300">
          {serverPagination ? (
            <div className="flex items-center justify-between px-4 py-3 w-full">
              <div className="flex items-center space-x-2">
                <p className="text-xs md:text-sm font-medium text-zinc-600 whitespace-nowrap">
                  Rows per page
                </p>

                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => onPageSizeChange?.(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[72px] bg-zinc-300 text-zinc-900 border border-zinc-600/50 hover:border-zinc-500">
                    <SelectValue placeholder={String(pageSize)} />
                  </SelectTrigger>

                  <SelectContent
                    side="top"
                    className="bg-zinc-300 text-zinc-900 border border-zinc-700/60"
                  >
                    {[10, 25, 50, 100, 150, 200].map((size) => (
                      <SelectItem
                        key={size}
                        value={String(size)}
                        className="text-sm text-zinc-900 hover:bg-zinc-800/70"
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <span className="text-sm font-medium text-zinc-700">
                Page {serverPagination.page} of {serverPagination.totalPages}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={serverPagination.page === 1}
                  onClick={() =>
                    serverPagination.onPageChange(serverPagination.page - 1)
                  }
                >
                  Previous
                </button>

                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={
                    serverPagination.page === serverPagination.totalPages
                  }
                  onClick={() =>
                    serverPagination.onPageChange(serverPagination.page + 1)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <DataTablePagination table={table} />
          )}
        </div>
      )}
    </div>
  );
}
