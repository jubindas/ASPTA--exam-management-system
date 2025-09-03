
import type { ColumnDef } from "@tanstack/react-table";

import type { Block } from "@/table-types/block-table-types";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { MoreHorizontal, Edit, FileBadge, Printer } from "lucide-react";

export const columns: ColumnDef<Block>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
    accessorKey: "subDivision",
    header: "Sub Division",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">
        {row.getValue("subDivision")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const block = row.original;
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
            className="w-48 p-2 bg-white border border-zinc-200 shadow-lg rounded-md"
          >
            <div className="flex flex-col space-y-1">
              {/* Edit Button */}
              <Button
                variant="ghost"
                className="justify-start text-left text-sm hover:bg-zinc-100"
                onClick={() => alert(`Editing ${block.name}`)}
              >
                <Edit className="h-4 w-4 mr-2 text-zinc-700" />
                Edit
              </Button>

              {/* Generate Admit Button */}
              <Button
                variant="ghost"
                className="justify-start text-left text-sm hover:bg-zinc-100"
                onClick={() => alert(`Generating Admit for ${block.name}`)}
              >
                <FileBadge className="h-4 w-4 mr-2 text-zinc-700" />
                Generate Admit
              </Button>

              {/* Print Result Button */}
              <Button
                variant="ghost"
                className="justify-start text-left text-sm hover:bg-zinc-100"
                onClick={() => alert(`Printing Result for ${block.name}`)}
              >
                <Printer className="h-4 w-4 mr-2 text-zinc-700" />
                Print Result
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
