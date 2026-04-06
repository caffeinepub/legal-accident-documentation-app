import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm"
        style={{
          background: "oklch(0.97 0.04 30)",
          border: "2px solid oklch(0.80 0.12 30)",
        }}
        data-ocid="payment_failure.panel"
      >
        <AlertTriangle
          className="w-10 h-10"
          style={{ color: "oklch(0.55 0.18 30)" }}
        />
      </div>

      <h1
        className="text-3xl font-bold tracking-tight mb-3"
        style={{ fontFamily: "Fraunces, Georgia, serif" }}
      >
        Payment Cancelled
      </h1>

      <p className="text-muted-foreground mb-2 max-w-md text-sm leading-relaxed">
        Your payment was not completed. You have not been charged. You can try
        again whenever you're ready.
      </p>

      <p className="text-xs text-muted-foreground mb-8">
        If you experienced an issue, please try again or contact support.
      </p>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/" })}
          data-ocid="payment_failure.cancel_button"
        >
          Back to App
        </Button>
        <Button
          onClick={() => navigate({ to: "/pricing" })}
          className="gap-2"
          data-ocid="payment_failure.primary_button"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
