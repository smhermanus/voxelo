"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle, Banknote, MoreHorizontal } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  approveCommission, markCommissionPaid,
} from "@/features/super-admin/actions/commission-actions";

type CommissionStatus = "PENDING" | "APPROVED" | "PAID";

interface CommissionRow {
  id:               string;
  agentName:        string;
  tenantId:         string;
  grossAmount:      number;
  commissionRate:   number;
  commissionAmount: number;
  month:            Date;
  status:           CommissionStatus;
  paidAt:           Date | null;
  notes:            string | null;
}

interface Props { rows: CommissionRow[] }

const statusBadge: Record<CommissionStatus, string> = {
  PENDING:  "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  APPROVED: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  PAID:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

function zarFormat(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 }).format(n);
}

export function CommissionsTable({ rows }: Props) {
  const [, startTransition] = useTransition();

  function approve(id: string) {
    startTransition(async () => {
      await approveCommission(id);
      toast.success("Commission approved");
    });
  }

  function markPaid(id: string) {
    startTransition(async () => {
      await markCommissionPaid(id);
      toast.success("Commission marked as paid");
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>Month</TableHead>
          <TableHead className="text-right">Gross</TableHead>
          <TableHead className="text-center">Rate</TableHead>
          <TableHead className="text-right">Commission</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
              No commission records found.
            </TableCell>
          </TableRow>
        )}
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.agentName}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(r.month).toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">{zarFormat(r.grossAmount)}</TableCell>
            <TableCell className="text-center text-sm">{(r.commissionRate * 100).toFixed(1)}%</TableCell>
            <TableCell className="text-right font-semibold text-violet-600 dark:text-violet-400">
              {zarFormat(r.commissionAmount)}
            </TableCell>
            <TableCell className="text-center">
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[r.status]}`}>
                {r.status}
              </span>
            </TableCell>
            <TableCell>
              {r.status !== "PAID" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {r.status === "PENDING" && (
                      <DropdownMenuItem onClick={() => approve(r.id)}>
                        <CheckCircle className="size-3.5 mr-2 text-blue-500" />
                        Approve
                      </DropdownMenuItem>
                    )}
                    {r.status === "APPROVED" && (
                      <DropdownMenuItem onClick={() => markPaid(r.id)}>
                        <Banknote className="size-3.5 mr-2 text-emerald-500" />
                        Mark as paid
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
