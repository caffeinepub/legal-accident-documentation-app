import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Bike,
  Car,
  ChevronDown,
  ChevronUp,
  Truck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export type VehicleType =
  | "car"
  | "motorbike"
  | "truck"
  | "van"
  | "bus"
  | "bicycle"
  | "pedestrian"
  | "third_party_object";

export interface AdditionalParty {
  id: string;
  vehicleType: VehicleType;
  make: string;
  model: string;
  colour: string;
  licencePlate: string;
  year: string;
  mot: string;
  ownerName: string;
  email: string;
  phone: string;
  insurer: string;
  policyNumber: string;
  claimRef: string;
  description: string;
}

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: "Car",
  motorbike: "Motorbike",
  truck: "Truck / HGV",
  van: "Van",
  bus: "Bus",
  bicycle: "Bicycle",
  pedestrian: "Pedestrian",
  third_party_object: "Third-Party Object",
};

const VULNERABLE_TYPES: VehicleType[] = ["bicycle", "pedestrian", "motorbike"];

function getVehicleIcon(type: VehicleType) {
  switch (type) {
    case "bicycle":
      return <Bike size={14} />;
    case "pedestrian":
      return <User size={14} />;
    case "truck":
    case "van":
    case "bus":
      return <Truck size={14} />;
    default:
      return <Car size={14} />;
  }
}

function isNonVehicleType(type: VehicleType): boolean {
  return type === "pedestrian" || type === "third_party_object";
}

interface PartyVehicleCardProps {
  party: AdditionalParty;
  index: number;
  onChange: (updated: AdditionalParty) => void;
  onRemove: () => void;
}

export default function PartyVehicleCard({
  party,
  index,
  onChange,
  onRemove,
}: PartyVehicleCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useLanguage();

  const label = `Party ${String.fromCharCode(66 + index)}`; // B, C, D…
  const isVulnerable = VULNERABLE_TYPES.includes(party.vehicleType);
  const isNonVehicle = isNonVehicleType(party.vehicleType);

  const update = (field: keyof AdditionalParty, value: string) => {
    onChange({ ...party, [field]: value });
  };

  const handleVehicleTypeChange = (value: string) => {
    onChange({ ...party, vehicleType: value as VehicleType });
  };

  // Deterministic ocid index (1-based)
  const ocidIndex = index + 1;

  return (
    <Card
      className="border border-border bg-card"
      data-ocid={`party.card.${ocidIndex}`}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between gap-2">
          {/* Left: toggle + labels */}
          <button
            type="button"
            className="flex items-center gap-2 flex-1 text-left group min-w-0"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-label={`Toggle ${label} details`}
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {label}
            </span>
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs shrink-0"
            >
              {getVehicleIcon(party.vehicleType)}
              {VEHICLE_TYPE_LABELS[party.vehicleType]}
            </Badge>
            {isVulnerable && (
              <Badge className="text-xs bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 shrink-0 hidden sm:flex items-center gap-1">
                <AlertTriangle size={10} />
                Vulnerable Road User
              </Badge>
            )}
          </button>

          {/* Remove button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
            data-ocid={`party.remove_button.${ocidIndex}`}
          >
            <X size={14} />
          </Button>
        </div>

        {/* Vulnerable road user notice — shown below header when open */}
        {isVulnerable && isOpen && (
          <div className="mt-2 flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 dark:bg-amber-900/15 dark:border-amber-700/50">
            <AlertTriangle
              size={14}
              className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
            />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Vulnerable road user</strong> — Highway Code Rules 211–215
              apply. Courts typically apply a higher standard of protection to
              cyclists, pedestrians, and motorcyclists.
            </p>
          </div>
        )}
      </CardHeader>

      {isOpen && (
        <CardContent className="px-4 pb-4 space-y-4">
          {/* Vehicle type selector */}
          <div className="space-y-1">
            <Label htmlFor={`party-type-${party.id}`}>
              Vehicle / Party Type
            </Label>
            <Select
              value={party.vehicleType}
              onValueChange={handleVehicleTypeChange}
            >
              <SelectTrigger
                id={`party-type-${party.id}`}
                data-ocid={`party.select.${ocidIndex}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="motorbike">Motorbike</SelectItem>
                <SelectItem value="truck">Truck / HGV</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="bicycle">Bicycle</SelectItem>
                <SelectItem value="pedestrian">Pedestrian</SelectItem>
                <SelectItem value="third_party_object">
                  Third-Party Object
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle fields — hidden for pedestrian / third_party_object */}
          {!isNonVehicle ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <Label htmlFor={`party-make-${party.id}`}>
                  {t("vehicle.make_model")}
                </Label>
                <Input
                  id={`party-make-${party.id}`}
                  value={party.make}
                  onChange={(e) => update("make", e.target.value)}
                  placeholder="e.g. Toyota Corolla"
                  data-ocid={`party.input.${ocidIndex}`}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`party-colour-${party.id}`}>
                  {t("vehicle.colour")}
                </Label>
                <Input
                  id={`party-colour-${party.id}`}
                  value={party.colour}
                  onChange={(e) => update("colour", e.target.value)}
                  placeholder="e.g. Red"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`party-plate-${party.id}`}>
                  {t("vehicle.licence_plate")}
                </Label>
                <Input
                  id={`party-plate-${party.id}`}
                  value={party.licencePlate}
                  onChange={(e) => update("licencePlate", e.target.value)}
                  placeholder="e.g. XY34 ZAB"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`party-year-${party.id}`}>Year</Label>
                <Input
                  id={`party-year-${party.id}`}
                  type="number"
                  value={party.year}
                  onChange={(e) => update("year", e.target.value)}
                  placeholder="e.g. 2020"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`party-mot-${party.id}`}>MOT Expiry</Label>
                <Input
                  id={`party-mot-${party.id}`}
                  value={party.mot}
                  onChange={(e) => update("mot", e.target.value)}
                  placeholder="e.g. 2025-06-01"
                />
              </div>
            </div>
          ) : (
            /* Description field for pedestrian / third-party object */
            <div className="space-y-1">
              <Label htmlFor={`party-desc-${party.id}`}>
                {party.vehicleType === "pedestrian"
                  ? "Pedestrian Description"
                  : "Object Description"}
              </Label>
              <Textarea
                id={`party-desc-${party.id}`}
                value={party.description}
                onChange={(e) => update("description", e.target.value)}
                rows={2}
                placeholder={
                  party.vehicleType === "pedestrian"
                    ? "e.g. Adult male, approximately 40 years, crossing at junction"
                    : "e.g. Parked lorry, street lamp, road barrier"
                }
                data-ocid={`party.textarea.${ocidIndex}`}
              />
            </div>
          )}

          {/* Contact / insurance fields */}
          <div className="border-t border-border pt-3 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Driver / Party Contact & Insurance
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <Label htmlFor={`party-name-${party.id}`}>
                  {party.vehicleType === "pedestrian"
                    ? "Full Name"
                    : "Driver / Owner Name"}
                </Label>
                <Input
                  id={`party-name-${party.id}`}
                  value={party.ownerName}
                  onChange={(e) => update("ownerName", e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <Label htmlFor={`party-email-${party.id}`}>Email</Label>
                <Input
                  id={`party-email-${party.id}`}
                  type="email"
                  value={party.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`party-phone-${party.id}`}>Phone</Label>
                <Input
                  id={`party-phone-${party.id}`}
                  value={party.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+44 7700 000000"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`party-insurer-${party.id}`}>Insurer</Label>
                <Input
                  id={`party-insurer-${party.id}`}
                  value={party.insurer}
                  onChange={(e) => update("insurer", e.target.value)}
                  placeholder="Insurance company"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`party-policy-${party.id}`}>
                  Policy Number
                </Label>
                <Input
                  id={`party-policy-${party.id}`}
                  value={party.policyNumber}
                  onChange={(e) => update("policyNumber", e.target.value)}
                  placeholder="Policy number"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`party-claim-${party.id}`}>
                  Claim Reference
                </Label>
                <Input
                  id={`party-claim-${party.id}`}
                  value={party.claimRef}
                  onChange={(e) => update("claimRef", e.target.value)}
                  placeholder="Claim reference"
                />
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
