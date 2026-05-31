"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  BadgeDollarSign,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
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
  { label: "Overview",     href: "/super-admin",              icon: LayoutDashboard },
  { label: "Tenants",      href: "/super-admin/tenants",      icon: Building2 },
  { label: "Agents",       href: "/super-admin/agents",       icon: Users },
  { label: "Commissions",  href: "/super-admin/commissions",  icon: BadgeDollarSign },
  { label: "Payments",     href: "/super-admin/payments",     icon: CreditCard },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const isActive = (href: string) =>
    href === "/super-admin" ? pathname === href : pathname.startsWith(href);

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
        <div className="group-data-[collapsible=icon]:hidden mx-1 flex items-center gap-1.5 rounded-md bg-violet-50 dark:bg-violet-950/40 px-2 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
          <ShieldCheck className="size-3.5 shrink-0" />
          Super Admin
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(href)}
                  tooltip={label}
                >
                  <Link href={href}>
                    <Icon className={cn("size-4", isActive(href) && "text-violet-600 dark:text-violet-400")} />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/super-admin/settings")}
                tooltip="Settings"
              >
                <Link href="/super-admin/settings">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
