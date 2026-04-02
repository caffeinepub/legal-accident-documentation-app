import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookUser,
  Gavel,
  Globe,
  Grid3X3,
  LibraryBig,
  List,
  Menu,
  Moon,
  Plus,
  Scale,
  Sun,
  Truck,
} from "lucide-react";
import React, { useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { LANGUAGES, type Language } from "../i18n/translations";
import { ChatAssistant } from "./ChatAssistant";
import CookieConsentBanner from "./CookieConsentBanner";

const NAV_ITEMS = [
  {
    labelKey: "nav.new_report" as const,
    to: "/",
    icon: Plus,
    exact: true,
    ocid: "nav.new_report.link",
  },
  {
    labelKey: "nav.my_reports" as const,
    to: "/reports",
    icon: List,
    exact: false,
    ocid: "nav.reports.link",
  },
  {
    labelKey: "nav.fault_reference" as const,
    to: "/fault-reference",
    icon: Scale,
    exact: true,
    ocid: "nav.fault_reference.link",
  },
  {
    labelKey: "nav.legal_outputs" as const,
    to: "/legal-outputs",
    icon: LibraryBig,
    exact: true,
    ocid: "nav.legal_outputs.link",
  },
  {
    labelKey: "nav.grid_view" as const,
    to: "/grid",
    icon: Grid3X3,
    exact: true,
    ocid: "nav.grid.link",
  },
  {
    labelKey: "nav.insurers" as const,
    to: "/insurers",
    icon: BookUser,
    exact: true,
    ocid: "nav.insurers.link",
  },
  {
    labelKey: "nav.fleet" as const,
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
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { country, setCountry } = useCountry();

  const handleNav = (to: string) => {
    navigate({ to });
    setMobileOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === language);

  const dangerousRoadsActive = location.pathname === "/dangerous-roads";

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
                  {t(item.labelKey)}
                </Button>
              );
            })}
            {/* Dangerous Roads nav item */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/dangerous-roads" })}
              className={[
                "gap-1.5 px-3 relative",
                dangerousRoadsActive
                  ? "text-primary font-semibold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-primary"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              data-ocid="nav.dangerous_roads.link"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {t("nav.dangerous_roads")}
            </Button>
          </nav>

          {/* Right controls: lang + theme + mobile menu */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Country switcher */}
            <button
              type="button"
              onClick={() => setCountry(country === "uk" ? "mt" : "uk")}
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Switch jurisdiction"
              data-ocid="header.country.toggle"
              title={
                country === "uk"
                  ? "Switch to Malta jurisdiction"
                  : "Switch to UK jurisdiction"
              }
            >
              {country === "uk" ? "🇬🇧 UK" : "🇲🇹 MT"}
            </button>

            {/* Language switcher */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  aria-label="Select language"
                  data-ocid="header.language.button"
                >
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[120px] z-50"
                data-ocid="header.language.dropdown_menu"
              >
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className={
                      language === lang.code ? "font-semibold text-primary" : ""
                    }
                    data-ocid={`header.language.${lang.code}.button`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              data-ocid="header.theme.toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden w-8 h-8"
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
                        {t(item.labelKey)}
                      </button>
                    );
                  })}
                  {/* Dangerous Roads mobile item */}
                  <button
                    type="button"
                    onClick={() => handleNav("/dangerous-roads")}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left w-full",
                      dangerousRoadsActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted",
                    ].join(" ")}
                    data-ocid="nav.dangerous_roads.link"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {t("nav.dangerous_roads")}
                  </button>
                  {/* Mobile lang row */}
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 px-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <div className="flex gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setLanguage(lang.code as Language)}
                          className={[
                            "text-xs px-2 py-1 rounded border transition-colors",
                            language === lang.code
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                          data-ocid={`nav.language.${lang.code}.button`}
                        >
                          {lang.code.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {country === "mt" && (
        <div
          className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-700/40 text-amber-800 dark:text-amber-300 text-xs text-center py-1.5 px-4"
          data-print-hide
        >
          🇲🇹 <strong>Malta Jurisdiction Active</strong> — Legal references use
          Maltese law (TRO Cap. 65, Civil Code Cap. 16)
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <footer
        className="border-t border-border bg-card mt-auto"
        data-print-hide
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} iamthe.law &middot;{" "}
            {t("footer.built_with")} <span className="text-red-500">♥</span>{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/privacy" })}
              className="underline hover:text-foreground transition-colors"
              data-ocid="footer.privacy_policy.link"
            >
              {t("footer.privacy_policy")}
            </button>
            <span>&middot;</span>
            <button
              type="button"
              onClick={() => navigate({ to: "/terms" })}
              className="underline hover:text-foreground transition-colors"
              data-ocid="footer.terms.link"
            >
              Terms of Service
            </button>
            <span>&middot;</span>
            <button
              type="button"
              onClick={() => navigate({ to: "/privacy" })}
              className="underline hover:text-foreground transition-colors"
              data-ocid="footer.data_privacy.link"
            >
              {t("footer.data_privacy")}
            </button>
            <span>&middot;</span>
            <span>
              {currentLang?.flag} {currentLang?.label}
            </span>
          </div>
        </div>
      </footer>
      <CookieConsentBanner />
      <ChatAssistant />
    </div>
  );
}
