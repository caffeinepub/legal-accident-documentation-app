import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bike,
  Calendar,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Gauge,
  Mail,
  Pencil,
  Phone,
  Plus,
  Shield,
  Trash2,
  Truck,
  User,
  Users,
  Wrench,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useGetAllReports } from "../hooks/useQueries";
import { formatClaimId } from "../utils/claimId";

// ── Storage keys ────────────────────────────────────────────────────────────
const FLEET_VEHICLES_KEY = "fleet_vehicles";
const FLEET_DRIVERS_KEY = "fleet_drivers";

// ── Data models ──────────────────────────────────────────────────────────────
interface FleetVehicle {
  id: string;
  alias: string;
  registration: string;
  vehicleType: "car" | "van" | "truck" | "motorbike";
  make: string;
  model: string;
  year: string;
  colour: string;
  mileage: string;
  assignedDriverId: string;
  motDue: string;
  insuranceExpiry: string;
  lastService: string;
  nextServiceDue: string;
  tyreStatus: "OK" | "Due" | "Overdue";
  maintenanceNotes: string;
  status: "Active" | "Inactive" | "Off-road" | "Under Repair";
}

interface FleetDriver {
  id: string;
  fullName: string;
  licenceNumber: string;
  licenceExpiry: string;
  phone: string;
  email: string;
  notes: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function normaliseReg(reg: string): string {
  return reg.replace(/\s/g, "").toUpperCase();
}

function loadFromStorage<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function friendlyDays(days: number | null): string {
  if (days === null) return "—";
  if (days < 0)
    return `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""}`;
  if (days === 0) return "Due today";
  return `${days} day${days !== 1 ? "s" : ""}`;
}

type AlertLevel = "ok" | "warning" | "urgent";

function getAlertLevel(days: number | null): AlertLevel {
  if (days === null) return "ok";
  if (days < 14) return "urgent";
  if (days <= 30) return "warning";
  return "ok";
}

function alertLevelForVehicle(v: FleetVehicle): AlertLevel {
  const levels: AlertLevel[] = [
    getAlertLevel(daysUntil(v.motDue)),
    getAlertLevel(daysUntil(v.insuranceExpiry)),
    getAlertLevel(daysUntil(v.nextServiceDue)),
  ];
  if (v.tyreStatus === "Overdue") levels.push("urgent");
  else if (v.tyreStatus === "Due") levels.push("warning");
  if (levels.includes("urgent")) return "urgent";
  if (levels.includes("warning")) return "warning";
  return "ok";
}

function alertLevelOrder(l: AlertLevel): number {
  if (l === "urgent") return 0;
  if (l === "warning") return 1;
  return 2;
}

type RiskLevel = {
  label: "Low" | "Medium" | "High";
  color: "green" | "amber" | "red";
};

function getRiskLevel(incidentCount: number): RiskLevel {
  if (incidentCount === 0) return { label: "Low", color: "green" };
  if (incidentCount === 1) return { label: "Medium", color: "amber" };
  return { label: "High", color: "red" };
}

function VehicleTypeIcon({
  type,
  className,
}: { type: FleetVehicle["vehicleType"]; className?: string }) {
  if (type === "motorbike") return <Bike className={className} />;
  if (type === "truck" || type === "van")
    return <Truck className={className} />;
  return <Car className={className} />;
}

function AlertBadge({ days, label }: { days: number | null; label: string }) {
  const level = getAlertLevel(days);
  const text = friendlyDays(days);
  if (level === "urgent") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded px-2 py-0.5">
        <AlertTriangle className="w-3 h-3" />
        {label}: {text}
      </span>
    );
  }
  if (level === "warning") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
        <Clock className="w-3 h-3" />
        {label}: {text}
      </span>
    );
  }
  if (days !== null) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
        <CheckCircle2 className="w-3 h-3" />
        {label}: {text}
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">{label}: —</span>;
}

function RiskBadge({ level }: { level: RiskLevel }) {
  if (level.color === "red") {
    return (
      <Badge className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-100">
        {level.label} Risk
      </Badge>
    );
  }
  if (level.color === "amber") {
    return (
      <Badge className="bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-100">
        {level.label} Risk
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-700 border border-green-200 hover:bg-green-100">
      {level.label} Risk
    </Badge>
  );
}

function TyreBadge({ status }: { status: FleetVehicle["tyreStatus"] }) {
  if (status === "Overdue")
    return (
      <Badge className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-100">
        Tyres: Overdue
      </Badge>
    );
  if (status === "Due")
    return (
      <Badge className="bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-100">
        Tyres: Due
      </Badge>
    );
  return (
    <Badge className="bg-green-100 text-green-700 border border-green-200 hover:bg-green-100">
      Tyres: OK
    </Badge>
  );
}

function LicenceBadge({ days }: { days: number | null }) {
  if (days === null) return null;
  if (days < 30)
    return (
      <Badge className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-100">
        Expires {friendlyDays(days)}
      </Badge>
    );
  if (days <= 90)
    return (
      <Badge className="bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-100">
        Expires {friendlyDays(days)}
      </Badge>
    );
  return (
    <Badge className="bg-green-100 text-green-700 border border-green-200 hover:bg-green-100">
      Valid
    </Badge>
  );
}

// ── Empty form defaults ───────────────────────────────────────────────────────
const EMPTY_VEHICLE_FORM: Omit<FleetVehicle, "id"> = {
  alias: "",
  registration: "",
  vehicleType: "car",
  make: "",
  model: "",
  year: "",
  colour: "",
  mileage: "",
  assignedDriverId: "",
  motDue: "",
  insuranceExpiry: "",
  lastService: "",
  nextServiceDue: "",
  tyreStatus: "OK",
  maintenanceNotes: "",
  status: "Active",
};

const EMPTY_DRIVER_FORM: Omit<FleetDriver, "id"> = {
  fullName: "",
  licenceNumber: "",
  licenceExpiry: "",
  phone: "",
  email: "",
  notes: "",
};

// ── Main component ────────────────────────────────────────────────────────────
export default function FleetPage() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<FleetVehicle[]>(() =>
    loadFromStorage<FleetVehicle>(FLEET_VEHICLES_KEY),
  );
  const [drivers, setDrivers] = useState<FleetDriver[]>(() =>
    loadFromStorage<FleetDriver>(FLEET_DRIVERS_KEY),
  );

  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(
    null,
  );

  // Vehicle dialog
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<FleetVehicle | null>(
    null,
  );
  const [vehicleForm, setVehicleForm] =
    useState<Omit<FleetVehicle, "id">>(EMPTY_VEHICLE_FORM);
  const [deleteVehicleTarget, setDeleteVehicleTarget] =
    useState<FleetVehicle | null>(null);

  // Driver dialog
  const [driverDialogOpen, setDriverDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<FleetDriver | null>(null);
  const [driverForm, setDriverForm] =
    useState<Omit<FleetDriver, "id">>(EMPTY_DRIVER_FORM);
  const [deleteDriverTarget, setDeleteDriverTarget] =
    useState<FleetDriver | null>(null);

  const { data: reports } = useGetAllReports();

  // Persist
  useEffect(() => {
    saveToStorage(FLEET_VEHICLES_KEY, vehicles);
  }, [vehicles]);
  useEffect(() => {
    saveToStorage(FLEET_DRIVERS_KEY, drivers);
  }, [drivers]);

  // ── Data helpers ────────────────────────────────────────────────────────────
  function getReportsForVehicle(v: FleetVehicle) {
    return (reports ?? []).filter(
      ([, r]) =>
        normaliseReg(r.vehicleInfo?.licencePlate ?? "") ===
        normaliseReg(v.registration),
    );
  }

  function getIncidentCount(v: FleetVehicle) {
    return getReportsForVehicle(v).length;
  }

  function getDriverById(id: string): FleetDriver | undefined {
    return drivers.find((d) => d.id === id);
  }

  function getVehicleForDriver(driverId: string): FleetVehicle | undefined {
    return vehicles.find((v) => v.assignedDriverId === driverId);
  }

  // ── Summary stats ───────────────────────────────────────────────────────────
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === "Active").length;
  const totalIncidents = vehicles.reduce(
    (sum, v) => sum + getIncidentCount(v),
    0,
  );
  const totalDrivers = drivers.length;

  const maintenanceAlerts = vehicles.filter((v) => {
    const level = alertLevelForVehicle(v);
    return level === "urgent" || level === "warning";
  }).length;

  const avgRisk = (() => {
    if (vehicles.length === 0)
      return { label: "Low" as const, color: "green" as const };
    const total = vehicles.reduce((sum, v) => sum + getIncidentCount(v), 0);
    const avg = total / vehicles.length;
    if (avg >= 2) return { label: "High" as const, color: "red" as const };
    if (avg >= 1) return { label: "Medium" as const, color: "amber" as const };
    return { label: "Low" as const, color: "green" as const };
  })();

  // Recent 5 incidents across all fleet vehicles
  const recentIncidents = (() => {
    const all: Array<{
      id: bigint;
      r: ReturnType<typeof getReportsForVehicle>[0][1];
      vehicleAlias: string;
      driverName: string;
    }> = [];
    for (const v of vehicles) {
      const reps = getReportsForVehicle(v);
      const driver = getDriverById(v.assignedDriverId);
      for (const [id, r] of reps) {
        all.push({
          id,
          r,
          vehicleAlias: v.alias,
          driverName: driver?.fullName ?? "—",
        });
      }
    }
    return all
      .sort((a, b) => Number(b.r.timestamp) - Number(a.r.timestamp))
      .slice(0, 5);
  })();

  // Fleet risk summary sorted by risk
  const fleetRiskSummary = [...vehicles]
    .map((v) => ({
      v,
      incidents: getIncidentCount(v),
      risk: getRiskLevel(getIncidentCount(v)),
      driver: getDriverById(v.assignedDriverId),
    }))
    .sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.risk.label] - order[b.risk.label];
    });

  // ── Vehicle CRUD ─────────────────────────────────────────────────────────────
  function openAddVehicleDialog() {
    setEditingVehicle(null);
    setVehicleForm(EMPTY_VEHICLE_FORM);
    setVehicleDialogOpen(true);
  }

  function openEditVehicleDialog(v: FleetVehicle) {
    setEditingVehicle(v);
    setVehicleForm({ ...v });
    setVehicleDialogOpen(true);
  }

  function handleVehicleSubmit() {
    if (!vehicleForm.alias.trim() || !vehicleForm.registration.trim()) return;
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editingVehicle.id
            ? { ...editingVehicle, ...vehicleForm }
            : v,
        ),
      );
    } else {
      setVehicles((prev) => [...prev, { id: generateId(), ...vehicleForm }]);
    }
    setVehicleDialogOpen(false);
  }

  function handleVehicleDelete(v: FleetVehicle) {
    setVehicles((prev) => prev.filter((x) => x.id !== v.id));
    setDeleteVehicleTarget(null);
  }

  // ── Driver CRUD ──────────────────────────────────────────────────────────────
  function openAddDriverDialog() {
    setEditingDriver(null);
    setDriverForm(EMPTY_DRIVER_FORM);
    setDriverDialogOpen(true);
  }

  function openEditDriverDialog(d: FleetDriver) {
    setEditingDriver(d);
    setDriverForm({ ...d });
    setDriverDialogOpen(true);
  }

  function handleDriverSubmit() {
    if (!driverForm.fullName.trim() || !driverForm.licenceNumber.trim()) return;
    if (editingDriver) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === editingDriver.id ? { ...editingDriver, ...driverForm } : d,
        ),
      );
    } else {
      setDrivers((prev) => [...prev, { id: generateId(), ...driverForm }]);
    }
    setDriverDialogOpen(false);
  }

  function handleDriverDelete(d: FleetDriver) {
    setDrivers((prev) => prev.filter((x) => x.id !== d.id));
    setDeleteDriverTarget(null);
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display">Fleet Manager</h1>
            <p className="text-xs text-muted-foreground">
              Dashboard · Up to 10 vehicles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={openAddDriverDialog}
            className="gap-2"
            data-ocid="fleet.add_driver.primary_button"
          >
            <User className="w-4 h-4" />
            Add Driver
          </Button>
          <Button
            onClick={openAddVehicleDialog}
            className="gap-2"
            data-ocid="fleet.primary_button"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex">
          <TabsTrigger value="overview" data-ocid="fleet.overview.tab">
            Overview
          </TabsTrigger>
          <TabsTrigger value="vehicles" data-ocid="fleet.vehicles.tab">
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="drivers" data-ocid="fleet.drivers.tab">
            Drivers
          </TabsTrigger>
          <TabsTrigger value="maintenance" data-ocid="fleet.maintenance.tab">
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: OVERVIEW ──────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* Stat cards 3×2 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              icon={<Car className="h-5 w-5 text-primary" />}
              value={totalVehicles}
              label="Total Vehicles"
              bg="bg-primary/8"
            />
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
              value={activeVehicles}
              label="Active Vehicles"
              bg="bg-green-50"
            />
            <StatCard
              icon={<FileText className="h-5 w-5 text-destructive" />}
              value={totalIncidents}
              label="Total Incidents"
              bg="bg-destructive/8"
            />
            <StatCard
              icon={<Users className="h-5 w-5 text-blue-600" />}
              value={totalDrivers}
              label="Total Drivers"
              bg="bg-blue-50"
            />
            <StatCard
              icon={<Wrench className="h-5 w-5 text-amber-600" />}
              value={maintenanceAlerts}
              label="Maint. Alerts"
              bg="bg-amber-50"
            />
            <Card className="border">
              <CardContent className="flex items-center gap-3 p-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    avgRisk.color === "red"
                      ? "bg-red-50"
                      : avgRisk.color === "amber"
                        ? "bg-amber-50"
                        : "bg-green-50"
                  }`}
                >
                  <Shield
                    className={`h-5 w-5 ${
                      avgRisk.color === "red"
                        ? "text-red-600"
                        : avgRisk.color === "amber"
                          ? "text-amber-600"
                          : "text-green-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgRisk.label}</p>
                  <p className="text-xs text-muted-foreground">Avg Risk</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fleet Risk Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Fleet Risk Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {fleetRiskSummary.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-sm"
                  data-ocid="fleet.risk.empty_state"
                >
                  No vehicles added yet.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {fleetRiskSummary.map(
                    ({ v, incidents, risk, driver }, idx) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-3 px-4 py-3"
                        data-ocid={`fleet.risk.item.${idx + 1}`}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <VehicleTypeIcon
                            type={v.vehicleType}
                            className="h-4 w-4 text-muted-foreground"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">
                              {v.alias}
                            </span>
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px] px-1.5 py-0"
                            >
                              {v.registration}
                            </Badge>
                            <RiskBadge level={risk} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {incidents} incident{incidents !== 1 ? "s" : ""}
                            {driver ? ` · ${driver.fullName}` : ""}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Incidents Feed */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Recent Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentIncidents.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-sm"
                  data-ocid="fleet.incidents.empty_state"
                >
                  No incidents recorded across fleet vehicles.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentIncidents.map(
                    ({ id, r, vehicleAlias, driverName }, idx) => (
                      <button
                        key={id.toString()}
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                        onClick={() =>
                          navigate({
                            to: "/reports/$reportId",
                            params: { reportId: id.toString() },
                          })
                        }
                        data-ocid={`fleet.incident.item.${idx + 1}`}
                      >
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-foreground">
                              {formatClaimId(id, r.timestamp)}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {vehicleAlias}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {driverName} ·{" "}
                            {new Date(
                              Number(r.timestamp) / 1_000_000,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      </button>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB 2: VEHICLES ──────────────────────────────────────────────── */}
        <TabsContent value="vehicles" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={openAddVehicleDialog}
              className="gap-2"
              data-ocid="fleet.vehicles.primary_button"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          </div>

          {vehicles.length === 0 ? (
            <div
              className="text-center py-16 space-y-3"
              data-ocid="fleet.vehicles.empty_state"
            >
              <Truck className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-lg font-semibold">No vehicles in fleet</p>
              <p className="text-muted-foreground text-sm">
                Add your first vehicle to start tracking.
              </p>
              <Button onClick={openAddVehicleDialog} className="gap-2">
                <Plus className="w-4 h-4" /> Add Vehicle
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((v, idx) => {
                const associated = getReportsForVehicle(v);
                const isExpanded = expandedVehicleId === v.id;
                const risk = getRiskLevel(associated.length);
                const driver = getDriverById(v.assignedDriverId);

                return (
                  <Card key={v.id} data-ocid={`fleet.vehicles.item.${idx + 1}`}>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          className="flex items-start gap-3 flex-1 min-w-0 text-left"
                          onClick={() =>
                            setExpandedVehicleId(isExpanded ? null : v.id)
                          }
                          data-ocid={`fleet.vehicles.item.${idx + 1}.toggle`}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                            <VehicleTypeIcon
                              type={v.vehicleType}
                              className="h-4 w-4 text-muted-foreground"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">
                                {v.alias}
                              </span>
                              <Badge
                                variant="outline"
                                className="font-mono text-[10px] px-1.5 py-0"
                              >
                                {v.registration}
                              </Badge>
                              <Badge
                                variant={
                                  v.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-[10px]"
                              >
                                {v.status}
                              </Badge>
                              <RiskBadge level={risk} />
                              {associated.length > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="text-[10px]"
                                >
                                  {associated.length} incident
                                  {associated.length !== 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {[v.year, v.colour, v.make, v.model]
                                .filter(Boolean)
                                .join(" ")}
                              {driver ? ` · ${driver.fullName}` : ""}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                          )}
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditVehicleDialog(v)}
                            data-ocid={`fleet.vehicles.item.${idx + 1}.edit_button`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteVehicleTarget(v)}
                            data-ocid={`fleet.vehicles.item.${idx + 1}.delete_button`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="px-4 pb-4 pt-3">
                        {/* Maintenance section */}
                        <div className="border-t border-border pt-3 mb-3">
                          <div className="flex items-center gap-1.5 mb-3">
                            <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Maintenance
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <AlertBadge
                              days={daysUntil(v.motDue)}
                              label="MOT"
                            />
                            <AlertBadge
                              days={daysUntil(v.insuranceExpiry)}
                              label="Insurance"
                            />
                            <AlertBadge
                              days={daysUntil(v.nextServiceDue)}
                              label="Next Service"
                            />
                            <TyreBadge status={v.tyreStatus} />
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            {v.lastService && (
                              <span>
                                Last service:{" "}
                                {new Date(v.lastService).toLocaleDateString(
                                  "en-GB",
                                )}
                              </span>
                            )}
                            {v.mileage && <span>Mileage: {v.mileage}</span>}
                            {driver && (
                              <span className="col-span-2">
                                Driver:{" "}
                                <span className="text-foreground font-medium">
                                  {driver.fullName}
                                </span>
                              </span>
                            )}
                          </div>
                          {v.maintenanceNotes && (
                            <p className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
                              {v.maintenanceNotes}
                            </p>
                          )}
                        </div>

                        {/* Associated reports */}
                        <div className="border-t border-border pt-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Associated Reports
                            </span>
                          </div>
                          {associated.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-2">
                              No incidents recorded for this vehicle.
                            </p>
                          ) : (
                            <div className="space-y-1.5">
                              {associated.map(([id, r]) => (
                                <button
                                  key={id.toString()}
                                  type="button"
                                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                                  onClick={() =>
                                    navigate({
                                      to: "/reports/$reportId",
                                      params: { reportId: id.toString() },
                                    })
                                  }
                                >
                                  <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <span className="font-mono text-xs text-foreground">
                                      {formatClaimId(id, r.timestamp)}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {new Date(
                                        Number(r.timestamp) / 1_000_000,
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── TAB 3: DRIVERS ───────────────────────────────────────────────── */}
        <TabsContent value="drivers" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={openAddDriverDialog}
              className="gap-2"
              data-ocid="fleet.drivers.primary_button"
            >
              <Plus className="w-4 h-4" />
              Add Driver
            </Button>
          </div>

          {drivers.length === 0 ? (
            <div
              className="text-center py-16 space-y-3"
              data-ocid="fleet.drivers.empty_state"
            >
              <Users className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-lg font-semibold">No drivers added</p>
              <p className="text-muted-foreground text-sm">
                Add drivers to assign them to fleet vehicles.
              </p>
              <Button onClick={openAddDriverDialog} className="gap-2">
                <Plus className="w-4 h-4" /> Add Driver
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {drivers.map((d, idx) => {
                const assignedVehicle = getVehicleForDriver(d.id);
                const incidentCount = assignedVehicle
                  ? getIncidentCount(assignedVehicle)
                  : 0;
                const licDays = daysUntil(d.licenceExpiry);

                return (
                  <Card key={d.id} data-ocid={`fleet.drivers.item.${idx + 1}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">
                                {d.fullName}
                              </span>
                              <LicenceBadge days={licDays} />
                            </div>
                            <p className="font-mono text-xs text-muted-foreground mt-0.5">
                              {d.licenceNumber}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              {d.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {d.phone}
                                </span>
                              )}
                              {d.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {d.email}
                                </span>
                              )}
                            </div>
                            {assignedVehicle && (
                              <div className="mt-1.5 flex items-center gap-2">
                                <Truck className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs">
                                  {assignedVehicle.alias}
                                  <Badge
                                    variant="outline"
                                    className="font-mono text-[10px] px-1.5 py-0 ml-1.5"
                                  >
                                    {assignedVehicle.registration}
                                  </Badge>
                                </span>
                                {incidentCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="text-[10px]"
                                  >
                                    {incidentCount} incident
                                    {incidentCount !== 1 ? "s" : ""}
                                  </Badge>
                                )}
                              </div>
                            )}
                            {d.notes && (
                              <p className="mt-1.5 text-xs text-muted-foreground bg-muted/50 rounded p-2">
                                {d.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDriverDialog(d)}
                            data-ocid={`fleet.drivers.item.${idx + 1}.edit_button`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteDriverTarget(d)}
                            data-ocid={`fleet.drivers.item.${idx + 1}.delete_button`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── TAB 4: MAINTENANCE ───────────────────────────────────────────── */}
        <TabsContent value="maintenance" className="mt-4 space-y-4">
          {/* Summary banner */}
          {vehicles.length > 0 &&
            (() => {
              const alertCount = vehicles.filter(
                (v) => alertLevelForVehicle(v) !== "ok",
              ).length;
              return alertCount > 0 ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>{alertCount}</strong> vehicle
                    {alertCount !== 1 ? "s" : ""} require attention
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-800 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>All vehicles are up to date</span>
                </div>
              );
            })()}

          {vehicles.length === 0 ? (
            <div
              className="text-center py-16 space-y-3"
              data-ocid="fleet.maintenance.empty_state"
            >
              <Wrench className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-lg font-semibold">No vehicles to track</p>
              <p className="text-muted-foreground text-sm">
                Add vehicles to monitor their maintenance status.
              </p>
              <Button onClick={openAddVehicleDialog} className="gap-2">
                <Plus className="w-4 h-4" /> Add Vehicle
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {[...vehicles]
                .sort(
                  (a, b) =>
                    alertLevelOrder(alertLevelForVehicle(a)) -
                    alertLevelOrder(alertLevelForVehicle(b)),
                )
                .map((v, idx) => {
                  const level = alertLevelForVehicle(v);
                  const motDays = daysUntil(v.motDue);
                  const insDays = daysUntil(v.insuranceExpiry);
                  const svcDays = daysUntil(v.nextServiceDue);

                  return (
                    <Card
                      key={v.id}
                      className="overflow-hidden"
                      data-ocid={`fleet.maintenance.item.${idx + 1}`}
                    >
                      <div className="flex">
                        {/* Urgency colour band */}
                        <div
                          className={`w-1 shrink-0 ${
                            level === "urgent"
                              ? "bg-red-500"
                              : level === "warning"
                                ? "bg-amber-400"
                                : "bg-green-400"
                          }`}
                        />
                        <CardContent className="p-3 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted">
                                <VehicleTypeIcon
                                  type={v.vehicleType}
                                  className="h-3.5 w-3.5 text-muted-foreground"
                                />
                              </div>
                              <div>
                                <span className="text-sm font-semibold">
                                  {v.alias}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="font-mono text-[10px] px-1.5 py-0 ml-2"
                                >
                                  {v.registration}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() => openEditVehicleDialog(v)}
                              data-ocid={`fleet.maintenance.item.${idx + 1}.edit_button`}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <AlertBadge days={motDays} label="MOT" />
                            <AlertBadge days={insDays} label="Insurance" />
                            <AlertBadge days={svcDays} label="Service" />
                            <TyreBadge status={v.tyreStatus} />
                          </div>
                          {v.mileage && (
                            <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
                              <Gauge className="w-3 h-3" />
                              {v.mileage} miles
                            </p>
                          )}
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Add/Edit Vehicle Dialog ─────────────────────────────────────────── */}
      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent
          className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="fleet.vehicles.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Vehicle Details */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Vehicle Details
              </p>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-alias">
                      Alias <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="v-alias"
                      placeholder="Delivery Van 1"
                      value={vehicleForm.alias}
                      onChange={(e) =>
                        setVehicleForm((f) => ({ ...f, alias: e.target.value }))
                      }
                      data-ocid="fleet.vehicles.alias.input"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-reg">
                      Registration <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="v-reg"
                      placeholder="AB12 CDE"
                      value={vehicleForm.registration}
                      onChange={(e) =>
                        setVehicleForm((f) => ({
                          ...f,
                          registration: e.target.value,
                        }))
                      }
                      data-ocid="fleet.vehicles.registration.input"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label>Vehicle Type</Label>
                  <Select
                    value={vehicleForm.vehicleType}
                    onValueChange={(val) =>
                      setVehicleForm((f) => ({
                        ...f,
                        vehicleType: val as FleetVehicle["vehicleType"],
                      }))
                    }
                  >
                    <SelectTrigger data-ocid="fleet.vehicles.type.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="truck">Truck / HGV</SelectItem>
                      <SelectItem value="motorbike">Motorbike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-make">Make</Label>
                    <Input
                      id="v-make"
                      placeholder="Ford"
                      value={vehicleForm.make}
                      onChange={(e) =>
                        setVehicleForm((f) => ({ ...f, make: e.target.value }))
                      }
                      data-ocid="fleet.vehicles.make.input"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-model">Model</Label>
                    <Input
                      id="v-model"
                      placeholder="Transit"
                      value={vehicleForm.model}
                      onChange={(e) =>
                        setVehicleForm((f) => ({ ...f, model: e.target.value }))
                      }
                      data-ocid="fleet.vehicles.model.input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-year">Year</Label>
                    <Input
                      id="v-year"
                      placeholder="2021"
                      value={vehicleForm.year}
                      onChange={(e) =>
                        setVehicleForm((f) => ({ ...f, year: e.target.value }))
                      }
                      data-ocid="fleet.vehicles.year.input"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-colour">Colour</Label>
                    <Input
                      id="v-colour"
                      placeholder="White"
                      value={vehicleForm.colour}
                      onChange={(e) =>
                        setVehicleForm((f) => ({
                          ...f,
                          colour: e.target.value,
                        }))
                      }
                      data-ocid="fleet.vehicles.colour.input"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-mileage">Mileage</Label>
                    <Input
                      id="v-mileage"
                      placeholder="45000"
                      value={vehicleForm.mileage}
                      onChange={(e) =>
                        setVehicleForm((f) => ({
                          ...f,
                          mileage: e.target.value,
                        }))
                      }
                      data-ocid="fleet.vehicles.mileage.input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Assignment */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Assignment
              </p>
              <div className="grid gap-1.5">
                <Label>Assigned Driver</Label>
                <Select
                  value={vehicleForm.assignedDriverId || "__none"}
                  onValueChange={(val) =>
                    setVehicleForm((f) => ({
                      ...f,
                      assignedDriverId: val === "__none" ? "" : val,
                    }))
                  }
                >
                  <SelectTrigger data-ocid="fleet.vehicles.driver.select">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">None</SelectItem>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {drivers.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add drivers in the Drivers tab first.
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Maintenance */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Maintenance
              </p>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-mot">MOT Due</Label>
                    <Input
                      id="v-mot"
                      type="date"
                      value={vehicleForm.motDue}
                      onChange={(e) =>
                        setVehicleForm((f) => ({
                          ...f,
                          motDue: e.target.value,
                        }))
                      }
                      data-ocid="fleet.vehicles.mot.input"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-ins">Insurance Expiry</Label>
                    <Input
                      id="v-ins"
                      type="date"
                      value={vehicleForm.insuranceExpiry}
                      onChange={(e) =>
                        setVehicleForm((f) => ({
                          ...f,
                          insuranceExpiry: e.target.value,
                        }))
                      }
                      data-ocid="fleet.vehicles.insurance.input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-last-svc">Last Service</Label>
                    <Input
                      id="v-last-svc"
                      type="date"
                      value={vehicleForm.lastService}
                      onChange={(e) =>
                        setVehicleForm((f) => ({
                          ...f,
                          lastService: e.target.value,
                        }))
                      }
                      data-ocid="fleet.vehicles.last-service.input"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="v-next-svc">Next Service Due</Label>
                    <Input
                      id="v-next-svc"
                      type="date"
                      value={vehicleForm.nextServiceDue}
                      onChange={(e) =>
                        setVehicleForm((f) => ({
                          ...f,
                          nextServiceDue: e.target.value,
                        }))
                      }
                      data-ocid="fleet.vehicles.next-service.input"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label>Tyre Status</Label>
                  <Select
                    value={vehicleForm.tyreStatus}
                    onValueChange={(val) =>
                      setVehicleForm((f) => ({
                        ...f,
                        tyreStatus: val as FleetVehicle["tyreStatus"],
                      }))
                    }
                  >
                    <SelectTrigger data-ocid="fleet.vehicles.tyre.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OK">OK</SelectItem>
                      <SelectItem value="Due">Due</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="v-notes">Maintenance Notes</Label>
                  <Textarea
                    id="v-notes"
                    placeholder="Any notes about upcoming work, known issues..."
                    rows={2}
                    value={vehicleForm.maintenanceNotes}
                    onChange={(e) =>
                      setVehicleForm((f) => ({
                        ...f,
                        maintenanceNotes: e.target.value,
                      }))
                    }
                    data-ocid="fleet.vehicles.notes.textarea"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Status
              </p>
              <Select
                value={vehicleForm.status}
                onValueChange={(val) =>
                  setVehicleForm((f) => ({
                    ...f,
                    status: val as FleetVehicle["status"],
                  }))
                }
              >
                <SelectTrigger data-ocid="fleet.vehicles.status.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Off-road">Off-road</SelectItem>
                  <SelectItem value="Under Repair">Under Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setVehicleDialogOpen(false)}
              data-ocid="fleet.vehicles.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVehicleSubmit}
              disabled={
                !vehicleForm.alias.trim() || !vehicleForm.registration.trim()
              }
              data-ocid="fleet.vehicles.submit_button"
            >
              {editingVehicle ? "Save Changes" : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add/Edit Driver Dialog ─────────────────────────────────────────── */}
      <Dialog open={driverDialogOpen} onOpenChange={setDriverDialogOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="fleet.drivers.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingDriver ? "Edit Driver" : "Add Driver"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5 col-span-2">
                <Label htmlFor="d-name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="d-name"
                  placeholder="Jane Smith"
                  value={driverForm.fullName}
                  onChange={(e) =>
                    setDriverForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  data-ocid="fleet.drivers.name.input"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="d-lic">
                  Licence Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="d-lic"
                  placeholder="SMITH123456JS9AB"
                  value={driverForm.licenceNumber}
                  onChange={(e) =>
                    setDriverForm((f) => ({
                      ...f,
                      licenceNumber: e.target.value,
                    }))
                  }
                  className="font-mono"
                  data-ocid="fleet.drivers.licence.input"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="d-lic-exp">
                  Licence Expiry <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="d-lic-exp"
                  type="date"
                  value={driverForm.licenceExpiry}
                  onChange={(e) =>
                    setDriverForm((f) => ({
                      ...f,
                      licenceExpiry: e.target.value,
                    }))
                  }
                  data-ocid="fleet.drivers.licence-expiry.input"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="d-phone">Phone</Label>
                <Input
                  id="d-phone"
                  placeholder="07700 900000"
                  value={driverForm.phone}
                  onChange={(e) =>
                    setDriverForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  data-ocid="fleet.drivers.phone.input"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="d-email">Email</Label>
                <Input
                  id="d-email"
                  type="email"
                  placeholder="jane@example.com"
                  value={driverForm.email}
                  onChange={(e) =>
                    setDriverForm((f) => ({ ...f, email: e.target.value }))
                  }
                  data-ocid="fleet.drivers.email.input"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="d-notes">Notes</Label>
              <Textarea
                id="d-notes"
                placeholder="Any relevant notes..."
                rows={2}
                value={driverForm.notes}
                onChange={(e) =>
                  setDriverForm((f) => ({ ...f, notes: e.target.value }))
                }
                data-ocid="fleet.drivers.notes.textarea"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDriverDialogOpen(false)}
              data-ocid="fleet.drivers.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDriverSubmit}
              disabled={
                !driverForm.fullName.trim() || !driverForm.licenceNumber.trim()
              }
              data-ocid="fleet.drivers.submit_button"
            >
              {editingDriver ? "Save Changes" : "Add Driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Vehicle Confirm ─────────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteVehicleTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteVehicleTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="fleet.vehicles.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong>{deleteVehicleTarget?.alias}</strong> (
              {deleteVehicleTarget?.registration}) from the fleet? Associated
              incident reports will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="fleet.vehicles.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteVehicleTarget && handleVehicleDelete(deleteVehicleTarget)
              }
              data-ocid="fleet.vehicles.delete.confirm_button"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Driver Confirm ──────────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteDriverTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteDriverTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="fleet.drivers.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Driver</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong>{deleteDriverTarget?.fullName}</strong> from the
              fleet? Their vehicle assignment will be unaffected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="fleet.drivers.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteDriverTarget && handleDriverDelete(deleteDriverTarget)
              }
              data-ocid="fleet.drivers.delete.confirm_button"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── StatCard helper ───────────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  bg: string;
}) {
  return (
    <Card className="border">
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
