import { SignInButton, useAuth } from "@clerk/react";
import { Link } from "react-router-dom";
import { useHubUser } from "../hooks/use-hub-user";
import { isClerkConfigured } from "../lib/convex-clerk-provider";
import { AdminJuryPanel } from "../components/admin/admin-jury-panel";
import { AdminLogisticsPanel } from "../components/admin/admin-logistics-panel";
import { AdminMentorPanel } from "../components/admin/admin-mentor-panel";
import { HubButton, HubCard } from "../components/hub/hub-ui-primitives";

export function AdminPage() {
  const { isSignedIn } = useAuth();
  const { role, isLoading } = useHubUser();
  const activeRole = role?.role ?? null;

  if (!isClerkConfigured) {
    return (
      <main className="section-padding py-16">
        <div className="mx-auto max-w-[1200px]">
          <HubCard title="Admin">
            <p className="text-sm text-fg-2">Clerk is not configured.</p>
          </HubCard>
        </div>
      </main>
    );
  }

  return (
    <main className="section-padding py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="tag mb-3 inline-block">Admin</span>
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold uppercase tracking-[0.04em] text-fg">
              Event operations
            </h1>
          </div>
          <Link to="/builder">
            <HubButton variant="ghost">Back to builder hub</HubButton>
          </Link>
        </div>

        {!isSignedIn ? (
          <HubCard title="Sign in required">
            <SignInButton mode="modal">
              <HubButton>Sign in with Google</HubButton>
            </SignInButton>
          </HubCard>
        ) : isLoading ? (
          <div className="h-32 animate-pulse border border-border bg-surface" />
        ) : !activeRole ? (
          <HubCard title="Access denied">
            <p className="text-sm text-fg-2">Your account does not have an admin role assigned.</p>
          </HubCard>
        ) : (
          <div className="space-y-6">
            {activeRole === "logistics" || activeRole === "mentor" || activeRole === "jury" ? (
              activeRole === "logistics" ? <AdminLogisticsPanel /> : null
            ) : null}
            {activeRole === "logistics" || activeRole === "mentor" ? <AdminMentorPanel /> : null}
            {activeRole === "logistics" || activeRole === "jury" ? <AdminJuryPanel /> : null}
          </div>
        )}
      </div>
    </main>
  );
}
