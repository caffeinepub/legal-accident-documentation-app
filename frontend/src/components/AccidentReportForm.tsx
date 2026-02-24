import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateReport } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import PhotoUpload from './PhotoUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Car, Camera, MapPin, CloudRain, Loader2 } from 'lucide-react';

interface FormState {
  make: string;
  model: string;
  colour: string;
  licencePlate: string;
  vehiclePosition: string;
  vehicleSpeed: string;
  timestamp: string;
  stopLocation: string;
  accidentMarker: string;
  witnessStatement: string;
  damageDescription: string;
  weather: string;
  roadCondition: string;
  visibility: string;
}

const initialForm: FormState = {
  make: '',
  model: '',
  colour: '',
  licencePlate: '',
  vehiclePosition: '',
  vehicleSpeed: '0',
  timestamp: new Date().toISOString().slice(0, 16),
  stopLocation: '',
  accidentMarker: '',
  witnessStatement: '',
  damageDescription: '',
  weather: 'clear',
  roadCondition: 'dry',
  visibility: 'good',
};

export default function AccidentReportForm() {
  const navigate = useNavigate();
  const createReport = useCreateReport();
  const [form, setForm] = useState<FormState>(initialForm);
  const [photos, setPhotos] = useState<Array<{ blob: ExternalBlob; filename: string; contentType: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isVehicleInfoComplete =
    form.make.trim() !== '' &&
    form.model.trim() !== '' &&
    form.colour.trim() !== '' &&
    form.licencePlate.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isVehicleInfoComplete) {
      setError('Please fill in all vehicle information fields.');
      return;
    }

    try {
      const reportId = await createReport.mutateAsync({
        vehicleSpeed: parseInt(form.vehicleSpeed) || 0,
        witnessStatement: form.witnessStatement,
        damageDescription: form.damageDescription,
        stopLocation: form.stopLocation,
        accidentMarker: form.vehiclePosition
          ? `${form.accidentMarker} — My vehicle: ${form.vehiclePosition}`
          : form.accidentMarker,
        timestamp: new Date(form.timestamp).getTime(),
        photos,
        surroundings: {
          weather: form.weather,
          roadCondition: form.roadCondition,
          visibility: form.visibility,
        },
        vehicleInfo: {
          make: form.make,
          model: form.model,
          colour: form.colour,
          licencePlate: form.licencePlate,
        },
      });

      navigate({ to: '/reports/$reportId', params: { reportId: reportId.toString() } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create report. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="w-4 h-4 text-primary" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="make">Make <span className="text-destructive">*</span></Label>
            <Input
              id="make"
              placeholder="e.g. Toyota"
              value={form.make}
              onChange={e => handleChange('make', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="model">Model <span className="text-destructive">*</span></Label>
            <Input
              id="model"
              placeholder="e.g. Corolla"
              value={form.model}
              onChange={e => handleChange('model', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="colour">Colour <span className="text-destructive">*</span></Label>
            <Input
              id="colour"
              placeholder="e.g. Red"
              value={form.colour}
              onChange={e => handleChange('colour', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="licencePlate">Licence Plate <span className="text-destructive">*</span></Label>
            <Input
              id="licencePlate"
              placeholder="e.g. AB12 CDE"
              value={form.licencePlate}
              onChange={e => handleChange('licencePlate', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="w-4 h-4 text-primary" />
            Incident Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PhotoUpload onPhotosChange={setPhotos} maxPhotos={10} />
          <div className="space-y-1">
            <Label htmlFor="vehiclePosition">Your vehicle's position in the photo</Label>
            <Input
              id="vehiclePosition"
              placeholder="e.g. Red sedan on the left side of the photo"
              value={form.vehiclePosition}
              onChange={e => handleChange('vehiclePosition', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Incident Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4 text-primary" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="timestamp">Date &amp; Time</Label>
              <Input
                id="timestamp"
                type="datetime-local"
                value={form.timestamp}
                onChange={e => handleChange('timestamp', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="vehicleSpeed">Vehicle Speed (mph)</Label>
              <Input
                id="vehicleSpeed"
                type="number"
                min="0"
                placeholder="0"
                value={form.vehicleSpeed}
                onChange={e => handleChange('vehicleSpeed', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="stopLocation">Stop Location</Label>
            <Input
              id="stopLocation"
              placeholder="e.g. Junction of High Street and Park Road"
              value={form.stopLocation}
              onChange={e => handleChange('stopLocation', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="accidentMarker">Accident Description</Label>
            <Input
              id="accidentMarker"
              placeholder="e.g. Rear-end collision at traffic lights"
              value={form.accidentMarker}
              onChange={e => handleChange('accidentMarker', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="witnessStatement">Witness Statement</Label>
            <Textarea
              id="witnessStatement"
              placeholder="Describe what witnesses observed..."
              value={form.witnessStatement}
              onChange={e => handleChange('witnessStatement', e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="damageDescription">Damage Description</Label>
            <Textarea
              id="damageDescription"
              placeholder="Describe the damage to vehicles and property..."
              value={form.damageDescription}
              onChange={e => handleChange('damageDescription', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Surroundings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CloudRain className="w-4 h-4 text-primary" />
            Surroundings
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Weather</Label>
            <Select value={form.weather} onValueChange={v => handleChange('weather', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
                <SelectItem value="fog">Fog</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
                <SelectItem value="overcast">Overcast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Road Condition</Label>
            <Select value={form.roadCondition} onValueChange={v => handleChange('roadCondition', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry">Dry</SelectItem>
                <SelectItem value="wet">Wet</SelectItem>
                <SelectItem value="icy">Icy</SelectItem>
                <SelectItem value="flooded">Flooded</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Visibility</Label>
            <Select value={form.visibility} onValueChange={v => handleChange('visibility', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-md p-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <Separator />

      <Button
        type="submit"
        className="w-full"
        disabled={createReport.isPending || !isVehicleInfoComplete}
      >
        {createReport.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Report...
          </>
        ) : (
          'Create Report'
        )}
      </Button>
    </form>
  );
}
