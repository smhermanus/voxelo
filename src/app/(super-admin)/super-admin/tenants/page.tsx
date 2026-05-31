import { prisma } from "@/lib/db";
import { PageHeader } from "@/features/super-admin/components/page-header";
import { AssignAttributionSelect } from "@/features/super-admin/components/assign-attribution-select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function TenantsPage() {
  const [tenants, agents] = await Promise.all([
    prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        attribution: { include: { agent: { select: { id: true, name: true } } } },
        payfastPayments: {
          where:   { paymentStatus: "COMPLETE" },
          select:  { amount: true },
        },
      },
    }),
    prisma.voxeloStaff.findMany({
      where:   { role: "AGENT", isActive: true },
      select:  { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Tenants"
        description="All businesses using Voxelo — assign agents and view payment totals"
      />

      <div className="flex-1 p-6">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Owner email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Total paid</TableHead>
                <TableHead>Attributed agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No tenants yet.
                  </TableCell>
                </TableRow>
              )}
              {tenants.map((t) => {
                const totalPaid = t.payfastPayments.reduce((s, p) => s + Number(p.amount), 0);
                const agentId   = t.attribution?.agent.id ?? null;

                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{t.phoneNumber}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{t.ownerEmail || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString("en-ZA")}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {totalPaid > 0
                        ? new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(totalPaid)
                        : <Badge variant="outline" className="text-xs">R0</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      <AssignAttributionSelect
                        tenantId={t.id}
                        currentAgentId={agentId}
                        agents={agents}
                      />
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
