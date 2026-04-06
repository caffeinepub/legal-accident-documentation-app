import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React from "react";
import Layout from "./components/Layout";
import { CountryProvider } from "./contexts/CountryContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import BirdsEyeGridPage from "./pages/BirdsEyeGridPage";
import DangerousRoadsPage from "./pages/DangerousRoadsPage";
import FaultReferencePage from "./pages/FaultReferencePage";
import FleetPage from "./pages/FleetPage";
import InsurerContactsPage from "./pages/InsurerContactsPage";
import LegalOutputsPage from "./pages/LegalOutputsPage";
import NewReportPage from "./pages/NewReportPage";
import PaymentFailurePage from "./pages/PaymentFailurePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PricingPage from "./pages/PricingPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import ReportsPage from "./pages/ReportsPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: NewReportPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: ReportsPage,
});

const reportDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports/$reportId",
  component: ReportDetailPage,
});

const faultReferenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fault-reference",
  component: FaultReferencePage,
});

const legalOutputsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal-outputs",
  component: LegalOutputsPage,
});

const gridRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/grid",
  component: BirdsEyeGridPage,
});

const insurersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/insurers",
  component: InsurerContactsPage,
});

const fleetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fleet",
  component: FleetPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsOfServicePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPolicyPage,
});

const dangerousRoadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dangerous-roads",
  component: DangerousRoadsPage,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: PricingPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailurePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  reportsRoute,
  reportDetailRoute,
  faultReferenceRoute,
  legalOutputsRoute,
  gridRoute,
  insurersRoute,
  fleetRoute,
  privacyRoute,
  termsRoute,
  dangerousRoadsRoute,
  pricingRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <CountryProvider>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </LanguageProvider>
      </CountryProvider>
    </ThemeProvider>
  );
}
