import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-zinc-600" />
    </div>
  );
}
