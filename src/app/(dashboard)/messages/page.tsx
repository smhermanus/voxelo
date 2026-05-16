"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Check, MessageSquare } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function MessagesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useQuery(
    trpc.messages.list.queryOptions(),
  );

  const markDelivered = useMutation(
    trpc.messages.markDelivered.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.messages.list.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.messages.unreadCount.queryKey(),
        });
      },
    }),
  );

  return (
    <div className="flex flex-col min-h-0">
      <PageHeader title="Messages" />
      <div className="p-6 space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : !messages?.length ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquare />
              </EmptyMedia>
              <EmptyTitle>No messages yet</EmptyTitle>
              <EmptyDescription>
                Messages left by callers will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg border p-4 transition-colors ${
                  !msg.delivered
                    ? "bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{msg.callerName}</p>
                      <span className="text-muted-foreground text-xs">
                        {msg.callerPhone}
                      </span>
                      {!msg.delivered && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {msg.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!msg.delivered && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0"
                      onClick={() => markDelivered.mutate({ id: msg.id })}
                      disabled={markDelivered.isPending}
                    >
                      <Check className="size-4 mr-1" />
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
