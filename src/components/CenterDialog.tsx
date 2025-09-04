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

interface SubDivision {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface Block {
  id: number;
  subDivision: string;
  blockName: string;
}

interface CenterDialogProps {
  onCentersChange: (centers: Center[]) => void;
}

export default function CenterDialog({ onCentersChange }: CenterDialogProps) {
  const [subDivision, setSubDivision] = useState("");
  const [block, setBlock] = useState("");
  const [centerName, setCenterName] = useState("");
  const [centers, setCenters] = useState<Center[]>([]);

  const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userSubDivision, setUserSubDivision] = useState<string | null>(null);

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
    console.log("👤 Current User:", storedUser);

    if (storedUser) {
      setUserRole(storedUser.role);

      if (storedUser.role === "subdiv") {
        setUserSubDivision(storedUser.name);
        setSubDivision(storedUser.name); 
      }
    }
  }, []);

  const handleSave = () => {
    if (!subDivision || !block || !centerName)
      return alert("Please fill all fields");

    if (userRole === "subdiv" && userSubDivision !== subDivision) {
      return alert("You can only add centers under your assigned subdivision.");
    }

    const newCenter = { id: Date.now(), subDivision, block, centerName };
    const updatedCenters = [...centers, newCenter];

    setCenters(updatedCenters);
    localStorage.setItem("centers", JSON.stringify(updatedCenters));

    if (onCentersChange) onCentersChange(updatedCenters);

    if (userRole !== "subdiv") {
      setSubDivision("");
    }
    setBlock("");
    setCenterName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4 rounded-lg transition">
          Add School
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
          {/* Sub Division */}
          <div className="w-full">
            <Label className="text-sm font-medium">Sub Division</Label>
            {userRole === "subdiv" && userSubDivision ? (
              <Input
                type="text"
                value={userSubDivision}
                disabled
                className="w-full h-10 mt-1 bg-zinc-200 border border-zinc-300 rounded-md cursor-not-allowed"
              />
            ) : (
              <Select value={subDivision} onValueChange={setSubDivision}>
                <SelectTrigger className="w-full mt-1 bg-white border border-zinc-300 focus:ring-2 focus:ring-zinc-400 rounded-md h-10">
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
            )}
          </div>

            <div>
            <Label className="text-sm font-medium">Block</Label>
            <Select value={block} onValueChange={setBlock}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 rounded-md shadow-lg">
                {blocks.length > 0 ? (
                  blocks.map((b) => (
                    <SelectItem
                      key={b.id}
                      value={b.blockName}
                      className="cursor-pointer hover:bg-zinc-100 px-3 py-2 rounded-md"
                    >
                      {b.blockName}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-zinc-500">
                    No Blocks found
                  </div>
                )}
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
