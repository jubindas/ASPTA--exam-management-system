import { DataTable } from "@/components/data-table";

import { studentsColumns } from "@/table-columns/student-table-columns";

import StudentDialog from "@/components/StudentDialog";

import type { Student,  } from "@/table-types/student-table-types";

import { useQuery } from "@tanstack/react-query";

import { getStudents } from "@/service/studentsApi";

import { useAuth } from "@/hooks/useAuth";

import Loader from "@/components/Loader";

export default function Student() {
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  console.log("the students are", studentsData);

  const { user, loading } = useAuth();

  console.log(user);

  const filteredStudents: Student[] = studentsData
    ? studentsData.filter((s: Student) => {
        if (!user) return true;

        if (user.user_type === "subdivision") {
          return s.subdivision?.name === user.name;
        }

        if (user.user_type === "block") {
          return s.block?.name === user.name;
        }

        return true;
      })
    : [];

  console.log("Filtered Data  ", filteredStudents);

  if (loading) return null;
  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-zinc-100 min-h-screen mt-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
          Student List
        </h1>

        <StudentDialog mode="create" />
      </div>

        {studentsData && (
          <DataTable
            columns={studentsColumns()}
            data={studentsData}
            enablePagination={true}
            filterOptions={{
              enableFilter: true,
              filterPlaceholder: "Search Students...",
              filterCol: "name",
            }}
          />
        )}
    </div>
  );
}
