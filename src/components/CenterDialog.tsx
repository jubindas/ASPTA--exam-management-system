
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchSubDivisions } from "@/service/subDivisionApi";

import { getBlockList } from "@/service/blockApi";

import { createSchools, updateSchool } from "@/service/schoolApi";

import { toast } from "sonner";

import type { SubDivision } from "@/table-types/sub-division-types";

import type { Block } from "@/table-types/block-table-types";

import { useAuth } from "@/hooks/useAuth";

interface CenterDialogProps {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
 schoolData?: {
  id: number;
  name: string;
  block: {
    id: number;
    name: string;
    subdivision?: { id: number; name: string }; 
  };
  subdivision?: { id: number; name: string }; 
};

}

export default function CenterDialog({
  mode,
  trigger,
  schoolData,
}: CenterDialogProps) {
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  const { data: subDivisions = [], isLoading: isLoadingSubDivisions } = useQuery<SubDivision[]>({
    queryKey: ["subDivisions"],
    queryFn: fetchSubDivisions,
  });

  const { data: blocks = [], isLoading: isLoadingBlocks } = useQuery<Block[]>({
    queryKey: ["blocks"],
    queryFn: getBlockList,
  });

  const [open, setOpen] = useState(false);
  const [subDivisionId, setSubDivisionId] = useState<string>("");
  const [blockId, setBlockId] = useState<string>("");
  const [centerName, setCenterName] = useState<string>("");
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (loading || isLoadingBlocks || isLoadingSubDivisions) {
      setIsInitialized(false);
      return;
    }

    if (!open) {
      setIsInitialized(false);
      return;
    }

    if (isInitialized) return;

    if (mode === "edit" && schoolData) {
  
      setSubDivisionId(schoolData.subdivision ? String(schoolData.subdivision.id) : "");
      setBlockId(String(schoolData.block.id));
      setCenterName(schoolData.name);
    } else if (user?.user_type === "subdivision") {
    
      setSubDivisionId(String(user.id));
      setBlockId("");
      setCenterName("");
    } else if (user?.user_type === "block") {
   
      const userBlock = blocks.find((b) => b.id === user.id);
      if (userBlock && userBlock.subdivision) {
        setBlockId(String(userBlock.id));
        setSubDivisionId(String(userBlock.subdivision.id));
      }
      setCenterName("");
    } else {
   
      setSubDivisionId("");
      setBlockId("");
      setCenterName("");
    }

    setIsInitialized(true);
  }, [mode, schoolData, user, loading, blocks, isLoadingBlocks, isLoadingSubDivisions, open, isInitialized]);

  useEffect(() => {
    if (!subDivisionId) {
      setFilteredBlocks([]);
      return;
    }
    const sid = Number(subDivisionId);
    const filtered = blocks.filter((b) => b.subdivision?.id === sid);
    setFilteredBlocks(filtered);

    if (user?.user_type !== "block" && !filtered.some((b) => String(b.id) === blockId)) {
      setBlockId("");
    }
  }, [subDivisionId, blocks, blockId, user?.user_type]);

  useEffect(() => {
    if (!open) {
      setIsInitialized(false);
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: async (data: {
      center_name: string;
      subdivision_id: number;
      block_id: number;
    }) => {
      if (mode === "create") return await createSchools(data);
      if (mode === "edit" && schoolData)
        return await updateSchool(schoolData.id, data);
      throw new Error("Invalid mode or missing school data");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success(
        `School ${mode === "create" ? "created" : "updated"} successfully`
      );
      setOpen(false);
      if (user?.user_type === "admin") {
        setCenterName("");
        setSubDivisionId("");
        setBlockId("");
      } else {
        setCenterName("");
      }
    },
    onError: (error) => {
      console.error("Error saving school:", error);
      toast.error("Failed to save school");
    },
  });

  const handleSave = () => {
    if (!centerName.trim() || !subDivisionId || !blockId) {
      toast.error("Please fill all fields");
      return;
    }

    mutation.mutate({
      center_name: centerName.trim(),
      subdivision_id: Number(subDivisionId),
      block_id: Number(blockId),
    });
  };

  const getSubDivisionName = () => {
    const subdivision = subDivisions.find((sd) => sd.id === Number(subDivisionId));
    return subdivision?.name || "";
  };

  const getBlockName = () => {
    const block = blocks.find((b) => b.id === Number(blockId));
    return block?.name || "";
  };

  if (loading) return null;

  const isSubDivisionDisabled = user?.user_type === "subdivision" || user?.user_type === "block";
  const isBlockDisabled = user?.user_type === "block";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
            {mode === "create" ? "Add Center" : "Edit Center"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-white text-zinc-900 rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Center" : "Edit Center"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
      
          <div className="grid gap-2">
            <Label>Sub Division</Label>
            {isSubDivisionDisabled ? (
              <Input
                value={getSubDivisionName()}
                disabled
                className="bg-zinc-100 text-zinc-700 border border-zinc-300 cursor-not-allowed"
              />
            ) : (
              <Select value={subDivisionId} onValueChange={setSubDivisionId}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select Sub Division" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {subDivisions.map((sd) => (
                    <SelectItem key={sd.id} value={String(sd.id)}>
                      {sd.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

      
          <div className="grid gap-2">
            <Label>Block</Label>
            {isBlockDisabled ? (
              <Input
                value={getBlockName()}
                disabled
                className="bg-zinc-100 text-zinc-700 border border-zinc-300 cursor-not-allowed"
              />
            ) : (
              <Select 
                value={blockId} 
                onValueChange={setBlockId}
                disabled={!subDivisionId}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {filteredBlocks.length > 0 ? (
                    filteredBlocks.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-zinc-500">
                      No Blocks available
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Center Name</Label>
            <Input
              value={centerName}
              onChange={(e) => setCenterName(e.target.value)}
              placeholder="Enter Center Name"
              
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="bg-zinc-800 text-white hover:bg-zinc-700"
          >
            {mutation.isPending
              ? mode === "create"
                ? "Saving..."
                : "Updating..."
              : mode === "create"
              ? "Save Center"
              : "Update Center"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}