import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Home, MapPin, Building2, User, Users } from "lucide-react";

const baseItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Block", url: "/block", icon: MapPin },
  { title: "School", url: "/school", icon: Building2 },
  { title: "Student", url: "/student", icon: User }
];

const adminItems = [
  { title: "Sub Division", url: "/subdivision", icon: Users }
];

export function AppSidebar() {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  
const getMenuItems = () => {
  if (currentUser?.role === "admin") {
    const [home, ...rest] = baseItems;
    return [home, ...adminItems, ...rest];
  }

  if (currentUser?.role === "subdiv") {
    return baseItems;
  }

  if (currentUser?.role === "block") {
    return baseItems.filter((item) => item.title !== "Block");
  }

  return baseItems;
};


  const menuItems = getMenuItems();

  return (
    <Sidebar className="bg-zinc-900 text-white w-64 shadow-lg">
      <SidebarContent className="py-6">
          <div className="px-6 mb-10 flex items-center space-x-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHavAqEKhY8MRX7NntKRnkGqFTk42uJT_TuA&s" 
            alt="Avatar"
            className="h-12 w-12 rounded-full border-2 border-zinc-700"
          />
          <div>
            <p className="text-sm text-zinc-400">Welcome,</p>
            <h2 className="text-lg font-bold">{currentUser?.role === "admin" ? "Admin" : "Sub-Division"}</h2>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-extrabold tracking-wide text-white px-6 mb-6">
            AAPTA
          </SidebarGroupLabel>
         
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center space-x-5 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300
                          ${
                            isActive
                              ? "bg-zinc-700 text-white shadow-md scale-[1.02]"
                              : "hover:bg-zinc-800 hover:text-white"
                          }`}
                      >
                        <item.icon className="h-7 w-7" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
         
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}