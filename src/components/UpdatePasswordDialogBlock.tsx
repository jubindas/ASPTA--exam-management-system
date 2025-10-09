import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";

import { updateBlockPassword } from "@/service/blockApi";

import { Eye, EyeOff } from "lucide-react";

interface UpdatePasswordDialogBlockProps {
  trigger?: React.ReactNode;
  updatePass: {
    id: number;
    password: string;
  };
}

export default function UpdatePasswordDialogBlock({
  trigger,
  updatePass,
}: UpdatePasswordDialogBlockProps) {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      updateBlockPassword(
        {
          user_id: updatePass.id,
          old_password: updatePass.password,
          new_password: newPassword,
        },
        token
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      setOpen(false);
      setNewPassword("");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error(err.response?.data?.message || err.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
            Update Password
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white text-zinc-900 border border-zinc-200 shadow-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Update Password</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Enter your new password below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative grid gap-2">
            <Label htmlFor="newPassword" className="text-zinc-700">
              New Password
            </Label>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-10" 
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-6 w-6"
            >
               {showPassword ? (
                <EyeOff className="mt-4 h-7 w-5 text-zinc-600"/>
              ) : (
                <Eye className=" mt-4 h-7 w-5 text-zinc-600" />
              )}
            </Button>
          </div>

          {mutation.isError && (
            <p className="text-red-500 text-sm">
              {mutation.error?.response?.data?.message ||
                "Failed to update password"}
            </p>
          )}
          {mutation.isSuccess && (
            <p className="text-green-500 text-sm">
              Password updated successfully!
            </p>
          )}
        </div>

        <div className="p-4 flex justify-end">
          <Button
            onClick={() => mutation.mutate()}
            disabled={!newPassword || mutation.isPending}
            className="bg-zinc-900 text-white hover:bg-zinc-700 px-4 py-2 rounded-md"
          >
            {mutation.isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
