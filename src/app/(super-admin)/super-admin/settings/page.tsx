import { prisma } from "@/lib/db";
import { PageHeader } from "@/features/super-admin/components/page-header";
import { SettingsForm } from "@/features/super-admin/components/settings-form";

export default async function SettingsPage() {
  const settings = await prisma.voxeloSettings.findUnique({ where: { id: "global" } });
  const defaultCommissionRate = Number(settings?.defaultCommissionRate ?? 0.15);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Settings" description="Global platform configuration" />
      <div className="flex-1 p-6">
        <SettingsForm defaultCommissionRate={defaultCommissionRate} />
      </div>
    </div>
  );
}
