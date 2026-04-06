import React from "react";

export default function ProBadge() {
  return (
    <span
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.78 0.18 85) 0%, oklch(0.72 0.20 60) 100%)",
        color: "oklch(0.20 0.05 60)",
      }}
    >
      PRO
    </span>
  );
}
