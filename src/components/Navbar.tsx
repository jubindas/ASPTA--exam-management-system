import { SidebarTrigger } from "./ui/sidebar";

import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("currentUser");

    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 bg-zinc-100/40 backdrop-blur-md px-6 py-3 h-[69px] shadow-lg flex items-center justify-between gap-4 z-50">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-black hover:text-zinc-300 transition-colors" />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-90">
          <User className="h-5 w-5" />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-zinc-500 hover:bg-zinc-600 text-white px-3 py-1 rounded-md transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </nav>
  );
}
