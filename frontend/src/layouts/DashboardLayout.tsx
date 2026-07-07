import { Outlet, useOutletContext } from "react-router";
import { AppSidebar } from "@/components/app-sidebar"
import type { User } from "@/api/auth"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout() {
    const user = useOutletContext<User>()
    return (
        <SidebarProvider>
            <AppSidebar user={user}/>
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                        </div>
                    </header>
                    <div className="flex items-center gap-2 px-4">
                        <Outlet  context={user}/>
                    </div>
                    
                </SidebarInset>
        </SidebarProvider>
    )
}