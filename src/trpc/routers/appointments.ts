import { createTRPCRouter, authProcedure } from "../init";
import { prisma } from "@/lib/db";

export const appointmentsRouter = createTRPCRouter({
  list: authProcedure.query(async () => {
    return prisma.appointment.findMany({
      orderBy: { startTime: "asc" },
      take: 50,
    });
  }),

  upcomingCount: authProcedure.query(async () => {
    return prisma.appointment.count({
      where: { startTime: { gte: new Date() } },
    });
  }),
});
