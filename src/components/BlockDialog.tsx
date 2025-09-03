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

export default function BlockDialog() {
  return (
    <Dialog>
     
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4">
          Add Block
        </Button>
      </DialogTrigger>

    
      <DialogContent className="max-w-md bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
    
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            Add Block Details
          </DialogTitle>
        </DialogHeader>

       
        <form className="grid grid-cols-1 gap-4 mt-4">
      
          <div>
            <Label className="text-sm font-medium">Sub Division</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-white border border-zinc-300">
                <SelectValue placeholder="Select Sub Division" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="sub1">Sub Division 1</SelectItem>
                <SelectItem value="sub2">Sub Division 2</SelectItem>
                <SelectItem value="sub3">Sub Division 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

     
          <div>
            <Label className="text-sm font-medium">Block Name</Label>
            <Input
              type="text"
              placeholder="Enter Block Name"
              className="mt-1 bg-white border border-zinc-300"
            />
          </div>
        </form>

       
        <div className="flex justify-end mt-6">
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700 px-6">
            Save Block
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
