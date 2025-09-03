import type { ColumnDef } from "@tanstack/react-table";
import type { SubDivision } from "@/table-types/sub-division-types";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { MoreHorizontal, Edit } from "lucide-react";

export const columns: ColumnDef<SubDivision>[] = [
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
    cell: ({ row }) => {
      const subdivision = row.original;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-zinc-100 rounded-full"
            >
              <MoreHorizontal className="h-5 w-5 text-zinc-700" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-36 p-2 bg-white border border-zinc-200 shadow-lg rounded-md"
          >
            <Button
              variant="ghost"
              className="justify-start text-left text-sm hover:bg-zinc-100"
              onClick={() => alert(`Editing ${subdivision.name}`)}
            >
              <Edit className="h-4 w-4 mr-2 text-zinc-700" />
              Edit
            </Button>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
