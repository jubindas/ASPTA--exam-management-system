import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { createSubDivision, updateSubDivision } from "@/service/subDivisionApi";

interface SubDivision {
  id: number;
  name: string;
  email?: string;
  password?: string;
}

interface SubDivisionDialogProps {
  mode: "create" | "edit";
  rowData?: SubDivision;
}

export default function SubDivisionDialog({
  mode,
  rowData,
}: SubDivisionDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (mode === "edit" && rowData) {
      setName(rowData.name);
    } else {
      setName("");
    }
  }, [mode, rowData]);

  const mutation = useMutation({
    mutationFn: () => {
      if (mode === "create") {
        const email = `${name
          .replace(/\s+/g, "")
          .toLowerCase()}@subdivision.com`;
        const password = Math.random().toString(36).slice(-8);
        return createSubDivision({ name, email, password });
      } else if (mode === "edit" && rowData) {
        return updateSubDivision(rowData.id, { name });
      }
      throw new Error("Invalid mode or missing data");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subDivisions"] }); // Refresh table
      alert(
        mode === "create" ? "Subdivision created!" : "Subdivision updated!"
      );
      setOpen(false);
      setName("");
    },
    onError: () => alert("Operation failed"), // Simple error handling
  });

  const handleSave = () => {
    if (!name.trim()) return alert("Please enter Sub Division Name");
    mutation.mutate(); // Trigger create or update
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4 rounded-lg transition">
          {mode === "create" ? "Add Sub Division" : "Edit Sub Division"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            {mode === "create" ? "Add Sub Division" : "Edit Sub Division"}
          </DialogTitle>
        </DialogHeader>

        <form
          className="grid grid-cols-1 gap-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="w-full">
            <Label className="text-sm font-medium">Sub Division Name</Label>
            <Input
              type="text"
              placeholder="Enter Sub Division Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 rounded-lg transition"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Save Sub Division"
                : "Update Sub Division"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
