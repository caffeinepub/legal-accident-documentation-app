import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookUser,
  Gavel,
  Grid3X3,
  List,
  Menu,
  Plus,
  Scale,
  Truck,
} from "lucide-react";
import React, { useState } from "react";

const NAV_ITEMS = [
  {
    label: "New Report",
    to: "/",
    icon: Plus,
    exact: true,
    ocid: "nav.new_report.link",
  },
  {
    label: "My Reports",
    to: "/reports",
    icon: List,
    exact: false,
    ocid: "nav.reports.link",
  },
  {
    label: "Fault Reference",
    to: "/fault-reference",
    icon: Scale,
    exact: true,
    ocid: "nav.fault_reference.link",
  },
  {
    label: "Grid View",
    to: "/grid",
    icon: Grid3X3,
    exact: true,
    ocid: "nav.grid.link",
  },
  {
    label: "Insurers",
    to: "/insurers",
    icon: BookUser,
    exact: true,
    ocid: "nav.insurers.link",
  },
  {
    label: "Fleet",
    to: "/fleet",
    icon: Truck,
    exact: true,
    ocid: "nav.fleet.link",
  },
] as const;

function isActive(pathname: string, to: string, exact: boolean) {
  return exact ? pathname === to : pathname.startsWith(to);
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (to: string) => {
    navigate({ to });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header
        className="border-b border-border bg-card sticky top-0 z-10 shadow-sm"
        data-print-hide
      >
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
              <Gavel className="w-4 h-4 text-primary-foreground" />
            </div>
            <span
              className="font-display font-bold text-xl tracking-tight text-foreground"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              iamthe.law
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(location.pathname, item.to, item.exact);
              return (
                <Button
                  key={item.to}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: item.to })}
                  className={[
                    "gap-1.5 px-3 relative",
                    active
                      ? "text-primary font-semibold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-primary"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                  data-ocid={item.ocid}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation"
                data-ocid="nav.mobile.open_modal_button"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-64 pt-12"
              data-ocid="nav.mobile.sheet"
            >
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(
                    location.pathname,
                    item.to,
                    item.exact,
                  );
                  return (
                    <button
                      key={item.to}
                      type="button"
                      onClick={() => handleNav(item.to)}
                      className={[
                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left w-full",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted",
                      ].join(" ")}
                      data-ocid={item.ocid}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <footer
        className="border-t border-border bg-card mt-auto"
        data-print-hide
      >
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} iamthe.law · Built with{" "}
          <span className="text-red-500">♥</span> using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
