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
import { Home, MapPin, Building2, User } from "lucide-react";

const items = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Block", url: "/block", icon: MapPin },
  { title: "Center", url: "/center", icon: Building2 },
  { title: "Student", url: "/student", icon: User }
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-zinc-900 text-white w-64 shadow-lg">
      <SidebarContent className="py-6">
     
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-extrabold tracking-wide text-white px-6 mb-8">
            AAPTA
          </SidebarGroupLabel>

       
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {items.map((item) => {
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
