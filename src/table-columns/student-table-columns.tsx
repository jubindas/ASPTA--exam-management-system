import type { ColumnDef } from "@tanstack/react-table";

import type { Student } from "@/table-types/student-table-types";

import StudentTableDropdown from "@/table-dropdown/student-table-dropdown";

export const studentsColumns = (): ColumnDef<Student>[] => [
  {
    accessorKey: "uuid",
    header: "Student UUID",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.getValue("uuid")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Student",
    cell: ({ row }) => (
      <span className="max-w-[70px] truncate font-medium text-zinc-900">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "guardianName",
    header: "Guardian",
    cell: ({ row }) => (
      <span className="max-w-[70px] truncate text-zinc-700">
        {row.getValue("guardianName")}
      </span>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => (
      <span className="w-20 truncate text-zinc-700">
        {row.getValue("mobile")}
      </span>
    ),
  },
  {
    accessorKey: "studentClass",
    header: "Class",
    cell: ({ row }) => (
      <span className="w-16 truncate text-zinc-700">
        {row.getValue("studentClass")}
      </span>
    ),
  },
  {
    accessorKey: "medium",
    header: "Medium",
    cell: ({ row }) => (
      <span className="w-20 truncate text-zinc-700">
        {row.getValue("medium")}
      </span>
    ),
  },
  {
    accessorKey: "subDivision",
    header: "Sub Division",
    cell: ({ row }) => (
      <span className="w-24 truncate text-zinc-700">
        {row.getValue("subDivision")}
      </span>
    ),
  },
  {
    accessorKey: "block",
    header: "Block",
    cell: ({ row }) => (
      <span className="w-24 truncate text-zinc-700">
        {row.getValue("block")}
      </span>
    ),
  },
  {
    accessorKey: "centerName",
    header: "School Name",
    cell: ({ row }) => (
      <span
        className="w-28 truncate text-zinc-700"
        title={row.getValue("centerName")}
      >
        {row.getValue("centerName")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const student = {
        id: row.original.id,
        name: row.original.name,
        subDiv: row.original.subDivision,
        block: row.original.block,
        school: row.original.centerName,
        guardian: row.original.guardianName,
        mobile: row.original.mobile,
        class: row.original.studentClass,
        medium: row.original.medium,
      };
      return <StudentTableDropdown student={student} />;
    },
  },
];
