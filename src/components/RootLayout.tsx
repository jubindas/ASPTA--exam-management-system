import { SidebarProvider } from "@/components/ui/sidebar"

import {AppSidebar} from "./AppSidebar"

import { Outlet } from "react-router-dom"

import Navbar  from "./Navbar"

export default function RootLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-zinc-100">
       <Navbar />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}