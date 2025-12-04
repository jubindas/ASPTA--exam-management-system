import type { Table } from "@tanstack/react-table";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 bg-inherit border-t border-zinc-300 rounded-b-xl">
      <div className="flex items-center space-x-2">
        <p className="text-xs md:text-sm font-medium text-zinc-600 whitespace-nowrap">
          Rows per page
        </p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[72px] bg-zinc-300 text-zinc-900 border border-zinc-600/50 hover:border-zinc-500">
            <SelectValue
              placeholder={`${table.getState().pagination.pageSize}`}
            />
          </SelectTrigger>
          <SelectContent
            side="top"
            className="bg-zinc-300 text-zinc-900 border border-zinc-700/60"
          >
            {[10, 50, 100, 150, 200].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={`${pageSize}`}
                className="text-sm text-zinc-900 hover:bg-zinc-800/70"
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-xs md:text-sm text-zinc-600 font-medium text-center">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          className="hidden sm:flex h-8 w-8 p-0 bg-zinc-950/80 border border-zinc-600/50 text-zinc-300 hover:bg-zinc-800/70"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0 bg-zinc-950/80 border border-zinc-600/50 text-zinc-300 hover:bg-zinc-800/70"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0 bg-zinc-950/80 border border-zinc-600/50 text-zinc-300 hover:bg-zinc-800/70"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="hidden sm:flex h-8 w-8 p-0 bg-zinc-950/80 border border-zinc-600/50 text-zinc-300 hover:bg-zinc-800/70"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
