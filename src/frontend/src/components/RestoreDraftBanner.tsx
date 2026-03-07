import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Trash2 } from "lucide-react";

interface RestoreDraftBannerProps {
  onRestore: () => void;
  onDiscard: () => void;
  savedAt?: string; // formatted time string
}

export default function RestoreDraftBanner({
  onRestore,
  onDiscard,
  savedAt,
}: RestoreDraftBannerProps) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700"
      role="alert"
      data-ocid="draft.panel"
    >
      <AlertTriangle
        className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          Unsaved draft found
          {savedAt && (
            <span className="font-normal text-amber-700 dark:text-amber-300 ml-1">
              — last saved {savedAt}
            </span>
          )}
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
          You have an unsubmitted accident report saved locally. Would you like
          to restore it or start fresh?
        </p>
        <div className="flex gap-2 mt-3">
          <Button
            type="button"
            size="sm"
            className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white border-0"
            onClick={onRestore}
            data-ocid="draft.confirm_button"
          >
            <FileText className="w-3.5 h-3.5" />
            Restore draft
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="gap-1.5 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
            onClick={onDiscard}
            data-ocid="draft.cancel_button"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Start fresh
          </Button>
        </div>
      </div>
    </div>
  );
}
