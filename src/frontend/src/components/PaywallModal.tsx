import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { Crown, Lock, Zap } from "lucide-react";
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const PRO_BENEFITS = [
  "Unlimited reports per month (free: 5/month)",
  "Unlimited PDF exports with QR code & tamper-proof fingerprint",
  "Demand letters & negotiation letter builder",
  "Fleet Manager dashboard",
  "Legal Outputs (settlement estimator, pathway guide)",
  "Cycling accident flow",
  "Priority chat assistant",
];

export default function PaywallModal({
  isOpen,
  onClose,
  featureName,
}: PaywallModalProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleUpgrade = () => {
    onClose();
    navigate({ to: "/pricing" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="paywall.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Lock className="w-5 h-5 text-amber-500" />
            {t("paywall.title")}
          </DialogTitle>
          <DialogDescription className="text-sm">
            <span className="font-semibold text-foreground">{featureName}</span>{" "}
            {t("paywall.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div
            className="rounded-lg p-4 mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.98 0.05 85) 0%, oklch(0.96 0.08 60) 100%)",
              border: "1px solid oklch(0.85 0.12 80)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Crown
                className="w-4 h-4"
                style={{ color: "oklch(0.55 0.18 60)" }}
              />
              <span
                className="font-bold text-sm"
                style={{ color: "oklch(0.35 0.12 60)" }}
              >
                Pro includes everything:
              </span>
            </div>
            <ul className="space-y-1.5">
              {PRO_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: "oklch(0.40 0.10 60)" }}
                >
                  <Zap
                    className="w-3.5 h-3.5 mt-0.5 shrink-0"
                    style={{ color: "oklch(0.60 0.18 80)" }}
                  />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="paywall.cancel_button"
          >
            {t("action.cancel")}
          </Button>
          <Button
            size="sm"
            onClick={handleUpgrade}
            className="gap-1.5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.18 80) 0%, oklch(0.68 0.20 55) 100%)",
              color: "oklch(0.15 0.05 60)",
              border: "none",
            }}
            data-ocid="paywall.confirm_button"
          >
            <Crown className="w-3.5 h-3.5" />
            {t("paywall.upgrade")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
