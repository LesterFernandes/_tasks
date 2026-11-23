"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>Projects / Tasks</SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem onClick={() => router.push("/users")}>
              Users
            </SidebarMenuItem>
            <SidebarMenuItem onClick={() => router.push("/projects")}>
              Projects
            </SidebarMenuItem>
            <SidebarMenuItem>-</SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Username</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

/* <ChevronDown className="ml-auto" /> */

// <DropdownMenu>
//   <DropdownMenuTrigger render={<SidebarMenuButton />}>
//     Select Workspace
//   </DropdownMenuTrigger>
//   <DropdownMenuContent>
//     <DropdownMenuItem>
//       <span>Acme Inc</span>
//     </DropdownMenuItem>
//   </DropdownMenuContent>
// </DropdownMenu>
