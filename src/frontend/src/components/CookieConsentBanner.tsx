import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { useState } from "react";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => {
    return localStorage.getItem("cookie_consent") === null;
  });

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 dark:bg-zinc-950 border-t border-zinc-700 shadow-xl"
      aria-label="Cookie consent"
      data-ocid="cookie_consent.panel"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Local Data Storage</p>
          <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
            We store your claim drafts, fleet data, and insurer contacts locally
            in your browser using localStorage. Nothing is sent to external
            servers. Your data stays on your device. This app complies with{" "}
            <strong className="text-zinc-100">GDPR</strong> — you can delete any
            stored data at any time via the Data &amp; Privacy section of each
            report.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            onClick={handleDecline}
            data-ocid="cookie_consent.cancel_button"
          >
            Decline
          </Button>
          <Button
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold"
            onClick={handleAccept}
            data-ocid="cookie_consent.confirm_button"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
