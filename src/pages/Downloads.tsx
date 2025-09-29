"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Download, Layers, FolderTree, School } from "lucide-react";

import type { SubDivision } from "@/table-types/sub-division-types";

import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import type { Block } from "@/table-types/block-table-types";

import type { Center } from "@/table-types/center-table-types";

export default function Downloads() {
  const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [schools, setSchools] = useState<Center[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  useEffect(() => {
    const subDiv = JSON.parse(localStorage.getItem("subDivisions") || "[]");
    setSubDivisions(subDiv);

    const blocksData = JSON.parse(localStorage.getItem("blocks") || "[]");
    setBlocks(blocksData);

    const schoolData = JSON.parse(localStorage.getItem("centers") || "[]");
    console.log("the school data is:", schoolData);
    setSchools(schoolData);
  }, []);

  console.log("schools data is:", schools);

 const handleDownload = () => {
  const studentsData = JSON.parse(localStorage.getItem("students") || "[]");

  console.log("the students data is:", studentsData);


   console.log("\n=== DEBUG START ===");
    console.log("Students raw data:", studentsData.slice(0, 5)); 

    console.log("Selected Values:", {
      selectedSub,
      selectedBlock,
      selectedSchool,
      selectedClass,
    });

    const filtered = studentsData.filter((s: any) => {
      const matchSub =
        !selectedSub ||
        s.subDivision === selectedSub || 
        s.subDivisionId === selectedSub; 

      const matchBlock =
        !selectedBlock ||
        s.block === selectedBlock || 
        s.blockId === selectedBlock;

      const matchSchool =
        !selectedSchool ||
        s.centerName === selectedSchool ||
        s.centerId === selectedSchool;

      const matchClass =
        !selectedClass || s.studentClass === selectedClass;

      return matchSub && matchBlock && matchSchool && matchClass;
    });

    console.log("Filtered Students:", filtered);
    console.log("=== DEBUG END ===\n");

    if (filtered.length === 0) {
      alert("No students found for this selection!");
      return;
    }
  const worksheet = XLSX.utils.json_to_sheet(filtered);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  XLSX.writeFile(
    workbook,
    `Students_${selectedSub || "all"}_${selectedBlock || "all"}_${
      selectedSchool || "all"
    }_${selectedClass || "all"}.xlsx`
  );
};


  return (
    <div className="p-10 flex justify-center mt-6">
      <Card className="w-full max-w-2xl shadow-md rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <Download className="h-6 w-6 text-zinc-800" />
          <CardTitle className="text-xl font-semibold text-zinc-800">
            Downloads
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-sm text-zinc-600">
            Please select the required <span className="font-medium">Sub</span>,{" "}
            <span className="font-medium">Div</span>, and{" "}
            <span className="font-medium">School</span> to proceed with
            downloading the data.
          </p>

          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Layers className="h-4 w-4  text-zinc-800" /> Sub Division
            </label>
            <Select onValueChange={(value) => setSelectedSub(value)}>
              <SelectTrigger className="w-full bg-white border border-zinc-300 rounded-md h-[42px]">
                <SelectValue placeholder="Select Sub" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-300 rounded-md">
                {subDivisions.map((item: SubDivision) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <FolderTree className="h-4 w-4 text-zinc-800" /> Blocks
            </label>
            <Select onValueChange={(value) => setSelectedBlock(value)}>
              <SelectTrigger className="w-full bg-white border border-zinc-300 rounded-md h-[42px]">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-300 rounded-md">
                {blocks
                  .filter((b: Block) => b.subDivision === selectedSub)
                  .map((item: Block) => (
                    <SelectItem key={item.id} value={item.blockName}>
                      {item.blockName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <School className="h-4 w-4 text-zinc-800" /> Schools
            </label>
            <Select onValueChange={(value) => setSelectedSchool(value)}>
              <SelectTrigger className="w-full bg-white border border-zinc-300 rounded-md h-[42px]">
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-300 rounded-md">
                {schools
                  .filter((sch: Center) => sch.block === selectedBlock)
                  .map((item: Center) => (
                    <SelectItem key={item.id} value={item.centerName}>
                      {item.centerName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <School className="h-4 w-4 text-zinc-800" /> Class
            </label>
            <Select onValueChange={(value) => setSelectedClass(value)}>
              <SelectTrigger className="w-full bg-white border border-zinc-300 rounded-md h-[42px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-300 rounded-md">
                <SelectItem value="IV">Class IV</SelectItem>
                <SelectItem value="V">Class V</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={handleDownload}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Download Excel
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
