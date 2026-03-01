import React, { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateReport } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import type { OtherVehicle, Witness } from '../backend';
import PhotoUpload from './PhotoUpload';
import InjuryAnalysisPanel from './InjuryAnalysisPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  Car,
  Camera,
  MapPin,
  CloudRain,
  Loader2,
  Users,
  Plus,
  Trash2,
  Video,
  X,
  ShieldCheck,
} from 'lucide-react';

interface FormState {
  make: string;
  model: string;
  colour: string;
  licencePlate: string;
  year: string;
  mot: string;
  registration: string;
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

interface OtherVehicleForm {
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  insurer: string;
  insurancePolicyNumber: string;
  claimReference: string;
  make: string;
  model: string;
  year: string;
  colour: string;
  licencePlate: string;
  mot: string;
  registration: string;
}

interface WitnessForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  statement: string;
}

const initialForm: FormState = {
  make: '',
  model: '',
  colour: '',
  licencePlate: '',
  year: '',
  mot: '',
  registration: '',
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

const emptyOtherVehicle: OtherVehicleForm = {
  ownerName: '',
  phone: '',
  email: '',
  address: '',
  insurer: '',
  insurancePolicyNumber: '',
  claimReference: '',
  make: '',
  model: '',
  year: '',
  colour: '',
  licencePlate: '',
  mot: '',
  registration: '',
};

const emptyWitness = (): WitnessForm => ({
  name: '',
  phone: '',
  email: '',
  address: '',
  statement: '',
});

interface VideoFile {
  file: File;
  blob: ExternalBlob;
}

// Temporary reportId placeholder for new reports (InjuryAnalysisPanel needs a bigint)
// We use 0n as a sentinel; the panel will be used in "new report" context
const NEW_REPORT_SENTINEL = 0n;

export default function AccidentReportForm() {
  const navigate = useNavigate();
  const createReport = useCreateReport();
  const [form, setForm] = useState<FormState>(initialForm);
  const [photos, setPhotos] = useState<Array<{ blob: ExternalBlob; filename: string; contentType: string }>>([]);
  const [otherVehicle, setOtherVehicle] = useState<OtherVehicleForm>(emptyOtherVehicle);
  const [hasOtherVehicle, setHasOtherVehicle] = useState(false);
  const [witnesses, setWitnesses] = useState<WitnessForm[]>([]);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOtherVehicleChange = (field: keyof OtherVehicleForm, value: string) => {
    setOtherVehicle((prev) => ({ ...prev, [field]: value }));
  };

  const handleWitnessChange = (index: number, field: keyof WitnessForm, value: string) => {
    setWitnesses((prev) => prev.map((w, i) => (i === index ? { ...w, [field]: value } : w)));
  };

  const addWitness = () => setWitnesses((prev) => [...prev, emptyWitness()]);

  const removeWitness = (index: number) =>
    setWitnesses((prev) => prev.filter((_, i) => i !== index));

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const newVideos: VideoFile[] = await Promise.all(
      files.map(async (file) => {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        return { file, blob };
      })
    );
    setVideos((prev) => [...prev, ...newVideos]);
    // Reset input so same file can be re-selected
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const removeVideo = (index: number) =>
    setVideos((prev) => prev.filter((_, i) => i !== index));

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
      const otherVehiclePayload: OtherVehicle | null = hasOtherVehicle
        ? {
            ownerName: otherVehicle.ownerName,
            phone: otherVehicle.phone,
            email: otherVehicle.email,
            insurer: otherVehicle.insurer,
            insurancePolicyNumber: otherVehicle.insurancePolicyNumber,
            claimReference: otherVehicle.claimReference,
            make: otherVehicle.make,
            model: otherVehicle.model,
            year: BigInt(parseInt(otherVehicle.year) || 0),
            colour: otherVehicle.colour,
            licencePlate: otherVehicle.licencePlate,
            mot: otherVehicle.mot,
            registration: otherVehicle.registration,
          }
        : null;

      const witnessPayload: Witness[] = witnesses.map((w) => ({
        name: w.name,
        phone: w.phone,
        email: w.email,
        address: w.address,
        statement: w.statement,
      }));

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
          year: BigInt(parseInt(form.year) || 0),
          mot: form.mot,
          registration: form.registration,
        },
        otherVehicle: otherVehiclePayload,
        witnesses: witnessPayload,
        videoFiles: videos.map((v) => v.blob),
      });

      navigate({ to: '/reports/$reportId', params: { reportId: reportId.toString() } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create report. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">

      {/* Injury & Damage Photo Analysis — prominent at top */}
      <InjuryAnalysisPanel reportId={NEW_REPORT_SENTINEL} />

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="w-4 h-4 text-primary" />
            My Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="make">
              Make <span className="text-destructive">*</span>
            </Label>
            <Input
              id="make"
              placeholder="e.g. Toyota"
              value={form.make}
              onChange={(e) => handleChange('make', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="model">
              Model <span className="text-destructive">*</span>
            </Label>
            <Input
              id="model"
              placeholder="e.g. Corolla"
              value={form.model}
              onChange={(e) => handleChange('model', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="colour">
              Colour <span className="text-destructive">*</span>
            </Label>
            <Input
              id="colour"
              placeholder="e.g. Red"
              value={form.colour}
              onChange={(e) => handleChange('colour', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="licencePlate">
              Licence Plate <span className="text-destructive">*</span>
            </Label>
            <Input
              id="licencePlate"
              placeholder="e.g. AB12 CDE"
              value={form.licencePlate}
              onChange={(e) => handleChange('licencePlate', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              placeholder="e.g. 2020"
              value={form.year}
              onChange={(e) => handleChange('year', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="registration">Registration</Label>
            <Input
              id="registration"
              placeholder="e.g. AB12CDE"
              value={form.registration}
              onChange={(e) => handleChange('registration', e.target.value)}
            />
          </div>
          <div className="space-y-1 col-span-2">
            <Label htmlFor="mot">MOT Expiry</Label>
            <Input
              id="mot"
              placeholder="e.g. 01/06/2026"
              value={form.mot}
              onChange={(e) => handleChange('mot', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Other Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="w-4 h-4 text-amber-500" />
            Other Vehicle Involved
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasOtherVehicle"
              checked={hasOtherVehicle}
              onChange={(e) => setHasOtherVehicle(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <Label htmlFor="hasOtherVehicle" className="cursor-pointer">
              Another vehicle was involved in this incident
            </Label>
          </div>

          {hasOtherVehicle && (
            <div className="space-y-4 pt-2">
              {/* Driver Contact Details */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Driver Contact Details
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="ov-ownerName">Full Name</Label>
                    <Input
                      id="ov-ownerName"
                      placeholder="e.g. Jane Smith"
                      value={otherVehicle.ownerName}
                      onChange={(e) => handleOtherVehicleChange('ownerName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ov-phone">Phone Number</Label>
                    <Input
                      id="ov-phone"
                      placeholder="e.g. 07700 900000"
                      value={otherVehicle.phone}
                      onChange={(e) => handleOtherVehicleChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ov-email">Email</Label>
                    <Input
                      id="ov-email"
                      type="email"
                      placeholder="e.g. jane@example.com"
                      value={otherVehicle.email}
                      onChange={(e) => handleOtherVehicleChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="ov-address">Address</Label>
                    <Input
                      id="ov-address"
                      placeholder="e.g. 12 High Street, London"
                      value={otherVehicle.address}
                      onChange={(e) => handleOtherVehicleChange('address', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Insurance Information */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Insurance Information
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="ov-insurer">Insurer Name</Label>
                    <Input
                      id="ov-insurer"
                      placeholder="e.g. Admiral Insurance"
                      value={otherVehicle.insurer}
                      onChange={(e) => handleOtherVehicleChange('insurer', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ov-policyNumber">Policy Number</Label>
                    <Input
                      id="ov-policyNumber"
                      placeholder="e.g. POL-123456"
                      value={otherVehicle.insurancePolicyNumber}
                      onChange={(e) => handleOtherVehicleChange('insurancePolicyNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ov-claimRef">Claim Reference</Label>
                    <Input
                      id="ov-claimRef"
                      placeholder="e.g. CLM-789012"
                      value={otherVehicle.claimReference}
                      onChange={(e) => handleOtherVehicleChange('claimReference', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Vehicle Details */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Vehicle Details
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="ov-make">Make</Label>
                    <Input
                      id="ov-make"
                      placeholder="e.g. Ford"
                      value={otherVehicle.make}
                      onChange={(e) => handleOtherVehicleChange('make', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ov-model">Model</Label>
                    <Input
                      id="ov-model"
                      placeholder="e.g. Focus"
                      value={otherVehicle.model}
                      onChange={(e) => handleOtherVehicleChange('model', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ov-year">Year</Label>
                    <Input
                      id="ov-year"
                      type="number"
                      placeholder="e.g. 2019"
                      value={otherVehicle.year}
                      onChange={(e) => handleOtherVehicleChange('year', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ov-colour">Colour</Label>
                    <Input
                      id="ov-colour"
                      placeholder="e.g. Blue"
                      value={otherVehicle.colour}
                      onChange={(e) => handleOtherVehicleChange('colour', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ov-licencePlate">Licence Plate</Label>
                    <Input
                      id="ov-licencePlate"
                      placeholder="e.g. XY21 ZAB"
                      value={otherVehicle.licencePlate}
                      onChange={(e) => handleOtherVehicleChange('licencePlate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ov-registration">Registration</Label>
                    <Input
                      id="ov-registration"
                      placeholder="e.g. XY21ZAB"
                      value={otherVehicle.registration}
                      onChange={(e) => handleOtherVehicleChange('registration', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="ov-mot">MOT Expiry</Label>
                    <Input
                      id="ov-mot"
                      placeholder="e.g. 01/06/2026"
                      value={otherVehicle.mot}
                      onChange={(e) => handleOtherVehicleChange('mot', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <Label htmlFor="vehiclePosition">Your vehicle's position</Label>
            <Input
              id="vehiclePosition"
              placeholder="e.g. Stationary at junction, moving at 30mph"
              value={form.vehiclePosition}
              onChange={(e) => handleChange('vehiclePosition', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Video Evidence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Video className="w-4 h-4 text-primary" />
            Video Evidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload any relevant video footage (dashcam, CCTV, phone recordings, etc.).
          </p>
          <div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
              multiple
              className="hidden"
              onChange={handleVideoSelect}
              id="video-upload-input"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              className="w-full border-dashed"
            >
              <Video className="w-4 h-4 mr-2" />
              Select Video Files
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Accepted formats: MP4, MOV, AVI, WebM
            </p>
          </div>

          {videos.length > 0 && (
            <div className="space-y-2">
              {videos.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md border border-border"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Video className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{v.file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      ({(v.file.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeVideo(i)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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
              <Label htmlFor="vehicleSpeed">Vehicle Speed (mph)</Label>
              <Input
                id="vehicleSpeed"
                type="number"
                min="0"
                max="200"
                placeholder="0"
                value={form.vehicleSpeed}
                onChange={(e) => handleChange('vehicleSpeed', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="timestamp">Date &amp; Time</Label>
              <Input
                id="timestamp"
                type="datetime-local"
                value={form.timestamp}
                onChange={(e) => handleChange('timestamp', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="stopLocation">Stop Location</Label>
            <Input
              id="stopLocation"
              placeholder="e.g. Junction of High Street and Mill Road"
              value={form.stopLocation}
              onChange={(e) => handleChange('stopLocation', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="accidentMarker">Accident Description</Label>
            <Textarea
              id="accidentMarker"
              placeholder="Describe what happened, including the sequence of events..."
              value={form.accidentMarker}
              onChange={(e) => handleChange('accidentMarker', e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          <div className="space-y-1">
            <Label htmlFor="damageDescription">Damage Description</Label>
            <Textarea
              id="damageDescription"
              placeholder="Describe the damage to your vehicle and any other vehicles involved..."
              value={form.damageDescription}
              onChange={(e) => handleChange('damageDescription', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="witnessStatement">General Witness Statement</Label>
            <Textarea
              id="witnessStatement"
              placeholder="Include any general witness accounts or statements..."
              value={form.witnessStatement}
              onChange={(e) => handleChange('witnessStatement', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Witnesses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4 text-primary" />
            Witnesses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add details for any witnesses to the incident.
          </p>

          {witnesses.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No witnesses added yet.</p>
          )}

          {witnesses.map((witness, index) => (
            <div key={index} className="space-y-3 p-4 border border-border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Witness {index + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeWitness(index)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <Label htmlFor={`witness-name-${index}`}>Full Name</Label>
                  <Input
                    id={`witness-name-${index}`}
                    placeholder="e.g. John Doe"
                    value={witness.name}
                    onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`witness-phone-${index}`}>Phone Number</Label>
                  <Input
                    id={`witness-phone-${index}`}
                    placeholder="e.g. 07700 900000"
                    value={witness.phone}
                    onChange={(e) => handleWitnessChange(index, 'phone', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`witness-email-${index}`}>Email</Label>
                  <Input
                    id={`witness-email-${index}`}
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={witness.email}
                    onChange={(e) => handleWitnessChange(index, 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor={`witness-address-${index}`}>Address</Label>
                  <Input
                    id={`witness-address-${index}`}
                    placeholder="e.g. 5 Oak Avenue, Manchester"
                    value={witness.address}
                    onChange={(e) => handleWitnessChange(index, 'address', e.target.value)}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor={`witness-statement-${index}`}>Statement</Label>
                  <Textarea
                    id={`witness-statement-${index}`}
                    placeholder="What did this witness see or hear?"
                    value={witness.statement}
                    onChange={(e) => handleWitnessChange(index, 'statement', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addWitness}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Witness
          </Button>
        </CardContent>
      </Card>

      {/* Surroundings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CloudRain className="w-4 h-4 text-primary" />
            Conditions at Time of Incident
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="weather">Weather</Label>
            <Select value={form.weather} onValueChange={(v) => handleChange('weather', v)}>
              <SelectTrigger id="weather">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
                <SelectItem value="fog">Fog</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
                <SelectItem value="ice">Ice</SelectItem>
                <SelectItem value="wind">High Wind</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="roadCondition">Road Condition</Label>
            <Select value={form.roadCondition} onValueChange={(v) => handleChange('roadCondition', v)}>
              <SelectTrigger id="roadCondition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry">Dry</SelectItem>
                <SelectItem value="wet">Wet</SelectItem>
                <SelectItem value="icy">Icy</SelectItem>
                <SelectItem value="flooded">Flooded</SelectItem>
                <SelectItem value="gravel">Gravel / Loose</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={form.visibility} onValueChange={(v) => handleChange('visibility', v)}>
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="very_poor">Very Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        disabled={createReport.isPending || !isVehicleInfoComplete}
      >
        {createReport.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Report…
          </>
        ) : (
          'Create Accident Report'
        )}
      </Button>
    </form>
  );
}
