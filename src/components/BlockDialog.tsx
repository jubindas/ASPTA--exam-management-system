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
  editingBlock?: Block | null;
  onClose?: () => void;
}

export default function BlockDialog({
  onBlocksChange,
  editingBlock,
  onClose,
}: BlockDialogProps) {
  const [open, setOpen] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [subDivision, setSubDivision] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (editingBlock) setOpen(true);
  }, [editingBlock]);

  useEffect(() => {
    const storedBlocks: Block[] = JSON.parse(
      localStorage.getItem("blocks") || "[]"
    );
    const storedSubDivisions: SubDivision[] = JSON.parse(
      localStorage.getItem("subDivisions") || "[]"
    );
    const storedUser: User | null = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );
    setBlocks(storedBlocks);
    setSubDivisions(storedSubDivisions);

    if (storedUser) {
      setUserRole(storedUser.role);

      if (editingBlock) {
        setBlockName(editingBlock.blockName);
        setSubDivision(editingBlock.subDivision);
      } else if (storedUser.role === "subdiv") {
        setSubDivision(storedUser.name);
      } else if (storedSubDivisions.length > 0) {
        setSubDivision(storedSubDivisions[0].name);
      }
    }
  }, [editingBlock]);

  const handleSave = () => {
    if (!blockName || !subDivision) return alert("Please fill all fields");

    if (editingBlock) {
      const updatedBlocks = blocks.map((b) =>
        b.id === editingBlock.id ? { ...b, blockName, subDivision } : b
      );
      localStorage.setItem("blocks", JSON.stringify(updatedBlocks));
      setBlocks(updatedBlocks);
      onBlocksChange(updatedBlocks);
      alert(`Block "${blockName}" updated!`);
      setOpen(false);
      onClose?.();
      return;
    }

    const generateRandomPassword = (length = 8) => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
      return Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("");
    };

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
    localStorage.setItem(
      "users",
      JSON.stringify([
        ...existingUsers,
        {
          name: blockName,
          email: generatedEmail,
          password: randomPassword,
          role: "block",
          subDivision: subDivision,
        },
      ])
    );

    onBlocksChange(updatedBlocks);
    alert(
      `Block "${blockName}" created under Sub Division: ${subDivision}\n\nLogin: ${generatedEmail}\nPassword: ${randomPassword}`
    );

    setBlockName("");
    if (userRole !== "subdiv" && subDivisions.length > 0)
      setSubDivision(subDivisions[0].name);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) onClose?.();
      }}
    >
      {!editingBlock && (
        <DialogTrigger asChild>
          <Button
            className="bg-zinc-900 text-white"
            onClick={() => setOpen(true)}
          >
            Add Block
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-lg w-full bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            {editingBlock ? "Edit Block" : "Add Block"}
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
              onValueChange={setSubDivision}
              disabled={userRole === "subdiv"}
            >
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md disabled:opacity-70">
                <SelectValue>
                  {subDivision || "Select Sub Division"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
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
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 rounded-lg transition"
            >
              {editingBlock ? "Update Block" : "Save Block"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
