import { createTRPCRouter, tenantProcedure } from "../init";
import { prisma } from "@/lib/db";

export const appointmentsRouter = createTRPCRouter({
  list: tenantProcedure.query(async ({ ctx }) => {
    return prisma.appointment.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { startTime: "asc" },
      take: 50,
    });
  }),

  upcoming: tenantProcedure.query(async ({ ctx }) => {
    return prisma.appointment.findMany({
      where: { tenantId: ctx.tenantId, startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
      take: 3,
    });
  }),

  upcomingCount: tenantProcedure.query(async ({ ctx }) => {
    return prisma.appointment.count({
      where: { tenantId: ctx.tenantId, startTime: { gte: new Date() } },
    });
  }),
});
