import type { Table } from "@tanstack/react-table";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

function DataTableFilter<TData>({
  table,
  placeholder = "Search...",
  filterCol,
}: {
  table: Table<TData>;
  placeholder: string;
  filterCol: string;
}) {
  const column = table.getColumn(filterCol);

  return (
    <div className="w-full flex justify-end">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />

        <Input
          type="text"
          placeholder={placeholder}
          value={(column?.getFilterValue() as string) ?? ""}
          onChange={(e) => column?.setFilterValue(e.target.value)}
          className="
            w-full pl-9 pr-4 py-2.5 
            bg-zinc-50 
            border border-zinc-300 
            rounded-xl 
            text-sm text-zinc-800 
            placeholder-zinc-400
            shadow-sm
            focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400
            transition-all
          "
        />
      </div>
    </div>
  );
}

export default DataTableFilter;
