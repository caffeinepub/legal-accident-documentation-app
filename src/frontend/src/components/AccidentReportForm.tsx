import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, MapPin, Loader2, TrafficCone, MapPinned } from 'lucide-react';
import { useVelocityCalculation } from '../hooks/useVelocityCalculation';
import SpeedDisplay from './SpeedDisplay';
import PhotoUpload from './PhotoUpload';
import { useCreateReport } from '../hooks/useQueries';
import type { RoadType, ExternalBlob } from '../backend';

export default function AccidentReportForm() {
  const navigate = useNavigate();
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [roadCondition, setRoadCondition] = useState('');
  const [witnessStatement, setWitnessStatement] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [stopLocation, setStopLocation] = useState('');
  const [accidentMarker, setAccidentMarker] = useState('');
  const [roadType, setRoadType] = useState<'urban' | 'dualCarriageway' | 'motorway'>('urban');
  const [trafficLightColor, setTrafficLightColor] = useState<string>('not-applicable');
  const [photos, setPhotos] = useState<Array<{ blob: ExternalBlob; filename: string; contentType: string }>>([]);
  
  // GPS location fields (optional)
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
  // Timestamp field (defaults to current time)
  const [timestamp, setTimestamp] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  });

  const { velocityMs, velocityMph } = useVelocityCalculation(
    parseFloat(distance) || 0,
    parseFloat(time) || 0
  );

  const createReportMutation = useCreateReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!distance || !time || parseFloat(distance) <= 0 || parseFloat(time) <= 0) {
      alert('Please enter valid positive numbers for distance and time');
      return;
    }

    // Convert velocity to bigint (m/s * 100 to preserve 2 decimal places)
    const vehicleSpeedBigInt = BigInt(Math.round(velocityMph * 100));

    // Create RoadType object based on selection
    let roadTypeObj: RoadType;
    if (roadType === 'urban') {
      roadTypeObj = { __kind__: 'urban', urban: BigInt(30) };
    } else if (roadType === 'dualCarriageway') {
      roadTypeObj = { __kind__: 'dualCarriageway', dualCarriageway: BigInt(70) };
    } else {
      roadTypeObj = { __kind__: 'motorway', motorway: BigInt(70) };
    }

    // Format GPS location as 'lat,lng' if both provided, otherwise empty string
    let gpsLocation = '';
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        gpsLocation = `${lat},${lng}`;
      }
    }

    // Convert timestamp to bigint (milliseconds)
    const timestampBigInt = BigInt(new Date(timestamp).getTime());

    try {
      await createReportMutation.mutateAsync({
        vehicleSpeed: vehicleSpeedBigInt,
        roadCondition,
        witnessStatement,
        damageDescription,
        stopLocation,
        accidentMarker,
        timestamp: timestampBigInt,
        roadType: roadTypeObj,
        photos,
        trafficLightColor,
        gpsLocation,
      });

      navigate({ to: '/reports' });
    } catch (error) {
      console.error('Failed to create report:', error);
      alert('Failed to create report. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Velocity Measurements</CardTitle>
            <CardDescription>Enter observed distance and time to calculate vehicle speed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (meters)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 50"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time (seconds)</Label>
                <Input
                  id="time"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 2"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {distance && time && parseFloat(distance) > 0 && parseFloat(time) > 0 && (
              <div className="pt-4 border-t border-border">
                <SpeedDisplay velocityMs={velocityMs} velocityMph={velocityMph} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Road Information</CardTitle>
            <CardDescription>Specify road type and conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roadType">Road Type</Label>
              <Select value={roadType} onValueChange={(value: any) => setRoadType(value)}>
                <SelectTrigger id="roadType">
                  <SelectValue placeholder="Select road type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban (30 mph limit)</SelectItem>
                  <SelectItem value="dualCarriageway">Dual Carriageway (70 mph limit)</SelectItem>
                  <SelectItem value="motorway">Motorway (70 mph limit)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadCondition">Road Conditions</Label>
              <Input
                id="roadCondition"
                placeholder="e.g., Wet surface, poor visibility, foggy weather"
                value={roadCondition}
                onChange={(e) => setRoadCondition(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Describe weather, surface type, and visibility conditions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Markers</CardTitle>
            <CardDescription>Mark accident and stop locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accidentMarker" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Accident Location
              </Label>
              <Input
                id="accidentMarker"
                placeholder="e.g., Junction of High Street and Park Road"
                value={accidentMarker}
                onChange={(e) => setAccidentMarker(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLocation" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[oklch(0.7_0.15_145)]" />
                Stop Location
              </Label>
              <Input
                id="stopLocation"
                placeholder="e.g., 20 meters before traffic light"
                value={stopLocation}
                onChange={(e) => setStopLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trafficLightColor" className="flex items-center gap-2">
                <TrafficCone className="h-4 w-4 text-[oklch(0.65_0.2_30)]" />
                Traffic Light Color at Time of Accident
              </Label>
              <Select value={trafficLightColor} onValueChange={setTrafficLightColor}>
                <SelectTrigger id="trafficLightColor">
                  <SelectValue placeholder="Select traffic light color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="yellow">Yellow/Amber</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                What color was the traffic light when the accident occurred?
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GPS Location & Timestamp</CardTitle>
            <CardDescription>Optional GPS coordinates and incident timestamp for enhanced violation detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-muted-foreground" />
                  Latitude (Optional)
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 51.5074"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-muted-foreground" />
                  Longitude (Optional)
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g., -0.1278"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timestamp">Incident Timestamp</Label>
              <Input
                id="timestamp"
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Date and time when the accident occurred
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accident Scene Photos</CardTitle>
            <CardDescription>Upload photos for AI analysis of damage, road conditions, and vehicle positions</CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoUpload onPhotosChange={setPhotos} maxPhotos={10} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>Provide witness statements and damage descriptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="witnessStatement">Witness Statement</Label>
              <Textarea
                id="witnessStatement"
                placeholder="Enter detailed witness account of the accident..."
                rows={4}
                value={witnessStatement}
                onChange={(e) => setWitnessStatement(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="damageDescription">Damage Description</Label>
              <Textarea
                id="damageDescription"
                placeholder="Describe vehicle damage, impact points, and severity..."
                rows={4}
                value={damageDescription}
                onChange={(e) => setDamageDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/reports' })}
            disabled={createReportMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createReportMutation.isPending}>
            {createReportMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Report & Analyze
          </Button>
        </div>
      </div>
    </form>
  );
}
