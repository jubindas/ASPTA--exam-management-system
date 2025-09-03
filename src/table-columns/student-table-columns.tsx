
import type { ColumnDef } from "@tanstack/react-table";

import type { Student } from "@/table-types/student-table-types";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { MoreHorizontal, Edit } from "lucide-react";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "si",
    header: "SI",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-800">{row.getValue("si")}</span>
    ),
  },
  {
    accessorKey: "studentId",
    header: "Student ID",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-800">{row.getValue("studentId")}</span>
    ),
  },
  {
    accessorKey: "studentName",
    header: "Student Name",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-zinc-900">
        {row.getValue("studentName")}
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
      <span className="text-sm text-zinc-700">{row.getValue("subDivision")}</span>
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
    accessorKey: "schoolName",
    header: "School Name",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-700">{row.getValue("schoolName")}</span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const student = row.original;
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
            className="w-40 p-2 bg-white border border-zinc-200 shadow-lg rounded-md"
          >
            <Button
              variant="ghost"
              className="justify-start text-left text-sm hover:bg-zinc-100"
              onClick={() => alert(`Editing student ${student.studentName}`)}
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
