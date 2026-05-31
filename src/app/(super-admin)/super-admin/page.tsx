import { Building2, Users, TrendingUp, BadgeDollarSign, CreditCard, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/features/super-admin/components/page-header";
import { StatCard } from "@/features/super-admin/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function zarFormat(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(amount);
}

function startOfMonth(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export default async function SuperAdminOverviewPage() {
  const now  = new Date();
  const thisMonth  = startOfMonth(now);
  const lastMonth  = startOfMonth(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)));

  const [
    tenantCount,
    agentCount,
    thisMonthMrr,
    lastMonthMrr,
    pendingCommissions,
    recentPayments,
    recentCommissions,
  ] = await Promise.all([
    prisma.tenant.count(),
    prisma.voxeloStaff.count({ where: { role: "AGENT", isActive: true } }),
    prisma.payFastPayment.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "COMPLETE", billingDate: { gte: thisMonth } },
    }),
    prisma.payFastPayment.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "COMPLETE", billingDate: { gte: lastMonth, lt: thisMonth } },
    }),
    prisma.commission.aggregate({
      _sum: { commissionAmount: true },
      where: { status: { in: ["PENDING", "APPROVED"] } },
    }),
    prisma.payFastPayment.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { tenant: { select: { name: true } } },
    }),
    prisma.commission.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      where: { status: "PENDING" },
      include: {
        agent:  { select: { name: true } },
      },
    }),
  ]);

  const mrr      = Number(thisMonthMrr._sum.amount ?? 0);
  const prevMrr  = Number(lastMonthMrr._sum.amount ?? 0);
  const pending  = Number(pendingCommissions._sum.commissionAmount ?? 0);
  const mrrTrend = percentChange(mrr, prevMrr);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Platform Overview" description="Voxelo — full platform snapshot" />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="MRR (this month)"
            value={zarFormat(mrr)}
            icon={<TrendingUp className="size-4" />}
            trend={mrrTrend}
            trendLabel="vs last month"
          />
          <StatCard
            title="Total Tenants"
            value={tenantCount.toString()}
            icon={<Building2 className="size-4" />}
          />
          <StatCard
            title="Active Agents"
            value={agentCount.toString()}
            icon={<Users className="size-4" />}
          />
          <StatCard
            title="Commissions Due"
            value={zarFormat(pending)}
            icon={<BadgeDollarSign className="size-4" />}
            trend={pending > 0 ? null : 0}
            trendLabel={pending > 0 ? "pending approval/payment" : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Recent Payments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="size-4 text-muted-foreground" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentPayments.length === 0 && (
                <p className="text-sm text-muted-foreground">No payments yet.</p>
              )}
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate max-w-[160px]">
                    {p.tenant?.name ?? "Unknown tenant"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-muted-foreground text-xs">
                      {new Date(p.billingDate).toLocaleDateString("en-ZA")}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {zarFormat(Number(p.amount))}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Commissions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="size-4 text-muted-foreground" />
                Pending Commissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentCommissions.length === 0 && (
                <p className="text-sm text-muted-foreground">No pending commissions.</p>
              )}
              {recentCommissions.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate max-w-[160px]">{c.agent.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {new Date(c.month).toLocaleDateString("en-ZA", { month: "short", year: "2-digit" })}
                    </Badge>
                    <span className="font-semibold text-violet-600 dark:text-violet-400">
                      {zarFormat(Number(c.commissionAmount))}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
