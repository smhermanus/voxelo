import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getCurrentAgent } from "@/features/agent-portal/lib/get-current-agent";
import { PageHeader } from "@/features/super-admin/components/page-header";
import { ReferralLinkCard } from "@/features/agent-portal/components/referral-link-card";

export default async function ReferralPage() {
  const agent = await getCurrentAgent();

  const [clientCount, viaLinkCount] = await Promise.all([
    prisma.tenantAttribution.count({ where: { agentId: agent.id } }),
    prisma.tenantAttribution.count({
      where: { agentId: agent.id, referralCode: { not: null } },
    }),
  ]);

  const headersList = await headers();
  const host     = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl  = `${protocol}://${host}`;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Referral Link"
        description="Your unique link for signing up new clients"
      />

      <div className="flex-1 p-6">
        <ReferralLinkCard
          referralCode={agent.referralCode}
          baseUrl={baseUrl}
          clientCount={clientCount}
          viaLinkCount={viaLinkCount}
        />
      </div>
    </div>
  );
}
