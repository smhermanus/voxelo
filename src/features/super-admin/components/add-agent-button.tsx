"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentFormDialog } from "./agent-form-dialog";

export function AddAgentButton({ defaultRate }: { defaultRate: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-4 mr-1.5" />
        Add agent
      </Button>
      <AgentFormDialog open={open} onClose={() => setOpen(false)} defaultRate={defaultRate} />
    </>
  );
}
