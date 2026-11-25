import Nav from "@/components/layout/nav";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { readTokenClaims } from "@/lib/token";
import { cookies } from "next/headers";

export default async function ProtectedLayerLayout({
  children,
  params,
}: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { role } = readTokenClaims(token!);

  return (
    <SidebarProvider>
      <Nav role={role} />
      <SidebarInset>
        <main>
          <SidebarTrigger size="icon-lg" className="cursor-pointer" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
