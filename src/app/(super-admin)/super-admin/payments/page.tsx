import { prisma } from "@/lib/db";
import { PageHeader } from "@/features/super-admin/components/page-header";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const statusClass: Record<string, string> = {
  COMPLETE:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  FAILED:    "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

export default async function PaymentsPage() {
  const payments = await prisma.payFastPayment.findMany({
    orderBy: { billingDate: "desc" },
    take:    100,
    include: { tenant: { select: { name: true } } },
  });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Payments"
        description="PayFast payment log (last 100)"
      />

      <div className="flex-1 p-6">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>PayFast ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No payments received yet.
                  </TableCell>
                </TableRow>
              )}
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(p.billingDate).toLocaleDateString("en-ZA")}
                  </TableCell>
                  <TableCell className="font-medium">{p.tenant?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.itemName ?? "—"}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(Number(p.amount))}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[p.paymentStatus] ?? "bg-muted text-muted-foreground"}`}>
                      {p.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{p.pfPaymentId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
