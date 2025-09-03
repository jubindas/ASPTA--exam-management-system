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

interface Block {
  id: number;
  subDivision: string;
  blockName: string;
}

interface BlockDialogProps {
  onBlocksChange: (blocks: Block[]) => void;
}

export default function BlockDialog({ onBlocksChange }: BlockDialogProps) {
  const [subDivision, setSubDivision] = useState("");
  const [blockName, setBlockName] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const storedBlocks = JSON.parse(localStorage.getItem("blocks") || "[]");
    setBlocks(storedBlocks);
  }, []);

  const handleSave = () => {
    if (!subDivision || !blockName) return alert("Please fill all fields");

    const newBlock = { id: Date.now(), subDivision, blockName };
    const updatedBlocks = [...blocks, newBlock];

    
    setBlocks(updatedBlocks);
    localStorage.setItem("blocks", JSON.stringify(updatedBlocks));

    
    if (onBlocksChange) onBlocksChange(updatedBlocks);

    
    setSubDivision("");
    setBlockName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4 rounded-lg transition">
          Add Block
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            Add Block Details
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
            <Select value={subDivision} onValueChange={(val) => setSubDivision(val)}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Sub Division" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="sub1">Sub Division 1</SelectItem>
                <SelectItem value="sub2">Sub Division 2</SelectItem>
                <SelectItem value="sub3">Sub Division 3</SelectItem>
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
