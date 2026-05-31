"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { assignAttribution, removeAttribution } from "@/features/super-admin/actions/tenant-actions";

interface Agent { id: string; name: string }

interface Props {
  tenantId:      string;
  currentAgentId: string | null;
  agents:        Agent[];
}

export function AssignAttributionSelect({ tenantId, currentAgentId, agents }: Props) {
  const [, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      if (value === "none") {
        await removeAttribution(tenantId);
        toast.success("Attribution removed");
      } else {
        await assignAttribution(tenantId, value);
        toast.success("Agent assigned");
      }
    });
  }

  return (
    <Select defaultValue={currentAgentId ?? "none"} onValueChange={handleChange}>
      <SelectTrigger className="h-7 w-[160px] text-xs">
        <SelectValue placeholder="Unassigned" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none" className="text-xs text-muted-foreground">Unassigned</SelectItem>
        {agents.map((a) => (
          <SelectItem key={a.id} value={a.id} className="text-xs">{a.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
