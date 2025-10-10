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

import { Home, MapPin, Building2, User, Users, Download } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const baseItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Block", url: "/block", icon: MapPin },
  { title: "School", url: "/school", icon: Building2 },
  { title: "Student", url: "/student", icon: User },
  { title: "Download", url: "/download", icon: Download },
];

const adminItems = [
  { title: "Sub Division", url: "/subdivision", icon: Users },
];

export function AppSidebar() {
  const location = useLocation();

  const { user } = useAuth();
  console.log("the sidebar", user?.user_type);

  const getMenuItems = () => {
    if (!user) return baseItems;

    switch (user.user_type) {
      case "admin":
        return [...baseItems.slice(0, 1), ...adminItems, ...baseItems.slice(1)];
      case "subdivision":
        return baseItems;

      case "block":
        return baseItems.filter((item) => item.title !== "Block");
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar
      className="!bg-zinc-900 text-white w-full sm:w-64 md:w-64 lg:w-64 shadow-lg"
      style={{ backgroundColor: "#18181b" }}
    >
      <SidebarContent
        className="py-3 sm:py-6 !bg-zinc-900"
        style={{ backgroundColor: "#18181b" }}
      >
        <div className="px-3 sm:px-6 mb-6 sm:mb-10 flex items-center space-x-2 sm:space-x-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHavAqEKhY8MRX7NntKRnkGqFTk42uJT_TuA&s"
            alt="Avatar"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-zinc-700 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-zinc-400">Welcome,</p>
            <h2 className="text-base text-white sm:text-lg font-bold truncate">
              {user?.user_type === "admin"
                ? "Admin"
                : user?.user_type === "subdivision"
                ? "Sub-Division"
                : "Block"}
            </h2>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl sm:text-2xl font-extrabold tracking-wide text-white px-3 sm:px-6 mb-4 sm:mb-6">
            ASPTA
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 sm:space-y-3">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center space-x-3 sm:space-x-5 px-3 sm:px-6 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 !text-white
                          ${
                            isActive
                              ? "bg-zinc-700 text-white shadow-md scale-[1.02] "
                              : "text-white hover:bg-zinc-800 hover:text-white"
                          }`}
                      >
                        <item.icon className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
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
