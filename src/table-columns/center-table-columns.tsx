import type { ColumnDef } from "@tanstack/react-table";

import type { Center } from "@/table-types/center-table-types";
import SchoolTableDropdown from "@/table-dropdown/school-table-dropdown";



export const columns = (): ColumnDef<Center>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-800">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "center_name",
    header: "School Name",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-zinc-900">
        {row.original.center_name}
      </span>
    ),
  },
  {
    accessorKey: "block",
    header: "Block",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">
        {row.original.block?.name ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "subdivision",
    header: "Sub Division",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">
        {row.original.subdivision?.name ?? "-"}
      </span>
    ),
  },
{
  id: "actions",
  header: "Action",
  cell: ({ row }) => {
    const school = {
      id: row.original.id,
      name: row.original.center_name,
      block: row.original.block,
      subdivision: row.original.subdivision,
    };

    return <SchoolTableDropdown school={school} />;
  },
}

];
