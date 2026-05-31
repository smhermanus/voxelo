import { AlertTriangle } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

export default async function AgentSetupPage() {
  const user = await currentUser();

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md w-full rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h2 className="font-semibold text-amber-800 dark:text-amber-200">Account not set up yet</h2>
        </div>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Your Clerk role is configured, but a Voxelo agent profile has not been created for you in the system yet.
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Ask your super admin to go to{" "}
          <span className="font-mono font-semibold">/super-admin/agents</span>{" "}
          and add you as an agent using your Clerk User ID:
        </p>
        <code className="block rounded bg-amber-100 dark:bg-amber-900/50 px-3 py-2 text-xs font-mono text-amber-900 dark:text-amber-100 break-all">
          {user?.id ?? "Sign in to see your ID"}
        </code>
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Once added, refresh this page and your portal will be ready.
        </p>
      </div>
    </div>
  );
}
