import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/table-types/student-table-types";

import { Button } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "SI",
    cell: ({ row }) => (
      <span className="text-xs w-6 text-zinc-800">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "uuid",
    header: "Student UUID",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-800">{row.getValue("uuid")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Student Name",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-zinc-900">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => (
      <span className="text-xs w-6 text-zinc-700">{row.getValue("mobile")}</span>
    ),
  },
  {
    accessorKey: "studentClass",
    header: "Class",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-700">{row.getValue("studentClass")}</span>
    ),
  },
  {
    accessorKey: "medium",
    header: "Medium",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-700">{row.getValue("medium")}</span>
    ),
  },
  {
    accessorKey: "subDivision",
    header: "Sub Division",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-700">{row.getValue("subDivision")}</span>
    ),
  },
  {
    accessorKey: "block",
    header: "Block",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-700">{row.getValue("block")}</span>
    ),
  },
  {
    accessorKey: "centerName",
    header: "School Name",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-700">{row.getValue("centerName")}</span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 p-0 flex items-center justify-center"
            onClick={() => alert(`Editing student ${student.name}`)}
          >
            <Edit className="h-3 w-3" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 p-0 flex items-center justify-center"
            onClick={() => alert(`Adding result for ${student.name}`)}
          >
            <PlusCircle className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
];
