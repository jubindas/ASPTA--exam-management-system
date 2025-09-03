import { SidebarTrigger } from "./ui/sidebar";
import { User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-zinc-100 backdrop-blur-md  px-6 py-3 h-[69px] shadow-lg flex items-center justify-between gap-4 z-50">
     
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-black hover:text-zinc-300 transition-colors" />
      </div>

 
      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-90">
        <User className="h-5 w-5" />
      </div>
    </nav>
  );
}
