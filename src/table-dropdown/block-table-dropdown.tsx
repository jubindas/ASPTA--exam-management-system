import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal, Edit, Trash2, Printer, FileBadge } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBlock } from "@/service/blockApi";

import { toast } from "sonner";

import BlockDialog from "@/components/BlockDialog";

import { useAuth } from "@/hooks/useAuth";

import { useNavigate } from "react-router-dom";

import UpdatePasswordDialogBlock from "@/components/UpdatePasswordDialogBlock";

interface BlockTableDropdownProps {
  block: {
    id: number;
    name: string;
    email: string;
    password: string;
    subdivision: { id: number; name: string };
  };

  updatePass: {
    id: number;
    password: string;
  };
}

export default function BlockTableDropdown({
  block,
  updatePass,
}: BlockTableDropdownProps) {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: () => deleteBlock(block.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast("Block deleted successfully");
      setOpenDialog(false);
    },
    onError: (error) => {
      console.error("Failed to delete block:", error);
      toast.error("Failed to delete block");
    },
  });

  const handlePrint = () => {
    alert(`Printing Result for ${block.name}`);
  };

  const handleGenerateAdmit = () => {
    navigate("/generate-admit", { state: { block } }); 
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-zinc-100 rounded-full"
          >
            <MoreHorizontal className="h-5 w-5 text-zinc-700" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-48 p-2 bg-white border border-zinc-200 shadow-lg rounded-md"
        >
          <div className="flex flex-col space-y-1">
            <BlockDialog
              mode="edit"
              blockData={block}
              trigger={
                <Button
                  variant="ghost"
                  className="justify-start text-left text-sm hover:bg-zinc-100 w-full text-zinc-700"
                >
                  <Edit className="h-4 w-4 mr-2 text-zinc-700" />
                  Edit
                </Button>
              }
            />

            <Button
              variant="ghost"
              className="justify-start text-left text-sm hover:bg-red-100 text-red-600 w-full mt-1"
              onClick={() => setOpenDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-600" />
              Delete
            </Button>

            {user?.user_type === "admin" && (
              <Button
                variant="ghost"
                className="justify-start text-left text-sm hover:bg-zinc-100"
                onClick={handleGenerateAdmit}
              >
                <FileBadge className="h-4 w-4 mr-2 text-zinc-700" />
                Generate Admit
              </Button>
            )}

            {user?.user_type === "admin" && (
              <UpdatePasswordDialogBlock
                updatePass={updatePass}
                trigger={
                  <Button
                    variant="ghost"
                    className="justify-start text-left text-sm hover:bg-zinc-100 w-full text-zinc-700"
                  >
                    <Edit className="h-4 w-4 mr-2 text-blue-600" />
                    Update Password
                  </Button>
                }
              />
            )}

            <Button
              variant="ghost"
              className="justify-start text-left text-sm hover:bg-zinc-100"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2 text-zinc-700" />
              Print Result
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this block?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-red-500 text-white"
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
