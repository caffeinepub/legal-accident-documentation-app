import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { Check, Crown, FileDown, Loader2, Shield, Zap } from "lucide-react";
import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  type ShoppingItem,
  useCreateCheckoutSession,
} from "../hooks/useCreateCheckoutSession";
import { usePlan } from "../hooks/usePlan";

const FREE_FEATURES = [
  "Basic accident documentation",
  "Up to 5 reports per month",
  "View reports in-app",
  "UK & Malta jurisdiction (🇬🇧 🇲🇹)",
  "PDF export for your first report",
  "Basic legal references",
  "AI photo analysis",
  "Fault assessment",
];

const PRO_FEATURES = [
  "Unlimited reports",
  "Unlimited PDF exports with QR code & SHA-256 fingerprint",
  "Demand letters & negotiation letter builder",
  "Malta jurisdiction (🇬🇧 🇲🇹) — unlimited access",
  "Fleet Manager dashboard",
  "Legal Outputs (settlement estimator, legal pathway)",
  "Cycling accident flow with full legal references",
  "Priority chat assistant",
  "All UK & Malta case law libraries",
  "Evidence strength checker",
];

const PRO_SUBSCRIPTION_ITEM: ShoppingItem = {
  name: "iamthe.law Pro — Monthly Subscription",
  description:
    "Unlimited reports, PDF export, Malta jurisdiction, Fleet Manager, and all legal tools.",
  amount: 999,
  quantity: 1,
};

const PAY_PER_EXPORT_ITEM: ShoppingItem = {
  name: "iamthe.law — Verified Export",
  description:
    "One tamper-evident verified report export with QR code and SHA-256 fingerprint.",
  amount: 399,
  quantity: 1,
};

export default function PricingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isPro } = usePlan();
  const checkoutMutation = useCreateCheckoutSession();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedCheckout, setSelectedCheckout] = useState<
    "pro" | "export" | null
  >(null);

  const handleCheckout = async (type: "pro" | "export") => {
    setCheckoutError(null);
    setSelectedCheckout(type);
    const item = type === "pro" ? PRO_SUBSCRIPTION_ITEM : PAY_PER_EXPORT_ITEM;

    try {
      const session = await checkoutMutation.mutateAsync([item]);
      window.location.href = session.url;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again.";
      setCheckoutError(msg);
      setSelectedCheckout(null);
    }
  };

  const isLoading = checkoutMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl font-bold tracking-tight mb-3"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
          data-ocid="pricing.page"
        >
          {t("pricing.title")}
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
          Start free, upgrade when you need professional legal documentation.
          Cancel anytime.
        </p>
        {isPro && (
          <div
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.08 85) 0%, oklch(0.94 0.12 60) 100%)",
              color: "oklch(0.35 0.15 60)",
              border: "1px solid oklch(0.85 0.14 75)",
            }}
          >
            <Crown className="w-4 h-4" />
            You're on the Pro plan
          </div>
        )}
      </div>

      {/* Error message */}
      {checkoutError && (
        <div
          className="mb-6 p-4 rounded-lg border text-sm"
          style={{
            background: "oklch(0.97 0.03 30)",
            borderColor: "oklch(0.80 0.12 30)",
            color: "oklch(0.40 0.15 30)",
          }}
          data-ocid="pricing.error_state"
        >
          <strong>Payment setup required:</strong> {checkoutError}
          <p className="mt-1 text-xs opacity-80">
            To enable payments, configure Stripe in the admin settings and
            redeploy the app.
          </p>
        </div>
      )}

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Free tier */}
        <Card className="border-border" data-ocid="pricing.free.card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Free</CardTitle>
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                Current plan
              </span>
            </div>
            <div className="mt-2">
              <span className="text-4xl font-bold">£0</span>
              <span className="text-muted-foreground text-sm ml-1">/month</span>
            </div>
            <p className="text-xs text-muted-foreground">
              For individuals documenting occasional accidents
            </p>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full mb-5"
              onClick={() => navigate({ to: "/" })}
              data-ocid="pricing.free.primary_button"
            >
              Get Started Free
            </Button>
            <ul className="space-y-2">
              {FREE_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pro tier */}
        <Card
          className="relative overflow-hidden shadow-lg"
          style={{
            border: "2px solid oklch(0.75 0.18 75)",
          }}
          data-ocid="pricing.pro.card"
        >
          {/* Highlight ribbon */}
          <div
            className="absolute top-0 right-0 text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider uppercase"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 85) 0%, oklch(0.70 0.20 55) 100%)",
              color: "oklch(0.18 0.06 60)",
            }}
          >
            Most Popular
          </div>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Crown
                className="w-5 h-5"
                style={{ color: "oklch(0.60 0.18 65)" }}
              />
              <CardTitle className="text-lg">Pro</CardTitle>
            </div>
            <div className="mt-2">
              <span className="text-4xl font-bold">£9.99</span>
              <span className="text-muted-foreground text-sm ml-1">
                {t("pricing.perMonth")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              For professionals, lawyers, and fleet operators
            </p>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full mb-5 gap-2"
              disabled={isLoading && selectedCheckout === "pro"}
              onClick={() => handleCheckout("pro")}
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.75 0.18 80) 0%, oklch(0.68 0.20 55) 100%)",
                color: "oklch(0.15 0.05 60)",
                border: "none",
              }}
              data-ocid="pricing.pro.primary_button"
            >
              {isLoading && selectedCheckout === "pro" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4" /> {t("pricing.upgrade")} — £9.99
                  {t("pricing.perMonth")}
                </>
              )}
            </Button>
            <ul className="space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Zap
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: "oklch(0.60 0.18 75)" }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Pay per export */}
      <div
        className="rounded-xl border border-border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        data-ocid="pricing.export.card"
      >
        <div
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ background: "oklch(0.95 0.06 230)" }}
        >
          <FileDown
            className="w-6 h-6"
            style={{ color: "oklch(0.45 0.18 230)" }}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base mb-1">Pay per Verified Export</h3>
          <p className="text-sm text-muted-foreground">
            Don't need a subscription? Pay just <strong>£3.99</strong> per
            export to generate a single tamper-evident legal-grade report with
            QR code, SHA-256 fingerprint, and digital signature.
          </p>
        </div>
        <Button
          variant="outline"
          className="shrink-0 gap-2"
          disabled={isLoading && selectedCheckout === "export"}
          onClick={() => handleCheckout("export")}
          data-ocid="pricing.export.primary_button"
        >
          {isLoading && selectedCheckout === "export" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" /> {t("pricing.perExport")} — £3.99
            </>
          )}
        </Button>
      </div>

      {/* Trust signals */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4" />
          Secure payments via Stripe
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-4 h-4" />
          Cancel anytime
        </div>
        <div className="flex items-center gap-1.5">
          <Crown className="w-4 h-4" />
          GDPR compliant
        </div>
      </div>
    </div>
  );
}
