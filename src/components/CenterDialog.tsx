import { useEffect, useState } from "react";
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

import { fetchSubDivisions } from "@/service/subDivisionApi";
import { getBlockList } from "@/service/blockApi";
import { createSchools } from "@/service/schoolApi";

import type { SubDivision } from "@/table-types/sub-division-types";
import type { Block } from "@/table-types/block-table-types";
import { toast } from "sonner";

export default function CenterDialog() {
  const [subDivisionId, setSubDivisionId] = useState<string>("");
  const [blockId, setBlockId] = useState<string>("");
  const [centerName, setCenterName] = useState<string>("");
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);

  const queryClient = useQueryClient();

  const { data: subDivisions = [] as SubDivision[] } = useQuery({
    queryKey: ["subDivisions"],
    queryFn: fetchSubDivisions,
  });

  const { data: blockData = [] as Block[] } = useQuery({
    queryKey: ["blocks"],
    queryFn: getBlockList,
  });

  useEffect(() => {
    if (!subDivisionId) {
      setFilteredBlocks([]);
      setBlockId("");
      return;
    }

    const sid = Number(subDivisionId);
    const filtered = (blockData ?? []).filter(
      (b: Block) => b.subdivision?.id === sid
    );

    setFilteredBlocks(filtered);
    setBlockId("");
  }, [subDivisionId, blockData]);

  const createSchoolMutation = useMutation({
    mutationFn: createSchools,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast("School created successfully!");
      setCenterName("");
      setBlockId("");
      setSubDivisionId("");
    },
    onError: (error) => {
      console.error("Error creating school:", error);
      toast("Failed to create school");
    },
  });

  const handleSave = () => {
    if (!subDivisionId || !blockId || !centerName.trim()) {
      console.warn("Please fill all fields before saving");
      return;
    }

    const payload = {
      center_name: centerName,
      subdivision_id: Number(subDivisionId),
      block_id: Number(blockId),
    };

    console.log("Sending payload:", payload);
    createSchoolMutation.mutate(payload);
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
            Add Center
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
            <Select
              value={subDivisionId}
              onValueChange={(val) => setSubDivisionId(val)}
            >
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm">
                <SelectValue placeholder="Select Sub Division" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {subDivisions.map((sd: SubDivision) => (
                  <SelectItem key={sd.id} value={String(sd.id)}>
                    {sd.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Block</Label>
            <Select value={blockId} onValueChange={(val) => setBlockId(val)}>
              <SelectTrigger className="w-full h-10 mt-1 bg-white border border-zinc-300 rounded-md shadow-sm">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {filteredBlocks.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
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
              disabled={createSchoolMutation.isPending}
              className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 rounded-lg transition"
            >
              {createSchoolMutation.isPending ? "Saving..." : "Save Center"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
