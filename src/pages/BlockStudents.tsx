import { DataTable } from "@/components/data-table";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";

import Loader from "@/components/Loader";

import { getStudentsByBlock } from "@/service/studentsApi";

import { studentsColumns } from "@/table-columns/student-table-columns";

import StudentDialog from "@/components/StudentDialog";

export default function BlockStudents() {
  const { user, loading } = useAuth();

  const id = user?.id;

  const { data: blockStudents, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudentsByBlock(Number(id)),
  });

  console.log("the datas are fronten", blockStudents);

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

      {blockStudents && (
        <DataTable
          columns={studentsColumns()}
          data={blockStudents}
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
