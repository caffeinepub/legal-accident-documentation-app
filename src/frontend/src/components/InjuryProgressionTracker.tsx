import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Minus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface MedicalEntry {
  id: string;
  date: string;
  appointmentType: "GP" | "A&E" | "Physiotherapy" | "Specialist" | "Other";
  location: string;
  doctor: string;
  notes: string;
  severity: number;
}

interface InjuryProgressionTrackerProps {
  reportId: bigint;
}

function getStorageKey(reportId: bigint): string {
  return `injury_tracker_${reportId.toString()}`;
}

function loadEntries(reportId: bigint): MedicalEntry[] {
  try {
    const raw = localStorage.getItem(getStorageKey(reportId));
    return raw ? (JSON.parse(raw) as MedicalEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(reportId: bigint, entries: MedicalEntry[]): void {
  localStorage.setItem(getStorageKey(reportId), JSON.stringify(entries));
}

function getTrendBadge(entries: MedicalEntry[]) {
  if (entries.length < 2) return null;
  const last3 = entries.slice(0, 3).map((e) => e.severity);
  const first = last3[last3.length - 1];
  const last = last3[0];
  const diff = last - first;
  if (diff <= -1)
    return {
      label: "Improving",
      icon: TrendingDown,
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300",
    };
  if (diff >= 1)
    return {
      label: "Worsening",
      icon: TrendingUp,
      className:
        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300",
    };
  return {
    label: "Stable",
    icon: Minus,
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300",
  };
}

function severityBadgeClass(severity: number): string {
  if (severity <= 3)
    return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300";
  if (severity <= 6)
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300";
  return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300";
}

const APPOINTMENT_TYPES: MedicalEntry["appointmentType"][] = [
  "GP",
  "A&E",
  "Physiotherapy",
  "Specialist",
  "Other",
];

const emptyForm = {
  date: "",
  appointmentType: "GP" as MedicalEntry["appointmentType"],
  location: "",
  doctor: "",
  notes: "",
  severity: 5,
};

const InjuryProgressionTracker: React.FC<InjuryProgressionTrackerProps> = ({
  reportId,
}) => {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<MedicalEntry[]>(() =>
    loadEntries(reportId),
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    saveEntries(reportId, entries);
  }, [entries, reportId]);

  const trend = getTrendBadge(entries);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) return;
    const entry: MedicalEntry = { ...form, id: Date.now().toString() };
    setEntries((prev) => [entry, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card data-ocid="injury_tracker.panel" className="border-border/60">
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer select-none">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Activity className="h-4 w-4 text-primary" />
                Injury Recovery Tracker
                {trend && (
                  <Badge
                    className={`ml-2 flex items-center gap-1 text-xs ${trend.className}`}
                  >
                    <trend.icon className="h-3 w-3" />
                    {trend.label}
                  </Badge>
                )}
              </CardTitle>
              {open ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-ocid="injury_tracker.add_button"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Cancel" : "+ Add Entry"}
            </Button>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="border border-border/60 rounded-lg p-4 space-y-4 bg-muted/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="irt-date">Date</Label>
                    <Input
                      id="irt-date"
                      type="date"
                      data-ocid="injury_tracker.input"
                      value={form.date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, date: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="irt-type">Appointment Type</Label>
                    <Select
                      value={form.appointmentType}
                      onValueChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          appointmentType: v as MedicalEntry["appointmentType"],
                        }))
                      }
                    >
                      <SelectTrigger
                        id="irt-type"
                        data-ocid="injury_tracker.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APPOINTMENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="irt-location">Hospital / Clinic</Label>
                    <Input
                      id="irt-location"
                      placeholder="e.g. Royal London Hospital"
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="irt-doctor">Doctor Name</Label>
                    <Input
                      id="irt-doctor"
                      placeholder="e.g. Dr. Smith"
                      value={form.doctor}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, doctor: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="irt-notes">Notes</Label>
                  <Textarea
                    id="irt-notes"
                    data-ocid="injury_tracker.textarea"
                    placeholder="Symptoms, treatment received, medications prescribed..."
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Pain / Severity:{" "}
                    <span className="font-semibold">{form.severity}</span> / 10
                  </Label>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[form.severity]}
                    onValueChange={([v]) =>
                      setForm((f) => ({ ...f, severity: v }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 — Mild</span>
                    <span>10 — Severe</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    data-ocid="injury_tracker.submit_button"
                  >
                    Save Entry
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    data-ocid="injury_tracker.cancel_button"
                    onClick={() => {
                      setShowForm(false);
                      setForm(emptyForm);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {entries.length === 0 ? (
              <div
                data-ocid="injury_tracker.empty_state"
                className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border/40 rounded-lg"
              >
                No medical entries yet. Add your first appointment to begin
                tracking recovery.
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="relative flex gap-4 pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-border/60"
                  >
                    <div className="flex-1 border border-border/40 rounded-lg p-3 space-y-2 bg-card">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-muted-foreground">
                            {entry.date
                              ? new Date(entry.date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {entry.appointmentType}
                          </Badge>
                          <Badge
                            className={`text-xs ${severityBadgeClass(entry.severity)}`}
                          >
                            Severity {entry.severity}/10
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                          data-ocid={`injury_tracker.delete_button.${idx + 1}`}
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      {(entry.location || entry.doctor) && (
                        <p className="text-xs text-muted-foreground">
                          {[entry.location, entry.doctor]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-foreground leading-relaxed">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default InjuryProgressionTracker;
