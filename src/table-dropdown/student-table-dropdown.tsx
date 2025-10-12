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
import { MoreHorizontal, Edit, Trash2, PlusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudent } from "@/service/studentsApi";
import { toast } from "sonner";
import StudentDialog from "@/components/StudentDialog";

import type { Student } from "@/table-types/student-table-types";

interface StudentTableDropdownProps {
  student: Student;
}

export default function StudentTableDropdown({
  student,
}: StudentTableDropdownProps) {
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteStudent(student.id),
    onSuccess: () => {
      toast.success(`Student ${student.student_name} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setOpenDeleteDialog(false);
    },
    onError: (err) => {
      console.error("Failed to delete student:", err);
      toast.error("Failed to delete student");
    },
  });

  const handleAddResult = () => {
    toast(`Adding result for ${student.student_name}`);
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
            <StudentDialog
              mode="edit"
              studentData={{
                id: student.id,
                name: student.student_name,
                guardianName: student.guardian_name,
                mobile: student.phone,
                studentClass: student.class,
                medium: student.medium,
                subdivision: student.subdivision?.name ?? "",
                block: student.block?.name ?? "",
                centerName: student.school?.center_name ?? "",
              }}
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
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-600" />
              Delete
            </Button>

            <Button
              variant="ghost"
              className="justify-start text-left text-sm hover:bg-zinc-100 w-full"
              onClick={handleAddResult}
            >
              <PlusCircle className="h-4 w-4 mr-2 text-zinc-700" />
              Add Result
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete {student.student_name}?
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
