import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Download, Layers, FolderTree, School } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { fetchSubDivisions } from "@/service/subDivisionApi";

import { getBlockList } from "@/service/blockApi";

import { getSchools } from "@/service/schoolApi";

import { getStudents } from "@/service/studentsApi";

import type { Block } from "@/table-types/block-table-types";

import type { Center } from "@/table-types/center-table-types";

import type { SubDivision } from "@/table-types/sub-division-types";

export default function Downloads() {
  const {
    data: subDivisions = [],
    isLoading: loadingSubs,
    error: subError,
  } = useQuery({
    queryKey: ["subDivisions"],
    queryFn: fetchSubDivisions,
  });

  const {
    data: blocks = [],
    isLoading: loadingBlocks,
    error: blockError,
  } = useQuery({
    queryKey: ["blocks"],
    queryFn: getBlockList,
  });

  const {
    data: schools = [],
    isLoading: loadingSchools,
    error: schoolError,
  } = useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents(),
  });

  const [selectedSub, setSelectedSub] = useState<string>("");

  const [selectedBlock, setSelectedBlock] = useState<string>("");

  const [selectedSchool, setSelectedSchool] = useState<string>("");

  const [selectedClass, setSelectedClass] = useState<string>("");

  useEffect(() => {
    console.log("Subdivisions fetched:", subDivisions);
    console.log("Blocks fetched:", blocks);
    console.log("Schools fetched:", schools);
    console.log("Students fetched:", studentsData);
  }, [subDivisions, blocks, schools, studentsData]);

  const handleDownload = () => {
    console.log("📦 Download Triggered with data:");
    console.table({
      selectedSub,
      selectedBlock,
      selectedSchool,
      selectedClass,
    });
    alert("Download started — check console logs for debug info");
  };

  if (subError || blockError || schoolError) {
    console.error("❌ Error fetching data:", {
      subError,
      blockError,
      schoolError,
    });
  }

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
          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Layers className="h-4 w-4 text-zinc-800" /> Sub Division
            </label>
            <Select onValueChange={setSelectedSub}>
              <SelectTrigger className="w-full bg-white border border-zinc-300 rounded-md h-[42px]">
                <SelectValue
                  placeholder={
                    loadingSubs
                      ? "Loading Subdivisions..."
                      : subDivisions.length === 0
                      ? "No Subdivisions Found"
                      : "Select Sub Division"
                  }
                />
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
            <Select onValueChange={setSelectedBlock}>
              <SelectTrigger className="w-full bg-white border border-zinc-300 rounded-md h-[42px]">
                <SelectValue
                  placeholder={
                    loadingBlocks
                      ? "Loading Blocks..."
                      : blocks.length === 0
                      ? "No Blocks Found"
                      : "Select Block"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-300 rounded-md">
                {blocks.map((item: Block, index: number) => (
                  <SelectItem key={item.id ?? index} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <School className="h-4 w-4 text-zinc-800" /> Schools
            </label>
            <Select onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-full bg-white border border-zinc-300 rounded-md h-[42px]">
                <SelectValue
                  placeholder={
                    loadingSchools
                      ? "Loading Schools..."
                      : schools.length === 0
                      ? "No Schools Found"
                      : "Select School"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-300 rounded-md">
                {schools.map((item: Center, index: number) => (
                  <SelectItem key={item.id ?? index} value={item.center_name}>
                    {item.center_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <School className="h-4 w-4 text-zinc-800" /> Class
            </label>
            <Select onValueChange={setSelectedClass}>
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
