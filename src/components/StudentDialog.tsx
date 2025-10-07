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

interface StudentData {
  id: number;
  name: string;
  guardianName: string;
  mobile: string;
  studentClass: string;
  medium: string;
  subdivision?: { id: number; name: string } | string | null;
  block?: { id: number; name: string } | string | null;
  school?: { id: number; center_name: string } | null;
  centerName?: string | null;
}

interface StudentDialogProps {
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
  studentData?: StudentData;
}

export default function StudentDialog({
  mode = "create",
  trigger,
  studentData,
}: StudentDialogProps) {
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  const { data: subDivisions = [] } = useQuery<SubDivision[]>({
    queryKey: ["subDivisions"],
    queryFn: fetchSubDivisions,
  });

  const { data: blocks = [] } = useQuery<Block[]>({
    queryKey: ["blocks"],
    queryFn: getBlockList,
  });

  const { data: centers = [] } = useQuery<Center[]>({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  const [open, setOpen] = useState(false);
  const [subDivisionId, setSubDivisionId] = useState<string>("");
  const [blockId, setBlockId] = useState<string>("");
  const [schoolId, setSchoolId] = useState<string>("");
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<Center[]>([]);

  const [name, setName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [mobile, setMobile] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [medium, setMedium] = useState("");

  useEffect(() => {
    if (!open || loading) return;

    console.log("Initializing student dialog...", { mode, studentData, user });

    setName(studentData?.name || "");
    setGuardianName(studentData?.guardianName || "");
    setMobile(studentData?.mobile || "");
    setStudentClass(studentData?.studentClass || "");
    setMedium(studentData?.medium || "");

    let initialSubDivisionId = "";
    let initialBlockId = "";
    let initialSchoolId = "";

    if (mode === "edit" && studentData) {
      console.log("Editing existing student:", studentData);

      if (
        typeof studentData.subdivision === "object" &&
        studentData.subdivision?.id
      ) {
        initialSubDivisionId = String(studentData.subdivision.id);
      } else if (typeof studentData.subdivision === "string") {
        const foundSub = subDivisions.find(
          (sd) =>
            sd.name.toLowerCase() ===
            (typeof studentData.subdivision === "string"
              ? studentData.subdivision.toLowerCase()
              : studentData.subdivision?.name.toLowerCase())
        );
        if (foundSub) {
          initialSubDivisionId = String(foundSub.id);
          console.log("Matched subdivision name → id:", foundSub);
        }
      }

      if (typeof studentData.block === "object" && studentData.block?.id) {
        initialBlockId = String(studentData.block.id);
      } else if (typeof studentData.block === "string") {
        const foundBlock = blocks.find(
          (b) =>
            typeof studentData.block === "string" &&
            b.name.toLowerCase() === studentData.block.toLowerCase()
        );
        if (foundBlock) {
          initialBlockId = String(foundBlock.id);
          console.log("Matched block name → id:", foundBlock);
        }
      }

      if (studentData.school?.id) {
        initialSchoolId = String(studentData.school.id);
      } else if (studentData.centerName) {
        const foundSchool = centers.find(
          (c) =>
            c.center_name.toLowerCase().trim() ===
            studentData.centerName!.toLowerCase().trim()
        );
        if (foundSchool) {
          initialSchoolId = String(foundSchool.id);
          console.log("✅ Matched school name → id:", foundSchool);
        } else {
          console.warn("⚠️ No matching school for:", studentData.centerName);
        }
      }
    } else {
      if (user?.user_type === "subdivision") {
        initialSubDivisionId = String(user.subdivision_id ?? user.id);
      } else if (user?.user_type === "block") {
        initialBlockId = String(user.block_id ?? user.id);
        initialSubDivisionId = String(user.subdivision_id ?? "");
      }
    }

    console.log("✅ Normalized IDs:", {
      initialSubDivisionId,
      initialBlockId,
      initialSchoolId,
    });

    setSubDivisionId(initialSubDivisionId);
    setBlockId(initialBlockId);
    setSchoolId(initialSchoolId);
  }, [open, mode, studentData, user, loading, subDivisions, blocks, centers]);

  useEffect(() => {
    if (!subDivisionId) return;
    const filtered = blocks.filter(
      (b) => String(b.subdivision?.id) === subDivisionId
    );
    setFilteredBlocks(filtered);
  }, [subDivisionId, blocks]);

  useEffect(() => {
    if (!blockId) return;
    const filtered = centers.filter((c) => String(c.block?.id) === blockId);
    setFilteredCenters(filtered);
  }, [blockId, centers]);

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  const handleSave = () => {
    if (
      !name ||
      !guardianName ||
      !mobile ||
      !studentClass ||
      !medium ||
      !subDivisionId ||
      !blockId ||
      !schoolId
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    const payload = {
      student_name: name,
      guardian_name: guardianName,
      phone: mobile,
      class: studentClass,
      medium,
      subdivision_id: Number(subDivisionId),
      block_id: Number(blockId),
      school_id: Number(schoolId),
    };

    mutation.mutate(payload);
  };

  const isSubDivisionDisabled =
    user?.user_type === "subdivision" || user?.user_type === "block";
  const isBlockDisabled = user?.user_type === "block";

  const getSubDivisionName = () =>
    subDivisions.find((sd) => sd.id === Number(subDivisionId))?.name || "";
  const getBlockName = () =>
    blocks.find((b) => b.id === Number(blockId))?.name || "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
            {mode === "create" ? "Add Student" : "Edit Student"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl bg-white text-zinc-900 rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Student" : "Edit Student"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">Sub Division</Label>
            {isSubDivisionDisabled ? (
              <Input
                value={getSubDivisionName()}
                disabled
                className="input-style"
              />
            ) : (
              <Select value={subDivisionId} onValueChange={setSubDivisionId}>
                <SelectTrigger className="input-style">
                  <SelectValue placeholder="Select Sub Division" />
                </SelectTrigger>
                <SelectContent>
                  {subDivisions.map((sd) => (
                    <SelectItem key={sd.id} value={String(sd.id)}>
                      {sd.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">Block</Label>
            {isBlockDisabled ? (
              <Input value={getBlockName()} disabled className="input-style" />
            ) : (
              <Select value={blockId} onValueChange={setBlockId}>
                <SelectTrigger className="input-style">
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBlocks.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">School</Label>
            <Select value={schoolId} onValueChange={setSchoolId}>
              <SelectTrigger className="input-style">
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {filteredCenters.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.center_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">Student Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-style"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">Guardian Name</Label>
            <Input
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              className="input-style"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">Mobile</Label>
            <Input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="input-style"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">Class</Label>
            <Select value={studentClass} onValueChange={setStudentClass}>
              <SelectTrigger className="input-style">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {["IV", "V", "VI", "VII"].map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">Medium</Label>
            <Select value={medium} onValueChange={setMedium}>
              <SelectTrigger className="input-style">
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
        </div>

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSave}
            className="bg-zinc-800 text-white hover:bg-zinc-700 w-40 h-10"
          >
            {mode === "create" ? "Save Student" : "Update Student"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
