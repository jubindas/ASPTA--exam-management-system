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

interface Center {
  id: number;
  subDivision: string;
  block: string;
  centerName: string;
}

interface CenterDialogProps {
  onCentersChange: (centers: Center[]) => void;
}

export default function CenterDialog({ onCentersChange }: CenterDialogProps) {
  const [subDivision, setSubDivision] = useState("");
  const [block, setBlock] = useState("");
  const [centerName, setCenterName] = useState("");
  const [centers, setCenters] = useState<Center[]>([]);

  useEffect(() => {
    const storedCenters = JSON.parse(localStorage.getItem("centers") || "[]");
    setCenters(storedCenters);
  }, []);

  const handleSave = () => {
    if (!subDivision || !block || !centerName)
      return alert("Please fill all fields");

    const newCenter = { id: Date.now(), subDivision, block, centerName };
    const updatedCenters = [...centers, newCenter];

    setCenters(updatedCenters);
    localStorage.setItem("centers", JSON.stringify(updatedCenters));

    if (onCentersChange) onCentersChange(updatedCenters);

    
    setSubDivision("");
    setBlock("");
    setCenterName("");

  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4 rounded-lg transition">
          Add Center
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full bg-zinc-100 text-zinc-900 rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            Add Center Details
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
            <Select value={subDivision} onValueChange={setSubDivision}>
              <SelectTrigger className="w-full mt-1 bg-white border border-zinc-300 focus:ring-2 focus:ring-zinc-400 rounded-md h-10">
                <SelectValue placeholder="Select Sub Division" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="sub1">Sub Division 1</SelectItem>
                <SelectItem value="sub2">Sub Division 2</SelectItem>
                <SelectItem value="sub3">Sub Division 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label className="text-sm font-medium">Block</Label>
            <Select value={block} onValueChange={setBlock}>
              <SelectTrigger className="w-full mt-1 bg-white border border-zinc-300 focus:ring-2 focus:ring-zinc-400 rounded-md h-10">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="block1">Block 1</SelectItem>
                <SelectItem value="block2">Block 2</SelectItem>
                <SelectItem value="block3">Block 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label className="text-sm font-medium">Center Name</Label>
            <Input
              type="text"
              placeholder="Enter Center Name"
              value={centerName}
              onChange={(e) => setCenterName(e.target.value)}
              className="w-full h-10 mt-1 bg-white border border-zinc-300 focus:ring-2 focus:ring-zinc-400 rounded-md"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 rounded-lg transition"
            >
              Save Center
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
