import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Student } from "@/table-types/student-table-types";
import type { SubDivision } from "@/table-types/sub-division-types";
import type { Block } from "@/table-types/block-table-types";
import type { Center } from "@/table-types/center-table-types";

interface StudentDialogProps {
  editStudent?: Student;
  open: boolean;
  setOpen: (open: boolean) => void;
  onStudentsChange: (students: Student[]) => void;
}

export default function StudentDialog({
  editStudent,
  open,
  setOpen,
  onStudentsChange,
}: StudentDialogProps) {
  const [uuid, setUuid] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [medium, setMedium] = useState("");
  const [subDivision, setSubDivision] = useState("");
  const [block, setBlock] = useState("");
  const [centerName, setCenterName] = useState("");
  const [guardianName, setGuardianName] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userSubDivision, setUserSubDivision] = useState<string | null>(null);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(storedStudents);

    const storedSubDivisions = JSON.parse(localStorage.getItem("subDivisions") || "[]");
    setSubDivisions(storedSubDivisions);

    const storedBlocks = JSON.parse(localStorage.getItem("blocks") || "[]");
    setBlocks(storedBlocks);

    const storedCenters = JSON.parse(localStorage.getItem("centers") || "[]");
    setCenters(storedCenters);

    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (storedUser) {
      setUserRole(storedUser.role);
      if (storedUser.role === "subdiv") {
        setUserSubDivision(storedUser.name);
        setSubDivision(storedUser.name);
      }
      if (storedUser.role === "block") {
        const foundBlock = storedBlocks.find((b: Block) => b.blockName === storedUser.name);
        if (foundBlock) {
          setBlock(foundBlock.blockName);
          setSubDivision(foundBlock.subDivision);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (editStudent) {
      setUuid(editStudent.uuid);
      setName(editStudent.name);
      setMobile(editStudent.mobile);
      setStudentClass(editStudent.studentClass);
      setMedium(editStudent.medium);
      setSubDivision(editStudent.subDivision);
      setBlock(editStudent.block);
      setCenterName(editStudent.centerName);
      setGuardianName(editStudent.guardianName);
    } else {
      setUuid("");
      setName("");
      setMobile("");
      setStudentClass("");
      setMedium("");
      if (userRole !== "subdiv") setSubDivision("");
      setBlock("");
      setCenterName("");
      setGuardianName("");
    }
  }, [editStudent, userRole]);

  const handleSave = () => {
    if (!name) return alert("Please enter Student Name");
    if (userRole === "subdiv" && userSubDivision !== subDivision) {
      return alert("You can only add students under your assigned subdivision.");
    }

    let studentUuid = uuid;
    if (!studentUuid) {
      const existingStudentsInBlock = students.filter(s => s.subDivision === subDivision);
      const serial = (existingStudentsInBlock.length + 1).toString().padStart(4, "0");
      const subDivShort = subDivision.slice(0, 3).toUpperCase();
      studentUuid = `PRAGYAN-${subDivShort}-${serial}`;
    }

    const newStudent: Student = {
      id: editStudent ? editStudent.id : Date.now(),
      uuid: studentUuid,
      name,
      guardianName,
      mobile,
      studentClass,
      medium,
      subDivision,
      block,
      centerName,
    };

    const updatedStudents = editStudent
      ? students.map(s => (s.id === editStudent.id ? newStudent : s))
      : [...students, newStudent];

    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    onStudentsChange(updatedStudents);

    setUuid("");
    setName("");
    setMobile("");
    setStudentClass("");
    setMedium("");
    if (userRole !== "subdiv") setSubDivision("");
    setBlock("");
    setCenterName("");
    setGuardianName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl w-full bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            {editStudent ? "Edit Student" : "Add Student"}
          </DialogTitle>
        </DialogHeader>

        <form
          className="grid grid-cols-2 gap-4 mt-4"
          onSubmit={(e) => { e.preventDefault(); handleSave(); }}
        >
          <div>
            <Label className="text-sm font-medium">Sub Division</Label>
            {userRole === "subdiv" || userRole === "block" ? (
              <Input type="text" value={subDivision} disabled className="w-full h-10 mt-1 bg-zinc-200 border border-zinc-300 rounded-md cursor-not-allowed" />
            ) : (
              <Select value={subDivision} onValueChange={setSubDivision}>
                <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm">
                  <SelectValue placeholder="Select Sub Division" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-zinc-200 rounded-md shadow-lg">
                  {subDivisions.map(sd => <SelectItem key={sd.id} value={sd.name}>{sd.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>

      
          <div>
            <Label className="text-sm font-medium">Block</Label>
            {userRole === "block" ? (
              <Input type="text" value={block} disabled className="w-full h-10 mt-1 bg-zinc-200 border border-zinc-300 rounded-md cursor-not-allowed" />
            ) : (
              <Select value={block} onValueChange={setBlock}>
                <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400">
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-zinc-200 rounded-md shadow-lg">
                  {blocks.map(b => <SelectItem key={b.id} value={b.blockName}>{b.blockName}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">School / Center</Label>
            <Select value={centerName} onValueChange={setCenterName}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400">
                <SelectValue placeholder="Select Center" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 rounded-md shadow-lg">
                {centers.map(c => <SelectItem key={c.id} value={c.centerName}>{c.centerName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

         
          <div>
            <Label className="text-sm font-medium">Student Name</Label>
            <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name" className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md" />
          </div>

          <div>
            <Label className="text-sm font-medium">Guardian Name</Label>
            <Input type="text" value={guardianName} onChange={e => setGuardianName(e.target.value)} placeholder="Enter Guardian Name" className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md" />
          </div>

          
          <div>
            <Label className="text-sm font-medium">Mobile</Label>
            <Input type="text" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter Mobile" className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md" />
          </div>

         
          <div>
            <Label className="text-sm font-medium">Class</Label>
            <Select value={studentClass} onValueChange={setStudentClass}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 rounded-md shadow-lg">
                <SelectItem value="IV">Class IV</SelectItem>
                <SelectItem value="V">Class V</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Medium */}
          <div>
            <Label className="text-sm font-medium">Medium</Label>
            <Select value={medium} onValueChange={setMedium}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Medium" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 rounded-md shadow-lg">
                {["Assamese","Bengali","Boro","Garo","Hindi"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mt-6 col-span-2">
            <Button type="submit" className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 rounded-lg transition">
              Save Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
