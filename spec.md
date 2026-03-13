# Legal Accident Documentation App

## Current State
The Fleet Manager page (`FleetPage.tsx`) currently supports:
- Adding/editing/deleting fleet vehicles (alias, registration, make, model, colour, driver name, status: Active/Inactive)
- Summary stats: total vehicles, active vehicles, total incidents
- Per-vehicle expansion showing linked incident reports (matched by registration plate)
- Basic add/edit/delete dialog

## Requested Changes (Diff)

### Add
- **Tabbed layout** in FleetPage: Overview | Vehicles | Drivers | Maintenance (4 tabs)
- **Overview tab**: fleet health scorecard (total vehicles, active, total incidents, drivers, vehicles with overdue maintenance, average risk score), fleet risk heat-map list (vehicles ranked by risk score with colour-coded badges), recent incidents feed (last 5 incidents across fleet with date, claim ID, vehicle alias, driver)
- **Driver profiles** (new `DRIVERS_KEY` localStorage store): add/edit/delete drivers with fields: full name, licence number, licence expiry date, contact phone, contact email, assigned vehicle (select from fleet), notes. Driver list card shows name, licence expiry (colour-coded: red if <30 days, amber if <90 days, green otherwise), assigned vehicle, incident count (reports matching assigned vehicle registration)
- **Maintenance records** on each vehicle (stored within the vehicle object): MOT due date, last service date, next service due date, insurance expiry date, tyre check status (OK / Due / Overdue), mileage, notes. Colour-coded expiry alerts: red if <14 days, amber if <30 days, green otherwise
- **Maintenance tab**: consolidated list of all vehicles with their maintenance status, sorted by most urgent expiry. Each row shows vehicle alias/reg, MOT due, insurance expiry, tyre status, next service. Urgent items highlighted in red/amber
- **Risk scoring** per vehicle: calculated from number of associated incidents (0=none: green Low, 1=amber Medium, 2+=red High). Displayed as a badge on each vehicle card and in the Overview
- **Fleet-wide incident summary** on Overview: count of incidents by status (submitted, pending, resolved) if available, otherwise total count with breakdown per vehicle
- **Extended vehicle form** in Add/Edit dialog: add MOT due date, insurance expiry date, last service date, next service due, tyre status, mileage fields alongside existing fields
- **Vehicle type selector** on vehicle form: Car, Van, Truck/HGV, Motorbike (affects icon shown on card)

### Modify
- `FleetVehicle` interface: extend with `vehicleType`, `motDue`, `insuranceExpiry`, `lastService`, `nextServiceDue`, `tyreStatus`, `mileage`, `maintenanceNotes` fields
- Summary stat cards: replace basic 3-card row with 6-card grid (Total Vehicles, Active, Total Incidents, Drivers, Maintenance Alerts, Avg Risk)
- Vehicle list (Vehicles tab): keep existing expand/collapse but add maintenance status row and risk badge to each card header
- Expand section on vehicle card: add Maintenance sub-section alongside existing Associated Reports

### Remove
- Nothing removed; all existing functionality preserved

## Implementation Plan
1. Extend `FleetVehicle` interface with new maintenance and vehicle type fields
2. Add `FleetDriver` interface and localStorage store (`DRIVERS_KEY`)
3. Add risk score calculation utility function
4. Add maintenance alert colour utility function (days-until expiry → colour/label)
5. Rebuild `FleetPage` with 4-tab layout using shadcn Tabs component
6. Build Overview tab: 6 stat cards, risk-ranked vehicle list, recent incidents feed
7. Build Vehicles tab: existing list with extended vehicle cards (risk badge, maintenance row, expanded maintenance section)
8. Extend Add/Edit vehicle dialog with new fields (vehicle type, MOT due, insurance expiry, service dates, tyre status, mileage)
9. Build Drivers tab: driver list cards, add/edit/delete driver dialog
10. Build Maintenance tab: consolidated urgency-sorted maintenance overview table
11. Apply deterministic `data-ocid` markers to all new interactive elements
