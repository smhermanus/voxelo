import { z } from "zod";
import { createTRPCRouter, authProcedure } from "../init";
import { prisma } from "@/lib/db";

const DEMO_TENANT_PHONE = "+27600000000";

export const tenantRouter = createTRPCRouter({
  get: authProcedure.query(async () => {
    return prisma.tenant.findUnique({
      where: { phoneNumber: DEMO_TENANT_PHONE },
    });
  }),

  update: authProcedure
    .input(
      z.object({
        greeting: z.string().min(1).optional(),
        faqContent: z.string().optional(),
        businessHours: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.tenant.update({
        where: { phoneNumber: DEMO_TENANT_PHONE },
        data: {
          ...input,
          ...(input.businessHours !== undefined && {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            businessHours: input.businessHours as any,
          }),
        },
      });
    }),
});
