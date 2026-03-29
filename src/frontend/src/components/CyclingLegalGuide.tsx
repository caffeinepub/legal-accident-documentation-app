import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bike, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import { getLegalReferencesForViolations } from "../data/legalReferences";
import { getMaltaLegalReferencesForViolations } from "../data/maltaLegalReferences";

interface ScenarioCard {
  title: string;
  description: string;
  primaryDuty: string;
  keyRefs: string[];
}

const UK_SCENARIOS: ScenarioCard[] = [
  {
    title: "Cyclist vs Vehicle",
    description:
      "The most common cycling accident. Where a motorist collides with or causes injury to a cyclist, the motorist typically bears primary liability. The vulnerability of cyclists is a key factor in apportioning fault.",
    primaryDuty: "Motorist — heightened duty of care under HC Rules 212–215",
    keyRefs: [
      "HC Rule 212 — 1.5m overtaking clearance",
      "Road Traffic Act 1988, s.3 (careless driving)",
      "Eagle v Chambers [2004] — reduced contributory negligence for vulnerable users",
    ],
  },
  {
    title: "Cyclist vs Pedestrian",
    description:
      "Where a cyclist collides with a pedestrian, the cyclist may bear primary fault. Key factors include speed, location (pavement vs road), and whether the pedestrian had right of way.",
    primaryDuty: "Cyclist — duty of care to pedestrians (HC Rule 64)",
    keyRefs: [
      "HC Rule 64 — cyclists must not ride on pavements",
      "Highways Act 1980, s.72 — cycling on footway is an offence",
      "Occupiers' Liability Act 1957, s.2 — duty to lawful visitors",
    ],
  },
  {
    title: "Solo / Road Defect",
    description:
      "Where a cyclist is injured due to a pothole, poor road surface, or defective cycling infrastructure, a claim may be brought against the highway authority under Highways Act 1980, s.41.",
    primaryDuty: "Highway Authority — statutory duty to maintain roads",
    keyRefs: [
      "Highways Act 1980, s.41 — duty to maintain highway",
      "Phipps v Rochester Corporation [1955] — duty of care to vulnerable users",
      "Active Travel Act 2017 — cycling infrastructure obligations",
    ],
  },
];

const MALTA_SCENARIOS: ScenarioCard[] = [
  {
    title: "Cyclist vs Vehicle",
    description:
      "The motorist bears primary liability where they fail to give adequate clearance or cut across a cyclist's path. TRO Cap. 65 and Civil Code Cap. 16 establish the duty and the remedy.",
    primaryDuty: "Motorist — TRO Cap. 65, Art. 58 (adequate clearance)",
    keyRefs: [
      "TRO Cap. 65, Art. 58 — minimum safe passing distance",
      "Civil Code Cap. 16, Art. 1031 — tortious liability",
      "Borg v Pisani — motorist primarily at fault for inadequate clearance",
    ],
  },
  {
    title: "Cyclist vs Pedestrian",
    description:
      "Cyclists must yield to pedestrians on footpaths and at crossings. Fault is apportioned under Civil Code Art. 1033 if both parties contributed to the accident.",
    primaryDuty: "Cyclist — Civil Code Art. 1031 duty of care to pedestrians",
    keyRefs: [
      "Civil Code Cap. 16, Art. 1031 — general tortious liability",
      "Civil Code Cap. 16, Art. 1033 — contributory negligence",
      "Road Code, Section 9.1 — cyclist duties at junctions and crossings",
    ],
  },
  {
    title: "Solo / Road Defect",
    description:
      "Claims against the Malta roads authority or local council for defective road surfaces, potholes, or inadequate cycling infrastructure. Prescription: 2 years under Civil Code Art. 2153.",
    primaryDuty: "Roads Authority / Local Council — duty to maintain roads",
    keyRefs: [
      "Civil Code Cap. 16, Art. 1031 — authority liability for negligent maintenance",
      "TRO Cap. 65 — road authority obligations",
      "Government Proceedings Act Cap. 481 — claims against public authorities",
    ],
  },
];

const UK_FAULT_TABLE = [
  {
    factor: "No helmet worn",
    impact: "Up to 15% reduction in compensation",
    ref: "Froom v Butcher [1976]",
  },
  {
    factor: "No lights at night",
    impact: "Up to 25% reduction",
    ref: "Lunt v Khelifa [2002]",
  },
  {
    factor: "No hi-vis in low visibility",
    impact: "Up to 10% reduction",
    ref: "Contributory negligence principles",
  },
  {
    factor: "Cycling on pavement",
    impact: "Significant fault attributed",
    ref: "Highways Act 1980, s.72",
  },
  {
    factor: "Failure to signal at junction",
    impact: "Fault apportioned accordingly",
    ref: "HC Rules 72 & 79",
  },
  {
    factor: "Riding more than two abreast",
    impact: "Contributory fault may be raised",
    ref: "HC Rule 66",
  },
];

const MALTA_FAULT_TABLE = [
  {
    factor: "No helmet worn",
    impact: "Damages may be apportioned accordingly",
    ref: "Civil Code Art. 1033",
  },
  {
    factor: "No lights at night",
    impact: "Up to 25% reduction",
    ref: "TRO Cap. 65, Art. 57",
  },
  {
    factor: "No hi-vis in low visibility",
    impact: "Contributory negligence factor",
    ref: "Civil Code Art. 1033",
  },
  {
    factor: "Cycling on footpath",
    impact: "Significant fault attributed",
    ref: "Road Code, Section 9.1",
  },
  {
    factor: "Failure to signal at junction",
    impact: "Fault apportioned: see Camilleri v Attard",
    ref: "TRO Cap. 65, Art. 53",
  },
  {
    factor: "Wrong road position",
    impact: "Contributory fault may be raised",
    ref: "Road Code, Section 9.1",
  },
];

export default function CyclingLegalGuide() {
  const { country } = useCountry();
  const isMalta = country === "mt";
  const [caseLawOpen, setCaseLawOpen] = useState(false);

  const scenarios = isMalta ? MALTA_SCENARIOS : UK_SCENARIOS;
  const faultTable = isMalta ? MALTA_FAULT_TABLE : UK_FAULT_TABLE;

  const refs = isMalta
    ? getMaltaLegalReferencesForViolations(["Cycling"])
    : getLegalReferencesForViolations(["Cycling"]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Bike className="w-5 h-5 text-blue-700 dark:text-blue-400" />
        </div>
        <div>
          <h2
            className="font-display font-bold text-2xl tracking-tight text-foreground"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            Cycling Accident Legal Guide
          </h2>
          <p className="text-sm text-muted-foreground">
            {isMalta
              ? "Maltese law governing cycling accidents — TRO Cap. 65 & Civil Code Cap. 16"
              : "UK law governing cycling accidents — Highway Code, Road Traffic Act, and case law"}
          </p>
        </div>
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((s) => (
          <Card key={s.title} className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bike className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {s.description}
              </p>
              <div className="rounded-lg bg-muted/30 border border-border px-3 py-2">
                <p className="text-xs font-medium text-foreground">
                  Primary Duty
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.primaryDuty}
                </p>
              </div>
              <div className="space-y-1">
                {s.keyRefs.map((ref) => (
                  <Badge
                    key={ref}
                    variant="outline"
                    className="text-xs block w-full text-left truncate"
                    title={ref}
                  >
                    {ref}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fault Weighting Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Contributory Negligence Weighting
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {isMalta
              ? "How these factors affect compensation under Civil Code Art. 1033"
              : "How these factors reduce compensation under contributory negligence principles"}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Factor</TableHead>
                <TableHead className="text-xs">Likely Impact</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">
                  Legal Basis
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faultTable.map((row) => (
                <TableRow key={row.factor}>
                  <TableCell className="text-xs font-medium">
                    {row.factor}
                  </TableCell>
                  <TableCell className="text-xs text-amber-700 dark:text-amber-400">
                    {row.impact}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                    {row.ref}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Deep Case Law */}
      {refs.caseLaw.length > 0 && (
        <Collapsible open={caseLawOpen} onOpenChange={setCaseLawOpen}>
          <Card>
            <CardHeader className="py-3 px-4">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Bike className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">
                      Cycling Case Law
                    </CardTitle>
                  </div>
                  {caseLawOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0 pb-4 px-4 space-y-3">
                {refs.caseLaw.map((c) => (
                  <div
                    key={c.caseName}
                    className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 space-y-1"
                  >
                    <p className="text-sm font-medium italic">{c.caseName}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {c.factualSummary}
                    </p>
                    <p className="text-xs font-medium text-foreground/80 leading-relaxed">
                      {c.legalPrinciple}
                    </p>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
}
