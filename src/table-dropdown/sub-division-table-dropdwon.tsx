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

import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSubDivision } from "@/service/subDivisionApi";

import { toast } from "sonner";

import SubDivisionDialog from "@/components/SubDivisionDialog";

import UpdatePasswordDialog from "@/components/UpdatePasswordDialog";

import { useAuth } from "@/hooks/useAuth";

export default function SubDivisionTableDropdown({
  id,
  rowData,
}: {
  id: number;
  rowData: { name: string; id: number; password: string; email: string };
}) {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);

  const { user } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: () => deleteSubDivision(id),
    onSuccess: () => {
      console.log(`Subdivision with ID ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["subDivisions"] });
      toast("Subdivision deleted successfully");
      setOpenDialog(false);
    },
    onError: (error) => {
      console.error("Failed to delete subdivision:", error);
      toast.error("Failed to delete subdivision");
    },
  });

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
          className="w-45 p-2 bg-white border border-zinc-200 shadow-lg rounded-md"
        >
          <div className="flex flex-col">
            <SubDivisionDialog
              mode="edit"
              rowData={rowData}
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
            {user?.user_type === "admin" && (
              <UpdatePasswordDialog
                data={rowData}
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
              className="justify-start text-left text-sm hover:bg-red-100 text-red-600 w-full mt-1"
              onClick={() => setOpenDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-600" />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this subdivision?
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
