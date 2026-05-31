import { Link2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentAgent } from "@/features/agent-portal/lib/get-current-agent";
import { PageHeader } from "@/features/super-admin/components/page-header";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function zarFormat(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}

export default async function AgentClientsPage() {
  const agent = await getCurrentAgent();

  const attributions = await prisma.tenantAttribution.findMany({
    where:   { agentId: agent.id },
    orderBy: { createdAt: "desc" },
    include: {
      tenant: {
        select: {
          id:          true,
          name:        true,
          ownerEmail:  true,
          phoneNumber: true,
          createdAt:   true,
          payfastPayments: {
            where:  { paymentStatus: "COMPLETE" },
            select: { amount: true },
          },
        },
      },
    },
  });

  // For each tenant, also get total commission earned by this agent
  const commissionTotals = await prisma.commission.groupBy({
    by:    ["tenantId"],
    where: { agentId: agent.id },
    _sum:  { commissionAmount: true },
  });

  const commByTenant = Object.fromEntries(
    commissionTotals.map((r) => [r.tenantId, Number(r._sum.commissionAmount ?? 0)])
  );

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="My Clients"
        description="Businesses you have referred or been assigned to"
      />

      <div className="flex-1 p-6">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Total paid</TableHead>
                <TableHead className="text-right">Your commission</TableHead>
                <TableHead className="text-center">Via</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No clients yet. Share your referral link to get started.
                  </TableCell>
                </TableRow>
              )}
              {attributions.map((a) => {
                const totalPaid   = a.tenant.payfastPayments.reduce((s, p) => s + Number(p.amount), 0);
                const myComm      = commByTenant[a.tenant.id] ?? 0;
                const viaReferral = !!a.referralCode;

                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-medium">{a.tenant.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{a.tenant.phoneNumber}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {a.tenant.ownerEmail || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(a.tenant.createdAt).toLocaleDateString("en-ZA")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {totalPaid > 0 ? zarFormat(totalPaid) : <span className="text-muted-foreground text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {myComm > 0 ? zarFormat(myComm) : <span className="text-muted-foreground text-xs font-normal">—</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {viaReferral
                        ? <Badge variant="outline" className="text-xs gap-1"><Link2 className="size-3" />Link</Badge>
                        : <Badge variant="secondary" className="text-xs">Manual</Badge>
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
