import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/table-types/student-table-types";
import StudentTableDropdown from "@/table-dropdown/student-table-dropdown";

export const studentsColumns = (): ColumnDef<Student>[] => [
  {
    accessorKey: "student_id",
    header: "Student UUID",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.getValue("student_id")}</span>
    ),
  },
  {
    accessorKey: "student_name",
    header: "Student",
    cell: ({ row }) => (
      <span className="max-w-[70px] truncate font-medium text-zinc-900">
        {row.getValue("student_name")}
      </span>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender");
      let displayGender = "";
      if (gender === "male") displayGender = "Male";
      else if (gender === "female") displayGender = "Female";
       else if (gender === "other") displayGender = "Other";

      return (
        <span className="max-w-[70px] truncate text-zinc-700">
          {displayGender}
        </span>
      );
    },
  },

  {
    accessorKey: "guardian_name",
    header: "Guardian",
    cell: ({ row }) => (
      <span className="max-w-[70px] truncate text-zinc-700">
        {row.getValue("guardian_name")}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Mobile",
    cell: ({ row }) => (
      <span className="w-20 truncate text-zinc-700">
        {row.getValue("phone")}
      </span>
    ),
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => (
      <span className="w-16 truncate text-zinc-700">
        {row.getValue("class")}
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
    accessorKey: "school",
    header: "School Name",
    cell: ({ row }) => {
      const schoolName = row.original.school?.center_name;
      return <span className="w-20 truncate text-zinc-700">{schoolName}</span>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const student: Student = row.original;
      console.log("Student row data:", student);
      return <StudentTableDropdown student={student} />;
    },
  },
];
