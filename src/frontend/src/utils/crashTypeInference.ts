import type { ScenarioKey } from "../data/scenarioReferences";

/** Map text keywords to a ScenarioKey */
export function inferCrashTypeFromText(text: string): ScenarioKey | null {
  const lower = text.toLowerCase();

  // Reversing first (specific)
  if (/\brevers(e|ing|ed)\b|\bbacking\b/.test(lower)) return "reversing";

  // Roundabout
  if (/\broundabout\b|\bisland\b/.test(lower)) return "roundabout";

  // Red light
  if (/\bred light\b|\btraffic light\b|\btraffic signal\b/.test(lower))
    return "red-light";

  // Lane change / merge
  if (
    /\blane[ -]change\b|\bmerging\b|\bmerge\b|\bovertake\b|\bovertaking\b/.test(
      lower,
    )
  )
    return "lane-change";

  // Head-on — map to "turning" (frontal collision context)
  if (/\bhead[ -]on\b|\boncoming\b|\bfrontal\b/.test(lower)) return "turning";

  // Side / T-bone / junction
  if (/\bt-bone\b|\bbroadside\b|\bside impact\b|\bside collision\b/.test(lower))
    return "junction";

  // Junction (separate from T-bone)
  if (/\bjunction\b|\bgive way\b|\bemerg(e|ing)\b|\bpull out\b/.test(lower))
    return "junction";

  // Rear-end
  if (
    /\brear[ -]end\b|\bbehind\b|\bstruck from behind\b|\bfollowing vehicle\b/.test(
      lower,
    )
  )
    return "rear-end";

  // Generic "rear" or "back"
  if (/\brear\b|\bback of\b/.test(lower)) return "rear-end";

  // Turning
  if (/\bturning\b|\bturn(ed)?\b|\bright turn\b|\bleft turn\b/.test(lower))
    return "turning";

  return null;
}

/** Low-confidence when description mentions uncertainty OR no crash type found */
export function isLowConfidence(text: string): boolean {
  const lower = text.toLowerCase();
  const uncertaintyKeywords = [
    "unclear",
    "cannot determine",
    "could not determine",
    "multiple",
    "uncertain",
    "possible",
    "may have",
    "difficult to assess",
    "not clear",
    "insufficient",
    "unable to",
    "ambiguous",
    "inconclusive",
  ];
  const hasUncertainty = uncertaintyKeywords.some((kw) => lower.includes(kw));
  const hasType = inferCrashTypeFromText(text) !== null;
  return hasUncertainty || !hasType;
}

/** Human-readable label for a ScenarioKey */
export const scenarioLabel: Record<ScenarioKey, string> = {
  "rear-end": "Rear-End Collision",
  "red-light": "Red Light Violation",
  "lane-change": "Lane Change Collision",
  turning: "Turning / Head-On Collision",
  junction: "Junction / T-Bone / Side Impact",
  roundabout: "Roundabout Collision",
  reversing: "Reversing Collision",
};

/** Default description template per scenario */
export const scenarioDefaultDescription: Record<ScenarioKey, string> = {
  "rear-end":
    "Rear-End Collision — Vehicle A struck Vehicle B from behind while Vehicle B was stationary or moving in the same direction.",
  "red-light":
    "Red Light Violation — Vehicle A proceeded through a red traffic signal and collided with Vehicle B.",
  "lane-change":
    "Lane Change Collision — Vehicle A changed lanes unsafely and collided with Vehicle B travelling in the adjacent lane.",
  turning:
    "Turning / Frontal Collision — Vehicle A turned across the path of oncoming Vehicle B without adequate clearance.",
  junction:
    "Junction / Side Impact Collision — Vehicle A failed to give way at a junction and collided broadside with Vehicle B.",
  roundabout:
    "Roundabout Collision — Vehicle A entered the roundabout without giving way to Vehicle B already circulating.",
  reversing:
    "Reversing Collision — Vehicle A reversed into Vehicle B without adequate observation of surrounding traffic.",
};
