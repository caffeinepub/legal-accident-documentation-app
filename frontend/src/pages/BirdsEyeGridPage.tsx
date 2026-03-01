import React, { useState } from "react";
import { faultMatrix, FaultMatrixEntry } from "../data/faultMatrix";
import { scenarioReferences, ScenarioKey } from "../data/scenarioReferences";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import GridCellDetail from "../components/GridCellDetail";
import { Grid3X3, Plus, Trash2, Info, Car } from "lucide-react";

interface Vehicle {
  id: string;
  label: string;
}

interface SelectedCell {
  vehicleA: Vehicle;
  vehicleB: Vehicle;
  scenario: FaultMatrixEntry;
  scenarioKey: ScenarioKey | null;
}

// Map faultMatrix scenario names to scenarioReferences keys
const SCENARIO_KEY_MAP: Record<string, ScenarioKey> = {
  "Rear-End Collision": "rear-end",
  "Red Light Violation": "red-light",
  "Lane Change Collision": "lane-change",
  "Turning Collision": "turning",
  "Junction / Give Way Collision": "junction",
  "Roundabout Collision": "roundabout",
  "Reversing Collision": "reversing",
};

function getFaultColor(fault: number): { bg: string; text: string; border: string } {
  if (fault >= 80) return { bg: "bg-red-100 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", border: "border-red-300 dark:border-red-700" };
  if (fault >= 65) return { bg: "bg-orange-100 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-300", border: "border-orange-300 dark:border-orange-700" };
  if (fault >= 50) return { bg: "bg-amber-100 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-300 dark:border-amber-700" };
  return { bg: "bg-emerald-100 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-300 dark:border-emerald-700" };
}

function MiniSplitBar({ partyAFault, partyBFault }: { partyAFault: number; partyBFault: number }) {
  return (
    <div className="flex rounded-full overflow-hidden h-2 w-full mt-1.5">
      <div
        className="transition-all duration-500"
        style={{
          width: `${partyAFault}%`,
          backgroundColor: "oklch(0.55 0.22 25)",
        }}
      />
      <div
        className="transition-all duration-500"
        style={{
          width: `${partyBFault}%`,
          backgroundColor: "oklch(0.45 0.18 250)",
        }}
      />
    </div>
  );
}

function GridCell({
  vehicleA,
  vehicleB,
  scenario,
  onClick,
}: {
  vehicleA: Vehicle;
  vehicleB: Vehicle;
  scenario: FaultMatrixEntry;
  onClick: () => void;
}) {
  const aColors = getFaultColor(scenario.partyAFault);
  const bColors = getFaultColor(scenario.partyBFault);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="w-full min-w-[110px] p-2 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left group"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${aColors.bg} ${aColors.text}`}>
                {vehicleA.label}: {scenario.partyAFault}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${bColors.bg} ${bColors.text}`}>
                {vehicleB.label}: {scenario.partyBFault}%
              </span>
            </div>
            <MiniSplitBar partyAFault={scenario.partyAFault} partyBFault={scenario.partyBFault} />
            <div className="mt-1.5 text-[10px] text-muted-foreground group-hover:text-primary transition-colors text-center">
              Click to drill down →
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-semibold mb-1">{scenario.scenario}</p>
          <p className="text-xs text-muted-foreground">{scenario.rationale.slice(0, 100)}…</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const DEFAULT_VEHICLES: Vehicle[] = [
  { id: "A", label: "Vehicle A" },
  { id: "B", label: "Vehicle B" },
];

const VEHICLE_LABELS = ["A", "B", "C", "D", "E", "F"];

export default function BirdsEyeGridPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEFAULT_VEHICLES);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  const addVehicle = () => {
    if (vehicles.length >= VEHICLE_LABELS.length) return;
    const nextLabel = VEHICLE_LABELS[vehicles.length];
    setVehicles((prev) => [...prev, { id: nextLabel, label: `Vehicle ${nextLabel}` }]);
  };

  const removeVehicle = (id: string) => {
    if (vehicles.length <= 2) return;
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // Generate all unique vehicle pairs (A-B, A-C, B-C, etc.)
  const vehiclePairs: [Vehicle, Vehicle][] = [];
  for (let i = 0; i < vehicles.length; i++) {
    for (let j = i + 1; j < vehicles.length; j++) {
      vehiclePairs.push([vehicles[i], vehicles[j]]);
    }
  }

  const handleCellClick = (vehicleA: Vehicle, vehicleB: Vehicle, scenario: FaultMatrixEntry) => {
    const scenarioKey = SCENARIO_KEY_MAP[scenario.scenario] ?? null;
    setSelectedCell({ vehicleA, vehicleB, scenario, scenarioKey });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-fault-header text-fault-header-fg rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-white/10">
            <Grid3X3 className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Bird's Eye Grid View</h1>
            <p className="mt-1 text-fault-header-fg/80 text-sm leading-relaxed max-w-2xl">
              Interactive fault matrix overview across all accident scenarios and vehicle pairs.
              Click any cell to drill down into the full fault breakdown, Highway Code references, and case law.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/60 border border-border text-sm text-muted-foreground">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <p>
          Fault percentages are indicative insurer assessments based on UK law and may vary by specific circumstances.
          This tool is for educational reference only and does not constitute legal advice.
        </p>
      </div>

      {/* Vehicle Management */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Vehicles:</span>
        </div>
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium"
          >
            <span>{v.label}</span>
            {vehicles.length > 2 && (
              <button
                onClick={() => removeVehicle(v.id)}
                className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove ${v.label}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {vehicles.length < VEHICLE_LABELS.length && (
          <Button variant="outline" size="sm" onClick={addVehicle} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add Vehicle
          </Button>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted-foreground font-medium">Fault level:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-900 inline-block" />
          <span className="text-muted-foreground">≥80% (High)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-900 inline-block" />
          <span className="text-muted-foreground">65–79% (Significant)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-200 dark:bg-amber-900 inline-block" />
          <span className="text-muted-foreground">50–64% (Moderate)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900 inline-block" />
          <span className="text-muted-foreground">&lt;50% (Lower)</span>
        </span>
      </div>

      {/* Grid */}
      <ScrollArea className="w-full">
        <div className="min-w-max">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                {/* Top-left corner cell */}
                <th className="sticky left-0 z-20 bg-card border border-border p-3 min-w-[160px]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Grid3X3 className="w-3.5 h-3.5" />
                    Pair \ Scenario
                  </div>
                </th>
                {faultMatrix.map((scenario) => (
                  <th
                    key={scenario.scenario}
                    className="border border-border p-2 bg-muted/50 min-w-[130px] max-w-[160px]"
                  >
                    <div className="text-xs font-semibold text-foreground leading-tight text-center">
                      {scenario.scenario}
                    </div>
                    <div className="flex justify-center gap-1 mt-1">
                      {scenario.relatedViolationTypes.slice(0, 2).map((vt) => (
                        <Badge
                          key={vt}
                          variant="outline"
                          className="text-[9px] px-1 py-0 h-4 font-normal"
                        >
                          {vt.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehiclePairs.map(([vehicleA, vehicleB]) => (
                <tr key={`${vehicleA.id}-${vehicleB.id}`}>
                  {/* Row header */}
                  <td className="sticky left-0 z-10 bg-card border border-border p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ backgroundColor: "oklch(0.55 0.22 25)" }}
                          >
                            {vehicleA.id}
                          </span>
                          <span className="text-xs font-medium">{vehicleA.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ backgroundColor: "oklch(0.45 0.18 250)" }}
                          >
                            {vehicleB.id}
                          </span>
                          <span className="text-xs font-medium">{vehicleB.label}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Scenario cells */}
                  {faultMatrix.map((scenario) => (
                    <td
                      key={scenario.scenario}
                      className="border border-border p-1.5 align-top"
                    >
                      <GridCell
                        vehicleA={vehicleA}
                        vehicleB={vehicleB}
                        scenario={scenario}
                        onClick={() => handleCellClick(vehicleA, vehicleB, scenario)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>

      {/* Drill-down Dialog */}
      <Dialog open={!!selectedCell} onOpenChange={(open) => !open && setSelectedCell(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Grid3X3 className="w-5 h-5 text-primary" />
              {selectedCell?.scenario.scenario}
            </DialogTitle>
            <DialogDescription>
              Fault breakdown for{" "}
              <strong>{selectedCell?.vehicleA.label}</strong> vs{" "}
              <strong>{selectedCell?.vehicleB.label}</strong>
            </DialogDescription>
          </DialogHeader>
          {selectedCell && (
            <GridCellDetail
              vehicleA={selectedCell.vehicleA}
              vehicleB={selectedCell.vehicleB}
              scenario={selectedCell.scenario}
              scenarioKey={selectedCell.scenarioKey}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
