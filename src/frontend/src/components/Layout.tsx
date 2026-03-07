import { Button } from "@/components/ui/button";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Grid3X3, List, Plus, Scale, Shield } from "lucide-react";
import React from "react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header
        className="border-b border-border bg-card sticky top-0 z-10"
        data-print-hide
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
          >
            <Shield className="w-5 h-5 text-primary" />
            <span>AccidentReport</span>
          </button>

          <nav className="flex items-center gap-1.5 flex-wrap justify-end">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate({ to: "/" })}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Report
            </Button>
            <Button
              variant={
                location.pathname.startsWith("/reports") ? "default" : "ghost"
              }
              size="sm"
              onClick={() => navigate({ to: "/reports" })}
              className="gap-1.5"
            >
              <List className="w-3.5 h-3.5" />
              My Reports
            </Button>
            <Button
              variant={
                location.pathname === "/fault-reference" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => navigate({ to: "/fault-reference" })}
              className="gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              Fault Reference
            </Button>
            <Button
              variant={location.pathname === "/grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate({ to: "/grid" })}
              className="gap-1.5"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              Grid View
            </Button>
          </nav>
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
          © {new Date().getFullYear()} AccidentReport · Built with{" "}
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
