import { Suspense } from "react";
import DashboardLanding from "@/modules/dashboard/DashboardLanding";

export const metadata = {
  title: "Dashboard | Okomoto",
  description: "Manage your car exports and search quality vehicles.",
};

// Page component serving as the user dashboard landing page wrapper with Suspense boundaries
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "#050913", color: "#fff" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <DashboardLanding />
    </Suspense>
  );
}
