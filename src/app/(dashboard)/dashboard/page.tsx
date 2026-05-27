"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, format, isToday } from "date-fns";
import type { LucideIcon } from "lucide-react";
import { PhoneCall, MessageSquare, Calendar, Clock, Check, ArrowRight } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";

function MetricCard({
  icon: Icon,
  title,
  value,
  loading,
  highlight,
}: {
  icon: LucideIcon;
  title: string;
  value: string | number;
  loading?: boolean;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-blue-200 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-900" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`size-4 ${highlight ? "text-blue-500" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className={`text-2xl font-bold ${highlight ? "text-blue-600 dark:text-blue-400" : ""}`}>{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AIReceptionistDashboard() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery(trpc.calls.todayStats.queryOptions());
  const { data: unread, isLoading: unreadLoading } = useQuery(trpc.messages.unreadCount.queryOptions());
  const { data: upcomingCount, isLoading: upcomingLoading } = useQuery(trpc.appointments.upcomingCount.queryOptions());
  const { data: recentMessages, isLoading: messagesLoading } = useQuery(trpc.messages.recent.queryOptions());
  const { data: upcomingAppts, isLoading: apptsLoading } = useQuery(trpc.appointments.upcoming.queryOptions());

  const markDelivered = useMutation(
    trpc.messages.markDelivered.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.messages.recent.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.messages.unreadCount.queryKey() });
      },
    }),
  );

  return (
    <div className="flex flex-col min-h-0">
      <PageHeader title="AI Receptionist" />
      <div className="p-6 space-y-6">

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={PhoneCall} title="Calls Today" value={stats?.count ?? 0} loading={statsLoading} />
          <MetricCard
            icon={MessageSquare}
            title="Unread Messages"
            value={unread ?? 0}
            loading={unreadLoading}
            highlight={(unread ?? 0) > 0}
          />
          <MetricCard icon={Calendar} title="Upcoming Appointments" value={upcomingCount ?? 0} loading={upcomingLoading} />
          <MetricCard icon={Clock} title="Avg Duration" value="—" />
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent messages */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recent Messages</h2>
              <Link href="/messages" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
            {messagesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : !recentMessages?.length ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No messages yet &mdash; they&apos;ll appear here after the first call.
              </div>
            ) : (
              <div className="space-y-2">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-lg border p-3 transition-colors ${
                      !msg.delivered
                        ? "bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{msg.callerName}</span>
                          <span className="text-xs text-muted-foreground">{msg.callerPhone}</span>
                          {!msg.delivered && <Badge variant="secondary" className="text-xs">New</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{msg.message}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!msg.delivered && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="shrink-0 h-7 px-2"
                          onClick={() => markDelivered.mutate({ id: msg.id })}
                          disabled={markDelivered.isPending}
                        >
                          <Check className="size-3 mr-1" />
                          Read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming appointments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Upcoming Appointments</h2>
              <Link href="/appointments" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
            {apptsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : !upcomingAppts?.length ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No upcoming appointments.
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingAppts.map((appt) => {
                  const start = new Date(appt.startTime);
                  const today = isToday(start);
                  return (
                    <div key={appt.id} className={`rounded-lg border p-3 ${today ? "border-blue-200 bg-blue-50/40 dark:bg-blue-950/20" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{appt.callerName}</p>
                          <p className="text-xs text-muted-foreground">{appt.callerPhone}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs font-medium ${today ? "text-blue-600" : ""}`}>
                            {today ? "Today" : format(start, "d MMM")}
                          </p>
                          <p className="text-xs text-muted-foreground">{format(start, "HH:mm")}</p>
                        </div>
                      </div>
                      {appt.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{appt.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
