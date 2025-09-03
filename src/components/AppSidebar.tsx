import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
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

const items = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Block", url: "/block", icon: Inbox },
  { title: "Center", url: "/center", icon: Calendar },
  { title: "Search", url: "/search", icon: Search },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-zinc-900 text-white w-64 rounded-tr-2xl rounded-br-2xl shadow-lg">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold tracking-wide text-white">
            AAPTA
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                          ${
                            isActive
                              ? "bg-zinc-700 text-white shadow-sm"
                              : "hover:bg-zinc-800 hover:text-zinc-100"
                          }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.title}</span>
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
