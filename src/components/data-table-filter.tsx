import type { Table } from "@tanstack/react-table";

import { Input } from "./ui/input";

function DataTableFilter<TData>({
  table,
  placeholder = "Search....",
  filterCol,
}: {
  table: Table<TData>;
  placeholder: string;
  filterCol: string;
}) {
  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={placeholder}
          value={(table.getColumn(filterCol)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterCol)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
    </div>
  );
}

export default DataTableFilter;
