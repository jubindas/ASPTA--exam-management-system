import type { ColumnDef } from "@tanstack/react-table";

import type { Student } from "@/table-types/student-table-types";

import { Button } from "@/components/ui/button";

import { Edit, PlusCircle } from "lucide-react";

export const studentsColumns = (
  onEdit: (student: Student) => void = () => {}
): ColumnDef<Student>[] => [
  {
    accessorKey: "uuid",
    header: "Student UUID",
    cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("uuid")}</span>,
  },
  {
    accessorKey: "name",
    header: "Student",
    cell: ({ row }) => (
      <span className="max-w-[70px] truncate font-medium text-zinc-900">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "guardianName",
    header: "Guardian",
    cell: ({ row }) => (
      <span className="max-w-[70px] truncate text-zinc-700">{row.getValue("guardianName")}</span>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => <span className="w-20 truncate text-zinc-700">{row.getValue("mobile")}</span>,
  },
  {
    accessorKey: "studentClass",
    header: "Class",
    cell: ({ row }) => <span className="w-16 truncate text-zinc-700">{row.getValue("studentClass")}</span>,
  },
  {
    accessorKey: "medium",
    header: "Medium",
    cell: ({ row }) => <span className="w-20 truncate text-zinc-700">{row.getValue("medium")}</span>,
  },
  {
    accessorKey: "subDivision",
    header: "Sub Division",
    cell: ({ row }) => <span className="w-24 truncate text-zinc-700">{row.getValue("subDivision")}</span>,
  },
  {
    accessorKey: "block",
    header: "Block",
    cell: ({ row }) => <span className="w-24 truncate text-zinc-700">{row.getValue("block")}</span>,
  },
  {
    accessorKey: "centerName",
    header: "School Name",
    cell: ({ row }) => (
      <span className="w-28 truncate text-zinc-700" title={row.getValue("centerName")}>
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
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 p-0 flex items-center justify-center"
            onClick={() => onEdit(student)}
          >
            <Edit className="h-3 w-3" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 p-0 flex items-center justify-center"
            onClick={() => console.log(`Adding result for ${student.name}`)}
          >
            <PlusCircle className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
];
