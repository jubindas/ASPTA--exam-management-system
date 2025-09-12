import { useState, useEffect } from "react";

import {  Dialog,  DialogContent,  DialogHeader,  DialogTitle,  DialogTrigger,} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select";

import type { Center } from "@/table-types/center-table-types";


interface SubDivision {
  id: number;
  name: string;
}

interface Block {
  id: number;
  subDivision: string; 
  blockName: string;
}

interface CenterDialogProps {
  onCentersChange: (centers: Center[]) => void;
  editingCenter?: Center | null;
  onClose?: () => void;
}

export default function CenterDialog({
  onCentersChange,
  editingCenter,
  onClose,
}: CenterDialogProps) {
  
  const [subDivision, setSubDivision] = useState("");

  const [block, setBlock] = useState("");

  const [centerName, setCenterName] = useState("");

  const [centers, setCenters] = useState<Center[]>([]);

  const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);

  const [blocks, setBlocks] = useState<Block[]>([]);

  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);

  const [userRole, setUserRole] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedCenters = JSON.parse(localStorage.getItem("centers") || "[]");
    setCenters(storedCenters);

    const storedSubDivisions = JSON.parse(
      localStorage.getItem("subDivisions") || "[]"
    );
    setSubDivisions(storedSubDivisions);

    const storedBlocks = JSON.parse(localStorage.getItem("blocks") || "[]");
    setBlocks(storedBlocks);

    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (storedUser) setUserRole(storedUser.role);
  }, []);


  useEffect(() => {
    if (editingCenter) {
      setOpen(true);
      setSubDivision(editingCenter.subDivision);
      setBlock(editingCenter.block);
      setCenterName(editingCenter.centerName);
    } else {
      setOpen(false);
      setSubDivision("");
      setBlock("");
      setCenterName("");
    }
  }, [editingCenter]);


  useEffect(() => {
    if (subDivision) {
      const relatedBlocks = blocks.filter(
        (b) => b.subDivision === subDivision
      );
      setFilteredBlocks(relatedBlocks);
      if (!relatedBlocks.some((b) => b.blockName === block)) {
        setBlock("");
      }
    } else {
      setFilteredBlocks([]);
      setBlock("");
    }
  }, [subDivision, blocks, block]);



  const handleSave = () => {
    if (!subDivision || !block || !centerName)
      return alert("Please fill all fields");

    if (editingCenter) {
      const updatedCenters = centers.map((c) =>
        c.id === editingCenter.id ? { ...c, subDivision, block, centerName } : c
      );
      setCenters(updatedCenters);
      localStorage.setItem("centers", JSON.stringify(updatedCenters));
      onCentersChange(updatedCenters);
      setOpen(false);
      onClose?.();
      return;
    }

    const newCenter: Center = {
      id: Date.now(),
      subDivision,
      block,
      centerName,
    };
    const updatedCenters = [...centers, newCenter];
    setCenters(updatedCenters);
    localStorage.setItem("centers", JSON.stringify(updatedCenters));
    onCentersChange(updatedCenters);

    if (userRole !== "subdiv") setSubDivision("");
    if (userRole !== "block") setBlock("");
    setCenterName("");
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
      {!editingCenter && (
        <DialogTrigger asChild>
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4 rounded-lg transition">
            Add School
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-lg w-full bg-zinc-100 text-zinc-900 rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            {editingCenter ? "Edit Center" : "Add School Details"}
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
              disabled={userRole === "subdiv" || userRole === "block"}
            >
              <SelectTrigger className="w-full mt-1 bg-white border border-zinc-300 focus:ring-2 focus:ring-zinc-400 rounded-md h-10 disabled:opacity-70 disabled:cursor-not-allowed">
                <SelectValue placeholder="Select Sub Division" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {subDivisions.map((sd) => (
                  <SelectItem key={sd.id} value={sd.name}>
                    {sd.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Block</Label>
            <Select
              value={block}
              onValueChange={setBlock}
              disabled={userRole === "block"}
            >
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {filteredBlocks.map((b) => (
                  <SelectItem key={b.id} value={b.blockName}>
                    {b.blockName}
                  </SelectItem>
                ))}
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
              className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 rounded-lg transition"
            >
              {editingCenter ? "Update Center" : "Save Center"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
