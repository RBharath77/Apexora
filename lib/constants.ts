export type NavItem = {
  label: string;
  href: string;
  id: string;
};

export const navItems: readonly NavItem[] = [
  { label: "HOME", href: "#home", id: "home" },
  { label: "RACES", href: "#races", id: "races" },
  { label: "STANDINGS", href: "#standings", id: "standings" },
  { label: "DRIVERS", href: "#drivers", id: "drivers" },
  { label: "TEAMS", href: "#teams", id: "teams" },
  { label: "CIRCUITS", href: "#circuits", id: "circuits" },
  { label: "GARAGE", href: "#garage", id: "garage" },
  { label: "FAN ZONE", href: "#fan-zone", id: "fan-zone" },
  { label: "ABOUT", href: "#about", id: "about" },
] as const;

export const heroTelemetry = [
  { label: "2026 WDC CHAMPION", value: "K. ANTONELLI (#12)" },
  { label: "2026 WCC CHAMPION", value: "MERCEDES (652 PTS)" },
  { label: "NEXT ROUND", value: "R21 LAS VEGAS GP" },
  { label: "MAX VELOCITY", value: "362 KM/H" },
  { label: "ACTIVE AERO", value: "X/Z MODE" },
  { label: "POWER UNIT", value: "350 KW HYBRID" },
  { label: "VEGAS TRACK TEMP", value: "14°C // CLEAR" },
] as const;

export type WeatherSessionForecast = {
  session: string;
  condition: "CLEAR" | "SUNNY" | "CLOUDY" | "RAIN" | "NIGHT";
  airTemp: string;
  trackTemp: string;
  rainChance: number;
  wind: string;
  gripLevel: string;
};

export type RaceCalendarItem = {
  id: string;
  round: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  city: string;
  circuitName: string;
  dateLabel: string;
  targetIso: string;
  status: "NEXT RACE" | "UPCOMING" | "SEASON CLASSIC";
  image: string;
  strategyForecast: string;
  safetyCarProb: number;
  sessions: readonly [
    WeatherSessionForecast,
    WeatherSessionForecast,
    WeatherSessionForecast
  ];
};

export const raceCalendarData: readonly RaceCalendarItem[] = [
  {
    id: "vegas",
    round: "ROUND 21",
    name: "LAS VEGAS GRAND PRIX",
    shortName: "LAS VEGAS GP",
    country: "USA",
    flag: "🇺🇸",
    city: "Las Vegas, Nevada",
    circuitName: "Las Vegas Strip Circuit",
    dateLabel: "Nov 19–21, 2026",
    targetIso: "2026-11-22T04:00:00Z",
    status: "NEXT RACE",
    image: "/images/race-vegas.jpg",
    strategyForecast: "2-Stop: Medium → Hard → Hard (Cold tire warm-up critical)",
    safetyCarProb: 68,
    sessions: [
      {
        session: "QUALIFYING",
        condition: "NIGHT",
        airTemp: "13°C",
        trackTemp: "17°C",
        rainChance: 4,
        wind: "11 km/h NW",
        gripLevel: "EVOLVING",
      },
      {
        session: "WARMUP / TRACK",
        condition: "CLEAR",
        airTemp: "15°C",
        trackTemp: "20°C",
        rainChance: 5,
        wind: "14 km/h W",
        gripLevel: "MEDIUM",
      },
      {
        session: "RACE NIGHT",
        condition: "NIGHT",
        airTemp: "12°C",
        trackTemp: "15°C",
        rainChance: 3,
        wind: "9 km/h NW",
        gripLevel: "LOW GRIP",
      },
    ],
  },
  {
    id: "qatar",
    round: "ROUND 22",
    name: "QATAR GRAND PRIX",
    shortName: "QATAR GP",
    country: "QAT",
    flag: "🇶🇦",
    city: "Lusail",
    circuitName: "Lusail International Circuit",
    dateLabel: "Nov 27–29, 2026",
    targetIso: "2026-11-29T16:00:00Z",
    status: "UPCOMING",
    image: "/images/race-vegas.jpg",
    strategyForecast: "2-Stop: Soft → Hard → Medium (High lateral load)",
    safetyCarProb: 42,
    sessions: [
      {
        session: "SPRINT",
        condition: "NIGHT",
        airTemp: "24°C",
        trackTemp: "29°C",
        rainChance: 2,
        wind: "18 km/h N",
        gripLevel: "HIGH",
      },
      {
        session: "QUALIFYING",
        condition: "CLEAR",
        airTemp: "23°C",
        trackTemp: "27°C",
        rainChance: 2,
        wind: "15 km/h N",
        gripLevel: "OPTIMAL",
      },
      {
        session: "GRAND PRIX",
        condition: "NIGHT",
        airTemp: "22°C",
        trackTemp: "26°C",
        rainChance: 1,
        wind: "16 km/h NE",
        gripLevel: "OPTIMAL",
      },
    ],
  },
  {
    id: "abudhabi",
    round: "ROUND 23",
    name: "ABU DHABI GRAND PRIX",
    shortName: "ABU DHABI GP",
    country: "UAE",
    flag: "🇦🇪",
    city: "Yas Island",
    circuitName: "Yas Marina Circuit",
    dateLabel: "Dec 04–06, 2026",
    targetIso: "2026-12-06T13:00:00Z",
    status: "UPCOMING",
    image: "/images/race-monaco.jpg",
    strategyForecast: "1-Stop: Medium → Hard (Sunset-to-night drop)",
    safetyCarProb: 35,
    sessions: [
      {
        session: "PRACTICE",
        condition: "SUNNY",
        airTemp: "27°C",
        trackTemp: "38°C",
        rainChance: 0,
        wind: "12 km/h NW",
        gripLevel: "HIGH",
      },
      {
        session: "QUALIFYING",
        condition: "CLEAR",
        airTemp: "24°C",
        trackTemp: "30°C",
        rainChance: 0,
        wind: "10 km/h W",
        gripLevel: "PEAK",
      },
      {
        session: "FINALE",
        condition: "NIGHT",
        airTemp: "23°C",
        trackTemp: "27°C",
        rainChance: 0,
        wind: "9 km/h NW",
        gripLevel: "PEAK",
      },
    ],
  },
  {
    id: "monaco",
    round: "CLASSIC R08",
    name: "MONACO GRAND PRIX",
    shortName: "MONACO GP",
    country: "MON",
    flag: "🇲🇨",
    city: "Monte Carlo",
    circuitName: "Circuit de Monaco",
    dateLabel: "2026 Classic",
    targetIso: "2026-11-22T04:00:00Z",
    status: "SEASON CLASSIC",
    image: "/images/race-monaco.jpg",
    strategyForecast: "1-Stop: Soft → Hard (Track position paramount)",
    safetyCarProb: 78,
    sessions: [
      {
        session: "PRACTICE",
        condition: "SUNNY",
        airTemp: "22°C",
        trackTemp: "36°C",
        rainChance: 15,
        wind: "14 km/h SE",
        gripLevel: "EVOLVING",
      },
      {
        session: "QUALIFYING",
        condition: "CLOUDY",
        airTemp: "21°C",
        trackTemp: "31°C",
        rainChance: 28,
        wind: "17 km/h S",
        gripLevel: "HIGH",
      },
      {
        session: "GRAND PRIX",
        condition: "RAIN",
        airTemp: "19°C",
        trackTemp: "24°C",
        rainChance: 64,
        wind: "21 km/h SW",
        gripLevel: "CROSSOVER",
      },
    ],
  },
  {
    id: "silverstone",
    round: "CLASSIC R11",
    name: "BRITISH GRAND PRIX",
    shortName: "BRITISH GP",
    country: "GBR",
    flag: "🇬🇧",
    city: "Silverstone",
    circuitName: "Silverstone Circuit",
    dateLabel: "2026 Classic",
    targetIso: "2026-11-22T04:00:00Z",
    status: "SEASON CLASSIC",
    image: "/images/garage-car.jpg",
    strategyForecast: "2-Stop / Weather Alert: Intermediates on standby",
    safetyCarProb: 54,
    sessions: [
      {
        session: "PRACTICE",
        condition: "CLOUDY",
        airTemp: "18°C",
        trackTemp: "25°C",
        rainChance: 38,
        wind: "24 km/h SW",
        gripLevel: "HIGH",
      },
      {
        session: "QUALIFYING",
        condition: "RAIN",
        airTemp: "16°C",
        trackTemp: "20°C",
        rainChance: 72,
        wind: "29 km/h W",
        gripLevel: "DAMP",
      },
      {
        session: "GRAND PRIX",
        condition: "CLOUDY",
        airTemp: "19°C",
        trackTemp: "28°C",
        rainChance: 40,
        wind: "22 km/h SW",
        gripLevel: "OPTIMAL",
      },
    ],
  },
  {
    id: "suzuka",
    round: "CLASSIC R03",
    name: "JAPANESE GRAND PRIX",
    shortName: "JAPANESE GP",
    country: "JPN",
    flag: "🇯🇵",
    city: "Suzuka",
    circuitName: "Suzuka International",
    dateLabel: "2026 Classic",
    targetIso: "2026-11-22T04:00:00Z",
    status: "SEASON CLASSIC",
    image: "/images/race-vegas.jpg",
    strategyForecast: "2-Stop: Soft → Hard → Medium (High energy Sector 1)",
    safetyCarProb: 46,
    sessions: [
      {
        session: "PRACTICE",
        condition: "SUNNY",
        airTemp: "20°C",
        trackTemp: "34°C",
        rainChance: 10,
        wind: "16 km/h E",
        gripLevel: "HIGH",
      },
      {
        session: "QUALIFYING",
        condition: "CLEAR",
        airTemp: "19°C",
        trackTemp: "31°C",
        rainChance: 12,
        wind: "14 km/h SE",
        gripLevel: "PEAK",
      },
      {
        session: "GRAND PRIX",
        condition: "CLOUDY",
        airTemp: "18°C",
        trackTemp: "27°C",
        rainChance: 30,
        wind: "19 km/h SE",
        gripLevel: "HIGH",
      },
    ],
  },
  {
    id: "monza",
    round: "CLASSIC R16",
    name: "ITALIAN GRAND PRIX",
    shortName: "ITALIAN GP",
    country: "ITA",
    flag: "🇮🇹",
    city: "Monza",
    circuitName: "Autodromo Nazionale Monza",
    dateLabel: "2026 Classic",
    targetIso: "2026-11-22T04:00:00Z",
    status: "SEASON CLASSIC",
    image: "/images/garage-car.jpg",
    strategyForecast: "1-Stop: Medium → Hard (Low-drag active aero trim)",
    safetyCarProb: 48,
    sessions: [
      {
        session: "PRACTICE",
        condition: "SUNNY",
        airTemp: "28°C",
        trackTemp: "43°C",
        rainChance: 5,
        wind: "9 km/h S",
        gripLevel: "PEAK",
      },
      {
        session: "QUALIFYING",
        condition: "SUNNY",
        airTemp: "29°C",
        trackTemp: "45°C",
        rainChance: 4,
        wind: "11 km/h SW",
        gripLevel: "PEAK",
      },
      {
        session: "GRAND PRIX",
        condition: "CLEAR",
        airTemp: "27°C",
        trackTemp: "41°C",
        rainChance: 8,
        wind: "10 km/h S",
        gripLevel: "OPTIMAL",
      },
    ],
  },
] as const;

/**
 * Automatically computes the active / next upcoming Formula 1 race based on current time.
 * A Grand Prix remains active until 4 hours after its official start time (covering full race duration + podium),
 * after which it automatically rolls over to the next scheduled championship round.
 */
export function getNextUpcomingRace(
  calendar: readonly RaceCalendarItem[] = raceCalendarData,
  nowMs: number = Date.now()
): RaceCalendarItem {
  const RACE_BUFFER_MS = 4 * 60 * 60 * 1000;
  const futureRaces = calendar.filter((r) => {
    if (r.status === "SEASON CLASSIC") return false;
    const raceEnd = new Date(r.targetIso).getTime() + RACE_BUFFER_MS;
    return raceEnd > nowMs;
  });

  return futureRaces[0] ?? calendar[0];
}

/**
 * Computes dynamic race status (NEXT RACE, LIVE NOW, COMPLETED, UPCOMING, SEASON CLASSIC)
 * based on current wall-clock time so the calendar automatically updates without manual redeploy.
 */
export function getDynamicRaceStatus(
  race: RaceCalendarItem,
  calendar: readonly RaceCalendarItem[] = raceCalendarData,
  nowMs: number = Date.now()
): "NEXT RACE" | "UPCOMING" | "LIVE NOW" | "COMPLETED" | "SEASON CLASSIC" {
  if (race.status === "SEASON CLASSIC") return "SEASON CLASSIC";
  const start = new Date(race.targetIso).getTime();
  const end = start + 4 * 60 * 60 * 1000;
  if (nowMs >= start && nowMs <= end) return "LIVE NOW";
  if (nowMs > end) return "COMPLETED";
  const next = getNextUpcomingRace(calendar, nowMs);
  return race.id === next.id ? "NEXT RACE" : "UPCOMING";
}

export type RaceSessionSchedule = {
  name: string;
  date: string;
  time?: string;
  timestamp: string;
};

export type UpcomingRaceDetail = {
  season: string;
  round: number;
  raceName: string;
  circuitId: string;
  circuitName: string;
  locality: string;
  country: string;
  flag: string;
  date: string;
  time?: string;
  raceTimestamp: string;
  sessions: RaceSessionSchedule[];
  url?: string;
};

export type RaceResultEntry = {
  position: number;
  positionText: string;
  points: number;
  driverNumber: string;
  driverCode: string;
  driverName: string;
  driverCountry: string;
  driverFlag: string;
  constructorId: string;
  constructorName: string;
  teamColor: string;
  grid: number;
  laps: number;
  status: string;
  timeOrGap: string;
  fastestLap?: {
    rank: number;
    lap: number;
    time: string;
  };
};

export type PreviousRaceResult = {
  season: string;
  round: number;
  raceName: string;
  circuitName: string;
  locality: string;
  country: string;
  flag: string;
  date: string;
  time?: string;
  winner: {
    driverName: string;
    driverCode: string;
    driverNumber: string;
    driverFlag: string;
    constructorName: string;
    teamColor: string;
    time: string;
    points: number;
  };
  fastestLapDriver?: {
    driverName: string;
    driverCode: string;
    driverNumber: string;
    constructorName: string;
    lapTime: string;
    lap: number;
  };
  results: RaceResultEntry[];
};

export const upcomingRaceDetailSnapshot: UpcomingRaceDetail = {
  season: "2026",
  round: 21,
  raceName: "Las Vegas Grand Prix",
  circuitId: "vegas",
  circuitName: "Las Vegas Strip Street Circuit",
  locality: "Las Vegas",
  country: "USA",
  flag: "🇺🇸",
  date: "2026-11-22",
  time: "04:00:00Z",
  raceTimestamp: "2026-11-22T04:00:00Z",
  sessions: [
    {
      name: "Practice 1 (FP1)",
      date: "2026-11-20",
      time: "00:30:00Z",
      timestamp: "2026-11-20T00:30:00Z",
    },
    {
      name: "Practice 2 (FP2)",
      date: "2026-11-20",
      time: "04:00:00Z",
      timestamp: "2026-11-20T04:00:00Z",
    },
    {
      name: "Practice 3 (FP3)",
      date: "2026-11-21",
      time: "00:30:00Z",
      timestamp: "2026-11-21T00:30:00Z",
    },
    {
      name: "Qualifying",
      date: "2026-11-21",
      time: "04:00:00Z",
      timestamp: "2026-11-21T04:00:00Z",
    },
    {
      name: "Grand Prix (Race)",
      date: "2026-11-22",
      time: "04:00:00Z",
      timestamp: "2026-11-22T04:00:00Z",
    },
  ],
  url: "https://en.wikipedia.org/wiki/2026_Las_Vegas_Grand_Prix",
};

export const previousRaceResultSnapshot: PreviousRaceResult = {
  season: "2026",
  round: 20,
  raceName: "Brazilian Grand Prix",
  circuitName: "Autódromo José Carlos Pace (Interlagos)",
  locality: "São Paulo",
  country: "Brazil",
  flag: "🇧🇷",
  date: "2026-11-08",
  time: "17:00:00Z",
  winner: {
    driverName: "Lando Norris",
    driverCode: "NOR",
    driverNumber: "1",
    driverFlag: "🇬🇧",
    constructorName: "McLaren",
    teamColor: "#FF8000",
    time: "1:35:23.504",
    points: 25,
  },
  fastestLapDriver: {
    driverName: "Andrea Kimi Antonelli",
    driverCode: "ANT",
    driverNumber: "12",
    constructorName: "Mercedes",
    lapTime: "1:12.689",
    lap: 55,
  },
  results: [
    {
      position: 1,
      positionText: "1",
      points: 25,
      driverNumber: "1",
      driverCode: "NOR",
      driverName: "Lando Norris",
      driverCountry: "Great Britain",
      driverFlag: "🇬🇧",
      constructorId: "mclaren",
      constructorName: "McLaren",
      teamColor: "#FF8000",
      grid: 1,
      laps: 71,
      status: "Finished",
      timeOrGap: "1:35:23.504",
      fastestLap: { rank: 3, lap: 52, time: "1:12.983" },
    },
    {
      position: 2,
      positionText: "2",
      points: 18,
      driverNumber: "3",
      driverCode: "VER",
      driverName: "Max Verstappen",
      driverCountry: "Netherlands",
      driverFlag: "🇳🇱",
      constructorId: "red_bull",
      constructorName: "Red Bull Racing",
      teamColor: "#3671C6",
      grid: 21,
      laps: 71,
      status: "Finished",
      timeOrGap: "+14.602s",
      fastestLap: { rank: 5, lap: 48, time: "1:13.131" },
    },
    {
      position: 3,
      positionText: "3",
      points: 15,
      driverNumber: "6",
      driverCode: "HAD",
      driverName: "Isack Hadjar",
      driverCountry: "France",
      driverFlag: "🇫🇷",
      constructorId: "red_bull",
      constructorName: "Red Bull Racing",
      teamColor: "#3671C6",
      grid: 5,
      laps: 71,
      status: "Finished",
      timeOrGap: "+24.485s",
      fastestLap: { rank: 2, lap: 52, time: "1:12.877" },
    },
    {
      position: 4,
      positionText: "4",
      points: 12,
      driverNumber: "63",
      driverCode: "RUS",
      driverName: "George Russell",
      driverCountry: "Great Britain",
      driverFlag: "🇬🇧",
      constructorId: "mercedes",
      constructorName: "Mercedes",
      teamColor: "#27F4D2",
      grid: 7,
      laps: 71,
      status: "Finished",
      timeOrGap: "+33.991s",
      fastestLap: { rank: 12, lap: 42, time: "1:14.040" },
    },
    {
      position: 5,
      positionText: "5",
      points: 10,
      driverNumber: "12",
      driverCode: "ANT",
      driverName: "Andrea Kimi Antonelli",
      driverCountry: "Italy",
      driverFlag: "🇮🇹",
      constructorId: "mercedes",
      constructorName: "Mercedes",
      teamColor: "#27F4D2",
      grid: 2,
      laps: 71,
      status: "Finished",
      timeOrGap: "+41.017s",
      fastestLap: { rank: 1, lap: 55, time: "1:12.689" },
    },
    {
      position: 6,
      positionText: "6",
      points: 8,
      driverNumber: "81",
      driverCode: "PIA",
      driverName: "Oscar Piastri",
      driverCountry: "Australia",
      driverFlag: "🇦🇺",
      constructorId: "mclaren",
      constructorName: "McLaren",
      teamColor: "#FF8000",
      grid: 10,
      laps: 71,
      status: "Finished",
      timeOrGap: "+56.475s",
      fastestLap: { rank: 4, lap: 54, time: "1:13.018" },
    },
    {
      position: 7,
      positionText: "7",
      points: 6,
      driverNumber: "30",
      driverCode: "LAW",
      driverName: "Liam Lawson",
      driverCountry: "New Zealand",
      driverFlag: "🇳🇿",
      constructorId: "rb",
      constructorName: "Racing Bulls",
      teamColor: "#6692FF",
      grid: 3,
      laps: 71,
      status: "Finished",
      timeOrGap: "+1:15.402",
      fastestLap: { rank: 6, lap: 51, time: "1:13.495" },
    },
    {
      position: 8,
      positionText: "8",
      points: 4,
      driverNumber: "16",
      driverCode: "LEC",
      driverName: "Charles Leclerc",
      driverCountry: "Monaco",
      driverFlag: "🇲🇨",
      constructorId: "ferrari",
      constructorName: "Ferrari",
      teamColor: "#E8002D",
      grid: 14,
      laps: 71,
      status: "Finished",
      timeOrGap: "+1:18.586",
      fastestLap: { rank: 13, lap: 51, time: "1:14.170" },
    },
    {
      position: 9,
      positionText: "9",
      points: 2,
      driverNumber: "44",
      driverCode: "HAM",
      driverName: "Lewis Hamilton",
      driverCountry: "Great Britain",
      driverFlag: "🇬🇧",
      constructorId: "ferrari",
      constructorName: "Ferrari",
      teamColor: "#E8002D",
      grid: 20,
      laps: 70,
      status: "Lapped",
      timeOrGap: "+1 Lap",
      fastestLap: { rank: 8, lap: 45, time: "1:13.724" },
    },
    {
      position: 10,
      positionText: "10",
      points: 1,
      driverNumber: "27",
      driverCode: "HUL",
      driverName: "Nico Hülkenberg",
      driverCountry: "Germany",
      driverFlag: "🇩🇪",
      constructorId: "audi",
      constructorName: "Audi F1 Team",
      teamColor: "#00E700",
      grid: 4,
      laps: 70,
      status: "Lapped",
      timeOrGap: "+1 Lap",
      fastestLap: { rank: 9, lap: 54, time: "1:14.000" },
    },
    {
      position: 11,
      positionText: "11",
      points: 0,
      driverNumber: "41",
      driverCode: "LIN",
      driverName: "Arvid Lindblad",
      driverCountry: "Great Britain",
      driverFlag: "🇬🇧",
      constructorId: "rb",
      constructorName: "Racing Bulls",
      teamColor: "#6692FF",
      grid: 18,
      laps: 70,
      status: "Lapped",
      timeOrGap: "+1 Lap",
      fastestLap: { rank: 10, lap: 54, time: "1:14.004" },
    },
    {
      position: 12,
      positionText: "12",
      points: 0,
      driverNumber: "14",
      driverCode: "ALO",
      driverName: "Fernando Alonso",
      driverCountry: "Spain",
      driverFlag: "🇪🇸",
      constructorId: "aston_martin",
      constructorName: "Aston Martin",
      teamColor: "#229971",
      grid: 8,
      laps: 70,
      status: "Lapped",
      timeOrGap: "+1 Lap",
      fastestLap: { rank: 18, lap: 52, time: "1:14.706" },
    },
    {
      position: 13,
      positionText: "13",
      points: 0,
      driverNumber: "43",
      driverCode: "COL",
      driverName: "Franco Colapinto",
      driverCountry: "Argentina",
      driverFlag: "🇦🇷",
      constructorId: "alpine",
      constructorName: "Alpine",
      teamColor: "#FF87BC",
      grid: 13,
      laps: 70,
      status: "Lapped",
      timeOrGap: "+1 Lap",
      fastestLap: { rank: 7, lap: 56, time: "1:13.710" },
    },
    {
      position: 14,
      positionText: "14",
      points: 0,
      driverNumber: "10",
      driverCode: "GAS",
      driverName: "Pierre Gasly",
      driverCountry: "France",
      driverFlag: "🇫🇷",
      constructorId: "alpine",
      constructorName: "Alpine",
      teamColor: "#FF87BC",
      grid: 15,
      laps: 70,
      status: "Lapped",
      timeOrGap: "+1 Lap",
      fastestLap: { rank: 15, lap: 40, time: "1:14.462" },
    },
    {
      position: 15,
      positionText: "15",
      points: 0,
      driverNumber: "23",
      driverCode: "ALB",
      driverName: "Alexander Albon",
      driverCountry: "Thailand",
      driverFlag: "🇹🇭",
      constructorId: "williams",
      constructorName: "Williams",
      teamColor: "#64C4FF",
      grid: 9,
      laps: 70,
      status: "Lapped",
      timeOrGap: "+1 Lap",
      fastestLap: { rank: 16, lap: 45, time: "1:14.464" },
    },
    {
      position: 16,
      positionText: "16",
      points: 0,
      driverNumber: "5",
      driverCode: "BOR",
      driverName: "Gabriel Bortoleto",
      driverCountry: "Brazil",
      driverFlag: "🇧🇷",
      constructorId: "audi",
      constructorName: "Audi F1 Team",
      teamColor: "#00E700",
      grid: 19,
      laps: 70,
      status: "Lapped",
      timeOrGap: "+1 Lap",
      fastestLap: { rank: 19, lap: 45, time: "1:14.940" },
    },
    {
      position: 17,
      positionText: "17",
      points: 0,
      driverNumber: "87",
      driverCode: "BEA",
      driverName: "Oliver Bearman",
      driverCountry: "Great Britain",
      driverFlag: "🇬🇧",
      constructorId: "haas",
      constructorName: "Haas F1 Team",
      teamColor: "#B6BABD",
      grid: 6,
      laps: 70,
      status: "Lapped",
      timeOrGap: "+1 Lap",
      fastestLap: { rank: 11, lap: 50, time: "1:14.036" },
    },
    {
      position: 18,
      positionText: "18",
      points: 0,
      driverNumber: "11",
      driverCode: "PER",
      driverName: "Sergio Pérez",
      driverCountry: "Mexico",
      driverFlag: "🇲🇽",
      constructorId: "cadillac",
      constructorName: "Cadillac F1 Team",
      teamColor: "#C0C0C0",
      grid: 22,
      laps: 69,
      status: "Lapped",
      timeOrGap: "+2 Laps",
      fastestLap: { rank: 20, lap: 52, time: "1:16.123" },
    },
    {
      position: 19,
      positionText: "19",
      points: 0,
      driverNumber: "55",
      driverCode: "SAI",
      driverName: "Carlos Sainz",
      driverCountry: "Spain",
      driverFlag: "🇪🇸",
      constructorId: "williams",
      constructorName: "Williams",
      teamColor: "#64C4FF",
      grid: 12,
      laps: 69,
      status: "Lapped",
      timeOrGap: "+2 Laps",
      fastestLap: { rank: 17, lap: 48, time: "1:14.613" },
    },
    {
      position: 20,
      positionText: "20",
      points: 0,
      driverNumber: "51",
      driverCode: "CAM",
      driverName: "Rafael Câmara",
      driverCountry: "Brazil",
      driverFlag: "🇧🇷",
      constructorId: "haas",
      constructorName: "Haas F1 Team",
      teamColor: "#B6BABD",
      grid: 11,
      laps: 69,
      status: "Lapped",
      timeOrGap: "+2 Laps",
      fastestLap: { rank: 14, lap: 51, time: "1:14.369" },
    },
    {
      position: 21,
      positionText: "DNF",
      points: 0,
      driverNumber: "18",
      driverCode: "STR",
      driverName: "Lance Stroll",
      driverCountry: "Canada",
      driverFlag: "🇨🇦",
      constructorId: "aston_martin",
      constructorName: "Aston Martin",
      teamColor: "#229971",
      grid: 16,
      laps: 30,
      status: "Retired",
      timeOrGap: "DNF",
      fastestLap: { rank: 21, lap: 28, time: "1:17.430" },
    },
    {
      position: 22,
      positionText: "DNS",
      points: 0,
      driverNumber: "77",
      driverCode: "BOT",
      driverName: "Valtteri Bottas",
      driverCountry: "Finland",
      driverFlag: "🇫🇮",
      constructorId: "cadillac",
      constructorName: "Cadillac F1 Team",
      teamColor: "#C0C0C0",
      grid: 17,
      laps: 0,
      status: "Did not start",
      timeOrGap: "DNS",
    },
  ],
};

export type DriverStanding = {
  id: string;
  position: number;
  number: string;
  code: string;
  name: string;
  teamId: string;
  team: string;
  teamColor: string;
  country: string;
  flag: string;
  image: string;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  isChampion?: boolean;
  quote: string;
  stats: {
    pace: number;
    racecraft: number;
    qualifying: number;
    wetWeather: number;
    consistency: number;
  };
};

// Accurate 2026 F1 World Drivers' Championship Standings & Official Car Numbers (as of Nov 2026)
export const driverStandings2026: readonly DriverStanding[] = [
  {
    id: "antonelli",
    position: 1,
    number: "12",
    code: "ANT",
    name: "KIMI ANTONELLI",
    teamId: "mercedes",
    team: "MERCEDES",
    teamColor: "#27F4D2",
    country: "ITA",
    flag: "🇮🇹",
    image: "/images/drivers/antonelli.webp",
    points: 390,
    wins: 9,
    podiums: 16,
    poles: 8,
    isChampion: true,
    quote: "2026 World Champion — fearless pace from lap one to the flag.",
    stats: { pace: 99, racecraft: 96, qualifying: 98, wetWeather: 97, consistency: 98 },
  },
  {
    id: "verstappen",
    position: 2,
    number: "03",
    code: "VER",
    name: "MAX VERSTAPPEN",
    teamId: "redbull",
    team: "RED BULL RACING",
    teamColor: "#3671C6",
    country: "NED",
    flag: "🇳🇱",
    image: "/images/drivers/verstappen.webp",
    points: 279,
    wins: 5,
    podiums: 12,
    poles: 6,
    quote: "Every braking zone is an opportunity to gain a tenth.",
    stats: { pace: 98, racecraft: 99, qualifying: 97, wetWeather: 99, consistency: 96 },
  },
  {
    id: "russell",
    position: 3,
    number: "63",
    code: "RUS",
    name: "GEORGE RUSSELL",
    teamId: "mercedes",
    team: "MERCEDES",
    teamColor: "#27F4D2",
    country: "GBR",
    flag: "🇬🇧",
    image: "/images/drivers/russell.webp",
    points: 262,
    wins: 3,
    podiums: 11,
    poles: 4,
    quote: "Precision execution and telemetry discipline deliver championships.",
    stats: { pace: 95, racecraft: 94, qualifying: 96, wetWeather: 93, consistency: 96 },
  },
  {
    id: "hamilton",
    position: 4,
    number: "44",
    code: "HAM",
    name: "LEWIS HAMILTON",
    teamId: "ferrari",
    team: "FERRARI",
    teamColor: "#E10600",
    country: "GBR",
    flag: "🇬🇧",
    image: "/images/drivers/hamilton.webp",
    points: 261,
    wins: 2,
    podiums: 11,
    poles: 3,
    quote: "Still chasing perfection in scarlet red.",
    stats: { pace: 95, racecraft: 98, qualifying: 94, wetWeather: 98, consistency: 95 },
  },
  {
    id: "leclerc",
    position: 5,
    number: "16",
    code: "LEC",
    name: "CHARLES LECLERC",
    teamId: "ferrari",
    team: "FERRARI",
    teamColor: "#E10600",
    country: "MON",
    flag: "🇲🇨",
    image: "/images/drivers/leclerc.webp",
    points: 249,
    wins: 2,
    podiums: 10,
    poles: 5,
    quote: "One flying lap at the absolute edge of grip is pure magic.",
    stats: { pace: 97, racecraft: 93, qualifying: 99, wetWeather: 90, consistency: 92 },
  },
  {
    id: "norris",
    position: 6,
    number: "01",
    code: "NOR",
    name: "LANDO NORRIS",
    teamId: "mclaren",
    team: "MCLAREN",
    teamColor: "#FF8000",
    country: "GBR",
    flag: "🇬🇧",
    image: "/images/drivers/norris.webp",
    points: 246,
    wins: 2,
    podiums: 10,
    poles: 3,
    quote: "Carrying #1 means attacking every corner with zero hesitation.",
    stats: { pace: 96, racecraft: 94, qualifying: 96, wetWeather: 92, consistency: 93 },
  },
  {
    id: "piastri",
    position: 7,
    number: "81",
    code: "PIA",
    name: "OSCAR PIASTRI",
    teamId: "mclaren",
    team: "MCLAREN",
    teamColor: "#FF8000",
    country: "AUS",
    flag: "🇦🇺",
    image: "/images/drivers/piastri.webp",
    points: 152,
    wins: 1,
    podiums: 5,
    poles: 1,
    quote: "Calm under wheel-to-wheel pressure.",
    stats: { pace: 93, racecraft: 95, qualifying: 92, wetWeather: 89, consistency: 94 },
  },
  {
    id: "hadjar",
    position: 8,
    number: "06",
    code: "HAD",
    name: "ISACK HADJAR",
    teamId: "redbull",
    team: "RED BULL RACING",
    teamColor: "#3671C6",
    country: "FRA",
    flag: "🇫🇷",
    image: "/images/drivers/hadjar.webp",
    points: 122,
    wins: 0,
    podiums: 3,
    poles: 0,
    quote: "Pushing the RB chassis to every apex.",
    stats: { pace: 91, racecraft: 90, qualifying: 90, wetWeather: 88, consistency: 89 },
  },
  {
    id: "lawson",
    position: 9,
    number: "30",
    code: "LAW",
    name: "LIAM LAWSON",
    teamId: "racingbulls",
    team: "RACING BULLS",
    teamColor: "#6692FF",
    country: "NZL",
    flag: "🇳🇿",
    image: "/images/drivers/lawson.webp",
    points: 89,
    wins: 0,
    podiums: 1,
    poles: 0,
    quote: "Fearless late braking in every midfield battle.",
    stats: { pace: 88, racecraft: 91, qualifying: 87, wetWeather: 88, consistency: 89 },
  },
  {
    id: "gasly",
    position: 10,
    number: "10",
    code: "GAS",
    name: "PIERRE GASLY",
    teamId: "alpine",
    team: "ALPINE",
    teamColor: "#FF87BC",
    country: "FRA",
    flag: "🇫🇷",
    image: "/images/drivers/gasly.webp",
    points: 42,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Extracting every point on Sunday afternoon.",
    stats: { pace: 87, racecraft: 89, qualifying: 88, wetWeather: 90, consistency: 88 },
  },
  {
    id: "lindblad",
    position: 11,
    number: "41",
    code: "LIN",
    name: "ARVID LINDBLAD",
    teamId: "racingbulls",
    team: "RACING BULLS",
    teamColor: "#6692FF",
    country: "GBR",
    flag: "🇬🇧",
    image: "/images/drivers/lindblad.webp",
    points: 38,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Rookie hunger meeting 2026 hybrid speed.",
    stats: { pace: 87, racecraft: 86, qualifying: 88, wetWeather: 85, consistency: 84 },
  },
  {
    id: "colapinto",
    position: 12,
    number: "43",
    code: "COL",
    name: "FRANCO COLAPINTO",
    teamId: "alpine",
    team: "ALPINE",
    teamColor: "#FF87BC",
    country: "ARG",
    flag: "🇦🇷",
    image: "/images/drivers/colapinto.webp",
    points: 27,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Flat out through every street circuit wall.",
    stats: { pace: 86, racecraft: 87, qualifying: 85, wetWeather: 84, consistency: 83 },
  },
  {
    id: "bearman",
    position: 13,
    number: "87",
    code: "BEA",
    name: "OLIVER BEARMAN",
    teamId: "haas",
    team: "HAAS F1 TEAM",
    teamColor: "#B6BABD",
    country: "GBR",
    flag: "🇬🇧",
    image: "/images/drivers/bearman.webp",
    points: 23,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Maximizing tire management in tight battles.",
    stats: { pace: 85, racecraft: 86, qualifying: 86, wetWeather: 85, consistency: 85 },
  },
  {
    id: "bortoleto",
    position: 14,
    number: "05",
    code: "BOR",
    name: "GABRIEL BORTOLETO",
    teamId: "audi",
    team: "AUDI",
    teamColor: "#F50537",
    country: "BRA",
    flag: "🇧🇷",
    image: "/images/drivers/bortoleto.webp",
    points: 14,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Building Audi's new factory chapter lap by lap.",
    stats: { pace: 85, racecraft: 85, qualifying: 86, wetWeather: 83, consistency: 86 },
  },
  {
    id: "hulkenberg",
    position: 15,
    number: "27",
    code: "HUL",
    name: "NICO HÜLKENBERG",
    teamId: "audi",
    team: "AUDI",
    teamColor: "#F50537",
    country: "GER",
    flag: "🇩🇪",
    image: "/images/drivers/hulkenberg.webp",
    points: 14,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Experience and Saturday precision.",
    stats: { pace: 86, racecraft: 85, qualifying: 89, wetWeather: 87, consistency: 87 },
  },
  {
    id: "ocon",
    position: 16,
    number: "31",
    code: "OCO",
    name: "ESTEBAN OCON",
    teamId: "haas",
    team: "HAAS F1 TEAM",
    teamColor: "#B6BABD",
    country: "FRA",
    flag: "🇫🇷",
    image: "/images/drivers/ocon.webp",
    points: 7,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Defending every position to the line.",
    stats: { pace: 84, racecraft: 86, qualifying: 83, wetWeather: 88, consistency: 85 },
  },
  {
    id: "alonso",
    position: 17,
    number: "14",
    code: "ALO",
    name: "FERNANDO ALONSO",
    teamId: "aston",
    team: "ASTON MARTIN",
    teamColor: "#229971",
    country: "ESP",
    flag: "🇪🇸",
    image: "/images/drivers/alonso.webp",
    points: 7,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Racecraft never ages.",
    stats: { pace: 87, racecraft: 96, qualifying: 86, wetWeather: 94, consistency: 91 },
  },
  {
    id: "sainz",
    position: 18,
    number: "55",
    code: "SAI",
    name: "CARLOS SAINZ",
    teamId: "williams",
    team: "WILLIAMS",
    teamColor: "#64C4FF",
    country: "ESP",
    flag: "🇪🇸",
    image: "/images/drivers/sainz.webp",
    points: 7,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Smooth operator pushing Williams forward.",
    stats: { pace: 88, racecraft: 90, qualifying: 88, wetWeather: 88, consistency: 90 },
  },
  {
    id: "albon",
    position: 19,
    number: "23",
    code: "ALB",
    name: "ALEXANDER ALBON",
    teamId: "williams",
    team: "WILLIAMS",
    teamColor: "#64C4FF",
    country: "THA",
    flag: "🇹🇭",
    image: "/images/drivers/albon.webp",
    points: 5,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Long stints and bold overtakes.",
    stats: { pace: 86, racecraft: 88, qualifying: 86, wetWeather: 85, consistency: 87 },
  },
  {
    id: "stroll",
    position: 20,
    number: "18",
    code: "STR",
    name: "LANCE STROLL",
    teamId: "aston",
    team: "ASTON MARTIN",
    teamColor: "#229971",
    country: "CAN",
    flag: "🇨🇦",
    image: "/images/drivers/stroll.webp",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Opening lap starts and wet-track pace.",
    stats: { pace: 81, racecraft: 82, qualifying: 80, wetWeather: 86, consistency: 80 },
  },
  {
    id: "bottas",
    position: 21,
    number: "77",
    code: "BOT",
    name: "VALTTERI BOTTAS",
    teamId: "cadillac",
    team: "CADILLAC",
    teamColor: "#D4AF37",
    country: "FIN",
    flag: "🇫🇮",
    image: "/images/drivers/bottas.webp",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Developing Cadillac's debut F1 program.",
    stats: { pace: 83, racecraft: 82, qualifying: 85, wetWeather: 83, consistency: 86 },
  },
  {
    id: "perez",
    position: 22,
    number: "11",
    code: "PER",
    name: "SERGIO PÉREZ",
    teamId: "cadillac",
    team: "CADILLAC",
    teamColor: "#D4AF37",
    country: "MEX",
    flag: "🇲🇽",
    image: "/images/drivers/perez.webp",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    quote: "Tire whispers and street-track precision.",
    stats: { pace: 82, racecraft: 86, qualifying: 80, wetWeather: 84, consistency: 82 },
  },
] as const;

export type TeamSponsorPartner = {
  name: string;
  role: string;
  zone: string;
};

export type TeamRaceEngineer = {
  driverName: string;
  carNumber: string;
  engineer: string;
};

export type ConstructorTeam = {
  id: string;
  position: number;
  name: string;
  shortName: string;
  carCode: string;
  carImage: string;
  titleSponsor: string;
  color: string;
  accentGlow: string;
  points: number;
  drivers: [string, string];
  powerUnit: string;
  base: string;
  isChampion?: boolean;
  chassisSpecs: {
    weight: string;
    ersOutput: string;
    topSpeed: string;
    aeroConcept: string;
  };
  pitCrew: {
    teamPrincipal: string;
    technicalDirector: string;
    pitStopBest: string;
    raceEngineers: readonly TeamRaceEngineer[];
  };
  sponsors: readonly TeamSponsorPartner[];
};

export const constructorStandings2026: readonly ConstructorTeam[] = [
  {
    id: "mercedes",
    position: 1,
    name: "MERCEDES-AMG PETRONAS",
    shortName: "MERCEDES",
    carCode: "W17",
    carImage: "/images/cars/mercedes.jpg",
    titleSponsor: "PETRONAS",
    color: "#27F4D2",
    accentGlow: "rgba(39, 244, 210, 0.25)",
    points: 652,
    drivers: ["Kimi Antonelli #12", "George Russell #63"],
    powerUnit: "Mercedes-AMG F1 M17",
    base: "Brackley, UK",
    isChampion: true,
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "362 KM/H",
      aeroConcept: "Ultra-Compact Active X/Z-Mode Underfloor",
    },
    pitCrew: {
      teamPrincipal: "Toto Wolff",
      technicalDirector: "James Allison",
      pitStopBest: "1.91 SEC",
      raceEngineers: [
        { driverName: "Kimi Antonelli", carNumber: "#12", engineer: "Peter Bonnington" },
        { driverName: "George Russell", carNumber: "#63", engineer: "Marcus Dudley" },
      ],
    },
    sponsors: [
      { name: "PETRONAS", role: "Title & Fluid Technology", zone: "Sidepod Flank & Rear Wing" },
      { name: "INEOS", role: "Principal Performance Partner", zone: "Roll-Hoop Airbox Intake" },
      { name: "TEAMVIEWER", role: "Remote Operations Partner", zone: "Engine Cover & Endplates" },
      { name: "IWC SCHAFFHAUSEN", role: "Official Timekeeper", zone: "Front Wing Endplates" },
    ],
  },
  {
    id: "ferrari",
    position: 2,
    name: "SCUDERIA FERRARI HP",
    shortName: "FERRARI",
    carCode: "SF-26",
    carImage: "/images/cars/ferrari.jpg",
    titleSponsor: "HP",
    color: "#E10600",
    accentGlow: "rgba(225, 6, 0, 0.28)",
    points: 510,
    drivers: ["Lewis Hamilton #44", "Charles Leclerc #16"],
    powerUnit: "Ferrari 067/6",
    base: "Maranello, Italy",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "360 KM/H",
      aeroConcept: "High-Downwash Pull-Rod Overbite Inlet",
    },
    pitCrew: {
      teamPrincipal: "Frédéric Vasseur",
      technicalDirector: "Loïc Serra",
      pitStopBest: "1.94 SEC",
      raceEngineers: [
        { driverName: "Lewis Hamilton", carNumber: "#44", engineer: "Riccardo Adami" },
        { driverName: "Charles Leclerc", carNumber: "#16", engineer: "Bryan Bozzi" },
      ],
    },
    sponsors: [
      { name: "HP", role: "Title Enterprise Partner", zone: "Rear Wing & Engine Cover" },
      { name: "SHELL V-POWER", role: "Innovation Fuel Partner", zone: "Sidepod Undercut Flank" },
      { name: "UNICREDIT", role: "Principal Banking Partner", zone: "Shark Fin & Nosecone" },
      { name: "PUMA MOTORSPORT", role: "Official Racewear Supplier", zone: "Halo & Wheel Endplates" },
    ],
  },
  {
    id: "redbull",
    position: 3,
    name: "ORACLE RED BULL RACING",
    shortName: "RED BULL",
    carCode: "RB22",
    carImage: "/images/cars/redbull.jpg",
    titleSponsor: "ORACLE",
    color: "#3671C6",
    accentGlow: "rgba(54, 113, 198, 0.28)",
    points: 415,
    drivers: ["Max Verstappen #3", "Isack Hadjar #6"],
    powerUnit: "Red Bull Ford DM01",
    base: "Milton Keynes, UK",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "359 KM/H",
      aeroConcept: "Vortex Venturi Channel & Steep Ramp Pod",
    },
    pitCrew: {
      teamPrincipal: "Laurent Mekies",
      technicalDirector: "Pierre Waché",
      pitStopBest: "1.87 SEC",
      raceEngineers: [
        { driverName: "Max Verstappen", carNumber: "#3", engineer: "Gianpiero Lambiase" },
        { driverName: "Isack Hadjar", carNumber: "#6", engineer: "Hugh Bird" },
      ],
    },
    sponsors: [
      { name: "ORACLE", role: "Title Cloud Telemetry Partner", zone: "Sidepod Flank & Rear Wing" },
      { name: "FORD RACING", role: "Powertrain Co-Developer", zone: "Nosecone & Engine Cover" },
      { name: "TAG HEUER", role: "Official Chronograph", zone: "Cockpit Halo & Front Wing" },
      { name: "CASTROL EDGE", role: "Lubricant Technology", zone: "Floor Edge Strakes" },
    ],
  },
  {
    id: "mclaren",
    position: 4,
    name: "MCLAREN FORMULA 1",
    shortName: "MCLAREN",
    carCode: "MCL40",
    carImage: "/images/cars/mclaren.jpg",
    titleSponsor: "OKX",
    color: "#FF8000",
    accentGlow: "rgba(255, 128, 0, 0.26)",
    points: 398,
    drivers: ["Lando Norris #1", "Oscar Piastri #81"],
    powerUnit: "Mercedes-AMG",
    base: "Woking, UK",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "358 KM/H",
      aeroConcept: "Low-Drag Anti-Dive Front Suspension Geometry",
    },
    pitCrew: {
      teamPrincipal: "Andrea Stella",
      technicalDirector: "Peter Prodromou",
      pitStopBest: "1.84 SEC",
      raceEngineers: [
        { driverName: "Lando Norris", carNumber: "#1", engineer: "Will Joseph" },
        { driverName: "Oscar Piastri", carNumber: "#81", engineer: "Tom Stallard" },
      ],
    },
    sponsors: [
      { name: "OKX", role: "Primary Partner", zone: "Sidepod & Rear Wing Endplates" },
      { name: "GOOGLE CHROME", role: "Official Browser & Aero Partner", zone: "Engine Cover & Wheel Discs" },
      { name: "MASTERCARD", role: "Principal Naming Partner", zone: "Nosecone Bridge & Halo" },
      { name: "DEWALT", role: "Pit Equipment Partner", zone: "Front Wing Cascade" },
    ],
  },
  {
    id: "racingbulls",
    position: 5,
    name: "VISA CASH APP RACING BULLS",
    shortName: "RACING BULLS",
    carCode: "VCARB",
    carImage: "/images/cars/racingbulls.jpg",
    titleSponsor: "VISA CASH APP",
    color: "#6692FF",
    accentGlow: "rgba(102, 146, 255, 0.22)",
    points: 114,
    drivers: ["Liam Lawson #30", "Arvid Lindblad #41"],
    powerUnit: "Red Bull Ford",
    base: "Faenza, Italy",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "355 KM/H",
      aeroConcept: "Slimline Undercut Floor & Twin-Stay Mirrors",
    },
    pitCrew: {
      teamPrincipal: "Alan Permane",
      technicalDirector: "Tim Goss",
      pitStopBest: "2.05 SEC",
      raceEngineers: [
        { driverName: "Liam Lawson", carNumber: "#30", engineer: "Ernesto Desiderio" },
        { driverName: "Arvid Lindblad", carNumber: "#41", engineer: "Mattia Spini" },
      ],
    },
    sponsors: [
      { name: "VISA", role: "Co-Title Partner", zone: "Sidepod Flank & Front Wing" },
      { name: "CASH APP", role: "Co-Title Partner", zone: "Rear Wing Flap & Halo" },
      { name: "HUGO", role: "Official Apparel Partner", zone: "Engine Cover Fin" },
      { name: "RED BULL FORD", role: "Power Unit Partner", zone: "Nosecone & Airbox" },
    ],
  },
  {
    id: "alpine",
    position: 6,
    name: "BWT ALPINE F1 TEAM",
    shortName: "ALPINE",
    carCode: "A526",
    carImage: "/images/cars/alpine.jpg",
    titleSponsor: "BWT",
    color: "#FF87BC",
    accentGlow: "rgba(255, 135, 188, 0.22)",
    points: 69,
    drivers: ["Pierre Gasly #10", "Franco Colapinto #43"],
    powerUnit: "Mercedes-AMG",
    base: "Enstone, UK",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "354 KM/H",
      aeroConcept: "Lightweight Exposed-Carbon Gulley Bodywork",
    },
    pitCrew: {
      teamPrincipal: "Oliver Oakes",
      technicalDirector: "David Sanchez",
      pitStopBest: "2.11 SEC",
      raceEngineers: [
        { driverName: "Pierre Gasly", carNumber: "#10", engineer: "John Howard" },
        { driverName: "Franco Colapinto", carNumber: "#43", engineer: "Josh Peckett" },
      ],
    },
    sponsors: [
      { name: "BWT", role: "Title Water Technology Partner", zone: "Sidepod & Rear Wing" },
      { name: "ENI", role: "Official Energy Partner", zone: "Engine Cover & Nosecone" },
      { name: "MSC CRUISES", role: "Principal Travel Partner", zone: "Front Wing Endplates" },
      { name: "CASTORE", role: "Teamwear Partner", zone: "Cockpit Headrest" },
    ],
  },
  {
    id: "haas",
    position: 7,
    name: "MONEYGRAM HAAS F1",
    shortName: "HAAS",
    carCode: "VF-26",
    carImage: "/images/cars/haas.jpg",
    titleSponsor: "MONEYGRAM",
    color: "#B6BABD",
    accentGlow: "rgba(182, 186, 189, 0.2)",
    points: 31,
    drivers: ["Oliver Bearman #87", "Esteban Ocon #31"],
    powerUnit: "Ferrari",
    base: "Kannapolis, USA",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "353 KM/H",
      aeroConcept: "Compact Ferrari Gearbox Packaging & Rear Diffuser",
    },
    pitCrew: {
      teamPrincipal: "Ayao Komatsu",
      technicalDirector: "Andrea De Zordo",
      pitStopBest: "2.14 SEC",
      raceEngineers: [
        { driverName: "Oliver Bearman", carNumber: "#87", engineer: "Ronan O'Hare" },
        { driverName: "Esteban Ocon", carNumber: "#31", engineer: "Mark Slade" },
      ],
    },
    sponsors: [
      { name: "MONEYGRAM", role: "Title Financial Partner", zone: "Engine Cover & Rear Wing" },
      { name: "TOYOTA GAZOO", role: "Technical Alliance Partner", zone: "Sidepod Flank" },
      { name: "KOMATSU", role: "Principal Machinery Partner", zone: "Nosecone & Endplates" },
      { name: "PALM ANGELS", role: "Culture Partner", zone: "Halo Trim" },
    ],
  },
  {
    id: "audi",
    position: 8,
    name: "AUDI F1 FACTORY TEAM",
    shortName: "AUDI",
    carCode: "AFR26",
    carImage: "/images/cars/audi.jpg",
    titleSponsor: "AUDI SPORT",
    color: "#F50537",
    accentGlow: "rgba(245, 5, 55, 0.22)",
    points: 28,
    drivers: ["Gabriel Bortoleto #5", "Nico Hülkenberg #27"],
    powerUnit: "Audi AFR26 Hybrid",
    base: "Hinwil / Neuburg",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "352 KM/H",
      aeroConcept: "Neuburg Factory Integrated Powertrain Aero",
    },
    pitCrew: {
      teamPrincipal: "Jonathan Wheatley",
      technicalDirector: "Mattia Binotto",
      pitStopBest: "2.18 SEC",
      raceEngineers: [
        { driverName: "Gabriel Bortoleto", carNumber: "#5", engineer: "José Manuel López" },
        { driverName: "Nico Hülkenberg", carNumber: "#27", engineer: "Steven Petrik" },
      ],
    },
    sponsors: [
      { name: "AUDI SPORT", role: "Works Factory Constructor", zone: "Full Sidepod & Rear Flap" },
      { name: "BP CASTROL", role: "Fuel & E-Thermal Partner", zone: "Engine Cover Spine" },
      { name: "REVOLUT", role: "FinTech Principal Partner", zone: "Nosecone & Wing Endplates" },
      { name: "ADIDAS", role: "Performance Apparel", zone: "Halo & Driver Overalls" },
    ],
  },
  {
    id: "williams",
    position: 9,
    name: "ATLASSIAN WILLIAMS RACING",
    shortName: "WILLIAMS",
    carCode: "FW48",
    carImage: "/images/cars/williams.jpg",
    titleSponsor: "ATLASSIAN",
    color: "#64C4FF",
    accentGlow: "rgba(100, 196, 255, 0.2)",
    points: 12,
    drivers: ["Carlos Sainz #55", "Alexander Albon #23"],
    powerUnit: "Mercedes-AMG",
    base: "Grove, UK",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "356 KM/H",
      aeroConcept: "Straight-Line Efficiency Trim & Carbon Pushrod",
    },
    pitCrew: {
      teamPrincipal: "James Vowles",
      technicalDirector: "Pat Fry",
      pitStopBest: "2.09 SEC",
      raceEngineers: [
        { driverName: "Carlos Sainz", carNumber: "#55", engineer: "Gaëtan Jego" },
        { driverName: "Alexander Albon", carNumber: "#23", engineer: "James Urwin" },
      ],
    },
    sponsors: [
      { name: "ATLASSIAN", role: "Title Collaboration Partner", zone: "Sidepod Flank & Rear Wing" },
      { name: "KOMATSU", role: "Engineering Partner", zone: "Nosecone & Engine Cover" },
      { name: "DURACELL", role: "Battery Tech Partner", zone: "Roll-Hoop Airbox Intake" },
      { name: "GULF", role: "Heritage Partner", zone: "Front Wing Endplates" },
    ],
  },
  {
    id: "aston",
    position: 10,
    name: "ASTON MARTIN ARAMCO",
    shortName: "ASTON MARTIN",
    carCode: "AMR26",
    carImage: "/images/cars/aston.jpg",
    titleSponsor: "ARAMCO",
    color: "#229971",
    accentGlow: "rgba(34, 153, 113, 0.22)",
    points: 7,
    drivers: ["Fernando Alonso #14", "Lance Stroll #18"],
    powerUnit: "Honda RA626H",
    base: "Silverstone, UK",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "352 KM/H",
      aeroConcept: "Newey-Era High-Undercut Diffuser & Honda Works PU",
    },
    pitCrew: {
      teamPrincipal: "Andy Cowell",
      technicalDirector: "Adrian Newey",
      pitStopBest: "2.16 SEC",
      raceEngineers: [
        { driverName: "Fernando Alonso", carNumber: "#14", engineer: "Andrew Vizard" },
        { driverName: "Lance Stroll", carNumber: "#18", engineer: "Gary Gannon" },
      ],
    },
    sponsors: [
      { name: "ARAMCO", role: "Title Synthetic Fuels Partner", zone: "Engine Cover & Rear Wing" },
      { name: "COGNIZANT", role: "Global Digital Partner", zone: "Sidepod Flank" },
      { name: "HONDA", role: "Works Power Unit Partner", zone: "Shark Fin & Rear Cowl" },
      { name: "VALVOLINE", role: "Technical Lubricants", zone: "Front Wing Endplates" },
    ],
  },
  {
    id: "cadillac",
    position: 11,
    name: "CADILLAC FORMULA 1",
    shortName: "CADILLAC",
    carCode: "CAD26",
    carImage: "/images/cars/cadillac.jpg",
    titleSponsor: "CADILLAC",
    color: "#D4AF37",
    accentGlow: "rgba(212, 175, 55, 0.2)",
    points: 0,
    drivers: ["Valtteri Bottas #77", "Sergio Pérez #11"],
    powerUnit: "Ferrari",
    base: "Silverstone / Detroit",
    chassisSpecs: {
      weight: "768 KG",
      ersOutput: "350 KW MGU-K",
      topSpeed: "350 KM/H",
      aeroConcept: "11th-Entry Ground-Effect Carbon Chassis & GM Aero",
    },
    pitCrew: {
      teamPrincipal: "Graeme Lowdon",
      technicalDirector: "Nick Chester",
      pitStopBest: "2.28 SEC",
      raceEngineers: [
        { driverName: "Valtteri Bottas", carNumber: "#77", engineer: "Julien Simon-Chautemps" },
        { driverName: "Sergio Pérez", carNumber: "#11", engineer: "Richard Wood" },
      ],
    },
    sponsors: [
      { name: "CADILLAC", role: "Works Automotive Entry", zone: "Engine Cover & Nosecone" },
      { name: "GENERAL MOTORS", role: "Factory Engineering", zone: "Sidepod Flank & Rear Wing" },
      { name: "TWG MOTORSPORTS", role: "Operations Group", zone: "Rear Wing Endplates" },
      { name: "TOMMY HILFIGER", role: "Official Apparel", zone: "Cockpit Halo & Front Wing" },
    ],
  },
] as const;

export type GaragePart = {
  id: string;
  label: string;
  x: number;
  y: number;
  summary: string;
  specs: { label: string; value: string; percent: number }[];
};

export const garageParts: readonly GaragePart[] = [
  {
    id: "front-wing",
    label: "FRONT WING",
    x: 84,
    y: 66,
    summary:
      "2026 active Z/X-mode front wing flap angles dynamically adjust to trim drag on straights and maximize front-end bite into apexes.",
    specs: [
      { label: "DOWNFORCE LOAD", value: "510 KG", percent: 84 },
      { label: "ACTIVE AERO ANGLE", value: "Z-MODE / X-MODE", percent: 92 },
      { label: "CARBON FLEX STIFFNESS", value: "96.2%", percent: 96 },
    ],
  },
  {
    id: "cockpit",
    label: "COCKPIT",
    x: 54,
    y: 38,
    summary:
      "Titanium Halo integrated into the ultra-light carbon survival cell with steering telemetry OLED displaying ERS boost and overtake override.",
    specs: [
      { label: "IMPACT LOAD", value: "125 KN", percent: 98 },
      { label: "STEERING WEIGHT", value: "1.3 KG", percent: 88 },
      { label: "VISOR TELEMETRY", value: "LIVE HUD", percent: 95 },
    ],
  },
  {
    id: "sidepod",
    label: "SIDE POD",
    x: 42,
    y: 52,
    summary:
      "Undercut carbon bodywork channels high-velocity air down toward the diffuser throat while cooling the 350 kW electric MGU-K battery pack.",
    specs: [
      { label: "COOLING FLOW", value: "440 L/SEC", percent: 89 },
      { label: "UNDERCUT EFFICIENCY", value: "93%", percent: 93 },
      { label: "THERMAL DISPERSAL", value: "52.4%", percent: 86 },
    ],
  },
  {
    id: "rear-wing",
    label: "REAR WING",
    x: 16,
    y: 32,
    summary:
      "Dual-element active rear wing sheds over 26% aerodynamic drag when X-mode engages, delivering +18 km/h overtaking velocity.",
    specs: [
      { label: "DRAG REDUCTION", value: "-26%", percent: 82 },
      { label: "ACTUATION SPEED", value: "90 MS", percent: 94 },
      { label: "ENDPLATE VORTEX", value: "OPTIMIZED", percent: 90 },
    ],
  },
  {
    id: "floor",
    label: "FLOOR",
    x: 46,
    y: 72,
    summary:
      "Sculpted underbody tunnels accelerate ground airflow to generate massive suction without dirty air wake behind the car.",
    specs: [
      { label: "GROUND SUCTION", value: "58% SHARE", percent: 95 },
      { label: "RIDE HEIGHT WINDOW", value: "2.2 MM", percent: 84 },
      { label: "WAKE CLEANLINESS", value: "91%", percent: 91 },
    ],
  },
  {
    id: "tyres",
    label: "TYRES",
    x: 72,
    y: 68,
    summary:
      "2026-spec 18-inch narrower Pirelli slicks engineered for rapid thermal warm-up and reduced unsprung rotational inertia.",
    specs: [
      { label: "THERMAL WINDOW", value: "95°C – 115°C", percent: 88 },
      { label: "PEAK LATERAL G", value: "5.8 G", percent: 96 },
      { label: "COMPOUND LIFE", value: "28 LAPS", percent: 78 },
    ],
  },
] as const;

export type WorldCircuit = {
  id: string;
  name: string;
  raceTitle: string;
  country: string;
  lat: number;
  lon: number;
  turnName: string;
  turnDesc: string;
  speedKmh: number;
  gear: string;
  distanceM: number;
  lengthKm: string;
  laps: number;
  lapRecord: string;
  path: string;
};

export const worldCircuits: readonly WorldCircuit[] = [
  {
    id: "monaco",
    name: "Monaco",
    raceTitle: "MONACO GRAND PRIX",
    country: "Monte Carlo",
    lat: 43.73,
    lon: 7.42,
    turnName: "TURN 1 // SAINTE DÉVOTE",
    turnDesc: "Slow corner, heavy braking required.",
    speedKmh: 120,
    gear: "2nd",
    distanceM: 320,
    lengthKm: "3.337 KM",
    laps: 78,
    lapRecord: "1:12.909",
    path: "M 92 188 L 210 188 C 235 188 240 165 258 155 C 282 142 308 156 322 136 C 334 118 306 108 320 90 C 336 70 375 78 368 106 C 362 128 336 122 332 142 C 328 164 358 182 335 202 C 310 222 252 204 228 198 C 205 192 195 218 165 214 C 138 210 132 184 106 196 C 88 204 62 198 60 176 C 58 152 72 138 82 152 C 88 164 78 188 92 188 Z",
  },
  {
    id: "vegas",
    name: "Las Vegas",
    raceTitle: "LAS VEGAS GRAND PRIX",
    country: "United States",
    lat: 36.11,
    lon: -115.17,
    turnName: "TURN 14 // THE STRIP CHICANE",
    turnDesc: "350 km/h braking zone into tight left-right.",
    speedKmh: 94,
    gear: "2nd",
    distanceM: 610,
    lengthKm: "6.201 KM",
    laps: 50,
    lapRecord: "1:34.876",
    path: "M 48 184 L 298 184 C 330 184 352 162 346 132 C 340 108 310 112 292 94 C 272 74 282 54 248 54 L 136 54 C 102 54 88 78 104 104 C 118 126 78 134 58 154 C 42 168 38 184 48 184 Z",
  },
  {
    id: "silverstone",
    name: "Silverstone",
    raceTitle: "BRITISH GRAND PRIX",
    country: "United Kingdom",
    lat: 52.07,
    lon: -1.01,
    turnName: "TURN 9 // COPSE CORNER",
    turnDesc: "Flat-out 295 km/h apex pulling 5.4 lateral G.",
    speedKmh: 294,
    gear: "7th",
    distanceM: 440,
    lengthKm: "5.891 KM",
    laps: 52,
    lapRecord: "1:27.097",
    path: "M 130 212 L 240 205 C 268 202 280 185 266 168 C 254 154 275 138 298 142 C 326 146 346 118 330 92 C 314 68 278 78 265 62 C 250 44 212 42 192 60 C 174 76 158 58 134 70 C 110 82 118 112 96 124 C 74 136 54 128 52 154 C 50 180 78 184 86 202 C 94 218 112 214 130 212 Z",
  },
  {
    id: "monza",
    name: "Monza",
    raceTitle: "ITALIAN GRAND PRIX",
    country: "Italy",
    lat: 45.62,
    lon: 9.28,
    turnName: "TURN 1 // VARIANTE DEL RETTIFILO",
    turnDesc: "Extreme deceleration from 360 to 72 km/h.",
    speedKmh: 72,
    gear: "1st",
    distanceM: 540,
    lengthKm: "5.793 KM",
    laps: 53,
    lapRecord: "1:21.046",
    path: "M 55 190 L 290 190 C 315 190 322 182 325 170 L 332 165 C 365 150 385 118 360 85 C 340 58 300 62 272 68 L 245 74 C 232 76 226 65 212 62 C 195 58 188 74 172 72 C 145 68 135 50 110 56 C 85 62 82 94 102 110 C 118 124 108 142 84 146 C 58 150 36 168 42 182 C 45 188 49 190 55 190 Z",
  },
  {
    id: "suzuka",
    name: "Suzuka",
    raceTitle: "JAPANESE GRAND PRIX",
    country: "Japan",
    lat: 34.84,
    lon: 136.54,
    turnName: "TURN 15 // 130R",
    turnDesc: "Iconic ultra-fast left-hander at 315 km/h.",
    speedKmh: 315,
    gear: "8th",
    distanceM: 490,
    lengthKm: "5.807 KM",
    laps: 53,
    lapRecord: "1:30.983",
    path: "M 122 182 L 258 182 C 296 182 325 162 322 134 C 318 106 286 112 276 94 C 266 76 294 58 270 46 C 244 34 222 68 202 88 C 176 114 148 136 118 118 C 94 104 68 124 62 94 C 56 64 98 52 122 68 C 148 86 176 118 198 152 C 216 180 186 206 146 202 C 118 198 92 182 122 182 Z",
  },
  {
    id: "singapore",
    name: "Singapore",
    raceTitle: "SINGAPORE GRAND PRIX",
    country: "Marina Bay",
    lat: 1.29,
    lon: 103.86,
    turnName: "TURN 1 // SHEARES",
    turnDesc: "Humid night braking zone under Marina Bay lights.",
    speedKmh: 136,
    gear: "3rd",
    distanceM: 380,
    lengthKm: "4.940 KM",
    laps: 62,
    lapRecord: "1:33.808",
    path: "M 70 175 L 250 175 C 285 175 315 152 308 124 C 302 98 338 92 342 70 C 346 46 295 44 265 64 C 238 82 205 62 175 76 C 145 90 135 128 108 124 C 82 120 62 142 70 175 Z",
  },
] as const;

export type TireCompound = {
  id: string;
  name: string;
  code: string;
  color: string;
  grip: number;
  durability: number;
  warmUp: number;
  windowLaps: string;
  optimalTemp: string;
  description: string;
  curvePath: string;
};

export const tireCompounds: readonly TireCompound[] = [
  {
    id: "soft",
    name: "P ZERO SOFT",
    code: "C5",
    color: "#E10600",
    grip: 98,
    durability: 38,
    warmUp: 96,
    windowLaps: "12 – 18 LAPS",
    optimalTemp: "95°C – 115°C",
    description:
      "Maximum mechanical grip and rapid thermal warm-up built for qualifying flyers and aggressive undercut pit strategies.",
    curvePath: "M 18 28 Q 90 32 145 78 T 282 142",
  },
  {
    id: "medium",
    name: "P ZERO MEDIUM",
    code: "C3",
    color: "#FFD12E",
    grip: 82,
    durability: 72,
    warmUp: 78,
    windowLaps: "22 – 32 LAPS",
    optimalTemp: "90°C – 110°C",
    description:
      "The strategic all-rounder balancing fierce opening stint pace with resilient thermal consistency across long runs.",
    curvePath: "M 18 44 Q 115 48 185 74 T 282 114",
  },
  {
    id: "hard",
    name: "P ZERO HARD",
    code: "C1",
    color: "#F2F2F2",
    grip: 68,
    durability: 96,
    warmUp: 54,
    windowLaps: "35 – 48 LAPS",
    optimalTemp: "100°C – 120°C",
    description:
      "Engineered for high-energy circuits and marathon stints. Takes longer to fire up, then delivers relentless lap consistency.",
    curvePath: "M 18 64 Q 140 62 215 74 T 282 88",
  },
  {
    id: "inter",
    name: "CINTURATO INTER",
    code: "INT",
    color: "#39B54A",
    grip: 76,
    durability: 65,
    warmUp: 88,
    windowLaps: "CROSSOVER",
    optimalTemp: "65°C – 85°C",
    description:
      "Treaded compound evacuating up to 30 liters of standing water per second at 300 km/h on damp asphalt.",
    curvePath: "M 18 52 Q 110 58 190 86 T 282 122",
  },
  {
    id: "wet",
    name: "CINTURATO FULL WET",
    code: "WET",
    color: "#0090FF",
    grip: 64,
    durability: 78,
    warmUp: 90,
    windowLaps: "HEAVY RAIN",
    optimalTemp: "55°C – 75°C",
    description:
      "Deep directional grooves disperse over 85 liters of water per second per tire to prevent aquaplaning in torrential rain.",
    curvePath: "M 18 66 Q 125 68 200 84 T 282 104",
  },
] as const;

export const pollOptions2026 = [
  { id: "antonelli", label: "Kimi Antonelli (#12)", baseVotes: 420 },
  { id: "verstappen", label: "Max Verstappen (#3)", baseVotes: 310 },
  { id: "hamilton", label: "Lewis Hamilton (#44)", baseVotes: 245 },
  { id: "leclerc", label: "Charles Leclerc (#16)", baseVotes: 198 },
  { id: "norris", label: "Lando Norris (#1)", baseVotes: 185 },
] as const;
