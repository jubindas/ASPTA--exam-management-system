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
import { MoreHorizontal, Edit, Trash2, UserPlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchool } from "@/service/schoolApi";
import { toast } from "sonner";
import CenterDialog from "@/components/CenterDialog";

interface SchoolTableDropdownProps {
  school: {
    id: number;
    name: string;
    block: { id: number; name: string };
    subdivision: { id: number; name: string };
  };
}

export default function SchoolTableDropdown({ school }: SchoolTableDropdownProps) {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteSchool(school.id),
    onSuccess: () => {
      console.log(`School with ID ${school.id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School deleted successfully");
      setOpenDialog(false);
    },
    onError: (error) => {
      console.error("Failed to delete school:", error);
      toast.error("Failed to delete school");
    },
  });

  const handleAddStudent = () => {
    alert(`Adding student to ${school.name}`);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-zinc-100 rounded-full">
            <MoreHorizontal className="h-5 w-5 text-zinc-700" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-48 p-2 bg-white border border-zinc-200 shadow-lg rounded-md"
        >
          <div className="flex flex-col space-y-1">
            <CenterDialog
              mode="edit"
              schoolData={school}
              trigger={
                <Button
                  variant="ghost"
                  className="justify-start text-left text-sm hover:bg-zinc-100 w-full text-zinc-700"
                >
                  <Edit className="h-4 w-4 mr-2 text-zinc-700" /> Edit
                </Button>
              }
            />

            <Button
              variant="ghost"
              className="justify-start text-left text-sm hover:bg-zinc-100 w-full text-zinc-700"
              onClick={handleAddStudent}
            >
              <UserPlus className="h-4 w-4 mr-2 text-zinc-700" /> Add Student
            </Button>

            <Button
              variant="ghost"
              className="justify-start text-left text-sm hover:bg-red-100 text-red-600 w-full mt-1"
              onClick={() => setOpenDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Confirm Delete Dialog */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this school?</AlertDialogTitle>
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
