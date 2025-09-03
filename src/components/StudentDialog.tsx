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

export default function StudentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 text-white hover:bg-zinc-700 shadow-md px-4">
          Add Student
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-zinc-100 text-zinc-900 rounded-xl shadow-xl p-6">
        
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">
            Add Student Details
          </DialogTitle>
        </DialogHeader>

     
        <form className="grid grid-cols-2 gap-4 mt-4">
          
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
            <Label className="text-sm font-medium">Block</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-white border border-zinc-300">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="block1">Block 1</SelectItem>
                <SelectItem value="block2">Block 2</SelectItem>
                <SelectItem value="block3">Block 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Center</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-white border border-zinc-300">
                <SelectValue placeholder="Select Center" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="center1">Center 1</SelectItem>
                <SelectItem value="center2">Center 2</SelectItem>
                <SelectItem value="center3">Center 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Student UUID</Label>
            <Input
              type="text"
              placeholder="Enter UUID"
              className="mt-1 bg-white border border-zinc-300"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Student Name</Label>
            <Input
              type="text"
              placeholder="Enter Name"
              className="mt-1 bg-white border border-zinc-300"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Mobile Number</Label>
            <Input
              type="text"
              placeholder="Enter Mobile Number"
              className="mt-1 bg-white border border-zinc-300"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Result</Label>
            <Input
              type="text"
              placeholder="Enter Result"
              className="mt-1 bg-white border border-zinc-300"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Class Name</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-white border border-zinc-300">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="iv">Class IV</SelectItem>
                <SelectItem value="v">Class V</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Medium</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-white border border-zinc-300">
                <SelectValue placeholder="Select Medium" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 shadow-md rounded-md">
                <SelectItem value="assamese">Assamese</SelectItem>
                <SelectItem value="bengali">Bengali</SelectItem>
                <SelectItem value="boro">Boro</SelectItem>
                <SelectItem value="garo">Garo</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="flex justify-end mt-6">
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700 px-6">
            Save Student
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
