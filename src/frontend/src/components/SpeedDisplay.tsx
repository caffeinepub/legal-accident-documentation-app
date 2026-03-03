import { getSpeedColor, getSpeedLabel } from "../utils/speedColorCoding";

interface SpeedDisplayProps {
  velocityMs: number;
  velocityMph: number;
}

export default function SpeedDisplay({
  velocityMs,
  velocityMph,
}: SpeedDisplayProps) {
  const colorClass = getSpeedColor(velocityMph);
  const label = getSpeedLabel(velocityMph);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        Calculated Velocity
      </h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`flex-1 p-4 rounded-lg border-2 ${colorClass}`}>
          <div className="text-sm text-muted-foreground mb-1">
            Meters per Second
          </div>
          <div className="text-3xl font-bold">{velocityMs.toFixed(2)} m/s</div>
        </div>
        <div className={`flex-1 p-4 rounded-lg border-2 ${colorClass}`}>
          <div className="text-sm text-muted-foreground mb-1">
            Miles per Hour
          </div>
          <div className="text-3xl font-bold">{velocityMph.toFixed(2)} mph</div>
        </div>
      </div>
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
      >
        {label}
      </div>
    </div>
  );
}
