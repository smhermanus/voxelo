"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const settingsSchema = z.object({
  greeting: z.string().min(1, "Greeting is required"),
  ownerEmail: z.string().email("Enter a valid email"),
  faqContent: z.string().optional(),
});
type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: tenant, isLoading } = useQuery(trpc.tenant.get.queryOptions());

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { greeting: "", ownerEmail: "", faqContent: "" },
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        greeting: tenant.greeting,
        ownerEmail: tenant.ownerEmail,
        faqContent: tenant.faqContent ?? "",
      });
    }
  }, [tenant, form]);

  const updateMutation = useMutation(
    trpc.tenant.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.tenant.get.queryKey(),
        });
        toast.success("Settings saved");
      },
      onError: () => toast.error("Failed to save settings"),
    }),
  );

  function onSubmit(values: SettingsValues) {
    updateMutation.mutate(values);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-0">
        <PageHeader title="Settings" />
        <div className="p-6 space-y-4 max-w-2xl">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0">
      <PageHeader title="Settings" />
      <div className="p-6 max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Greeting</CardTitle>
              <CardDescription>
                The first thing callers hear when they call.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="greeting">Greeting message</Label>
              <Input
                id="greeting"
                {...form.register("greeting")}
                placeholder="Hello, thanks for calling..."
              />
              {form.formState.errors.greeting && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.greeting.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Where to send alerts for new messages, bookings, and emergencies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="ownerEmail">Owner email</Label>
              <Input
                id="ownerEmail"
                type="email"
                {...form.register("ownerEmail")}
                placeholder="joe@joes-plumbing.co.za"
              />
              {form.formState.errors.ownerEmail && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.ownerEmail.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business knowledge</CardTitle>
              <CardDescription>
                The AI uses this to answer caller questions about your business —
                services, pricing, hours, and service area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                {...form.register("faqContent")}
                rows={12}
                placeholder="Describe your business, services, pricing, hours, service area..."
                className="resize-none font-mono text-xs"
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save settings"}
          </Button>
        </form>
      </div>
    </div>
  );
}
