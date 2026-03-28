import React, { useState } from "react";
import type { DangerousRoad } from "../data/dangerousRoads";

interface GeographicHeatMapProps {
  roads: DangerousRoad[];
  isMalta: boolean;
  onRoadClick: (road: DangerousRoad) => void;
  highlightedId: string | null;
}

// Approximate x,y positions for each road ID within the SVG coordinate spaces
const UK_POSITIONS: Record<string, [number, number]> = {
  // Scotland
  a9: [105, 75],
  // North East
  a19: [138, 128],
  a1m_yorkshire: [130, 145],
  "a1m-yorkshire": [130, 145],
  // Yorkshire
  a58: [122, 155],
  a682: [118, 148],
  a616: [125, 162],
  // North West / Cumbria
  a590: [100, 148],
  a537: [108, 165],
  // Midlands
  a6_derbyshire: [118, 185],
  "a6-derbyshire": [118, 185],
  a43: [128, 193],
  a38: [115, 192],
  // East Anglia
  a249: [150, 210],
  // South East / London
  a31: [115, 232],
  a303: [105, 238],
  a417: [112, 222],
  // South West / Wales
  a30: [72, 258],
  a361: [85, 248],
  // Wales
  "a5-north-wales": [75, 185],
  "a483-wales": [78, 200],
  "a470-wales": [82, 213],
};

const MALTA_POSITIONS: Record<string, [number, number]> = {
  "mt-regional-road": [100, 68],
  "mt-coast-road": [148, 60],
  "mt-mosta-burmarrad": [82, 58],
  "mt-airport-corridor": [110, 80],
  "mt-marsa-junction": [95, 78],
  "mt-rabat-dingli": [68, 72],
  "mt-mellieha-bypass": [70, 50],
  "mt-santa-venera": [98, 73],
  "mt-valletta-approach": [105, 72],
  "mt-gozo-ferry-road": [65, 58],
  "mt-msida-seafront": [100, 76],
  "mt-sliema-seafront": [112, 70],
  "mt-paola-tarxien": [105, 83],
  "mt-victoria-gozo": [35, 38],
  "mt-marsaxlokk-birzebbuga": [118, 90],
};

function getDotColor(accidentIndex: number): string {
  if (accidentIndex >= 9) return "#dc2626";
  if (accidentIndex >= 7) return "#f97316";
  if (accidentIndex >= 5) return "#fbbf24";
  return "#fde047";
}

function getDotRadius(accidentIndex: number): number {
  if (accidentIndex >= 9) return 6;
  if (accidentIndex >= 7) return 5;
  if (accidentIndex >= 5) return 4;
  return 3;
}

const UK_PATH = [
  // England south coast
  "M 80,260 L 100,268 L 125,272 L 140,270 L 155,263 L 160,255 L 158,244 L 155,230",
  // East coast north
  "L 162,215 L 165,200 L 165,185 L 165,175 L 168,160 L 170,150 L 163,135 L 160,120",
  // Northeast
  "L 157,108 L 155,100 L 150,90 L 145,80",
  // Scotland east
  "L 138,68 L 130,58 L 118,42 L 108,36 L 95,28 L 82,22 L 72,26 L 62,38",
  // Scotland north/west
  "L 68,52 L 58,65 L 50,80 L 47,98 L 43,118",
  // England west coast
  "L 40,138 L 38,155 L 40,172 L 44,188 L 50,205 L 55,218 L 62,232 L 70,248 L 80,260 Z",
].join(" ");

// Wales bump on west side
const WALES_PATH =
  "M 55,195 L 48,200 L 43,212 L 47,222 L 55,225 L 65,220 L 68,210 L 65,198 Z";

const MALTA_MAIN_PATH =
  "M 40,62 L 70,52 L 110,50 L 148,52 L 165,58 L 170,72 L 168,82 L 160,92 L 140,100 L 118,108 L 95,106 L 72,98 L 55,88 L 42,76 Z";

const GOZO_PATH = "M 20,37 L 42,28 L 62,26 L 68,36 L 62,48 L 38,52 L 22,46 Z";

export default function GeographicHeatMap({
  roads,
  isMalta,
  onRoadClick,
  highlightedId,
}: GeographicHeatMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    road: DangerousRoad;
  } | null>(null);

  const positions = isMalta ? MALTA_POSITIONS : UK_POSITIONS;
  const viewBox = isMalta ? "0 0 200 130" : "0 0 200 300";

  return (
    <div className="relative w-full">
      <svg
        viewBox={viewBox}
        className="w-full max-h-96 mx-auto block"
        style={{ maxWidth: isMalta ? 480 : 320 }}
        aria-labelledby="geomap-title"
      >
        <title id="geomap-title">
          {isMalta ? "Malta accident heat map" : "UK accident heat map"}
        </title>
        {/* Map outline */}
        {isMalta ? (
          <>
            <path
              d={MALTA_MAIN_PATH}
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <path
              d={GOZO_PATH}
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1"
            />
          </>
        ) : (
          <>
            <path d={UK_PATH} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <path
              d={WALES_PATH}
              fill="#d1d5db"
              stroke="#94a3b8"
              strokeWidth="0.8"
            />
          </>
        )}

        {/* Danger dots */}
        {roads.map((road) => {
          const pos = positions[road.id];
          if (!pos) return null;
          const [x, y] = pos;
          const isHighlighted = highlightedId === road.id;
          const isHovered = hoveredId === road.id;
          const r = getDotRadius(road.accidentIndex);
          const fill = getDotColor(road.accidentIndex);

          return (
            <g key={road.id}>
              {/* Highlight ring */}
              {(isHighlighted || isHovered) && (
                <circle
                  cx={x}
                  cy={y}
                  r={r + 3}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.9"
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={fill}
                stroke="rgba(0,0,0,0.25)"
                strokeWidth="0.5"
                style={{ cursor: "pointer" }}
                onClick={() => onRoadClick(road)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onRoadClick(road);
                }}
                onMouseEnter={(e) => {
                  setHoveredId(road.id);
                  const svg = (e.target as SVGCircleElement).closest("svg");
                  if (svg) {
                    const rect = svg.getBoundingClientRect();
                    const vbW = isMalta ? 200 : 200;
                    const vbH = isMalta ? 130 : 300;
                    const scaleX = rect.width / vbW;
                    const scaleY = rect.height / vbH;
                    setTooltip({
                      x: x * scaleX,
                      y: y * scaleY,
                      road,
                    });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setTooltip(null);
                }}
                aria-label={`${road.name} — severity ${road.accidentIndex}/10`}
              >
                <title>
                  {road.name} ({road.number}) — Severity {road.accidentIndex}/10
                </title>
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none bg-popover text-popover-foreground border border-border rounded-md shadow-lg px-3 py-2 text-xs max-w-[160px]"
          style={{
            left: tooltip.x + 8,
            top: tooltip.y - 40,
            transform: "translateX(-50%)",
          }}
        >
          <p className="font-semibold text-foreground leading-tight">
            {tooltip.road.name}
          </p>
          <p className="text-muted-foreground">{tooltip.road.number}</p>
          <p className="mt-0.5">
            <span
              className="inline-block w-2 h-2 rounded-full mr-1"
              style={{
                backgroundColor: getDotColor(tooltip.road.accidentIndex),
              }}
            />
            Severity {tooltip.road.accidentIndex}/10
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600" />{" "}
          Critical
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-orange-500" />{" "}
          High
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-amber-400" />{" "}
          Moderate
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-300" />{" "}
          Lower
        </span>
      </div>
    </div>
  );
}
