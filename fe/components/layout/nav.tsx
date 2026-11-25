"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import { Button } from "@base-ui/react/button";
import {
  CircleFadingArrowUpIcon,
  FolderKanban,
  Layers,
  LogOut,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Nav({ role }: { role: "admin" | "user" }) {
  const router = useRouter();

  const logout = async () => {
    const response = await api.post("/api/auth/sign-out");
    if (response.ok) {
      router.push("/login");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="mb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="w-fit">
              <Link href="/projects">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Layers className="size-2" />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {role == "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Users">
                    <Link href="/users" className="flex flex-row gap-2 w-full">
                      <Users />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Projects">
                  <Link href="/projects" className="flex flex-row gap-2 w-full">
                    <FolderKanban />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut className="size-4" /> Log out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
