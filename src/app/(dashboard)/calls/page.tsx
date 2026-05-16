"use client";

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PhoneCall } from "lucide-react";

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

export default function CallsPage() {
  const trpc = useTRPC();
  const { data: calls, isLoading } = useQuery(trpc.calls.list.queryOptions());

  return (
    <div className="flex flex-col min-h-0">
      <PageHeader title="Calls" />
      <div className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !calls?.length ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PhoneCall />
              </EmptyMedia>
              <EmptyTitle>No calls yet</EmptyTitle>
              <EmptyDescription>
                Calls will appear here once the AI receptionist starts handling
                calls.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Caller
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Intent
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    When
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {calls.map((call) => (
                  <tr
                    key={call.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {call.callerName ?? "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {call.callerPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {call.intent ? (
                        <Badge variant="secondary" className="capitalize">
                          {call.intent}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {call.duration
                        ? `${Math.floor(call.duration / 60)}:${String(call.duration % 60).padStart(2, "0")}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          call.status === "completed"
                            ? "default"
                            : call.status === "active"
                              ? "secondary"
                              : "outline"
                        }
                        className="capitalize"
                      >
                        {call.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(call.createdAt), {
                        addSuffix: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
