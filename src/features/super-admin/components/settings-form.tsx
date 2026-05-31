"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSettings } from "@/features/super-admin/actions/settings-actions";

interface Props { defaultCommissionRate: number }

export function SettingsForm({ defaultCommissionRate }: Props) {
  const [rate, setRate]     = useState((defaultCommissionRate * 100).toFixed(1));
  const [pending, start]    = useTransition();

  function handleSave() {
    const value = parseFloat(rate);
    if (isNaN(value) || value < 0 || value > 100) {
      toast.error("Rate must be between 0 and 100");
      return;
    }
    start(async () => {
      await updateSettings({ defaultCommissionRate: value / 100 });
      toast.success("Settings saved");
    });
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commission defaults</CardTitle>
          <CardDescription>
            This rate applies to all new agents unless overridden per-agent on the Agents page.
            Changing this does not retroactively affect existing commission records.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="default-rate">Default commission rate (%)</Label>
            <div className="flex items-center gap-2 max-w-[200px]">
              <Input
                id="default-rate"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <span className="text-muted-foreground text-sm">%</span>
            </div>
          </div>

          <Button onClick={handleSave} disabled={pending} size="sm">
            <Save className="size-3.5 mr-1.5" />
            {pending ? "Saving…" : "Save settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
