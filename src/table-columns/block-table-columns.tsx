import type { ColumnDef } from "@tanstack/react-table";

import type { Block } from "@/table-types/block-table-types";

import { Button } from "@/components/ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { MoreHorizontal, Edit, FileBadge, Printer } from "lucide-react";

export const columns = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: (path: string, options?: any) => void,
  onEdit: (block: Block) => void
): ColumnDef<Block, unknown>[] => [

  { accessorKey: "id", header: "ID", cell: ({ row }) => <span>{row.getValue("id")}</span> },
  { accessorKey: "blockName", header: "Name", cell: ({ row }) => <span>{row.getValue("blockName")}</span> },
  { accessorKey: "subDivision", header: "Sub Division", cell: ({ row }) => <span>{row.getValue("subDivision")}</span> },
  { accessorKey: "email", header: "Email", cell: ({ row }) => <span>{row.getValue("email")}</span> },
  { accessorKey: "password", header: "Password", cell: ({ row }) => <span>{row.getValue("password")}</span> },
  
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const block = row.original;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-100 rounded-full">
              <MoreHorizontal className="h-5 w-5 text-zinc-700" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-2 bg-white border border-zinc-200 shadow-lg rounded-md">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" className="justify-start text-left text-sm hover:bg-zinc-100" onClick={() => onEdit(block)}>
                <Edit className="h-4 w-4 mr-2 text-zinc-700" /> Edit
              </Button>

              <Button variant="ghost" className="justify-start text-left text-sm hover:bg-zinc-100" onClick={() => navigate("/generate-admit", { state: { block } })}>
                <FileBadge className="h-4 w-4 mr-2 text-zinc-700" /> Generate Admit
              </Button>

              <Button variant="ghost" className="justify-start text-left text-sm hover:bg-zinc-100" onClick={() => alert(`Printing Result for ${block.blockName}`)}>
                <Printer className="h-4 w-4 mr-2 text-zinc-700" /> Print Result
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
