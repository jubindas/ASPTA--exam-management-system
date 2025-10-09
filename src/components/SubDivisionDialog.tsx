import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSubDivision, updateSubDivision } from "@/service/subDivisionApi";

import { toast } from "sonner";

interface SubDivision {
  id: number;
  name: string;
  email?: string;
  password?: string;
}

interface Props {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  rowData?: SubDivision;
}

export default function SubDivisionDialog({ mode, trigger, rowData }: Props) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  // Fill input when editing
  useEffect(() => {
    if (mode === "edit" && rowData) {
      setName(rowData.name);
    } else {
      setName("");
    }
  }, [mode, rowData]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "create") {
        const email = `${name.replace(/\s+/g, "").toLowerCase()}@subdivision.com`;
        const password = Math.random().toString(36).slice(-8);
        return await createSubDivision({ name, email, password });
      } else if (mode === "edit" && rowData) {
        return await updateSubDivision(rowData.id, { name });
      }
      throw new Error("Invalid mode or missing data");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subDivisions"] });
      toast.success(
        `Subdivision ${mode === "create" ? "created" : "updated"} successfully`
      );
      setOpen(false);
      setName("");
    },
    onError: (err) => {
      console.error("Failed to save subdivision:", err);
      toast.error("Failed to save subdivision");
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter subdivision name");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
            {mode === "create" ? "Add Sub Division" : "Edit Sub Division"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white text-zinc-900 border border-zinc-200 shadow-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">
            {mode === "create" ? "Add Sub Division" : "Edit Sub Division"}
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Enter subdivision details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subDivisionName" className="text-zinc-700">
              Sub Division Name
            </Label>
            <Input
              id="subDivisionName"
              placeholder="Enter subdivision name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-50 text-zinc-900 border border-zinc-300 placeholder:text-zinc-400"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
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
