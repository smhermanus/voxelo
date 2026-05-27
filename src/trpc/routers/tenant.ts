import { z } from "zod";
import { createTRPCRouter, tenantProcedure } from "../init";
import { prisma } from "@/lib/db";

export const tenantRouter = createTRPCRouter({
  get: tenantProcedure.query(async ({ ctx }) => {
    return prisma.tenant.findUnique({
      where: { id: ctx.tenantId },
    });
  }),

  update: tenantProcedure
    .input(
      z.object({
        greeting: z.string().min(1).optional(),
        ownerEmail: z.string().email().optional(),
        faqContent: z.string().optional(),
        businessHours: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.tenant.update({
        where: { id: ctx.tenantId },
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
