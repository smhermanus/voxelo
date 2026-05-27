import { z } from "zod";
import { createTRPCRouter, tenantProcedure } from "../init";
import { prisma } from "@/lib/db";

export const messagesRouter = createTRPCRouter({
  list: tenantProcedure.query(async ({ ctx }) => {
    return prisma.message.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }),

  recent: tenantProcedure.query(async ({ ctx }) => {
    return prisma.message.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  }),

  unreadCount: tenantProcedure.query(async ({ ctx }) => {
    return prisma.message.count({
      where: { tenantId: ctx.tenantId, delivered: false },
    });
  }),

  markDelivered: tenantProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.message.update({
        where: { id: input.id, tenantId: ctx.tenantId },
        data: { delivered: true },
      });
    }),
});
