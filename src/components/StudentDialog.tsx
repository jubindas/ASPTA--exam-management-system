import { useState, useEffect } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<Center[]>([]);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userSubDivision, setUserSubDivision] = useState<string | null>(null);

  const norm = (v: unknown) => (v === null || v === undefined ? "" : String(v).trim().toLowerCase());

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    const storedSubDivisions = JSON.parse(localStorage.getItem("subDivisions") || "[]");
    const storedBlocks = JSON.parse(localStorage.getItem("blocks") || "[]");
    const storedCenters = JSON.parse(localStorage.getItem("centers") || "[]");
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    console.log("[StudentDialog] loaded from localStorage:", {
      storedUser,
      storedSubDivisionsCount: storedSubDivisions.length,
      storedBlocksCount: storedBlocks.length,
      storedCentersCount: storedCenters.length,
    });

    setStudents(storedStudents);
    setSubDivisions(storedSubDivisions);
    setBlocks(storedBlocks);
    setCenters(storedCenters);

    if (storedUser) {
      console.log("[StudentDialog] setting userRole:", storedUser.role, "userName:", storedUser.name);
      setUserRole(storedUser.role);

      if (storedUser.role === "subdiv") {
        console.log("[StudentDialog] subdiv user - set subdivision:", storedUser.name);
        setUserSubDivision(storedUser.name);
        setSubDivision(storedUser.name);
      }

      if (storedUser.role === "block") {
        const foundBlock = (storedBlocks || []).find((b: Block) => norm(b.blockName) === norm(storedUser.name));
        console.log("[StudentDialog] block user - foundBlock:", foundBlock);
        if (foundBlock) {
          setBlock(foundBlock.blockName);
          setSubDivision(foundBlock.subDivision);
        } else {
          setBlock(storedUser.name);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (editStudent) {
      console.log("[StudentDialog] editStudent loaded:", editStudent);
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

  // only clear for admin, not for block or subdiv
  if (userRole === "admin") {
    console.log("[StudentDialog] clearing subDivision for admin");
    setSubDivision("");
  }

  if (userRole === "admin" || userRole === "subdiv") {
    console.log("[StudentDialog] clearing block for admin/subdiv");
    setBlock("");
  }

  setCenterName("");
  setGuardianName("");
}
  }, [editStudent, userRole]);

  useEffect(() => {
    console.log("[StudentDialog] subDivision changed:", subDivision);
    const sdNorm = norm(subDivision);
    const relatedBlocks = (blocks || []).filter((b) => norm(b.subDivision) === sdNorm);
    console.log("[StudentDialog] filtered relatedBlocks:", relatedBlocks);

    setFilteredBlocks(relatedBlocks);

    if (userRole === "subdiv") {
      const alreadyMatches = relatedBlocks.some((b) => norm(b.blockName) === norm(block));
      if (!alreadyMatches) {
        if (relatedBlocks.length > 0) {
          console.log("[StudentDialog] subdiv user - auto selecting first block:", relatedBlocks[0].blockName);
          setBlock(relatedBlocks[0].blockName);
        } else {
          if (block !== "") {
            console.log("[StudentDialog] subdiv user - no related blocks, clearing block");
            setBlock("");
          }
        }
      }
    } else if (userRole === "block") {
      console.log("[StudentDialog] userRole=block -> keep block as is");
    } else {
      const belongs = relatedBlocks.some((b) => norm(b.blockName) === norm(block));
      if (!belongs && block !== "") {
        console.log("[StudentDialog] admin - clearing block because not in selected subdivision");
        setBlock("");
      }
    }

    setFilteredCenters([]);
    if (userRole !== "block") {
      setCenterName("");
    }
  }, [subDivision, blocks, userRole, block]);

  useEffect(() => {
    console.log("[StudentDialog] block changed:", block);
    const bNorm = norm(block);
    const relatedCenters = (centers || []).filter((c) => norm(c.block) === bNorm);
    console.log("[StudentDialog] filtered relatedCenters:", relatedCenters);

    setFilteredCenters(relatedCenters);

    if (userRole === "block") {
      const centerMatches = relatedCenters.some((c) => norm(c.centerName) === norm(centerName));
      if (!centerMatches) {
        if (relatedCenters.length > 0) {
          console.log("[StudentDialog] block user - auto selecting first center:", relatedCenters[0].centerName);
          setCenterName(relatedCenters[0].centerName);
        } else {
          if (centerName !== "") {
            console.log("[StudentDialog] block user - no centers for this block -> clearing centerName");
            setCenterName("");
          }
        }
      }
    } else {
      const belongs = relatedCenters.some((c) => norm(c.centerName) === norm(centerName));
      if (!belongs && centerName !== "") {
        console.log("[StudentDialog] clearing centerName because it doesn't belong to selected block");
        setCenterName("");
      }
    }
  }, [block, centers, userRole, centerName]);

  useEffect(() => {
    if (subDivision) {
      const relatedBlocks = (blocks || []).filter((b) => norm(b.subDivision) === norm(subDivision));
      setFilteredBlocks(relatedBlocks);
    }
  }, [blocks, subDivision]);

  const handleSave = () => {
    console.log("[StudentDialog] handleSave:", { subDivision, block, centerName, name });

    if (!name) return alert("Please enter Student Name");
    if (userRole === "subdiv" && userSubDivision !== subDivision) {
      return alert("You can only add students under your assigned subdivision.");
    }

    let studentUuid = uuid;
    if (!studentUuid) {
      const existingStudentsInBlock = students.filter((s) => s.subDivision === subDivision);
      const serial = (existingStudentsInBlock.length + 1).toString().padStart(4, "0");
      const subDivShort = (subDivision || "").slice(0, 3).toUpperCase();
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

    const updatedStudents = editStudent ? students.map((s) => (s.id === editStudent.id ? newStudent : s)) : [...students, newStudent];

    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    onStudentsChange(updatedStudents);

    setUuid("");
    setName("");
    setMobile("");
    setStudentClass("");
    setMedium("");
    if (userRole !== "subdiv") setSubDivision("");
    if (userRole !== "block") setBlock("");
    setCenterName("");
    setGuardianName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl w-full bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">{editStudent ? "Edit Student" : "Add Student"}</DialogTitle>
        </DialogHeader>

        <form
          className="grid grid-cols-2 gap-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
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
                <SelectContent className="bg-white">
                  {subDivisions.map((sd) => (
                    <SelectItem key={sd.id} value={sd.name}>
                      {sd.name}
                    </SelectItem>
                  ))}
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
                <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm">
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {filteredBlocks.map((b) => (
                    <SelectItem key={b.id} value={b.blockName}>
                      {b.blockName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">School / Center</Label>
            <Select value={centerName} onValueChange={setCenterName}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm">
                <SelectValue placeholder="Select Center" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {filteredCenters.map((c) => (
                  <SelectItem key={c.id} value={c.centerName}>
                    {c.centerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Student Name</Label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md" />
          </div>

          <div>
            <Label className="text-sm font-medium">Guardian Name</Label>
            <Input type="text" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Enter Guardian Name" className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md" />
          </div>

          <div>
            <Label className="text-sm font-medium">Mobile</Label>
            <Input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter Mobile" className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md" />
          </div>

          <div>
            <Label className="text-sm font-medium">Class</Label>
            <Select value={studentClass} onValueChange={setStudentClass}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IV">Class IV</SelectItem>
                <SelectItem value="V">Class V</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Medium</Label>
            <Select value={medium} onValueChange={setMedium}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Medium" />
              </SelectTrigger>
              <SelectContent>
                {["Assamese", "Bengali", "Boro", "Garo", "Hindi"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
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
