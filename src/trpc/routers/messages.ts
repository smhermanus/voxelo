import { z } from "zod";
import { createTRPCRouter, authProcedure } from "../init";
import { prisma } from "@/lib/db";

export const messagesRouter = createTRPCRouter({
  list: authProcedure.query(async () => {
    return prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }),

  unreadCount: authProcedure.query(async () => {
    return prisma.message.count({ where: { delivered: false } });
  }),

  markDelivered: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.message.update({
        where: { id: input.id },
        data: { delivered: true },
      });
    }),
});
