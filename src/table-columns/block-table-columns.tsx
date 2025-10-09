import type { ColumnDef } from "@tanstack/react-table";

import type { Block } from "@/table-types/block-table-types";

import BlockTableDropdown from "@/table-dropdown/block-table-dropdown";

export const columns = (): ColumnDef<Block>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span>{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },

  {
    accessorFn: (row) => row.subdivision.name,
    id: "subdivision",
    header: "Sub Division",
    cell: ({ row }) => <span>{row.getValue("subdivision")}</span>,
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => <span>{row.getValue("password")}</span>,
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const block = {
        id: row.original.id,
        name: row.original.name,
        email: row.original.email,
        password: row.original.password,
        subdivision: row.original.subdivision,
      };

      const updatePass = {
        id: row.original.id,
        password: row.original.password
      }

      return <BlockTableDropdown block={block} updatePass={updatePass}/>;
    },
  },
];
