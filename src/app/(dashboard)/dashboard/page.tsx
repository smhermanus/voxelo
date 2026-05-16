"use client";

import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { PhoneCall, MessageSquare, Calendar, Clock } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";

function MetricCard({
  icon: Icon,
  title,
  value,
  loading,
}: {
  icon: LucideIcon;
  title: string;
  value: string | number;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AIReceptionistDashboard() {
  const trpc = useTRPC();

  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.calls.todayStats.queryOptions(),
  );
  const { data: unread, isLoading: unreadLoading } = useQuery(
    trpc.messages.unreadCount.queryOptions(),
  );
  const { data: upcoming, isLoading: upcomingLoading } = useQuery(
    trpc.appointments.upcomingCount.queryOptions(),
  );

  return (
    <div className="flex flex-col min-h-0">
      <PageHeader title="AI Receptionist" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={PhoneCall}
            title="Calls Today"
            value={stats?.count ?? 0}
            loading={statsLoading}
          />
          <MetricCard
            icon={MessageSquare}
            title="Unread Messages"
            value={unread ?? 0}
            loading={unreadLoading}
          />
          <MetricCard
            icon={Calendar}
            title="Upcoming Appointments"
            value={upcoming ?? 0}
            loading={upcomingLoading}
          />
          <MetricCard icon={Clock} title="Avg Duration" value="—" />
        </div>
      </div>
    </div>
  );
}
