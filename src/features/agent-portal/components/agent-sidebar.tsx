"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BadgeDollarSign,
  Link2,
  LogOut,
  Briefcase,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { VoiceWave } from "@/app/(marketing)/components/voice-wave";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview",      href: "/agent-portal",                    icon: LayoutDashboard },
  { label: "My Clients",    href: "/agent-portal/clients",            icon: Building2 },
  { label: "Commissions",   href: "/agent-portal/commissions",        icon: BadgeDollarSign },
  { label: "Referral Link", href: "/agent-portal/referral",           icon: Link2 },
];

export function AgentSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const isActive = (href: string) =>
    href === "/agent-portal" ? pathname === href : pathname.startsWith(href);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col gap-3 pt-4">
        <div className="flex items-center gap-2 pl-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
          <VoiceWave size={26} />
          <span className="group-data-[collapsible=icon]:hidden font-semibold text-lg tracking-tighter text-foreground">
            V<span style={{ color: "#5b5ef4" }}>o</span>xelo
          </span>
        </div>
        {/* Role badge */}
        <div className="group-data-[collapsible=icon]:hidden mx-1 flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Briefcase className="size-3.5 shrink-0" />
          Sales Agent
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My Portal</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(href)}
                  tooltip={label}
                >
                  <Link href={href}>
                    <Icon className={cn("size-4", isActive(href) && "text-emerald-600 dark:text-emerald-400")} />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ redirectUrl: "/home" })}
              tooltip="Sign out"
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
