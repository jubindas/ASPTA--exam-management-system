import type { Student } from "@/table-types/student-table-types";

export const students: Student[] = 
  JSON.parse(localStorage.getItem("students") || "[]");