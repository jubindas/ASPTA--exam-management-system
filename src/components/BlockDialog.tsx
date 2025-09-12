import { useState, useEffect } from "react";

import {  Dialog,  DialogContent,  DialogHeader,  DialogTitle,  DialogTrigger } from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import type { User } from "@/login-local-storage/LoginData";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Block {
  id: number;
  subDivision: string;
  blockName: string;
  role: string;
  email: string;
  password: string;
}

interface SubDivision {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface BlockDialogProps {
  onBlocksChange: (blocks: Block[]) => void;
}

export default function BlockDialog({ onBlocksChange }: BlockDialogProps) {
  const [blockName, setBlockName] = useState("");
  const [subDivision, setSubDivision] = useState(""); 
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedBlocks = JSON.parse(localStorage.getItem("blocks") || "[]");
    const storedSubDivisions = JSON.parse(
      localStorage.getItem("subDivisions") || "[]"
    );
    setBlocks(storedBlocks);
    setSubDivisions(storedSubDivisions);

    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    console.log(" Current User:", storedUser);

    if (storedUser) {
      setUserRole(storedUser.role);

      if (storedUser.role === "subdiv") {
        setSubDivision(storedUser.name);
      }
    }
  }, []);

  const handleSave = () => {
    if (!blockName || !subDivision) {
      return alert("Please fill all fields");
    }

    function generateRandomPassword(length: number = 8): string {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
      return Array.from({ length }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join("");
    }

    const nextId = blocks.length > 0 ? blocks[blocks.length - 1].id + 1 : 1;
    const randomPassword = generateRandomPassword(10);
    const generatedEmail = `${blockName
      .toLowerCase()
      .replace(/\s+/g, "")}@abc.com`;

    const newBlock: Block = {
      id: nextId,
      subDivision,
      blockName,
      role: "block",
      email: generatedEmail,
      password: randomPassword,
    };

    const updatedBlocks = [...blocks, newBlock];
    localStorage.setItem("blocks", JSON.stringify(updatedBlocks));
    setBlocks(updatedBlocks);

    const existingUsers: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const newUser: User = {
      name: blockName,
      email: generatedEmail,
      password: randomPassword,
      role: "block",
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (onBlocksChange) onBlocksChange(updatedBlocks);

    setBlockName("");
    if (userRole !== "subdiv") setSubDivision("");

    alert(
      ` Block "${blockName}" created under Sub Division: ${subDivision}\n\nLogin Credentials:\nEmail: ${newUser.email}\nPassword: ${newUser.password}`
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4 rounded-lg transition">
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
          <div className="w-full">
            <Label className="text-sm font-medium">Sub Division</Label>
            <Select
              value={subDivision}
              onValueChange={(val) => setSubDivision(val)}
              disabled={userRole === "subdiv"} 
            >
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md disabled:opacity-70 disabled:cursor-not-allowed">
                <SelectValue placeholder="Select Sub Division" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                {subDivisions.length > 0 ? (
                  subDivisions.map((sd) => (
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

          <div className="w-full">
            <Label className="text-sm font-medium">Block Name</Label>
            <Input
              type="text"
              placeholder="Enter Block Name"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 rounded-lg transition"
            >
              Save Block
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
