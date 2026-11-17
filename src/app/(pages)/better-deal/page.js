import { Suspense } from "react";
import DashboardLanding from "@/modules/dashboard/DashboardLanding";

export const metadata = {
  title: "Find Me A Better Deal | Okomoto",
  description: "Explore the best deals on premium export vehicles direct from dealer auctions.",
};

// Page component serving as the 'Better Deal' search landing page wrapping the vehicle dashboard
export default function BetterDealPage() {
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
