import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AgentSidebar } from "@/features/agent-portal/components/agent-sidebar";
import { requireAgent } from "@/lib/voxelo-auth";

export default async function AgentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAgent();

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-svh">
      <AgentSidebar />
      <SidebarInset className="min-h-0 min-w-0">
        <main className="flex min-h-0 flex-1 flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
