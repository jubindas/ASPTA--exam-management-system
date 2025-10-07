"use client";

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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchSubDivisions } from "@/service/subDivisionApi";
import { getBlockList } from "@/service/blockApi";
import { getSchools } from "@/service/schoolApi";
import { createStudent, updateStudent } from "@/service/studentsApi";
import { useAuth } from "@/hooks/useAuth";

import type { SubDivision } from "@/table-types/sub-division-types";
import type { Block } from "@/table-types/block-table-types";
import type { Center } from "@/table-types/center-table-types";

interface StudentDialogProps {
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  studentData?: {
    id: number;
    name: string;
    guardianName: string;
    mobile: string;
    studentClass: string;
    medium: string;
    subdivision?: { id: number; name: string } | null;
    block?: { id: number; name: string } | string | null;
    school?: { id: number; center_name: string } | null;
  };
}

export default function StudentDialog({
  mode = "create",
  trigger,
  studentData,
}: StudentDialogProps) {
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  const { data: subDivisions = [], isLoading: isLoadingSubDivisions } =
    useQuery<SubDivision[]>({
      queryKey: ["subDivisions"],
      queryFn: fetchSubDivisions,
    });

  const { data: blocks = [], isLoading: isLoadingBlocks } = useQuery<Block[]>({
    queryKey: ["blocks"],
    queryFn: getBlockList,
  });

  const { data: centers = [], isLoading: isLoadingCenters } = useQuery<
    Center[]
  >({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  const [open, setOpen] = useState(false);
  const [subDivisionId, setSubDivisionId] = useState<string>("");
  const [blockId, setBlockId] = useState<string>("");
  const [schoolId, setSchoolId] = useState<string>("");
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<Center[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [name, setName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [mobile, setMobile] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [medium, setMedium] = useState("");

  // Initialize values based on mode or user type
  useEffect(() => {
    if (loading || isLoadingBlocks || isLoadingSubDivisions || isLoadingCenters) {
      setIsInitialized(false);
      return;
    }

    // Only initialize once when dialog opens
    if (!open) {
      setIsInitialized(false);
      return;
    }

    if (isInitialized) return;

    if (mode === "edit" && studentData) {
      // Edit mode: use student data
      setName(studentData.name || "");
      setGuardianName(studentData.guardianName || "");
      setMobile(studentData.mobile || "");
      setStudentClass(studentData.studentClass || "");
      setMedium(studentData.medium || "");

      setSubDivisionId(studentData.subdivision?.id ? String(studentData.subdivision.id) : "");
      setBlockId(studentData.block ? String(typeof studentData.block === "object" ? studentData.block.id : "") : "");
      setSchoolId(studentData.school?.id ? String(studentData.school.id) : "");
    } else if (user?.user_type === "subdivision") {
      // Subdivision user: pre-select subdivision
      setSubDivisionId(String(user.id));
      setBlockId("");
      setSchoolId("");
      resetStudentFields();
    } else if (user?.user_type === "block") {
      // Block user: pre-select both block and subdivision
      const userBlock = blocks.find((b) => b.id === user.id);
      if (userBlock && userBlock.subdivision) {
        setBlockId(String(userBlock.id));
        setSubDivisionId(String(userBlock.subdivision.id));
      }
      setSchoolId("");
      resetStudentFields();
    } else {
      // Admin user: clear all fields
      setSubDivisionId("");
      setBlockId("");
      setSchoolId("");
      resetStudentFields();
    }

    setIsInitialized(true);
  }, [mode, studentData, user, loading, blocks, isLoadingBlocks, isLoadingSubDivisions, isLoadingCenters, open, isInitialized]);

  // Reset initialization flag when dialog closes
  useEffect(() => {
    if (!open) {
      setIsInitialized(false);
    }
  }, [open]);

  // Filter blocks when subdivision changes
  useEffect(() => {
    if (!subDivisionId) {
      setFilteredBlocks([]);
      return;
    }
    const sid = Number(subDivisionId);
    const filtered = blocks.filter((b) => b.subdivision?.id === sid);
    setFilteredBlocks(filtered);

    // Only clear blockId if it's not valid for the current subdivision
    // and user is not a block user (block users should keep their pre-selected block)
    if (user?.user_type !== "block" && !filtered.some((b) => String(b.id) === blockId)) {
      setBlockId("");
    }
  }, [subDivisionId, blocks, blockId, user?.user_type]);

  // Filter centers when block changes
  useEffect(() => {
    if (!blockId) {
      setFilteredCenters([]);
      return;
    }
    const bid = Number(blockId);
    const filtered = centers.filter((c) => c.block?.id === bid);
    setFilteredCenters(filtered);

    if (!filtered.some((c) => String(c.id) === schoolId)) {
      setSchoolId("");
    }
  }, [blockId, centers, schoolId]);

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      mode === "create"
        ? createStudent(payload)
        : updateStudent(studentData!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(
        `Student ${mode === "create" ? "created" : "updated"} successfully!`
      );
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("❌ Error:", error);
      toast.error("Operation failed!");
    },
  });

  const handleSave = () => {
    if (!name || !guardianName || !mobile || !studentClass || !medium || !subDivisionId || !blockId || !schoolId) {
      toast.error("Please fill all fields!");
      return;
    }

    const payload = {
      student_name: name,
      guardian_name: guardianName,
      phone: mobile,
      class: studentClass,
      medium: medium,
      subdivision_id: Number(subDivisionId),
      block_id: Number(blockId),
      school_id: Number(schoolId),
    };

    mutation.mutate(payload);
  };

  const resetStudentFields = () => {
    setName("");
    setGuardianName("");
    setMobile("");
    setStudentClass("");
    setMedium("");
  };

  const resetForm = () => {
    resetStudentFields();
    // Only reset location fields for admin users
    if (user?.user_type === "admin") {
      setSubDivisionId("");
      setBlockId("");
      setSchoolId("");
      setFilteredBlocks([]);
      setFilteredCenters([]);
    } else {
      // For subdivision/block users, only reset the school
      setSchoolId("");
    }
  };

  // Get display names for disabled fields
  const getSubDivisionName = () => {
    const subdivision = subDivisions.find((sd) => sd.id === Number(subDivisionId));
    return subdivision?.name || "";
  };

  const getBlockName = () => {
    const block = blocks.find((b) => b.id === Number(blockId));
    return block?.name || "";
  };

  if (loading) return null;

  const isSubDivisionDisabled = user?.user_type === "subdivision" || user?.user_type === "block";
  const isBlockDisabled = user?.user_type === "block";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
            {mode === "create" ? "Add Student" : "Edit Student"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full bg-white text-zinc-900 rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Student" : "Edit Student"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Subdivision */}
          <div className="flex flex-col">
            <Label>Sub Division</Label>
            {isSubDivisionDisabled ? (
              <Input
                value={getSubDivisionName()}
                disabled
                className="bg-zinc-100 text-zinc-700 border border-zinc-300 cursor-not-allowed mt-2"
              />
            ) : (
              <Select value={subDivisionId} onValueChange={setSubDivisionId}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select Sub Division" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {subDivisions.map((sd) => (
                    <SelectItem key={sd.id} value={String(sd.id)}>
                      {sd.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Block */}
          <div className="flex flex-col">
            <Label>Block</Label>
            {isBlockDisabled ? (
              <Input
                value={getBlockName()}
                disabled
                className="bg-zinc-100 text-zinc-700 border border-zinc-300 cursor-not-allowed mt-2"
              />
            ) : (
              <Select
                value={blockId}
                onValueChange={setBlockId}
                disabled={!subDivisionId}
              >
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
                    <div className="p-2 text-sm text-zinc-500">
                      {subDivisionId ? "No blocks available" : "Select a subdivision first"}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* School */}
          <div className="flex flex-col">
            <Label>School Name</Label>
            <Select
              value={schoolId}
              onValueChange={setSchoolId}
              disabled={!blockId}
            >
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
                  <div className="p-2 text-sm text-zinc-500">
                    {blockId ? "No schools available" : "Select a block first"}
                  </div>
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
                {["IV", "V", "VI", "VII"].map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
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
              type="button"
              onClick={handleSave}
              className="bg-zinc-800 text-white hover:bg-zinc-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? mode === "create"
                  ? "Saving..."
                  : "Updating..."
                : mode === "create"
                ? "Save Student"
                : "Update Student"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}