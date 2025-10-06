import type { ColumnDef } from "@tanstack/react-table";

import type { Center } from "@/table-types/center-table-types";

import { Button } from "@/components/ui/button";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { MoreHorizontal, Edit, UserPlus } from "lucide-react";

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
      const center = row.original;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-100 rounded-full">
              <MoreHorizontal className="h-5 w-5 text-zinc-700" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-48 p-2 bg-white border border-zinc-200 shadow-lg rounded-md"
          >
            <div className="flex flex-col space-y-1">
              <Button
                variant="ghost"
                className="justify-start text-left text-sm hover:bg-zinc-100"
                onClick={() => console.log("edit", center)}
              >
                <Edit className="h-4 w-4 mr-2 text-zinc-700" /> Edit
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-left text-sm hover:bg-zinc-100"
                onClick={() => alert(`Adding Student to ${center.center_name}`)}
              >
                <UserPlus className="h-4 w-4 mr-2 text-zinc-700" /> Add Student
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
