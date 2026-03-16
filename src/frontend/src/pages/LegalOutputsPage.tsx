import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  CheckCircle2,
  Copy,
  FileText,
  Gavel,
  Route,
  Scale,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Settlement Value Lookup ──────────────────────────────────────────────────
type SeverityKey =
  | "Minor"
  | "Moderate"
  | "Moderately Severe"
  | "Severe"
  | "Very Severe";
type InjuryKey =
  | "Head/Brain"
  | "Neck (Whiplash/Soft Tissue)"
  | "Back"
  | "Shoulder"
  | "Psychiatric/PTSD"
  | "Lower Limb"
  | "Upper Limb"
  | "Multiple Injuries";

const JCG_TABLE: Partial<
  Record<InjuryKey, Partial<Record<SeverityKey, [number, number]>>>
> = {
  "Neck (Whiplash/Soft Tissue)": {
    Minor: [2300, 7410],
    Moderate: [7410, 36120],
    Severe: [36120, 139210],
  },
  Back: {
    Minor: [2300, 11730],
    Moderate: [11730, 36390],
    Severe: [36390, 151070],
  },
  "Head/Brain": {
    Minor: [2210, 12770],
    Moderate: [40410, 205580],
    Severe: [205580, 354260],
    "Very Severe": [282010, 403990],
  },
  "Psychiatric/PTSD": {
    Minor: [1540, 5860],
    Moderate: [5860, 19070],
    Severe: [54830, 102890],
  },
  Shoulder: {
    Minor: [4080, 7410],
    Moderate: [7410, 11980],
    Severe: [11980, 42550],
  },
  "Lower Limb": {
    Minor: [5630, 12900],
    Moderate: [12900, 39200],
    Severe: [39200, 127530],
  },
  "Upper Limb": {
    Minor: [5010, 10640],
    Moderate: [10640, 36770],
    Severe: [36770, 110750],
  },
  "Multiple Injuries": {
    Moderate: [30000, 60000],
    Severe: [60000, 180000],
    "Very Severe": [180000, 500000],
  },
};

const INJURY_CATEGORIES: InjuryKey[] = [
  "Head/Brain",
  "Neck (Whiplash/Soft Tissue)",
  "Back",
  "Shoulder",
  "Psychiatric/PTSD",
  "Lower Limb",
  "Upper Limb",
  "Multiple Injuries",
];

const SEVERITY_BANDS: SeverityKey[] = [
  "Minor",
  "Moderate",
  "Moderately Severe",
  "Severe",
  "Very Severe",
];

function formatCurrency(n: number): string {
  return `£${n.toLocaleString("en-GB")}`;
}

// ─── Track data ───────────────────────────────────────────────────────────────
const TRACKS = [
  {
    id: "small",
    name: "Small Claims Track",
    range: "< £10,000",
    threshold: 10000,
    color: "bg-emerald-50 border-emerald-200 text-emerald-900",
    badgeColor: "bg-emerald-100 text-emerald-700",
    keyPoints: [
      "Informal procedure, litigants in person",
      "No cost recovery for legal fees",
      "Suitable for straightforward disputes",
    ],
    timeline: "6–12 months",
    cpr: "CPR Part 27",
    note: "Most personal injury claims under £1,000 and other claims under £10,000. Costs are not generally recoverable even if you win.",
  },
  {
    id: "fast",
    name: "Fast Track",
    range: "£10,000 – £25,000",
    threshold: 25000,
    color: "bg-amber-50 border-amber-200 text-amber-900",
    badgeColor: "bg-amber-100 text-amber-700",
    keyPoints: [
      "Fixed trial costs, 1-day trial",
      "Solicitor costs recoverable",
      "Structured directions timetable",
    ],
    timeline: "12–18 months",
    cpr: "CPR Part 28",
    note: "Standard track for personal injury claims between £1,000 and £25,000. Fixed trial costs apply. Legal costs are recoverable on a standard basis.",
  },
  {
    id: "multi",
    name: "Multi-Track",
    range: "> £25,000",
    threshold: Number.POSITIVE_INFINITY,
    color: "bg-blue-50 border-blue-200 text-blue-900",
    badgeColor: "bg-blue-100 text-blue-700",
    keyPoints: [
      "Full case management, expert witnesses",
      "Full cost recovery available",
      "Complex or high-value claims",
    ],
    timeline: "18–36 months",
    cpr: "CPR Part 29",
    note: "Complex or high-value claims. Full judicial case management with directions. Costs are recoverable on a standard or indemnity basis.",
  },
];

function getTrack(value: number) {
  if (value < 10000) return "small";
  if (value <= 25000) return "fast";
  return "multi";
}

// ─── Template builder ─────────────────────────────────────────────────────────
function buildTemplate(fields: {
  yourName: string;
  opponentName: string;
  incidentDate: string;
  incidentLocation: string;
  claimRef: string;
  keyEvidence: string;
}): string {
  const date = fields.incidentDate
    ? new Date(fields.incidentDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "[INCIDENT DATE]";
  return `WITHOUT PREJUDICE SAVE AS TO COSTS

${fields.yourName || "[YOUR NAME]"}
${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

Re: Liability Dispute — Incident of ${date} at ${fields.incidentLocation || "[LOCATION]"}
Your Reference: ${fields.claimRef || "[CLAIM ID / REF]"}

Dear Sir/Madam,

I write in response to your notification disputing liability in connection with the above-referenced incident.

I reject the assertion that I bear responsibility for this collision. The evidence in my possession clearly demonstrates that the incident occurred as a direct result of ${fields.opponentName || "[OPPONENT NAME]"}'s negligence, as follows:

KEY EVIDENCE:
${fields.keyEvidence || "[KEY EVIDENCE POINTS]"}

Under the principles established in Nettleship v Weston [1971] 2 QB 691 and Froom v Butcher [1976] QB 286, the standard of care expected of all road users is that of a reasonably competent and careful driver. The circumstances of this incident demonstrate a clear breach of that standard.

I further note the obligations under the Civil Procedure Rules Pre-Action Protocol for Personal Injury Claims, and invite you to reconsider your position within 21 days of receipt of this letter, failing which I reserve the right to issue proceedings without further notice.

I also draw your attention to the provisions of the Limitation Act 1980, which imposes strict time limits within which proceedings must be commenced.

Yours faithfully,
${fields.yourName || "[YOUR NAME]"}`;
}

// ─── Section 1: Settlement Value Estimator ───────────────────────────────────
function SettlementEstimator() {
  const [injuryCategory, setInjuryCategory] = useState<string>("");
  const [severityBand, setSeverityBand] = useState<string>("");
  const [result, setResult] = useState<
    { min: number; max: number; severity: string } | "none" | null
  >(null);

  const handleEstimate = () => {
    const band = severityBand as SeverityKey;
    const cat = injuryCategory as InjuryKey;
    const entry = JCG_TABLE[cat]?.[band];
    if (entry) {
      setResult({ min: entry[0], max: entry[1], severity: band });
    } else {
      setResult("none");
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle
              className="font-display text-xl"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Settlement Value Estimator
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              Judicial College Guidelines (17th Edition) tariff bands
            </CardDescription>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Estimate PSLA (Pain, Suffering &amp; Loss of Amenity) compensation
          ranges based on Judicial College Guidelines tariff bands.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="injury-category">Injury Category</Label>
            <Select value={injuryCategory} onValueChange={setInjuryCategory}>
              <SelectTrigger id="injury-category" data-ocid="settlement.select">
                <SelectValue placeholder="Select injury type" />
              </SelectTrigger>
              <SelectContent>
                {INJURY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="severity-band">Severity Band</Label>
            <Select value={severityBand} onValueChange={setSeverityBand}>
              <SelectTrigger id="severity-band" data-ocid="settlement.select">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_BANDS.map((band) => (
                  <SelectItem key={band} value={band}>
                    {band}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleEstimate}
          disabled={!injuryCategory || !severityBand}
          className="w-full sm:w-auto"
          data-ocid="settlement.submit_button"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Estimate Value
        </Button>

        {result === "none" && (
          <div
            className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800"
            data-ocid="settlement.error_state"
          >
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Please select a valid injury category and severity band.
          </div>
        )}

        {result && result !== "none" && (
          <div
            className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5"
            data-ocid="settlement.success_state"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                Estimated PSLA Range
              </span>
              <Badge variant="secondary" className="ml-auto">
                {result.severity}
              </Badge>
            </div>
            <div
              className="text-3xl font-display font-bold text-primary tracking-tight"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              {formatCurrency(result.min)} – {formatCurrency(result.max)}
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              <strong>Note:</strong> These figures are indicative estimates
              based on Judicial College Guidelines 17th Edition. Actual awards
              depend on individual circumstances, medical evidence, and judicial
              assessment. This estimate covers PSLA only and excludes special
              damages (loss of earnings, care costs, treatment).
            </p>
          </div>
        )}

        <div className="rounded-md bg-muted/50 border border-border px-4 py-3 text-xs text-muted-foreground">
          <BookOpen className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
          These figures are indicative estimates based on{" "}
          <strong>Judicial College Guidelines 17th Edition</strong>. Actual
          awards depend on individual circumstances and judicial assessment.
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Section 2: Legal Pathway Guide ──────────────────────────────────────────
function LegalPathwayGuide() {
  const [claimValue, setClaimValue] = useState("");
  const [activeTrack, setActiveTrack] = useState<string | null>(null);

  const handleDetermine = () => {
    const val = Number.parseFloat(claimValue);
    if (!Number.isNaN(val) && val > 0) {
      setActiveTrack(getTrack(val));
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Route className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle
              className="font-display text-xl"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Legal Pathway Guide
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              CPR Track Allocation
            </CardDescription>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Determine which court track applies to your claim based on value and
          complexity.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex gap-3 flex-col sm:flex-row sm:items-end">
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="claim-value">Estimated Claim Value (£)</Label>
            <Input
              id="claim-value"
              type="number"
              min={0}
              placeholder="e.g. 5000"
              value={claimValue}
              onChange={(e) => setClaimValue(e.target.value)}
              data-ocid="pathway.input"
            />
          </div>
          <Button
            onClick={handleDetermine}
            disabled={!claimValue}
            data-ocid="pathway.submit_button"
          >
            <Scale className="w-4 h-4 mr-2" />
            Determine Track
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {TRACKS.map((track) => {
            const isHighlighted = activeTrack === track.id;
            return (
              <div
                key={track.id}
                className={[
                  "rounded-xl border-2 p-4 transition-all duration-300",
                  isHighlighted
                    ? `${track.color} border-opacity-100 shadow-md scale-[1.02] ring-2 ring-offset-1 ring-primary/30`
                    : "bg-card border-border opacity-70",
                ].join(" ")}
                data-ocid={`pathway.${track.id}.card`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isHighlighted ? track.badgeColor : "bg-muted text-muted-foreground"}`}
                  >
                    {track.range}
                  </span>
                  {isHighlighted && (
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      Applicable
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-2">{track.name}</h3>
                <ul className="space-y-1 mb-3">
                  {track.keyPoints.map((pt) => (
                    <li key={pt} className="text-xs flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="text-muted-foreground">{pt}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="my-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Timeline</span>
                  <span className="font-medium">{track.timeline}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Authority</span>
                  <span className="font-mono text-xs font-semibold">
                    {track.cpr}
                  </span>
                </div>
                {isHighlighted && (
                  <p className="text-xs mt-3 italic leading-relaxed border-t border-border/50 pt-2">
                    {track.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Section 3: Liability Dispute Response Template ──────────────────────────
function LiabilityDisputeTemplate() {
  const [fields, setFields] = useState({
    yourName: "",
    opponentName: "",
    incidentDate: "",
    incidentLocation: "",
    claimRef: "",
    keyEvidence: "",
  });
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const update =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      setGenerated("");
    };

  const handleGenerate = () => {
    setGenerated(buildTemplate(fields));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      toast.success("Letter copied to clipboard");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Unable to copy — please select and copy manually");
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle
              className="font-display text-xl"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Liability Dispute Response Template
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              WITHOUT PREJUDICE response letter
            </CardDescription>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Use this template when the other party contests fault. Complete the
          fields below and copy the letter.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="your-name">Your Full Name</Label>
            <Input
              id="your-name"
              placeholder="e.g. John Smith"
              value={fields.yourName}
              onChange={update("yourName")}
              data-ocid="dispute.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="opponent-name">Opponent's Full Name</Label>
            <Input
              id="opponent-name"
              placeholder="e.g. Jane Doe"
              value={fields.opponentName}
              onChange={update("opponentName")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="incident-date">Incident Date</Label>
            <Input
              id="incident-date"
              type="date"
              value={fields.incidentDate}
              onChange={update("incidentDate")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="incident-location">Incident Location</Label>
            <Input
              id="incident-location"
              placeholder="e.g. A40 Westway, London"
              value={fields.incidentLocation}
              onChange={update("incidentLocation")}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="claim-ref">Your Reference / Claim ID</Label>
            <Input
              id="claim-ref"
              placeholder="e.g. ACC-20260315-0001"
              value={fields.claimRef}
              onChange={update("claimRef")}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="key-evidence">Key Evidence Points</Label>
            <Textarea
              id="key-evidence"
              rows={3}
              placeholder="e.g. dashcam footage timestamp 14:32, witness John Smith, photo of road markings"
              value={fields.keyEvidence}
              onChange={update("keyEvidence")}
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          className="w-full sm:w-auto"
          data-ocid="dispute.submit_button"
        >
          <Gavel className="w-4 h-4 mr-2" />
          Generate Template
        </Button>

        {generated && (
          <div className="space-y-3" data-ocid="dispute.success_state">
            <Textarea
              rows={22}
              className="font-mono text-xs leading-relaxed resize-y"
              value={generated}
              onChange={(e) => setGenerated(e.target.value)}
              data-ocid="dispute.editor"
            />
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="gap-2"
                data-ocid="dispute.secondary_button"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy Letter"}
              </Button>
              <span className="text-xs text-muted-foreground">
                You can edit the letter above before copying.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LegalOutputsPage() {
  return (
    <div className="space-y-8" data-ocid="legal_outputs.page">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1
              className="font-display font-bold text-3xl tracking-tight text-foreground"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Legal Outputs
            </h1>
            <p className="text-sm text-muted-foreground">
              UK legal tools and templates for accident claims
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <SettlementEstimator />
      <LegalPathwayGuide />
      <LiabilityDisputeTemplate />
    </div>
  );
}
