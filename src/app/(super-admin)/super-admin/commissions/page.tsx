import { prisma } from "@/lib/db";
import { PageHeader } from "@/features/super-admin/components/page-header";
import { CommissionsTable } from "@/features/super-admin/components/commissions-table";

export default async function CommissionsPage() {
  const commissions = await prisma.commission.findMany({
    orderBy: [{ month: "desc" }, { createdAt: "desc" }],
    include: {
      agent: { select: { name: true } },
    },
  });

  const rows = commissions.map((c) => ({
    id:               c.id,
    agentName:        c.agent.name,
    tenantId:         c.tenantId,
    grossAmount:      Number(c.grossAmount),
    commissionRate:   Number(c.commissionRate),
    commissionAmount: Number(c.commissionAmount),
    month:            c.month,
    status:           c.status as "PENDING" | "APPROVED" | "PAID",
    paidAt:           c.paidAt,
    notes:            c.notes,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Commissions"
        description="Review, approve, and mark commissions as paid"
      />

      <div className="flex-1 p-6">
        <div className="rounded-lg border">
          <CommissionsTable rows={rows} />
        </div>
      </div>
    </div>
  );
}
