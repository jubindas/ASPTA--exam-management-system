/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "@/components/data-table";
import { studentsColumns } from "@/table-columns/student-table-columns";
import StudentDialog from "@/components/StudentDialog";
import type { Student } from "@/table-types/student-table-types";

import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/service/studentsApi";

import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/Loader";

import { useState } from "react";

export default function Student() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["students", page, pageSize],
    queryFn: () => getStudents(page, pageSize),
    placeholderData: (prev) => prev,
  });

  const { loading } = useAuth();

  const students: Student[] = data?.data || [];
  const meta = data?.pagination;

  const sortedStudents = [...students].sort((a: any, b: any) =>
    a.student_id.localeCompare(b.student_id)
  );

  if (loading) return null;
  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-zinc-100 min-h-screen mt-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800">Student List</h1>
        <StudentDialog mode="create" />
      </div>

      <DataTable
        columns={studentsColumns()}
        data={sortedStudents}
        enablePagination={true}
        serverPagination={{
          page,
          totalPages: meta?.last_page || 1,
          onPageChange: (p) => setPage(p),
        }}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        filterOptions={{
          enableFilter: true,
          filterPlaceholder: "Search Students...",
          filterCol: "student_name",
        }}
      />
    </div>
  );
}
