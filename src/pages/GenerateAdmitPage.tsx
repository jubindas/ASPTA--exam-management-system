import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/service/studentsApi";
import AdmitCard from "@/components/Admitcard";
import type { Student } from "@/table-types/student-table-types";

export default function GenerateAdmitPage() {
  const location = useLocation();
  const blockData = location.state?.block;

  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  if (isLoading) return <p>Loading students...</p>;

  if (!blockData)
    return <p className="text-red-500 font-bold">No block selected!</p>;

  const filteredStudents =
    students?.filter((s) => s.block === blockData.name) || [];

  return (
    <div className="p-3">
      {filteredStudents.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => window.print()}
            className="bg-zinc-600 text-white px-4 py-2 rounded-lg shadow hover:bg-zinc-700 print:hidden"
          >
            Print Admit Cards
          </button>
        </div>
      )}

      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => (
          <div key={student.id} className="mb-6">
            <AdmitCard
              uuid={student.student_id}
              studentName={student.student_name}
              schoolName={student.school?.center_name || ""}
              className={student.class}
              medium={student.medium}
              block={student.block?.name}
              district={student.subdivision?.name || ""}
              examDate="23rd March, 2026"
              examTime="11 AM to 01 PM"
            />
          </div>
        ))
      ) : (
        <p className="text-red-500 font-bold">
          No students found for block: {blockData.name}
        </p>
      )}
    </div>
  );
}
