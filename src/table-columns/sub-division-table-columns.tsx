import type { ColumnDef } from "@tanstack/react-table";
import type { SubDivision } from "@/table-types/sub-division-types";
import SubDivisionTableDropdown from "@/table-dropdown/sub-division-table-dropdwon";

export const getColumns = (): ColumnDef<SubDivision>[] => [
  {
    accessorKey: "id",
    header: "SI",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-800">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-zinc-900">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">{row.getValue("password")}</span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <SubDivisionTableDropdown
        id={row.original.id}
        rowData={{ name: row.original.name, id: row.original.id, password: row.original.password, email: row.original.email}}
      />
    ),
  },
];
