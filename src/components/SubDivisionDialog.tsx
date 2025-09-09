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

interface SubDivision {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface SubDivisionDialogProps {
  onSubDivisionsChange: (subDivisions: SubDivision[]) => void;
}

export default function SubDivisionDialog({
  onSubDivisionsChange,
}: SubDivisionDialogProps) {
  const [name, setName] = useState("");
  const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);

  useEffect(() => {
    const storedSubDivisions = JSON.parse(
      localStorage.getItem("subDivisions") || "[]"
    );
    setSubDivisions(storedSubDivisions);
  }, []);

  const handleSave = () => {
    if (!name) return alert("Please enter Sub Division Name");

    const email = `${name.replace(/\s+/g, "").toLowerCase()}@subdivision.com`;
    const password = Math.random().toString(36).slice(-8);

    const nextId =
      subDivisions.length > 0
        ? subDivisions[subDivisions.length - 1].id + 1
        : 1;

    const newSubDivision: SubDivision = {
      id: nextId,
      name,
      email,
      password,
    };


    const updatedSubDivisions = [...subDivisions, newSubDivision];
    localStorage.setItem("subDivisions", JSON.stringify(updatedSubDivisions));
    setSubDivisions(updatedSubDivisions);

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = {
      name,
      email,
      password,
      role: "subdiv",
    };
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (onSubDivisionsChange) onSubDivisionsChange(updatedSubDivisions);

    setName("");
    alert(
      `Subdivision created!\n\nLogin credentials:\nEmail: ${email}\nPassword: ${password}`
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4 rounded-lg transition">
          Add Sub Division
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            Add Sub Division
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
            >
              Save Sub Division
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
