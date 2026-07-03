"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Team } from "@/components/team"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, UserIcon, PackageIcon } from "lucide-react"
import type { User } from "@/api/auth"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: (
        <LayoutDashboardIcon
        />
      ),
      isActive: true,
    },
    {
      title: "Items",
      url: "/items",
      icon: (
        <PackageIcon
        />
      ),
    },
    {
      title: "User",
      url: "/user",
      icon: (
        <UserIcon
        />
      ),
    },
  ],
}

export function AppSidebar({user, ...props }: React.ComponentProps<typeof Sidebar> & { user: User }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Team />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
