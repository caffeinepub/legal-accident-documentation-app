import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, MapPin, TrendingUp } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import GeographicHeatMap from "../components/GeographicHeatMap";
import { useCountry } from "../contexts/CountryContext";
import {
  type DangerousRoad,
  HAZARD_COLORS,
  MALTA_DANGEROUS_ROADS,
  UK_DANGEROUS_ROADS,
} from "../data/dangerousRoads";

function getHeatColor(index: number): string {
  if (index >= 9) return "bg-red-600 text-white";
  if (index >= 7) return "bg-orange-500 text-white";
  if (index >= 5) return "bg-amber-400 text-gray-900";
  return "bg-yellow-300 text-gray-900";
}

function getBorderColor(index: number): string {
  if (index >= 9) return "border-l-red-600";
  if (index >= 7) return "border-l-orange-500";
  if (index >= 5) return "border-l-amber-400";
  return "border-l-yellow-400";
}

function getRoadBadge(country: string): string {
  if (country === "mt") return "bg-red-700 text-white";
  return "bg-green-700 text-white";
}

export default function DangerousRoadsPage() {
  const { country } = useCountry();
  const isMalta = country === "mt";
  const ROADS = isMalta ? MALTA_DANGEROUS_ROADS : UK_DANGEROUS_ROADS;

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState("all");
  const [hazardFilter, setHazardFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"danger" | "number" | "region">(
    "danger",
  );

  const regions = useMemo(() => {
    const set = new Set(ROADS.map((r) => r.region));
    return Array.from(set).sort();
  }, [ROADS]);

  const allHazards = useMemo(() => {
    const set = new Set(ROADS.flatMap((r) => r.hazards));
    return Array.from(set).sort();
  }, [ROADS]);

  const filtered = useMemo(() => {
    let roads = [...ROADS];
    if (regionFilter !== "all")
      roads = roads.filter((r) => r.region === regionFilter);
    if (hazardFilter !== "all")
      roads = roads.filter((r) => r.hazards.includes(hazardFilter));
    if (sortBy === "danger")
      roads.sort((a, b) => b.accidentIndex - a.accidentIndex);
    else if (sortBy === "number")
      roads.sort((a, b) => a.number.localeCompare(b.number));
    else if (sortBy === "region")
      roads.sort((a, b) => a.region.localeCompare(b.region));
    return roads;
  }, [ROADS, regionFilter, hazardFilter, sortBy]);

  const handleHeatClick = (road: DangerousRoad) => {
    setHighlightedId(road.id);
    const el = cardRefs.current[road.id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setHighlightedId(null), 2000);
    }
  };

  return (
    <div className="space-y-8" data-ocid="dangerous_roads.page">
      {/* Page header */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Dangerous Roads
            </h1>
            <span className="text-xl">{isMalta ? "🇲🇹" : "🇬🇧"}</span>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isMalta
              ? "Malta road safety hotspots based on Transport Malta and police accident records"
              : "UK accident hotspots based on STATS19 data and road safety reports"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 italic">
            {isMalta ? (
              <>
                Data is indicative only. Always consult official{" "}
                <a
                  href="https://www.transport.gov.mt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Transport Malta road safety guidance
                </a>
                .
              </>
            ) : (
              <>
                Data is indicative only. Always consult official{" "}
                <a
                  href="https://think.direct.gov.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  THINK! road safety guidance
                </a>
                .
              </>
            )}
          </p>
        </div>
      </div>

      {/* Geographic Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            Geographic Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GeographicHeatMap
            roads={ROADS}
            isMalta={isMalta}
            onRoadClick={handleHeatClick}
            highlightedId={highlightedId}
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Dot size and colour indicate severity. Click any dot to jump to road
            details.
          </p>
        </CardContent>
      </Card>

      {/* Heat map section */}
      <Card data-ocid="dangerous_roads.panel">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              Accident Risk Heat Map
            </CardTitle>
            {/* Legend */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Lower risk</span>
              <div className="flex rounded overflow-hidden">
                <div className="w-8 h-4 bg-yellow-300" />
                <div className="w-8 h-4 bg-amber-400" />
                <div className="w-8 h-4 bg-orange-500" />
                <div className="w-8 h-4 bg-red-600" />
              </div>
              <span>Higher risk</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {ROADS.map((road) => (
              <button
                key={road.id}
                type="button"
                onClick={() => handleHeatClick(road)}
                className={[
                  "rounded-md px-2 py-2.5 text-center transition-all hover:scale-105 hover:shadow-md cursor-pointer",
                  getHeatColor(road.accidentIndex),
                ].join(" ")}
                data-ocid={"dangerous_roads.heatmap.button"}
                title={road.name}
              >
                <div className="font-bold text-xs leading-tight">
                  {road.number}
                </div>
                <div className="text-[10px] opacity-80 mt-0.5 leading-tight line-clamp-1">
                  {road.region.split(",")[0].split(" ")[0]}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Click any cell to jump to the full road details below.
          </p>
        </CardContent>
      </Card>

      {/* Filter/sort controls */}
      <div
        className="flex flex-col sm:flex-row gap-3"
        data-ocid="dangerous_roads.panel"
      >
        <div className="flex-1">
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger
              data-ocid="dangerous_roads.select"
              className="w-full"
            >
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={hazardFilter} onValueChange={setHazardFilter}>
            <SelectTrigger
              data-ocid="dangerous_roads.select"
              className="w-full"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Filter by hazard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hazard Types</SelectItem>
              {allHazards.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as typeof sortBy)}
          >
            <SelectTrigger
              data-ocid="dangerous_roads.select"
              className="w-full"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="danger">Most Dangerous</SelectItem>
              <SelectItem value="number">Road Number</SelectItem>
              <SelectItem value="region">Region</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground -mt-4">
        Showing {filtered.length} of {ROADS.length} roads
      </p>

      {/* Road cards */}
      <div className="space-y-4" data-ocid="dangerous_roads.list">
        {filtered.map((road, idx) => (
          <div
            key={road.id}
            ref={(el) => {
              cardRefs.current[road.id] = el;
            }}
            data-ocid={`dangerous_roads.item.${idx + 1}`}
            className={[
              "rounded-lg border-l-4 border border-border bg-card transition-all duration-500",
              getBorderColor(road.accidentIndex),
              highlightedId === road.id
                ? "ring-2 ring-offset-2 ring-orange-400 shadow-lg"
                : "hover:shadow-sm",
            ].join(" ")}
          >
            <div className="p-4">
              {/* Card header row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div className="flex items-start gap-3">
                  {/* Road number badge */}
                  <span
                    className={[
                      "inline-flex items-center justify-center px-2.5 py-1 rounded text-sm font-bold tracking-wide shrink-0 font-mono",
                      getRoadBadge(country),
                    ].join(" ")}
                  >
                    {road.number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                      {road.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {road.region}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Annual serious
                    </div>
                    <div className="font-bold text-sm text-foreground">
                      ~{road.annualSerious} incidents
                    </div>
                  </div>
                  <div
                    className={[
                      "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm",
                      getHeatColor(road.accidentIndex),
                    ].join(" ")}
                  >
                    {road.accidentIndex}
                  </div>
                </div>
              </div>

              {/* Severity bar */}
              <Progress
                value={road.accidentIndex * 10}
                className="h-1.5 mb-3"
              />

              {/* Notes */}
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {road.notes}
              </p>

              {/* Hazard chips */}
              <div className="flex flex-wrap gap-1.5">
                {road.hazards.map((hazard) => (
                  <span
                    key={hazard}
                    className={[
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      HAZARD_COLORS[hazard] ??
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                    ].join(" ")}
                  >
                    {hazard}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="dangerous_roads.empty_state"
        >
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No roads match the selected filters.</p>
        </div>
      )}

      {/* Source note */}
      <Card className="bg-muted/40 border-border">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground">
            {isMalta ? (
              <>
                <strong>Data sources:</strong> Transport Malta Road Safety Unit,
                Malta Police Force annual accident statistics, National
                Statistics Office (NSO) Malta road casualty data, and published
                Transport Malta road safety action plans. Accident indices are
                indicative severity scores and should not be used for insurance
                or legal determinations without official verification.
              </>
            ) : (
              <>
                <strong>Data sources:</strong> Department for Transport STATS19
                road casualty statistics, IAM RoadSmart annual dangerous roads
                reports, Royal Society for the Prevention of Accidents (RoSPA),
                and road safety charity Brake. Accident indices are indicative
                severity scores based on published data and should not be used
                for insurance or legal determinations without official
                verification.
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
