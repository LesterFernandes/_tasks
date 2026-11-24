import Nav from "@/components/layout/nav";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <Nav />
      <SidebarInset>
        <main>
          <SidebarTrigger size="icon-lg" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
