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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterOptions,
  enablePagination = false,
  hideTableInPrint = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
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
      } bg-white  overflow-hidden`}
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

    <div className="overflow-hidden rounded-tl-lg rounded-tr-lg rounded-l-lg rounded-r-lg border border-zinc-300">
  <Table className="w-full border-collapse">
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="bg-zinc-300">
          {headerGroup.headers.map((header, index) => (
            <TableHead
              key={header.id}
              className={`text-black text-xs font-medium uppercase tracking-wider py-4 px-6 text-left
                ${index === 0 ? "rounded-tl-lg" : ""}
                ${index === headerGroup.headers.length - 1 ? "rounded-tr-lg" : ""}`}
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
        table.getRowModel().rows.map((row, rowIndex) => (
          <TableRow
            key={row.id}
            className={`bg-zinc-50 hover:bg-zinc-100 transition-colors ${
              rowIndex !== table.getRowModel().rows.length - 1
                ? "border-b border-zinc-300"
                : ""
            }`}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="text-black text-sm py-4 px-6"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        <div className="bg-zinc-50 border-r border-l border-b rounded-b-lg border-zinc-300">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}
