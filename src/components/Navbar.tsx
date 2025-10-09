import { useEffect, useState } from "react";

import { SidebarTrigger } from "./ui/sidebar";

import { User, LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [currentUserName, setCurrentUserName] = useState<string>("Guest");

  useEffect(() => {
    if (user) {
      console.log("Current user:", user);
      setCurrentUserName(user.name || "User");
    } else {
      setCurrentUserName("Guest");
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 bg-zinc-100/40 backdrop-blur-md px-6 py-3 h-[69px] shadow-lg flex items-center justify-between gap-4 z-50">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-black hover:text-zinc-300 transition-colors" />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-3 py-1.5 bg-white border border-zinc-200 rounded-full shadow-sm hover:shadow-md transition">
          <div className="w-10 h-9 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
            <User className="h-4 w-7" />
          </div>
          <span className="text-zinc-800 font-medium capitalize tracking-wide">
            {currentUserName}
          </span>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-zinc-500 hover:bg-zinc-600 text-white px-3 py-1 rounded-md transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
