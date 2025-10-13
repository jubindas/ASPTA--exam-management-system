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

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentData {
  id: number;
  name: string;
  guardianName: string;
  mobile: string;
  studentClass: string;
  medium: string;
  gender?: string;
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

  const [subDivisionOpen, setSubDivisionOpen] = useState(false);
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
  const [gender, setGender] = useState("");

  useEffect(() => {
    if (!open || loading) return;

    console.log("Initializing student dialog...", { mode, studentData, user });

    setName(studentData?.name || "");
    setGuardianName(studentData?.guardianName || "");
    setMobile(studentData?.mobile || "");
    setStudentClass(studentData?.studentClass || "");
    setMedium(studentData?.medium || "");
    setGender(studentData?.gender || "");

    let initialSubDivisionId = "";
    let initialBlockId = "";
    let initialSchoolId = "";

    if (mode === "edit" && studentData) {
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
      !studentClass ||
      !medium ||
      !subDivisionId ||
      !blockId ||
      !schoolId
    ) {
      toast("Please fill all fields!");
      return;
    }

    if (mobile.length !== 10) {
      toast("Mobile number must be exactly 10 digits!");
      return;
    }

    const payload = {
      student_name: name,
      guardian_name: guardianName,
      phone: mobile,
      class: studentClass,
      medium,
      gender,
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
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700 px-4 py-2 rounded-md">
            {mode === "create" ? "Add Student" : "Edit Student"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-[95vw] sm:w-full bg-white text-zinc-900 rounded-xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            {mode === "create" ? "Add Student" : "Edit Student"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="grid gap-2">
            <Label>Sub Division *</Label>
            {isSubDivisionDisabled ? (
              <Input
                value={getSubDivisionName()}
                disabled
                className="bg-zinc-100 text-zinc-700 border border-zinc-300 cursor-not-allowed"
              />
            ) : (
              <Popover open={subDivisionOpen} onOpenChange={setSubDivisionOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {subDivisionId
                      ? subDivisions.find(
                          (sd) => sd.id === Number(subDivisionId)
                        )?.name
                      : "Select Sub Division..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-0">
                  <Command className="bg-white">
                    <CommandInput
                      placeholder="Search Sub Division..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No Sub Division found.</CommandEmpty>
                      <CommandGroup className="bg-white">
                        {[...subDivisions]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((sd) => (
                            <CommandItem
                              key={sd.id}
                              value={sd.name}
                              onSelect={() => {
                                setSubDivisionId(String(sd.id));
                                setSubDivisionOpen(false);
                              }}
                            >
                              {sd.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  String(subDivisionId) === String(sd.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-2">Block *</Label>

            {isBlockDisabled ? (
              <Input
                value={getBlockName()}
                disabled
                className="w-full bg-zinc-100 border border-zinc-300 rounded-md px-3 py-2 text-sm sm:text-base text-zinc-700 cursor-not-allowed"
              />
            ) : (
              <Select value={blockId} onValueChange={setBlockId}>
                <SelectTrigger className="w-full text-sm sm:text-base">
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>

                <SelectContent className="bg-white">
                  {filteredBlocks && filteredBlocks.length > 0 ? (
                    filteredBlocks.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-zinc-500">
                      No Blocks available
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-2">School *</Label>

            <Select value={schoolId} onValueChange={setSchoolId}>
              <SelectTrigger className="w-full text-sm sm:text-base">
                <SelectValue placeholder="Select School" />
              </SelectTrigger>

              <SelectContent className="bg-white">
                {filteredCenters && filteredCenters.length > 0 ? (
                  filteredCenters.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.center_name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-zinc-500">
                    No Schools available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-2">Student Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Student Name"
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-2">Guardian Name</Label>
            <Input
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              placeholder="Enter Guardian Name"
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-2">Mobile</Label>
            <Input
              type="number"
              value={mobile}
              onChange={(e) => {
                const input = e.target.value;

                if (input.length <= 10) {
                  setMobile(input);
                }
              }}
              placeholder="Enter Mobile Number"
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-2">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full text-sm sm:text-base">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {["male", "female", "other"].map((g) => (
                  <SelectItem key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}{" "}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-2">Class *</Label>
            <Select value={studentClass} onValueChange={setStudentClass}>
              <SelectTrigger className="w-full text-sm sm:text-base">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {["IV", "V"].map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-2">Medium *</Label>
            <Select value={medium} onValueChange={setMedium}>
              <SelectTrigger className="w-full text-sm sm:text-base">
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
        </div>

        <div className="flex justify-end mt-6 sm:mt-8">
          <Button
            onClick={handleSave}
            className="bg-zinc-800 text-white hover:bg-zinc-700 w-full sm:w-40 h-10 rounded-md text-sm sm:text-base"
          >
            {mode === "create" ? "Save Student" : "Update Student"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
