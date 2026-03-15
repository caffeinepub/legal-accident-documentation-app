import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { ScenarioKey } from "../data/scenarioReferences";

type DiagramProps = { label: string };

function RearEndDiagram({ label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto block"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <rect width="320" height="220" fill="#f1f5f9" rx="8" />
      <rect x="0" y="85" width="320" height="50" fill="#1e2a3a" />
      {[0, 50, 100, 150, 200, 250].map((x) => (
        <rect
          key={x}
          x={x + 10}
          y="108"
          width="30"
          height="4"
          fill="white"
          opacity="0.6"
        />
      ))}
      <rect x="0" y="85" width="320" height="3" fill="white" opacity="0.4" />
      <rect x="0" y="132" width="320" height="3" fill="white" opacity="0.4" />
      <rect x="195" y="96" width="48" height="28" rx="4" fill="#3b82f6" />
      <text
        x="219"
        y="115"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="bold"
      >
        B
      </text>
      <polygon points="248,110 258,106 258,114" fill="#93c5fd" />
      <rect x="77" y="96" width="48" height="28" rx="4" fill="#f59e0b" />
      <text
        x="101"
        y="115"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="bold"
      >
        A
      </text>
      <polygon points="130,110 140,106 140,114" fill="#fcd34d" />
      <circle cx="198" cy="110" r="16" fill="#ef444466" />
      <text
        x="160"
        y="170"
        textAnchor="middle"
        fill="#334155"
        fontSize="12"
        fontWeight="600"
      >
        A rear-ends B
      </text>
      <text x="160" y="186" textAnchor="middle" fill="#64748b" fontSize="10">
        Following too closely — HC Rule 126
      </text>
    </svg>
  );
}

function RedLightDiagram({ label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto block"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <rect width="320" height="220" fill="#f1f5f9" rx="8" />
      <rect x="0" y="90" width="320" height="40" fill="#1e2a3a" />
      <rect x="140" y="0" width="40" height="220" fill="#1e2a3a" />
      {[0, 50, 220, 270].map((x) => (
        <rect
          key={x}
          x={x + 5}
          y="108"
          width="30"
          height="4"
          fill="white"
          opacity="0.6"
        />
      ))}
      {[10, 60, 140, 180].map((y) => (
        <rect
          key={y}
          x="158"
          y={y}
          width="4"
          height="30"
          fill="white"
          opacity="0.6"
        />
      ))}
      <rect x="0" y="90" width="320" height="2" fill="white" opacity="0.3" />
      <rect x="0" y="128" width="320" height="2" fill="white" opacity="0.3" />
      <rect x="140" y="0" width="2" height="220" fill="white" opacity="0.3" />
      <rect x="178" y="0" width="2" height="220" fill="white" opacity="0.3" />
      <rect x="200" y="35" width="14" height="36" rx="3" fill="#1e293b" />
      <circle cx="207" cy="44" r="5" fill="#ef4444" />
      <circle cx="207" cy="56" r="5" fill="#374151" />
      <circle cx="207" cy="68" r="5" fill="#374151" />
      <text x="215" y="48" fill="#ef4444" fontSize="8" fontWeight="bold">
        RED
      </text>
      <rect x="148" y="30" width="24" height="40" rx="4" fill="#3b82f6" />
      <text
        x="160"
        y="55"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        B
      </text>
      <polygon points="160,76 156,84 164,84" fill="#93c5fd" />
      <rect x="48" y="98" width="40" height="24" rx="4" fill="#f59e0b" />
      <text
        x="68"
        y="114"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        A
      </text>
      <polygon points="92,110 100,106 100,114" fill="#fcd34d" />
      <circle cx="155" cy="110" r="18" fill="#ef444466" />
      <text
        x="160"
        y="185"
        textAnchor="middle"
        fill="#334155"
        fontSize="12"
        fontWeight="600"
      >
        A runs red light
      </text>
      <text x="160" y="200" textAnchor="middle" fill="#64748b" fontSize="10">
        HC Rule 109–112, RTA 1988 s.36
      </text>
    </svg>
  );
}

function LaneChangeDiagram({ label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto block"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <rect width="320" height="220" fill="#f1f5f9" rx="8" />
      <rect x="0" y="70" width="320" height="80" fill="#1e2a3a" />
      {[0, 50, 100, 150, 200, 250].map((x) => (
        <rect
          key={x}
          x={x + 10}
          y="108"
          width="30"
          height="4"
          fill="white"
          opacity="0.6"
        />
      ))}
      <rect x="0" y="70" width="320" height="3" fill="white" opacity="0.4" />
      <rect x="0" y="147" width="320" height="3" fill="white" opacity="0.4" />
      <text x="12" y="92" fill="white" opacity="0.5" fontSize="9">
        LEFT LANE
      </text>
      <text x="12" y="140" fill="white" opacity="0.5" fontSize="9">
        RIGHT LANE
      </text>
      <rect x="200" y="122" width="48" height="24" rx="4" fill="#3b82f6" />
      <text
        x="224"
        y="138"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        B
      </text>
      <polygon points="252,134 262,130 262,138" fill="#93c5fd" />
      <rect x="100" y="80" width="48" height="24" rx="4" fill="#f59e0b" />
      <text
        x="124"
        y="96"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        A
      </text>
      <path
        d="M 148 92 Q 175 92 185 122"
        stroke="#f59e0b"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="5,3"
      />
      <polygon points="183,122 190,116 188,125" fill="#f59e0b" />
      <circle cx="200" cy="122" r="16" fill="#ef444466" />
      <text
        x="160"
        y="175"
        textAnchor="middle"
        fill="#334155"
        fontSize="12"
        fontWeight="600"
      >
        A changes lane unsafely
      </text>
      <text x="160" y="191" textAnchor="middle" fill="#64748b" fontSize="10">
        Failure to check mirrors/blind spot — HC Rule 133
      </text>
    </svg>
  );
}

function TurningDiagram({ label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto block"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <rect width="320" height="220" fill="#f1f5f9" rx="8" />
      <rect x="0" y="110" width="320" height="50" fill="#1e2a3a" />
      <rect x="130" y="0" width="50" height="115" fill="#1e2a3a" />
      {[0, 50, 220, 270].map((x) => (
        <rect
          key={x}
          x={x + 5}
          y="133"
          width="28"
          height="4"
          fill="white"
          opacity="0.6"
        />
      ))}
      {[10, 50].map((y) => (
        <rect
          key={y}
          x="153"
          y={y}
          width="4"
          height="25"
          fill="white"
          opacity="0.6"
        />
      ))}
      <rect
        x="130"
        y="108"
        width="50"
        height="3"
        fill="#fbbf24"
        opacity="0.8"
      />
      <text x="115" y="107" fill="#fbbf24" fontSize="8">
        GIVE WAY
      </text>
      <rect x="0" y="110" width="320" height="2" fill="white" opacity="0.3" />
      <rect x="0" y="158" width="320" height="2" fill="white" opacity="0.3" />
      <rect x="220" y="120" width="44" height="24" rx="4" fill="#3b82f6" />
      <text
        x="242"
        y="136"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        B
      </text>
      <polygon points="220,132 210,128 210,136" fill="#93c5fd" />
      <rect x="140" y="50" width="24" height="40" rx="4" fill="#f59e0b" />
      <text
        x="152"
        y="74"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        A
      </text>
      <path
        d="M 152 94 Q 152 120 120 132"
        stroke="#f59e0b"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="5,3"
      />
      <polygon points="120,132 113,126 122,130" fill="#f59e0b" />
      <circle cx="180" cy="128" r="18" fill="#ef444466" />
      <text
        x="160"
        y="185"
        textAnchor="middle"
        fill="#334155"
        fontSize="12"
        fontWeight="600"
      >
        A turns across B
      </text>
      <text x="160" y="200" textAnchor="middle" fill="#64748b" fontSize="10">
        Failure to yield to oncoming — HC Rule 180
      </text>
    </svg>
  );
}

function JunctionDiagram({ label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto block"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <rect width="320" height="220" fill="#f1f5f9" rx="8" />
      <rect x="0" y="90" width="320" height="50" fill="#1e2a3a" />
      <rect x="135" y="140" width="50" height="80" fill="#1e2a3a" />
      {[0, 50, 220, 270].map((x) => (
        <rect
          key={x}
          x={x + 5}
          y="113"
          width="28"
          height="4"
          fill="white"
          opacity="0.6"
        />
      ))}
      {[155, 185].map((y) => (
        <rect
          key={y}
          x="158"
          y={y}
          width="4"
          height="20"
          fill="white"
          opacity="0.6"
        />
      ))}
      <rect
        x="135"
        y="138"
        width="50"
        height="3"
        fill="#fbbf24"
        opacity="0.8"
      />
      <text x="120" y="137" fill="#fbbf24" fontSize="8">
        GIVE WAY
      </text>
      <rect x="0" y="90" width="320" height="2" fill="white" opacity="0.3" />
      <rect x="0" y="138" width="320" height="2" fill="white" opacity="0.3" />
      <rect x="50" y="99" width="44" height="24" rx="4" fill="#3b82f6" />
      <text
        x="72"
        y="115"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        B
      </text>
      <polygon points="98,111 108,107 108,115" fill="#93c5fd" />
      <rect x="145" y="155" width="24" height="38" rx="4" fill="#f59e0b" />
      <text
        x="157"
        y="178"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        A
      </text>
      <polygon points="157,151 153,141 161,141" fill="#fcd34d" />
      <circle cx="152" cy="118" r="18" fill="#ef444466" />
      <polygon
        points="265,100 280,115 265,130 250,115"
        fill="#fbbf24"
        stroke="white"
        strokeWidth="1.5"
      />
      <text
        x="265"
        y="119"
        textAnchor="middle"
        fill="#1e293b"
        fontSize="8"
        fontWeight="bold"
      >
        P
      </text>
      <text
        x="160"
        y="185"
        textAnchor="middle"
        fill="#334155"
        fontSize="12"
        fontWeight="600"
      >
        A fails to give way
      </text>
      <text x="160" y="200" textAnchor="middle" fill="#64748b" fontSize="10">
        Emerging from minor road — HC Rule 172
      </text>
    </svg>
  );
}

function RoundaboutDiagram({ label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto block"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <rect width="320" height="220" fill="#f1f5f9" rx="8" />
      <rect x="140" y="0" width="40" height="65" fill="#1e2a3a" />
      <rect x="140" y="155" width="40" height="65" fill="#1e2a3a" />
      <rect x="0" y="90" width="65" height="40" fill="#1e2a3a" />
      <rect x="255" y="90" width="65" height="40" fill="#1e2a3a" />
      <circle cx="160" cy="110" r="65" fill="#1e2a3a" />
      <circle cx="160" cy="110" r="38" fill="#f1f5f9" />
      <circle cx="160" cy="110" r="28" fill="#cbd5e1" />
      <circle cx="212.0" cy="110.0" r="2" fill="white" opacity="0.5" />
      <circle cx="205.0" cy="136.0" r="2" fill="white" opacity="0.5" />
      <circle cx="186.0" cy="155.0" r="2" fill="white" opacity="0.5" />
      <circle cx="160.0" cy="162.0" r="2" fill="white" opacity="0.5" />
      <circle cx="134.0" cy="155.0" r="2" fill="white" opacity="0.5" />
      <circle cx="115.0" cy="136.0" r="2" fill="white" opacity="0.5" />
      <circle cx="108.0" cy="110.0" r="2" fill="white" opacity="0.5" />
      <circle cx="115.0" cy="84.0" r="2" fill="white" opacity="0.5" />
      <circle cx="134.0" cy="65.0" r="2" fill="white" opacity="0.5" />
      <circle cx="160.0" cy="58.0" r="2" fill="white" opacity="0.5" />
      <circle cx="186.0" cy="65.0" r="2" fill="white" opacity="0.5" />
      <circle cx="205.0" cy="84.0" r="2" fill="white" opacity="0.5" />
      <rect
        x="140"
        y="152"
        width="40"
        height="3"
        fill="#fbbf24"
        opacity="0.8"
      />
      <rect x="88" y="103" width="32" height="18" rx="3" fill="#3b82f6" />
      <text
        x="104"
        y="116"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        B
      </text>
      <polygon points="97,100 94,92 104,96" fill="#93c5fd" />
      <rect x="148" y="157" width="24" height="34" rx="3" fill="#f59e0b" />
      <text
        x="160"
        y="178"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="bold"
      >
        A
      </text>
      <polygon points="160,153 156,145 164,145" fill="#fcd34d" />
      <circle cx="130" cy="148" r="16" fill="#ef444466" />
      <text
        x="160"
        y="200"
        textAnchor="middle"
        fill="#334155"
        fontSize="12"
        fontWeight="600"
      >
        A fails to give way on roundabout
      </text>
    </svg>
  );
}

function ReversingDiagram({ label }: DiagramProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto block"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <rect width="320" height="220" fill="#f1f5f9" rx="8" />
      <rect x="0" y="85" width="320" height="50" fill="#1e2a3a" />
      <rect x="0" y="40" width="320" height="45" fill="#94a3b8" opacity="0.3" />
      <rect
        x="0"
        y="135"
        width="320"
        height="45"
        fill="#94a3b8"
        opacity="0.3"
      />
      {[40, 80, 120, 160, 200, 240, 280].map((x) => (
        <rect
          key={x}
          x={x}
          y="40"
          width="2"
          height="45"
          fill="#64748b"
          opacity="0.4"
        />
      ))}
      {[0, 50, 100, 150, 200, 250].map((x) => (
        <rect
          key={x}
          x={x + 10}
          y="108"
          width="30"
          height="4"
          fill="white"
          opacity="0.6"
        />
      ))}
      <rect x="0" y="85" width="320" height="2" fill="white" opacity="0.3" />
      <rect x="0" y="133" width="320" height="2" fill="white" opacity="0.3" />
      <rect x="195" y="96" width="44" height="24" rx="4" fill="#3b82f6" />
      <text
        x="217"
        y="112"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        B
      </text>
      <rect x="80" y="96" width="44" height="24" rx="4" fill="#f59e0b" />
      <text
        x="102"
        y="112"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        A
      </text>
      <path
        d="M 128 108 L 190 108"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeDasharray="6,3"
      />
      <polygon points="190,108 180,104 180,112" fill="#ef4444" />
      <text
        x="160"
        y="102"
        textAnchor="middle"
        fill="#ef4444"
        fontSize="9"
        fontWeight="bold"
      >
        REVERSING
      </text>
      <rect
        x="80"
        y="96"
        width="6"
        height="24"
        rx="2"
        fill="#ef4444"
        opacity="0.8"
      />
      <circle cx="195" cy="108" r="16" fill="#ef444466" />
      <text
        x="160"
        y="170"
        textAnchor="middle"
        fill="#334155"
        fontSize="12"
        fontWeight="600"
      >
        A reverses into B
      </text>
      <text x="160" y="186" textAnchor="middle" fill="#64748b" fontSize="10">
        Failure to check surroundings — HC Rule 202
      </text>
    </svg>
  );
}

const scenarioLabels: Record<ScenarioKey, string> = {
  "rear-end": "Rear-end collision: Vehicle A strikes the back of Vehicle B",
  "red-light":
    "Red light violation: Vehicle A runs a red light and strikes Vehicle B",
  "lane-change": "Unsafe lane change: Vehicle A merges into Vehicle B's lane",
  turning: "Turning collision: Vehicle A turns across oncoming Vehicle B",
  junction:
    "Junction failure: Vehicle A fails to give way to Vehicle B on priority road",
  roundabout:
    "Roundabout collision: Vehicle A fails to give way to circulating Vehicle B",
  reversing: "Reversing collision: Vehicle A reverses into Vehicle B",
};

export default function CrashScenarioDiagram({
  scenarioKey,
}: { scenarioKey: ScenarioKey }) {
  const label = scenarioLabels[scenarioKey];

  const renderDiagram = () => {
    switch (scenarioKey) {
      case "rear-end":
        return <RearEndDiagram label={label} />;
      case "red-light":
        return <RedLightDiagram label={label} />;
      case "lane-change":
        return <LaneChangeDiagram label={label} />;
      case "turning":
        return <TurningDiagram label={label} />;
      case "junction":
        return <JunctionDiagram label={label} />;
      case "roundabout":
        return <RoundaboutDiagram label={label} />;
      case "reversing":
        return <ReversingDiagram label={label} />;
      default:
        return null;
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          Crash Scenario Diagram
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">{renderDiagram()}</div>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
            Vehicle A
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
            Vehicle B
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            Impact Zone
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
