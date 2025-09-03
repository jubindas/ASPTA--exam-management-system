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
  result: string;
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
  const [result, setResult] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(storedStudents);
  }, []);

  const handleSave = () => {
    if (!uuid || !name) return alert("Please enter Student ID and Name");

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
      result,
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
    setSubDivision("");
    setBlock("");
    setCenterName("");
    setResult("");

    
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
            <Label className="text-sm font-medium">Student ID</Label>
            <Input
              type="text"
              placeholder="Enter Student ID"
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Student Name</Label>
            <Input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Mobile</Label>
            <Input
              type="text"
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Class</Label>
            <Select value={studentClass} onValueChange={setStudentClass}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
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
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="Assamese">Assamese</SelectItem>
                <SelectItem value="Bengali">Bengali</SelectItem>
                <SelectItem value="Boro">Boro</SelectItem>
                <SelectItem value="Garo">Garo</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Sub Division</Label>
            <Select value={subDivision} onValueChange={setSubDivision}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Sub Division" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="sub1">Sub Division 1</SelectItem>
                <SelectItem value="sub2">Sub Division 2</SelectItem>
                <SelectItem value="sub3">Sub Division 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Block</Label>
            <Select value={block} onValueChange={setBlock}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="block1">Block 1</SelectItem>
                <SelectItem value="block2">Block 2</SelectItem>
                <SelectItem value="block3">Block 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Center Name</Label>
            <Select value={centerName} onValueChange={setCenterName}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Center" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="Center 1">Center 1</SelectItem>
                <SelectItem value="Center 2">Center 2</SelectItem>
                <SelectItem value="Center 3">Center 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Result</Label>
            <Input
              type="text"
              placeholder="Enter Result"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-400"
            />
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
