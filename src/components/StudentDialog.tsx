import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface Student {
  id: number;
  uuid: string;
  name: string;
  mobile: string;
  studentClass: string;
  medium: string;
  subDivision: string;
  block: string;
  centerName: string;
}

interface SubDivision {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface Block {
  id: number;
  subDivision: string;
  blockName: string;
}

interface Center {
  id: number;
  subDivision: string;
  block: string;
  centerName: string;
}

interface StudentDialogProps {
  onStudentsChange: (students: Student[]) => void;
}

export default function StudentDialog({ onStudentsChange }: StudentDialogProps) {
  const [uuid, setUuid] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [medium, setMedium] = useState("");
  const [subDivision, setSubDivision] = useState("");
  const [block, setBlock] = useState("");
  const [centerName, setCenterName] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userSubDivision, setUserSubDivision] = useState<string | null>(null);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(storedStudents);

    const storedSubDivisions = JSON.parse(
      localStorage.getItem("subDivisions") || "[]"
    );
    setSubDivisions(storedSubDivisions);

    const storedBlocks = JSON.parse(localStorage.getItem("blocks") || "[]");
    setBlocks(storedBlocks);

    const storedCenters = JSON.parse(localStorage.getItem("centers") || "[]");
    setCenters(storedCenters);

    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    console.log("👤 Current User:", storedUser);

    if (storedUser) {
      setUserRole(storedUser.role);

      if (storedUser.role === "subdiv") {
        setUserSubDivision(storedUser.name);
        setSubDivision(storedUser.name); 
      }
    }
  }, []);

  const handleSave = () => {
    if (!uuid || !name) return alert("Please enter Student ID and Name");

    if (userRole === "subdiv" && userSubDivision !== subDivision) {
      return alert("You can only add students under your assigned subdivision.");
    }

    const newStudent: Student = {
      id: Date.now(),
      uuid,
      name,
      mobile,
      studentClass,
      medium,
      subDivision,
      block,
      centerName,
    };

    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    if (onStudentsChange) onStudentsChange(updatedStudents);

    setUuid("");
    setName("");
    setMobile("");
    setStudentClass("");
    setMedium("");
    if (userRole !== "subdiv") {
      setSubDivision("");
    }
    setBlock("");
    setCenterName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4 rounded-lg transition">
          Add Student
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            Add Student
          </DialogTitle>
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
            {userRole === "subdiv" && userSubDivision ? (
              <Input
                type="text"
                value={userSubDivision}
                disabled
                className="w-full h-10 mt-1 bg-zinc-200 border border-zinc-300 rounded-md cursor-not-allowed"
              />
            ) : (
              <Select value={subDivision} onValueChange={setSubDivision}>
                <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm">
                  <SelectValue placeholder="Select Sub Division" />
                </SelectTrigger>
                <SelectContent>
                  {subDivisions.length > 0 ? (
                    subDivisions.map((sd) => (
                      <SelectItem key={sd.id} value={sd.name}>
                        {sd.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-zinc-500">
                      No Sub Divisions found
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">Block</Label>
            <Select value={block} onValueChange={setBlock}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent>
                {blocks.length > 0 ? (
                  blocks
                    .filter((b) => !subDivision || b.subDivision === subDivision)
                    .map((b) => (
                      <SelectItem key={b.id} value={b.blockName}>
                        {b.blockName}
                      </SelectItem>
                    ))
                ) : (
                  <div className="p-2 text-sm text-zinc-500">No Blocks found</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">School / Center</Label>
            <Select value={centerName} onValueChange={setCenterName}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm">
                <SelectValue placeholder="Select Center" />
              </SelectTrigger>
              <SelectContent>
                {centers.length > 0 ? (
                  centers
                    .filter(
                      (c) =>
                        (!subDivision || c.subDivision === subDivision) &&
                        (!block || c.block === block)
                    )
                    .map((center) => (
                      <SelectItem key={center.id} value={center.centerName}>
                        {center.centerName}
                      </SelectItem>
                    ))
                ) : (
                  <div className="p-2 text-sm text-zinc-500">
                    No Centers found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Student ID</Label>
            <Input
              type="text"
              placeholder="Enter Student UUID"
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Student Name</Label>
            <Input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Mobile</Label>
            <Input
              type="text"
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md"
            />
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
                <SelectItem value="Assamese">Assamese</SelectItem>
                <SelectItem value="Bengali">Bengali</SelectItem>
                <SelectItem value="Boro">Boro</SelectItem>
                <SelectItem value="Garo">Garo</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mt-6 col-span-2">
            <Button
              type="submit"
              className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 rounded-lg transition"
            >
              Save Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
