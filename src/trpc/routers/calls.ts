import { z } from "zod";
import { createTRPCRouter, tenantProcedure } from "../init";
import { prisma } from "@/lib/db";

export const callsRouter = createTRPCRouter({
  list: tenantProcedure
    .input(z.object({ limit: z.number().default(20) }).optional())
    .query(async ({ ctx, input }) => {
      return prisma.call.findMany({
        where: { tenantId: ctx.tenantId },
        take: input?.limit ?? 20,
        orderBy: { createdAt: "desc" },
      });
    }),

  todayStats: tenantProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await prisma.call.count({
      where: { tenantId: ctx.tenantId, createdAt: { gte: today } },
    });
    return { count };
  }),
});
