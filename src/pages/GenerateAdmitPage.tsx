import { useLocation } from "react-router-dom";

import AdmitCard from "@/components/Admitcard";

import type { Block } from "@/table-types/block-table-types";

import { useEffect, useState } from "react";

interface Student {
  uuid: string;
  name: string;
  centerName: string;
  studentClass: string;
  medium: string;
  block: string;
  subDivision: string;
  district?: string;
  mobile: string;
}

export default function GenerateAdmitPage() {
  const location = useLocation();
  const { block } = location.state as { block: Block };
  console.log("Selected Block:", block.blockName);

  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const storedStudents = JSON.parse(
      localStorage.getItem("students") || "[]"
    ) as Student[];
    setStudents(storedStudents);
  }, []);

  const filteredStudents = students.filter(
    (student) => student.block === block.blockName
  );

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
    <div key={student.uuid} className="-my-4">
      <AdmitCard
        uuid={student.uuid}
        studentName={student.name}
        schoolName={student.centerName}
        className={student.studentClass}
        medium={student.medium}
        block={student.block}
        district={student.subDivision}
        examDate="23rd March, 2026"
        examTime="11 AM to 01 PM"
      />
    </div>
  ))
) : (
  <p className="text-red-500 font-bold">
    No students found for block: {block.blockName}
  </p>
)}

   
    </div>
  );
}
