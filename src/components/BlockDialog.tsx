import { useState } from "react";

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

import { createBlock } from "@/service/blockApi";
import type { SubDivision } from "@/table-types/sub-division-types";

interface BlockDialogProps {
  mode: string;
}

export default function BlockDialog({ mode }: BlockDialogProps) {
  console.log(mode);
  const queryClient = useQueryClient();

  const { data: subDivisionData = [] } = useQuery({
    queryKey: ["subDivisions"],
    queryFn: fetchSubDivisions,
  });

  const [open, setOpen] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [subDivision, setSubDivision] = useState("");

  const generateRandomPassword = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const mutation = useMutation({
    mutationFn: createBlock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      console.log(data);
      alert("✅ Block created successfully!");
      setOpen(false);
      setBlockName("");
      setSubDivision("");
    },
    onError: (error) => {
      console.error("Error creating block:", error);
      alert("❌ Failed to create block. Check console for details.");
    },
  });

  const handleSave = () => {
    if (!blockName || !subDivision) {
      alert("Please enter Block name and select a Sub Division.");
      return;
    }

    const selectedSubDiv = subDivisionData.find(
      (sd: SubDivision) => sd.name === subDivision
    );

    if (!selectedSubDiv) {
      alert("Invalid Sub Division selected.");
      return;
    }

    const generatedEmail = `${blockName
      .toLowerCase()
      .replace(/\s+/g, "")}@abc.com`;
    const randomPassword = generateRandomPassword();

    const blockData = {
      name: blockName,
      email: generatedEmail,
      subdivision_id: selectedSubDiv.id,
      password: randomPassword,
    };

    console.log("📦 Sending block data:", blockData);

    mutation.mutate(blockData);

    alert(
      `Block: ${blockName}\nEmail: ${generatedEmail}\nPassword: ${randomPassword}`
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-zinc-900 text-white"
          onClick={() => setOpen(true)}
        >
          Add Block
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            Add Block
          </DialogTitle>
        </DialogHeader>

        <form
          className="grid grid-cols-1 gap-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <Label className="text-sm font-medium">Sub Division</Label>
            <Select
              value={subDivision}
              onValueChange={(val) => setSubDivision(val)}
            >
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Sub Division" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {subDivisionData.length > 0 ? (
                  subDivisionData.map((sd: SubDivision) => (
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
          </div>

          <div>
            <Label className="text-sm font-medium">Block Name</Label>
            <Input
              type="text"
              placeholder="Enter Block Name"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 rounded-lg transition"
            >
              {mutation.isPending ? "Saving..." : "Save Block"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
