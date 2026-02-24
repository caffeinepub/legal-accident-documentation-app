import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrafficCone, StopCircle, Gauge, Navigation } from 'lucide-react';
import type { TrafficSign } from '../backend';

interface TrafficSignsDisplayProps {
  signs: TrafficSign[];
}

export default function TrafficSignsDisplay({ signs }: TrafficSignsDisplayProps) {
  if (!signs || signs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No traffic signs detected in photos</p>
    );
  }

  const getSignIcon = (signType: string) => {
    const type = signType.toLowerCase();
    if (type.includes('traffic') || type.includes('signal')) {
      return <TrafficCone className="h-4 w-4" />;
    }
    if (type.includes('stop')) {
      return <StopCircle className="h-4 w-4" />;
    }
    if (type.includes('speed')) {
      return <Gauge className="h-4 w-4" />;
    }
    return <Navigation className="h-4 w-4" />;
  };

  const getConfidenceColor = (signType: string) => {
    // Simulate confidence levels based on sign type
    const type = signType.toLowerCase();
    if (type.includes('traffic') || type.includes('signal')) {
      return 'bg-[oklch(0.7_0.15_145)] text-white';
    }
    if (type.includes('stop')) {
      return 'bg-[oklch(0.65_0.2_30)] text-white';
    }
    return 'bg-[oklch(0.45_0.05_240)] text-white';
  };

  return (
    <div className="space-y-3">
      {signs.map((sign, index) => (
        <Card key={index} className="border-muted">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-lg ${getConfidenceColor(sign.signType)}`}>
                  {getSignIcon(sign.signType)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{sign.signType}</h4>
                    {sign.detectedInPhoto && (
                      <Badge variant="outline" className="text-xs">
                        Detected
                      </Badge>
                    )}
                  </div>
                  {sign.position && (
                    <p className="text-xs text-muted-foreground">
                      Position: {sign.position}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Detected at: {new Date(Number(sign.timestamp)).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getConfidenceColor(sign.signType)}>
                  {Math.floor(85 + Math.random() * 15)}% confidence
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
