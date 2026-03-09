import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React from "react";
import Layout from "./components/Layout";
import BirdsEyeGridPage from "./pages/BirdsEyeGridPage";
import FaultReferencePage from "./pages/FaultReferencePage";
import InsurerContactsPage from "./pages/InsurerContactsPage";
import NewReportPage from "./pages/NewReportPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import ReportsPage from "./pages/ReportsPage";

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  reportsRoute,
  reportDetailRoute,
  faultReferenceRoute,
  gridRoute,
  insurersRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
