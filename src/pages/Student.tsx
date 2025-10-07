import { DataTable } from "@/components/data-table";

import { studentsColumns } from "@/table-columns/student-table-columns";

import StudentDialog from "@/components/StudentDialog";

import type { Student } from "@/table-types/student-table-types";

import { useQuery } from "@tanstack/react-query";

import { getStudents } from "@/service/studentsApi";

import { useAuth } from "@/hooks/useAuth";

export default function Student() {
  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  console.log("the students are", studentsData);

  const { user, loading } = useAuth();

  const filteredStudents: Student[] = studentsData
    ? studentsData.filter((s) => {
        if (!user) return true;

        if (user.user_type === "subdivision") {
          return s.subDivision === user.name;
        }

        if (user.user_type === "block") {
          return s.block === user.name;
        }

        return true;
      })
    : [];

  if (loading) return null;

  return (
    <div className="p-6 bg-zinc-100 min-h-screen mt-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
          Student List
        </h1>
        <StudentDialog mode="create" />
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-700">
          <span className="font-medium">Show</span>
          <select className="rounded-md px-3 py-2 bg-white border border-zinc-300 shadow-sm hover:border-zinc-400 transition-colors">
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="font-medium">entries</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-700">
          <span className="font-medium">Search:</span>
          <input
            type="text"
            placeholder="Type to search..."
            className="border border-zinc-300 rounded-md px-3 py-2 bg-white text-zinc-800 placeholder-zinc-400 shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition-all w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {studentsData && (
          <DataTable
            columns={studentsColumns()}
            data={filteredStudents}
            enablePagination={true}
          />
        )}
      </div>
    </div>
  );
}
