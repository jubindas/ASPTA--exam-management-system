import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
        <span className="text-white font-medium text-lg">Loading...</span>
      </div>
    </div>
  );
}
