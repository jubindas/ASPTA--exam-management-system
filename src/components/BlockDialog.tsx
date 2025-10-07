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

import { createBlock, updateBlock } from "@/service/blockApi";

import type { SubDivision } from "@/table-types/sub-division-types";

import { useAuth } from "@/hooks/useAuth";

interface BlockDialogProps {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  blockData?: {
    id: number;
    name: string;
    email: string;
    password: string;
    subdivision: { id: number; name: string };
  };
}

export default function BlockDialog({
  mode,
  trigger,
  blockData,
}: BlockDialogProps) {
  const queryClient = useQueryClient();

  const { data: subDivisionData = [] } = useQuery({
    queryKey: ["subDivisions"],
    queryFn: fetchSubDivisions,
  });

  const [open, setOpen] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [subDivision, setSubDivision] = useState("");

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      console.log(user, "the user auth");
      if (mode === "edit" && blockData) {
        setBlockName(blockData.name);
        setSubDivision(blockData.subdivision.name);
      } else if (user?.user_type === "subdivision") {
        setSubDivision(user.name);
        setBlockName("");
      } else {
        setBlockName("");
        setSubDivision("");
      }
    }
  }, [mode, blockData, user, loading]);

  const generateRandomPassword = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (data: any) => {
      if (mode === "create") return await createBlock(data);
      if (mode === "edit" && blockData)
        return await updateBlock(blockData.id, data);
      throw new Error("Invalid mode or missing block data");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast(`Block ${mode === "create" ? "created" : "updated"} successfully`);
      setOpen(false);
      setBlockName("");
      setSubDivision("");
    },
    onError: (err) => {
      console.error("Failed to save block:", err);
      toast("Failed to save block");
    },
  });

  const handleSave = () => {
    if (!blockName || !subDivision) {
      toast.error("Please enter Block name and select a Sub Division.");
      return;
    }

    const selectedSubDiv = subDivisionData.find(
      (sd: SubDivision) => sd.name === subDivision
    );
    if (!selectedSubDiv) {
      toast.error("Invalid Sub Division selected.");
      return;
    }

    const generatedEmail = `${blockName
      .toLowerCase()
      .replace(/\s+/g, "")}@abc.com`;
    const randomPassword =
      mode === "create" ? generateRandomPassword() : blockData?.password;

    const payload = {
      name: blockName,
      email: generatedEmail,
      subdivision_id: selectedSubDiv.id,
      password: randomPassword,
    };

    mutation.mutate(payload);

    if (mode === "create") {
      toast.success(
        `Block created!\nEmail: ${generatedEmail}\nPassword: ${randomPassword}`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
            {mode === "create" ? "Add Block" : "Edit Block"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white text-zinc-900 border border-zinc-200 shadow-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Block" : "Edit Block"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subDivision" className="text-zinc-700">
              Sub Division
            </Label>

            {user?.user_type === "subdivision" ? (
              <Input
                value={subDivision}
                disabled
                className="bg-zinc-100 text-zinc-900 border border-zinc-300 cursor-not-allowed"
              />
            ) : (
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
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="blockName" className="text-zinc-700">
              Block Name
            </Label>
            <Input
              id="blockName"
              placeholder="Enter Block Name"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              className="bg-zinc-50 text-zinc-900 border border-zinc-300 placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            className="bg-zinc-800 text-white hover:bg-zinc-700"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Save"
              : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
