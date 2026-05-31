"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createAgent, updateAgent } from "@/features/super-admin/actions/agent-actions";

interface AgentFormData {
  id?:               string;
  name:              string;
  email:             string;
  clerkUserId:       string;
  commissionRate:    number;
  fixedSalary:       number;
  commissionEnabled: boolean;
}

interface Props {
  open:        boolean;
  onClose:     () => void;
  initial?:    AgentFormData;
  defaultRate: number;
}

const EMPTY: AgentFormData = {
  name: "", email: "", clerkUserId: "",
  commissionRate: 0.15, fixedSalary: 0, commissionEnabled: true,
};

export function AgentFormDialog({ open, onClose, initial, defaultRate }: Props) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<AgentFormData>(initial ?? { ...EMPTY, commissionRate: defaultRate });
  const [pending, startTransition] = useTransition();

  const set = (key: keyof AgentFormData, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  function handleSubmit() {
    startTransition(async () => {
      try {
        if (isEdit && initial?.id) {
          await updateAgent({ id: initial.id, ...form });
          toast.success("Agent updated");
        } else {
          await createAgent(form);
          toast.success("Agent created");
        }
        onClose();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Agent" : "Add Agent"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="clerk">Clerk User ID</Label>
            <Input id="clerk" value={form.clerkUserId} onChange={(e) => set("clerkUserId", e.target.value)}
              placeholder="user_xxxxxxxxxxxxxxxx" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="rate">Commission rate (%)</Label>
              <Input
                id="rate" type="number" min={0} max={100} step={0.5}
                value={(form.commissionRate * 100).toFixed(1)}
                onChange={(e) => set("commissionRate", parseFloat(e.target.value) / 100 || 0)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="salary">Fixed salary (ZAR)</Label>
              <Input
                id="salary" type="number" min={0} step={100}
                value={form.fixedSalary}
                onChange={(e) => set("fixedSalary", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <Label htmlFor="comm-enabled" className="cursor-pointer">Commission enabled</Label>
            <Switch
              id="comm-enabled"
              checked={form.commissionEnabled}
              onCheckedChange={(v) => set("commissionEnabled", v)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create agent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
