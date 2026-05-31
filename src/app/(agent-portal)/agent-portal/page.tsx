import { Building2, BadgeDollarSign, TrendingUp, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentAgent } from "@/features/agent-portal/lib/get-current-agent";
import { PageHeader } from "@/features/super-admin/components/page-header";
import { StatCard } from "@/features/super-admin/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function zarFormat(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}

function startOfYear(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
}

function startOfMonth(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export default async function AgentPortalOverviewPage() {
  const agent = await getCurrentAgent();
  const now   = new Date();

  const [
    clientCount,
    thisMonthComm,
    ytdComm,
    pendingComm,
    recentClients,
    recentCommissions,
  ] = await Promise.all([
    prisma.tenantAttribution.count({ where: { agentId: agent.id } }),

    prisma.commission.aggregate({
      _sum: { commissionAmount: true },
      where: { agentId: agent.id, month: { gte: startOfMonth(now) } },
    }),

    prisma.commission.aggregate({
      _sum: { commissionAmount: true },
      where: { agentId: agent.id, month: { gte: startOfYear(now) } },
    }),

    prisma.commission.aggregate({
      _sum: { commissionAmount: true },
      where: { agentId: agent.id, status: { in: ["PENDING", "APPROVED"] } },
    }),

    prisma.tenantAttribution.findMany({
      where:   { agentId: agent.id },
      take:    5,
      orderBy: { createdAt: "desc" },
      include: { tenant: { select: { name: true, createdAt: true } } },
    }),

    prisma.commission.findMany({
      where:   { agentId: agent.id },
      take:    6,
      orderBy: { createdAt: "desc" },
      select:  { id: true, commissionAmount: true, month: true, status: true },
    }),
  ]);

  const thisMonth = Number(thisMonthComm._sum.commissionAmount ?? 0);
  const ytd       = Number(ytdComm._sum.commissionAmount ?? 0);
  const pending   = Number(pendingComm._sum.commissionAmount ?? 0);

  const statusClass: Record<string, string> = {
    PENDING:  "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    APPROVED: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    PAID:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={`Welcome, ${agent.name.split(" ")[0]}`}
        description="Your portal — clients, commissions, and referral link"
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Total clients"
            value={clientCount.toString()}
            icon={<Building2 className="size-4" />}
          />
          <StatCard
            title="This month"
            value={zarFormat(thisMonth)}
            icon={<TrendingUp className="size-4" />}
          />
          <StatCard
            title="YTD earned"
            value={zarFormat(ytd)}
            icon={<BadgeDollarSign className="size-4" />}
          />
          <StatCard
            title="Pending payout"
            value={zarFormat(pending)}
            icon={<Clock className="size-4" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Recent clients */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Building2 className="size-4 text-muted-foreground" />
                Recent clients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentClients.length === 0 && (
                <p className="text-sm text-muted-foreground">No clients yet — share your referral link!</p>
              )}
              {recentClients.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{a.tenant.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleDateString("en-ZA")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent commissions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <BadgeDollarSign className="size-4 text-muted-foreground" />
                Recent commissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentCommissions.length === 0 && (
                <p className="text-sm text-muted-foreground">No commissions yet.</p>
              )}
              {recentCommissions.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground text-xs">
                    {new Date(c.month).toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[c.status] ?? ""}`}>
                      {c.status}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
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
