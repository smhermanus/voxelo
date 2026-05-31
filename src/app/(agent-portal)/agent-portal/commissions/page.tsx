import { prisma } from "@/lib/db";
import { getCurrentAgent } from "@/features/agent-portal/lib/get-current-agent";
import { PageHeader } from "@/features/super-admin/components/page-header";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

function zarFormat(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 }).format(n);
}

const statusClass: Record<string, string> = {
  PENDING:  "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  APPROVED: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  PAID:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

export default async function AgentCommissionsPage() {
  const agent = await getCurrentAgent();

  const [commissions, totals] = await Promise.all([
    prisma.commission.findMany({
      where:   { agentId: agent.id },
      orderBy: [{ month: "desc" }, { createdAt: "desc" }],
      include: {
        payment: {
          include: { tenant: { select: { name: true } } },
        },
      },
    }),
    prisma.commission.groupBy({
      by:    ["status"],
      where: { agentId: agent.id },
      _sum:  { commissionAmount: true },
    }),
  ]);

  const totalByStatus = Object.fromEntries(
    totals.map((t) => [t.status, Number(t._sum.commissionAmount ?? 0)])
  );

  const totalEarned = Object.values(totalByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="My Commissions"
        description="Full commission history — contact your admin to query any records"
      />

      <div className="flex-1 p-6 space-y-4">
        {/* Summary bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total earned",  value: zarFormat(totalEarned),                         cls: "text-foreground" },
            { label: "Pending",       value: zarFormat(totalByStatus.PENDING  ?? 0),          cls: "text-amber-600 dark:text-amber-400" },
            { label: "Approved",      value: zarFormat(totalByStatus.APPROVED ?? 0),          cls: "text-blue-600 dark:text-blue-400" },
            { label: "Paid out",      value: zarFormat(totalByStatus.PAID     ?? 0),          cls: "text-emerald-600 dark:text-emerald-400" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="rounded-lg border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`mt-1 text-lg font-bold tracking-tight ${cls}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Subscription</TableHead>
                <TableHead className="text-center">Rate</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Paid on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    No commission records yet.
                  </TableCell>
                </TableRow>
              )}
              {commissions.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-sm whitespace-nowrap">
                    {new Date(c.month).toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {c.payment.tenant?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {zarFormat(Number(c.grossAmount))}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {(Number(c.commissionRate) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {zarFormat(Number(c.commissionAmount))}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[c.status] ?? ""}`}>
                      {c.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {c.paidAt ? new Date(c.paidAt).toLocaleDateString("en-ZA") : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
