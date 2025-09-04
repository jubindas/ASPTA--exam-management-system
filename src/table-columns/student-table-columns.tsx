import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/table-types/student-table-types";

import { Button } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react"; // changed icon

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "SI",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-800">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "uuid",
    header: "Student UUID",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-800">{row.getValue("uuid")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Student Name",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-zinc-900">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">{row.getValue("mobile")}</span>
    ),
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">{row.getValue("class")}</span>
    ),
  },
  {
    accessorKey: "medium",
    header: "Medium",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">{row.getValue("medium")}</span>
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
    accessorKey: "block",
    header: "Block",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">{row.getValue("block")}</span>
    ),
  },
  {
    accessorKey: "centerName",
    header: "School Name",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">
        {row.getValue("centerName")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-1">
          {/* Edit Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-7 p-0 flex items-center justify-center"
            onClick={() => alert(`Editing student ${student.name}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          {/* Add Result Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0 flex items-center justify-center"
            onClick={() => alert(`Adding result for ${student.name}`)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
