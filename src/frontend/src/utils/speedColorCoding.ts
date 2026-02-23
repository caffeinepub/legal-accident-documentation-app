export function getSpeedColor(speedMph: number): string {
  if (speedMph > 70) {
    return 'border-destructive bg-destructive/10 text-destructive';
  } else if (speedMph > 30) {
    return 'border-[oklch(0.75_0.15_85)] bg-[oklch(0.75_0.15_85)]/10 text-[oklch(0.55_0.15_85)]';
  } else {
    return 'border-[oklch(0.7_0.15_145)] bg-[oklch(0.7_0.15_145)]/10 text-[oklch(0.5_0.15_145)]';
  }
}

export function getSpeedLabel(speedMph: number): string {
  if (speedMph > 70) {
    return 'High Speed - Above 70 mph';
  } else if (speedMph > 30) {
    return 'Medium Speed - 31-70 mph';
  } else {
    return 'Low Speed - 0-30 mph';
  }
}
