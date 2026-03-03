import { useMemo } from "react";

export function useVelocityCalculation(distance: number, time: number) {
  const velocityMs = useMemo(() => {
    if (time === 0) return 0;
    return distance / time;
  }, [distance, time]);

  const velocityMph = useMemo(() => {
    return velocityMs * 2.23694;
  }, [velocityMs]);

  return { velocityMs, velocityMph };
}
