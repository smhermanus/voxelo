"use client";

import { useQuery } from "@tanstack/react-query";
import { format, isPast, isToday } from "date-fns";
import { Calendar } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function AppointmentsPage() {
  const trpc = useTRPC();
  const { data: appointments, isLoading } = useQuery(
    trpc.appointments.list.queryOptions(),
  );

  return (
    <div className="flex flex-col min-h-0">
      <PageHeader title="Appointments" />
      <div className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !appointments?.length ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Calendar />
              </EmptyMedia>
              <EmptyTitle>No appointments yet</EmptyTitle>
              <EmptyDescription>
                Bookings made via the AI receptionist will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Date &amp; Time
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map((appt) => {
                  const start = new Date(appt.startTime);
                  const past = isPast(start);
                  const today = isToday(start);
                  return (
                    <tr
                      key={appt.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{appt.callerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {appt.callerPhone}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p
                          className={
                            today
                              ? "font-medium text-blue-600"
                              : past
                                ? "text-muted-foreground"
                                : ""
                          }
                        >
                          {format(start, "d MMM yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(start, "HH:mm")}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {appt.duration} min
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs">
                        <p className="line-clamp-2 text-xs">
                          {appt.notes ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            appt.status === "confirmed" ? "default" : "outline"
                          }
                          className="capitalize"
                        >
                          {appt.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
