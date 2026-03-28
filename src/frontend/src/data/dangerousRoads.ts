export interface DangerousRoad {
  id: string;
  name: string;
  number: string;
  region: string;
  accidentIndex: number;
  annualSerious: number;
  hazards: string[];
  notes: string;
}

export const UK_DANGEROUS_ROADS: DangerousRoad[] = [
  {
    id: "a537",
    name: "A537 Cat and Fiddle Road",
    number: "A537",
    region: "Peak District, Cheshire/Derbyshire",
    accidentIndex: 10,
    annualSerious: 18,
    hazards: [
      "Sharp bends",
      "High speed",
      "Rural single-carriageway",
      "Blind summits",
      "Wet/icy surface",
    ],
    notes:
      "Consistently ranked the most dangerous road in the UK, with frequent fatal crashes on its exposed moorland bends.",
  },
  {
    id: "a682",
    name: "A682",
    number: "A682",
    region: "Lancashire/Yorkshire",
    accidentIndex: 9,
    annualSerious: 14,
    hazards: [
      "Sharp bends",
      "High speed",
      "Overtaking collisions",
      "Rural single-carriageway",
      "Poor lighting",
    ],
    notes:
      "A high-speed rural road across open moorland with poor visibility and numerous serious collisions annually.",
  },
  {
    id: "a9",
    name: "A9 Perth to Inverness",
    number: "A9",
    region: "Scotland (Perth to Inverness)",
    accidentIndex: 9,
    annualSerious: 22,
    hazards: [
      "High speed",
      "Overtaking collisions",
      "HGV traffic",
      "Wet/icy surface",
      "Animal crossings",
    ],
    notes:
      "Scotland's longest trunk road sees frequent head-on collisions due to overtaking on single-carriageway sections.",
  },
  {
    id: "a417",
    name: "A417 Missing Link",
    number: "A417",
    region: "Gloucestershire (Brockworth to Cowley)",
    accidentIndex: 8,
    annualSerious: 11,
    hazards: [
      "Dual carriageway merges",
      "High speed",
      "Blind summits",
      "HGV traffic",
      "Junctions",
    ],
    notes:
      "A notorious bottleneck where dual carriageway abruptly narrows to single lane at Air Balloon roundabout, causing serious crashes.",
  },
  {
    id: "a30",
    name: "A30 Cornwall",
    number: "A30",
    region: "Cornwall",
    accidentIndex: 8,
    annualSerious: 16,
    hazards: [
      "High speed",
      "Tourist traffic",
      "Overtaking collisions",
      "Rural single-carriageway",
      "Junctions",
    ],
    notes:
      "The primary route through Cornwall suffers from seasonal congestion and overtaking incidents on mixed carriageway sections.",
  },
  {
    id: "a361",
    name: "A361 North Devon Link Road",
    number: "A361",
    region: "North Devon, Somerset",
    accidentIndex: 8,
    annualSerious: 13,
    hazards: [
      "High speed",
      "Rural single-carriageway",
      "Junctions",
      "Blind summits",
      "Poor lighting",
    ],
    notes:
      "A fast rural A-road with numerous at-grade junctions and limited overtaking opportunities creating high-risk situations.",
  },
  {
    id: "a58",
    name: "A58 Halifax to Leeds",
    number: "A58",
    region: "West Yorkshire",
    accidentIndex: 8,
    annualSerious: 12,
    hazards: [
      "Sharp bends",
      "High speed",
      "Pedestrians",
      "Poor lighting",
      "Wet/icy surface",
    ],
    notes:
      "Winding trans-Pennine route with mixed urban and rural sections creating unpredictable hazard changes for drivers.",
  },
  {
    id: "a5-north-wales",
    name: "A5 North Wales",
    number: "A5",
    region: "North Wales (Anglesey to Shrewsbury)",
    accidentIndex: 8,
    annualSerious: 15,
    hazards: [
      "Sharp bends",
      "High speed",
      "Tourist traffic",
      "Narrow carriageway",
      "Blind summits",
    ],
    notes:
      "Historic route through Snowdonia used by tourists unfamiliar with its rapid elevation changes and tight mountain bends.",
  },
  {
    id: "a616",
    name: "A616",
    number: "A616",
    region: "Nottinghamshire/South Yorkshire",
    accidentIndex: 8,
    annualSerious: 10,
    hazards: [
      "High speed",
      "Overtaking collisions",
      "Rural single-carriageway",
      "HGV traffic",
      "Junctions",
    ],
    notes:
      "A fast cross-Pennine route used heavily by HGVs, where impatient overtaking on single-carriageway sections leads to head-on crashes.",
  },
  {
    id: "a483-wales",
    name: "A483 Wales",
    number: "A483",
    region: "Wales (Swansea to Wrexham)",
    accidentIndex: 7,
    annualSerious: 11,
    hazards: [
      "High speed",
      "Rural single-carriageway",
      "Junctions",
      "Animal crossings",
      "Wet/icy surface",
    ],
    notes:
      "Wales's main north-south spine road with hazardous junctions and animals from adjacent farmland creating unpredictable obstacles.",
  },
  {
    id: "a470-wales",
    name: "A470",
    number: "A470",
    region: "Wales (Cardiff to Llandudno)",
    accidentIndex: 7,
    annualSerious: 14,
    hazards: [
      "Sharp bends",
      "High speed",
      "Narrow carriageway",
      "Animal crossings",
      "Blind summits",
    ],
    notes:
      "Wales's most important highway traverses mountainous terrain with frequent weather changes and unpredictable road conditions.",
  },
  {
    id: "a590",
    name: "A590",
    number: "A590",
    region: "Cumbria (Barrow-in-Furness to M6)",
    accidentIndex: 7,
    annualSerious: 9,
    hazards: [
      "High speed",
      "HGV traffic",
      "Junctions",
      "Overtaking collisions",
      "Poor lighting",
    ],
    notes:
      "Main road serving South Cumbria with high HGV volumes and dangerous junction designs contributing to a high serious accident rate.",
  },
  {
    id: "a303",
    name: "A303",
    number: "A303",
    region: "Wiltshire/Somerset (London to Exeter)",
    accidentIndex: 7,
    annualSerious: 13,
    hazards: [
      "High speed",
      "Dual carriageway merges",
      "Tourist traffic",
      "Overtaking collisions",
      "HGV traffic",
    ],
    notes:
      "London to Southwest gateway alternates between dual and single carriageway, frustrating drivers and encouraging dangerous overtaking.",
  },
  {
    id: "a38",
    name: "A38 Devon/Somerset",
    number: "A38",
    region: "Devon/Somerset",
    accidentIndex: 7,
    annualSerious: 11,
    hazards: [
      "High speed",
      "Sharp bends",
      "Rural single-carriageway",
      "Tourist traffic",
      "Wet/icy surface",
    ],
    notes:
      "A mix of dual and single carriageway sections creates dangerous transitions where speeds remain high into restricted sections.",
  },
  {
    id: "a6-derbyshire",
    name: "A6 Derbyshire",
    number: "A6",
    region: "Derbyshire (Buxton to Bakewell)",
    accidentIndex: 7,
    annualSerious: 8,
    hazards: [
      "Sharp bends",
      "Narrow carriageway",
      "High speed",
      "Blind summits",
      "Tourist traffic",
    ],
    notes:
      "Scenic Peak District route popular with motorcyclists, where tight bends and narrow lanes compound risk at higher speeds.",
  },
  {
    id: "a43",
    name: "A43",
    number: "A43",
    region: "Northamptonshire/Oxfordshire",
    accidentIndex: 7,
    annualSerious: 9,
    hazards: [
      "High speed",
      "Junctions",
      "Overtaking collisions",
      "HGV traffic",
      "Dual carriageway merges",
    ],
    notes:
      "A busy cross-country route with heavy HGV traffic and poor junction design contributing to regular serious accidents.",
  },
  {
    id: "a19",
    name: "A19",
    number: "A19",
    region: "North Yorkshire/Teesside",
    accidentIndex: 7,
    annualSerious: 12,
    hazards: [
      "High speed",
      "Junctions",
      "HGV traffic",
      "Poor lighting",
      "Roadworks",
    ],
    notes:
      "Major north-east arterial road with complex junction interactions and ongoing infrastructure works creating hazardous conditions.",
  },
  {
    id: "a1m-yorkshire",
    name: "A1(M) Yorkshire Section",
    number: "A1(M)",
    region: "South/West Yorkshire",
    accidentIndex: 6,
    annualSerious: 10,
    hazards: [
      "High speed",
      "HGV traffic",
      "Roadworks",
      "Dual carriageway merges",
      "Poor lighting",
    ],
    notes:
      "Upgrading sections create unpredictable lane changes and reduced speed limits alongside live heavy traffic flows.",
  },
  {
    id: "a31",
    name: "A31",
    number: "A31",
    region: "Hampshire (Alton to Ringwood)",
    accidentIndex: 6,
    annualSerious: 7,
    hazards: [
      "High speed",
      "Dual carriageway merges",
      "Junctions",
      "Tourist traffic",
      "Overtaking collisions",
    ],
    notes:
      "A busy rural dual carriageway through the New Forest where tourist traffic and wildlife crossings create unexpected hazards.",
  },
  {
    id: "a249",
    name: "A249",
    number: "A249",
    region: "Kent (Maidstone to Sheerness)",
    accidentIndex: 6,
    annualSerious: 8,
    hazards: [
      "High speed",
      "Junctions",
      "HGV traffic",
      "Dual carriageway merges",
      "Roadworks",
    ],
    notes:
      "A key Kent arterial link with port-bound HGV traffic and challenging intersections at Bobbing and Iwade.",
  },
];

export const MALTA_DANGEROUS_ROADS: DangerousRoad[] = [
  {
    id: "mt-regional-road",
    name: "Triq Reġjonali (Regional Road)",
    number: "RR",
    region: "Central Malta (Birkirkara to Msida)",
    accidentIndex: 10,
    annualSerious: 24,
    hazards: [
      "High speed",
      "Congestion",
      "Pedestrians",
      "Motorcyclists",
      "Poor lane discipline",
    ],
    notes:
      "Malta's main artery through the central conurbation records the highest accident frequency on the island, with lane-changing and speed differentials the primary cause.",
  },
  {
    id: "mt-coast-road",
    name: "Triq il-Kosta (Coast Road)",
    number: "CR",
    region: "Northern Malta (St Paul's Bay to Mellieħa)",
    accidentIndex: 10,
    annualSerious: 19,
    hazards: [
      "Sharp bends",
      "High speed",
      "Tourist traffic",
      "Narrow carriageway",
      "Motorcyclists",
    ],
    notes:
      "A winding coastal road heavily used by tourists and motorcyclists. Cliff-edge sections and tight bends contribute to a disproportionate number of serious crashes.",
  },
  {
    id: "mt-mosta-burmarrad",
    name: "Triq Buġibba — Mosta Road",
    number: "TBM",
    region: "St Paul's Bay / Mosta",
    accidentIndex: 9,
    annualSerious: 16,
    hazards: [
      "Roundabouts",
      "High speed",
      "Pedestrians",
      "Tourist traffic",
      "Poor lighting",
    ],
    notes:
      "Connects the tourist-heavy northern bay area with central Malta. High pedestrian volumes, poorly marked roundabouts, and mixed speed traffic are the key hazards.",
  },
  {
    id: "mt-airport-corridor",
    name: "Triq l-Ajruport (Airport Corridor)",
    number: "AC",
    region: "Luqa / Gudja",
    accidentIndex: 9,
    annualSerious: 14,
    hazards: [
      "High speed",
      "HGV traffic",
      "Junctions",
      "Poor lighting",
      "Congestion",
    ],
    notes:
      "The arterial road serving Malta International Airport carries heavy freight and taxi traffic at all hours. Poor junction visibility and inadequate lighting worsen night-time risk.",
  },
  {
    id: "mt-marsa-junction",
    name: "Marsa Junction (Ħal Qormi Road)",
    number: "MJ",
    region: "Marsa / Ħal Qormi",
    accidentIndex: 9,
    annualSerious: 18,
    hazards: [
      "Congestion",
      "Junctions",
      "HGV traffic",
      "Motorcyclists",
      "Poor lane discipline",
    ],
    notes:
      "Malta's busiest road interchange records the highest collision density on the island during peak hours. Lane weaving and inadequate signage are persistent problems.",
  },
  {
    id: "mt-rabat-dingli",
    name: "Triq ir-Rabat — Triq id-Dingli",
    number: "RD",
    region: "Rabat / Dingli",
    accidentIndex: 8,
    annualSerious: 11,
    hazards: [
      "Sharp bends",
      "Narrow carriageway",
      "Blind summits",
      "Rural road",
      "Poor lighting",
    ],
    notes:
      "A narrow rural road winding across the Dingli Cliffs escarpment. Blind summits and sharp bends make overtaking extremely hazardous, particularly at night.",
  },
  {
    id: "mt-mellieha-bypass",
    name: "Mellieħa Bypass",
    number: "MB",
    region: "Mellieħa",
    accidentIndex: 8,
    annualSerious: 10,
    hazards: [
      "High speed",
      "Tourist traffic",
      "Sharp bends",
      "Blind summits",
      "Motorcyclists",
    ],
    notes:
      "A high-speed bypass popular with motorcyclists and tourist coaches travelling to the northern beaches. Steep gradient changes and sharp bends increase crash risk significantly.",
  },
  {
    id: "mt-santa-venera",
    name: "Triq Santa Venera (Santa Venera Tunnels Approach)",
    number: "SV",
    region: "Santa Venera / Ħamrun",
    accidentIndex: 8,
    annualSerious: 13,
    hazards: [
      "Congestion",
      "Tunnel approach",
      "Junctions",
      "Poor lane discipline",
      "Motorcyclists",
    ],
    notes:
      "The tunnel approach roads concentrate heavy two-way traffic into narrow lanes. Sudden speed changes and unclear priority markings at exits lead to frequent rear-end and side collisions.",
  },
  {
    id: "mt-valletta-approach",
    name: "Triq Sant'Antnin — Valletta Approach",
    number: "VA",
    region: "Floriana / Valletta",
    accidentIndex: 7,
    annualSerious: 12,
    hazards: [
      "Pedestrians",
      "Congestion",
      "Poor lane discipline",
      "Buses",
      "Tourist traffic",
    ],
    notes:
      "The main approach to Valletta's city gates funnels pedestrians, buses, and private vehicles through a constrained space. Conflicts between coaches and pedestrians at crossings are a recurring cause of injury.",
  },
  {
    id: "mt-gozo-ferry-road",
    name: "Triq il-Fgura — Ċirkewwa Ferry Road",
    number: "CF",
    region: "Northern Malta (Ċirkewwa)",
    accidentIndex: 7,
    annualSerious: 9,
    hazards: [
      "High speed",
      "Tourist traffic",
      "HGV traffic",
      "Poor lighting",
      "Junctions",
    ],
    notes:
      "Heavily trafficked road serving the Gozo ferry terminal. Lorries and tourist coaches combine with unfamiliar drivers rushing for ferry departures, creating dangerous speed and merging conflicts.",
  },
  {
    id: "mt-msida-seafront",
    name: "Triq ix-Xatt (Msida Seafront)",
    number: "MS",
    region: "Msida / Ta' Xbiex",
    accidentIndex: 7,
    annualSerious: 8,
    hazards: [
      "Congestion",
      "Pedestrians",
      "Cyclists",
      "Poor lighting",
      "Junctions",
    ],
    notes:
      "A busy seafront dual carriageway with high pedestrian and cyclist activity near the Marina. Unmarked crossing points and high vehicle speeds create serious pedestrian safety risks.",
  },
  {
    id: "mt-sliema-seafront",
    name: "Triq ix-Xatt is-Sliema (Sliema Seafront)",
    number: "SF",
    region: "Sliema",
    accidentIndex: 7,
    annualSerious: 9,
    hazards: [
      "Pedestrians",
      "Tourist traffic",
      "Congestion",
      "Cyclists",
      "Poor lane discipline",
    ],
    notes:
      "One of Malta's most pedestrianised tourist areas shares road space with high-volume vehicle traffic. Informal parking, jaywalking, and tourist unfamiliarity with Maltese driving norms drive accident frequency.",
  },
  {
    id: "mt-paola-tarxien",
    name: "Triq Paola — Tarxien Road",
    number: "PT",
    region: "Paola / Tarxien",
    accidentIndex: 6,
    annualSerious: 7,
    hazards: [
      "Junctions",
      "Pedestrians",
      "Congestion",
      "Buses",
      "Poor lane discipline",
    ],
    notes:
      "A dense residential arterial road with frequent bus stops, unsignalised junctions, and high pedestrian activity between schools and retail areas.",
  },
  {
    id: "mt-victoria-gozo",
    name: "Triq ir-Repubblika, Victoria (Gozo)",
    number: "VG",
    region: "Victoria (Ir-Rabat), Gozo",
    accidentIndex: 6,
    annualSerious: 6,
    hazards: [
      "Narrow carriageway",
      "Pedestrians",
      "Tourist traffic",
      "Sharp bends",
      "Poor lighting",
    ],
    notes:
      "Gozo's main town centre artery suffers from narrow lanes shared by tourist coaches, delivery vehicles, and pedestrians. Poorly lit side roads and irregular pavement edges increase trip-and-fall injury risk alongside vehicle accidents.",
  },
  {
    id: "mt-marsaxlokk-birzebbuga",
    name: "Triq Marsaxlokk — Birzebbuga",
    number: "MBZ",
    region: "Marsaxlokk / Birżebbuġa",
    accidentIndex: 6,
    annualSerious: 7,
    hazards: [
      "HGV traffic",
      "High speed",
      "Poor lighting",
      "Junctions",
      "Dust / reduced visibility",
    ],
    notes:
      "This industrial corridor serves Freeport Malta and the power station. High HGV volumes at all hours, poor lighting, and industrial dust reducing visibility make this one of Malta's most hazardous freight routes.",
  },
];

export const HAZARD_COLORS: Record<string, string> = {
  "Sharp bends":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "High speed": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "Rural single-carriageway":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Poor lighting":
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "Overtaking collisions":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Junctions: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "HGV traffic":
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Pedestrians:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Wet/icy surface":
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Blind summits":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Narrow carriageway":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Animal crossings":
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "Tourist traffic":
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "Dual carriageway merges":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Roadworks:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Congestion:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  Motorcyclists:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  Roundabouts:
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  Cyclists: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
  Buses: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "Poor lane discipline":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Rural road":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Tunnel approach":
    "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
  "Dust / reduced visibility":
    "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};
