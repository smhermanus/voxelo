import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/features/super-admin/components/page-header";
import { AgentsTable } from "@/features/super-admin/components/agents-table";
import { AddAgentButton } from "@/features/super-admin/components/add-agent-button";

export default async function AgentsPage() {
  const [agents, settings] = await Promise.all([
    prisma.voxeloStaff.findMany({
      where:   { role: "AGENT" },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { attributions: true, commissions: true } } },
    }),
    prisma.voxeloSettings.findUnique({ where: { id: "global" } }),
  ]);

  const defaultRate = Number(settings?.defaultCommissionRate ?? 0.15);

  const headersList = await headers();
  const host     = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl  = `${protocol}://${host}`;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Agents"
        description="Manage sales agents, commission rates and salaries"
        action={<AddAgentButton defaultRate={defaultRate} />}
      />

      <div className="flex-1 p-6">
        <div className="rounded-lg border">
          <AgentsTable
            agents={agents.map((a) => ({
              ...a,
              commissionRate: Number(a.commissionRate),
              fixedSalary:    Number(a.fixedSalary),
            }))}
            defaultRate={defaultRate}
            baseUrl={baseUrl}
          />
        </div>
      </div>
    </div>
  );
}
