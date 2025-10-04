import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSubDivision } from "@/service/subDivisionApi";

import SubDivisionDialog from "@/components/SubDivisionDialog";

export default function SubDivisionTableDropdown({
  id,
  rowData,
}: {
  id: number;
  rowData: { name: string , id: number};
}) {
  console.log("Dropdown rowData:", rowData);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteSubDivision(id),
    onSuccess: () => {
      console.log(`Subdivision with ID ${id} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["subDivisions"] });
    },
    onError: (error) => {
      console.error("Failed to delete subdivision:", error);
      alert("Failed to delete subdivision");
    },
  });

  const handleEdit = () => {
    console.log("Edit clicked for ID:", id);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this subdivision?")) {
      deleteMutation.mutate();
    }
  };

  return (
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
        className="w-36 p-2 bg-white border border-zinc-200 shadow-lg rounded-md"
      >
        <Button
          variant="ghost"
          className="justify-start text-left text-sm hover:bg-zinc-100 w-full"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4 mr-2 text-zinc-700" />
          Edit
          <SubDivisionDialog mode="edit" rowData={rowData} />
        </Button>

        <Button
          variant="ghost"
          className="justify-start text-left text-sm hover:bg-red-100 text-red-600 w-full mt-1"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="h-4 w-4 mr-2 text-red-600" />
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
