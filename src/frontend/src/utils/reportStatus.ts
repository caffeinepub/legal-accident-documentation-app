export type ClaimStatus = "draft" | "submitted" | "under_review" | "settled";

const LS_KEY = "iamthelaw_report_status";

function loadStatusMap(): Record<string, ClaimStatus> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ClaimStatus>;
  } catch {
    return {};
  }
}

function saveStatusMap(map: Record<string, ClaimStatus>) {
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

export function getReportStatus(reportId: string): ClaimStatus {
  const map = loadStatusMap();
  return map[reportId] ?? "draft";
}

export function setReportStatus(reportId: string, status: ClaimStatus) {
  const map = loadStatusMap();
  map[reportId] = status;
  saveStatusMap(map);
}

export const STATUS_CONFIG: Record<
  ClaimStatus,
  {
    label: string;
    color: string;
    badgeVariant: "secondary" | "default" | "outline" | "destructive";
  }
> = {
  draft: {
    label: "Draft",
    color:
      "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
    badgeVariant: "secondary",
  },
  submitted: {
    label: "Submitted",
    color:
      "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700",
    badgeVariant: "default",
  },
  under_review: {
    label: "Under Review",
    color:
      "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700",
    badgeVariant: "outline",
  },
  settled: {
    label: "Settled",
    color:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-700",
    badgeVariant: "default",
  },
};
