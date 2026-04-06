import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Crown, Home } from "lucide-react";
import React, { useEffect } from "react";
import { usePlan } from "../hooks/usePlan";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { setPlan } = usePlan();

  useEffect(() => {
    setPlan("pro");
  }, [setPlan]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.78 0.18 85) 0%, oklch(0.70 0.20 55) 100%)",
        }}
        data-ocid="payment_success.panel"
      >
        <CheckCircle2
          className="w-10 h-10"
          style={{ color: "oklch(0.15 0.05 60)" }}
        />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Crown className="w-5 h-5" style={{ color: "oklch(0.55 0.18 65)" }} />
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          Welcome to Pro!
        </h1>
      </div>

      <p className="text-muted-foreground mb-2 max-w-md text-sm leading-relaxed">
        Your payment was successful. You now have full access to all Pro
        features: unlimited reports, PDF export, Malta jurisdiction, Fleet
        Manager, and all legal tools.
      </p>

      <p className="text-xs text-muted-foreground mb-8">
        A confirmation has been noted on your account. Enjoy iamthe.law Pro.
      </p>

      <Button
        onClick={() => navigate({ to: "/" })}
        className="gap-2"
        data-ocid="payment_success.primary_button"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.75 0.18 80) 0%, oklch(0.68 0.20 55) 100%)",
          color: "oklch(0.15 0.05 60)",
          border: "none",
        }}
      >
        <Home className="w-4 h-4" />
        Start Using Pro
      </Button>
    </div>
  );
}
