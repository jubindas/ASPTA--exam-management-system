import { DataTable } from "@/components/data-table";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";

import Loader from "@/components/Loader";

import { getStudentsBySubDiv } from "@/service/studentsApi";

import { studentsColumns } from "@/table-columns/student-table-columns";

import StudentDialog from "@/components/StudentDialog";

export default function SubDivStudents() {
  const { user, loading } = useAuth();

  const id = user?.id;

  const { data: subDivStudents, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudentsBySubDiv(Number(id)),
  });

  console.log("the datas are", subDivStudents);

  if (loading) return null;
  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-zinc-100 min-h-screen mt-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
          Students
        </h1>

        <StudentDialog mode="create" />
      </div>

      {subDivStudents && (
        <DataTable
          columns={studentsColumns()}
          data={subDivStudents}
          enablePagination={true}
          filterOptions={{
            enableFilter: true,
            filterPlaceholder: "Search Students...",
            filterCol: "student_name",
          }}
        />
      )}
    </div>
  );
}
