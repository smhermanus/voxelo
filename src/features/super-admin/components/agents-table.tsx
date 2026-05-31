"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, RefreshCw, Pencil, PowerOff, Power, Copy } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AgentFormDialog } from "./agent-form-dialog";
import { toggleAgentActive, regenerateReferralCode } from "@/features/super-admin/actions/agent-actions";

interface Agent {
  id:                string;
  name:              string;
  email:             string;
  clerkUserId:       string;
  commissionRate:    number;
  fixedSalary:       number;
  commissionEnabled: boolean;
  isActive:          boolean;
  referralCode:      string;
  _count:            { attributions: number; commissions: number };
}

interface Props {
  agents:      Agent[];
  defaultRate: number;
  baseUrl:     string;
}

function zarFormat(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}

export function AgentsTable({ agents, defaultRate, baseUrl }: Props) {
  const [editTarget, setEditTarget] = useState<Agent | null>(null);
  const [, startTransition] = useTransition();

  function copyLink(code: string) {
    navigator.clipboard.writeText(`${baseUrl}/ref/${code}`);
    toast.success("Referral link copied");
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleAgentActive(id);
      toast.success("Agent status updated");
    });
  }

  function handleRegen(id: string) {
    startTransition(async () => {
      const code = await regenerateReferralCode(id);
      toast.success(`New code: ${code}`);
    });
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead className="text-center">Clients</TableHead>
            <TableHead>Referral code</TableHead>
            <TableHead className="text-center">Active</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                No agents yet. Add your first agent above.
              </TableCell>
            </TableRow>
          )}
          {agents.map((a) => (
            <TableRow key={a.id}>
              <TableCell>
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.email}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{(a.commissionRate * 100).toFixed(1)}%</span>
                  {!a.commissionEnabled && (
                    <Badge variant="secondary" className="text-xs">disabled</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{a.fixedSalary > 0 ? zarFormat(a.fixedSalary) : <span className="text-muted-foreground text-xs">commission only</span>}</TableCell>
              <TableCell className="text-center">{a._count.attributions}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.referralCode}</code>
                  <button onClick={() => copyLink(a.referralCode)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Copy className="size-3" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Switch checked={a.isActive} onCheckedChange={() => handleToggle(a.id)} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditTarget(a)}>
                      <Pencil className="size-3.5 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRegen(a.id)}>
                      <RefreshCw className="size-3.5 mr-2" /> Regenerate link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleToggle(a.id)}
                      className={a.isActive ? "text-destructive" : "text-emerald-600"}
                    >
                      {a.isActive
                        ? <><PowerOff className="size-3.5 mr-2" /> Deactivate</>
                        : <><Power className="size-3.5 mr-2" /> Activate</>
                      }
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editTarget && (
        <AgentFormDialog
          open
          onClose={() => setEditTarget(null)}
          initial={{
            id:                editTarget.id,
            name:              editTarget.name,
            email:             editTarget.email,
            clerkUserId:       editTarget.clerkUserId,
            commissionRate:    editTarget.commissionRate,
            fixedSalary:       editTarget.fixedSalary,
            commissionEnabled: editTarget.commissionEnabled,
          }}
          defaultRate={defaultRate}
        />
      )}
    </>
  );
}
