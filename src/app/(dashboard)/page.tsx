import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardView } from "@/features/dashboard/views/dashboard-view";

export default async function RootPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/home");
  }
  return <DashboardView />;
}
