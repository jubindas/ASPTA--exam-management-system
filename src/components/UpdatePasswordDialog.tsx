import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { updateSubdivisionPassword, type UpdatePasswordData } from "@/service/subDivisionApi";
import { useAuth } from "@/hooks/useAuth";

interface UpdatePasswordDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function UpdatePasswordDialog({
  trigger,
  onSuccess,
}: UpdatePasswordDialogProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Not authenticated");
      if (newPassword !== confirmPassword) throw new Error("Passwords do not match");

      const data: UpdatePasswordData = {
        old_password: currentPassword,
        new_password: newPassword,
      };

      return await updateSubdivisionPassword(data, token);
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      setOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      queryClient.invalidateQueries({ queryKey: ["subdivisions"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      console.error("Failed to update password:", err);
      toast.error(err?.message || err?.error || "Failed to update password");
    },
  });

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    mutation.mutate();
  };

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
            Enter your current password and the new password below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword" className="text-zinc-700">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword" className="text-zinc-700">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-zinc-700">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
