import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, Edit, FileBadge, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlockTableDropdownProps {
  block: {
    id: number;
    name: string;
    email: string;
    password: string;
    subdivision: { name: string };
  };
}

export default function BlockTableDropdown({ block }: BlockTableDropdownProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    console.log("Editing block:", block);
    // Your edit logic here
  };

  const handleGenerateAdmit = () => {
    navigate("/generate-admit", { state: { block } });
  };

  const handlePrint = () => {
    alert(`Printing Result for ${block.name}`);
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
        className="w-48 p-2 bg-white border border-zinc-200 shadow-lg rounded-md"
      >
        <div className="flex flex-col space-y-1">
          <Button
            variant="ghost"
            className="justify-start text-left text-sm hover:bg-zinc-100"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-2 text-zinc-700" /> Edit
          </Button>

          <Button
            variant="ghost"
            className="justify-start text-left text-sm hover:bg-zinc-100"
            onClick={handleGenerateAdmit}
          >
            <FileBadge className="h-4 w-4 mr-2 text-zinc-700" /> Generate Admit
          </Button>

          <Button
            variant="ghost"
            className="justify-start text-left text-sm hover:bg-zinc-100"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2 text-zinc-700" /> Print Result
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
