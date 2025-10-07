"use client";

import { useEffect, useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSubDivisions } from "@/service/subDivisionApi";
import { getBlockList } from "@/service/blockApi";
import { getSchools } from "@/service/schoolApi";
import { createStudent } from "@/service/studentsApi";
import type { Block } from "@/table-types/block-table-types";
import type { Center } from "@/table-types/center-table-types";
import type { SubDivision } from "@/table-types/sub-division-types";
import { toast } from "sonner";

interface StudentDialogProps {
  trigger?: React.ReactNode;
}

export default function StudentDialog({ trigger }: StudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [subDivisionId, setSubDivisionId] = useState<string>("");
  const [blockId, setBlockId] = useState<string>("");
  const [schoolId, setSchoolId] = useState<string>("");

  const [name, setName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [mobile, setMobile] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [medium, setMedium] = useState("");

  const queryClient = useQueryClient();

  const { data: subDivisions = [] } = useQuery({
    queryKey: ["subDivisions"],
    queryFn: fetchSubDivisions,
  });

  const { data: blocks = [] } = useQuery({
    queryKey: ["blocks"],
    queryFn: getBlockList,
  });

  const { data: centers = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<Center[]>([]);

  useEffect(() => {
    if (subDivisionId) {
      const fb = blocks.filter(
        (b: Block) => String(b.subdivision?.id) === subDivisionId
      );
      setFilteredBlocks(fb);
      setBlockId("");
      setSchoolId("");
      setFilteredCenters([]);
    } else {
      setFilteredBlocks([]);
      setBlockId("");
      setSchoolId("");
      setFilteredCenters([]);
    }
  }, [subDivisionId, blocks]);

  useEffect(() => {
    if (blockId) {
      const fc = centers.filter((c: Center) => String(c.block?.id) === blockId);
      setFilteredCenters(fc);
      setSchoolId("");
    } else {
      setFilteredCenters([]);
      setSchoolId("");
    }
  }, [blockId, centers]);

  const mutation = useMutation({
    mutationFn: createStudent,
    onSuccess: (data) => {
      console.log("Student created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast("Student created successfully!");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating student:", error);
      toast("Failed to create!");
    },
  });

  const handleSave = () => {
    const payload = {
      student_name: name,
      guardian_name: guardianName,
      phone: mobile,
      class: studentClass,
      medium: medium,
      subdivision_id: subDivisionId ? Number(subDivisionId) : 0,
      block_id: blockId ? Number(blockId) : 0,
      school_id: schoolId ? Number(schoolId) : 0,
    };
    console.log("Payload:", payload);

    mutation.mutate(payload);
  };

  const resetForm = () => {
    setSubDivisionId("");
    setBlockId("");
    setSchoolId("");
    setName("");
    setGuardianName("");
    setMobile("");
    setStudentClass("");
    setMedium("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
            Add Student
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full bg-white text-zinc-900 rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
        </DialogHeader>

        <form
          className="grid grid-cols-2 gap-6 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* Sub Division */}
          <div className="flex flex-col">
            <Label>Sub Division</Label>
            <Select value={subDivisionId} onValueChange={setSubDivisionId}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select Sub Division" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {subDivisions.map((sd: SubDivision) => (
                  <SelectItem key={sd.id} value={String(sd.id)}>
                    {sd.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        
          <div className="flex flex-col">
            <Label>Block</Label>
            <Select value={blockId} onValueChange={setBlockId}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {filteredBlocks.length > 0 ? (
                  filteredBlocks.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-zinc-500">No blocks</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* School */}
          <div className="flex flex-col">
            <Label>School Name</Label>
            <Select value={schoolId} onValueChange={setSchoolId}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {filteredCenters.length > 0 ? (
                  filteredCenters.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.center_name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-zinc-500">No schools</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Student Name */}
          <div className="flex flex-col">
            <Label>Student Name</Label>
            <Input
              className="mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
            />
          </div>

          {/* Guardian Name */}
          <div className="flex flex-col">
            <Label>Guardian Name</Label>
            <Input
              className="mt-2"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              placeholder="Enter Guardian Name"
            />
          </div>

          {/* Mobile */}
          <div className="flex flex-col">
            <Label>Mobile</Label>
            <Input
              className="mt-2"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter Mobile"
            />
          </div>

          {/* Class */}
          <div className="flex flex-col">
            <Label>Class</Label>
            <Select value={studentClass} onValueChange={setStudentClass}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="IV">Class IV</SelectItem>
                <SelectItem value="V">Class V</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Medium */}
          <div className="flex flex-col">
            <Label>Medium</Label>
            <Select value={medium} onValueChange={setMedium}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select Medium" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {["Assamese", "Bengali", "Boro", "Garo", "Hindi"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mt-6 col-span-2">
            <Button
              type="submit"
              className="bg-zinc-800 text-white hover:bg-zinc-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
