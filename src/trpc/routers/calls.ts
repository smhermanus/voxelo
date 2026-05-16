import { z } from "zod";
import { createTRPCRouter, authProcedure } from "../init";
import { prisma } from "@/lib/db";

export const callsRouter = createTRPCRouter({
  list: authProcedure
    .input(z.object({ limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      return prisma.call.findMany({
        take: input?.limit ?? 20,
        orderBy: { createdAt: "desc" },
      });
    }),

  todayStats: authProcedure.query(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await prisma.call.count({
      where: { createdAt: { gte: today } },
    });
    return { count };
  }),
});
