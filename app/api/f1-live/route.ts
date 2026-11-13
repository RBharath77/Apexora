import { NextResponse } from "next/server";
import {
  constructorStandings2026,
  driverStandings2026,
  previousRaceResultSnapshot,
  upcomingRaceDetailSnapshot,
  type ConstructorTeam,
  type DriverStanding,
  type PreviousRaceResult,
  type RaceResultEntry,
  type RaceSessionSchedule,
  type UpcomingRaceDetail,
} from "../../../lib/constants";

export const dynamic = "force-dynamic";

export type LiveWeatherSnapshot = {
  airTemp: string;
  trackTemp: string;
  rainChance: number;
  wind: string;
  condition: "CLEAR" | "SUNNY" | "CLOUDY" | "RAIN" | "NIGHT";
};

export type LiveF1Payload = {
  source: "LIVE_API" | "HYBRID_CACHE" | "LOCAL_SNAPSHOT";
  updatedAt: string;
  serverLatencyMs: number;
  sessionBanner: string;
  drivers: DriverStanding[];
  constructors: ConstructorTeam[];
  weatherByRace: Record<string, LiveWeatherSnapshot>;
  liveMessages: string[];
  upcomingRace: UpcomingRaceDetail;
  previousRaceResult: PreviousRaceResult;
};

const RACE_COORDS: Record<string, { lat: number; lon: number; isNight?: boolean }> = {
  vegas: { lat: 36.1147, lon: -115.1728, isNight: true },
  qatar: { lat: 25.49, lon: 51.4542, isNight: true },
  abudhabi: { lat: 24.4672, lon: 54.6031, isNight: true },
  monaco: { lat: 43.7347, lon: 7.4206 },
  silverstone: { lat: 52.0786, lon: -1.0169 },
  suzuka: { lat: 34.8431, lon: 136.541 },
  monza: { lat: 45.6156, lon: 9.2811 },
};

type CachedEntry = {
  payload: LiveF1Payload;
  timestamp: number;
};

let memoryCache: CachedEntry | null = null;
let refreshInFlight: Promise<LiveF1Payload> | null = null;
const CACHE_TTL_MS = 20_000;

function mapWmoToCondition(
  code: number,
  isNight?: boolean
): LiveWeatherSnapshot["condition"] {
  if (code >= 51) return "RAIN";
  if (code >= 2 && code <= 48) return "CLOUDY";
  if (isNight) return "NIGHT";
  return code === 0 ? "SUNNY" : "CLEAR";
}

function compassDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8] ?? "N";
}

async function fetchJsonWithTimeout<T>(url: string, timeoutMs = 1700): Promise<T | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type JolpicaDriverRes = {
  MRData?: {
    StandingsTable?: {
      season?: string;
      StandingsLists?: Array<{
        DriverStandings?: Array<{
          position?: string;
          points?: string;
          wins?: string;
          Driver?: {
            givenName?: string;
            familyName?: string;
            code?: string;
            permanentNumber?: string;
          };
          Constructors?: Array<{ name?: string }>;
        }>;
      }>;
    };
  };
};

type JolpicaConstructorRes = {
  MRData?: {
    StandingsTable?: {
      season?: string;
      StandingsLists?: Array<{
        ConstructorStandings?: Array<{
          position?: string;
          points?: string;
          wins?: string;
          Constructor?: { name?: string };
        }>;
      }>;
    };
  };
};

type JolpicaRaceResultRes = {
  MRData?: {
    RaceTable?: {
      season?: string;
      round?: string;
      Races?: Array<{
        season?: string;
        round?: string;
        raceName?: string;
        Circuit?: {
          circuitId?: string;
          circuitName?: string;
          Location?: {
            locality?: string;
            country?: string;
          };
        };
        date?: string;
        time?: string;
        Results?: Array<{
          number?: string;
          position?: string;
          positionText?: string;
          points?: string;
          grid?: string;
          laps?: string;
          status?: string;
          Time?: {
            time?: string;
          };
          FastestLap?: {
            rank?: string;
            lap?: string;
            Time?: {
              time?: string;
            };
          };
          Driver?: {
            driverId?: string;
            code?: string;
            givenName?: string;
            familyName?: string;
            permanentNumber?: string;
            nationality?: string;
          };
          Constructor?: {
            constructorId?: string;
            name?: string;
          };
        }>;
      }>;
    };
  };
};

type JolpicaNextRaceRes = {
  MRData?: {
    RaceTable?: {
      season?: string;
      round?: string;
      Races?: Array<{
        season?: string;
        round?: string;
        raceName?: string;
        url?: string;
        Circuit?: {
          circuitId?: string;
          circuitName?: string;
          Location?: {
            locality?: string;
            country?: string;
          };
        };
        date?: string;
        time?: string;
        FirstPractice?: { date?: string; time?: string };
        SecondPractice?: { date?: string; time?: string };
        ThirdPractice?: { date?: string; time?: string };
        Qualifying?: { date?: string; time?: string };
        Sprint?: { date?: string; time?: string };
        SprintQualifying?: { date?: string; time?: string };
      }>;
    };
  };
};

function getFlagForCountry(country: string): string {
  const c = (country || "").toLowerCase();
  if (c.includes("brit") || c.includes("uk") || c.includes("eng")) return "🇬🇧";
  if (c.includes("dutch") || c.includes("nether")) return "🇳🇱";
  if (c.includes("fran")) return "🇫🇷";
  if (c.includes("ital")) return "🇮🇹";
  if (c.includes("austral")) return "🇦🇺";
  if (c.includes("zealand")) return "🇳🇿";
  if (c.includes("monaco") || c.includes("mone")) return "🇲🇨";
  if (c.includes("germ")) return "🇩🇪";
  if (c.includes("spain") || c.includes("span")) return "🇪🇸";
  if (c.includes("argent")) return "🇦🇷";
  if (c.includes("thai")) return "🇹🇭";
  if (c.includes("brazil")) return "🇧🇷";
  if (c.includes("mexic")) return "🇲🇽";
  if (c.includes("canad")) return "🇨🇦";
  if (c.includes("fin")) return "🇫🇮";
  if (c.includes("usa") || c.includes("united states") || c.includes("amer")) return "🇺🇸";
  if (c.includes("qatar")) return "🇶🇦";
  if (c.includes("abu dhabi") || c.includes("uae") || c.includes("emirates")) return "🇦🇪";
  if (c.includes("japan")) return "🇯🇵";
  if (c.includes("china")) return "🇨🇳";
  if (c.includes("singapore")) return "🇸🇬";
  if (c.includes("austria")) return "🇦🇹";
  return "🏁";
}

const TEAM_PALETTES: Record<string, string> = {
  mclaren: "#FF8000",
  red_bull: "#3671C6",
  mercedes: "#27F4D2",
  ferrari: "#E8002D",
  rb: "#6692FF",
  audi: "#00E700",
  alpine: "#FF87BC",
  aston_martin: "#229971",
  williams: "#64C4FF",
  haas: "#B6BABD",
  cadillac: "#C0C0C0",
};

type OpenMeteoCurrent = {
  current?: {
    temperature_2m?: number;
    precipitation_probability?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
  };
};

type OpenF1RaceControl = Array<{
  message?: string;
  flag?: string;
}>;

async function buildLiveSnapshot(): Promise<LiveF1Payload> {
  const started = performance.now();

  const [
    driverApi,
    constructorApi,
    lastResultApi,
    nextRaceApi,
    raceControlApi,
    ...weatherResults
  ] = await Promise.all([
    fetchJsonWithTimeout<JolpicaDriverRes>(
      "https://api.jolpi.ca/ergast/f1/current/driverStandings.json",
      1700
    ),
    fetchJsonWithTimeout<JolpicaConstructorRes>(
      "https://api.jolpi.ca/ergast/f1/current/constructorStandings.json",
      1700
    ),
    fetchJsonWithTimeout<JolpicaRaceResultRes>(
      "https://api.jolpi.ca/ergast/f1/current/last/results.json",
      1800
    ),
    fetchJsonWithTimeout<JolpicaNextRaceRes>(
      "https://api.jolpi.ca/ergast/f1/current/next.json",
      1800
    ),
    fetchJsonWithTimeout<OpenF1RaceControl>(
      "https://api.openf1.org/v1/race_control?session_key=latest",
      1600
    ),
    ...Object.entries(RACE_COORDS).map(async ([id, coords]) => {
      const data = await fetchJsonWithTimeout<OpenMeteoCurrent>(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m`,
        1600
      );
      return [id, coords, data] as const;
    }),
  ]);

  let usedLiveData = false;

  // Merge live Driver Standings if returned cleanly for 2026+
  let drivers: DriverStanding[] = [...driverStandings2026];
  const apiDrivers =
    driverApi?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
  const apiSeason = Number(driverApi?.MRData?.StandingsTable?.season ?? 0);

  if (apiDrivers && apiDrivers.length >= 10 && apiSeason >= 2026) {
    usedLiveData = true;
    const baseByCode = new Map(driverStandings2026.map((d) => [d.code, d]));
    const merged: DriverStanding[] = [];

    for (const item of apiDrivers) {
      const code = (item.Driver?.code ?? "").toUpperCase();
      const base = baseByCode.get(code);
      const pos = Number(item.position ?? merged.length + 1);
      const pts = Number(item.points ?? base?.points ?? 0);
      const wins = Number(item.wins ?? base?.wins ?? 0);
      const fullName = item.Driver
        ? `${item.Driver.givenName ?? ""} ${item.Driver.familyName ?? ""}`
            .trim()
            .toUpperCase()
        : base?.name ?? code;

      if (base) {
        merged.push({
          ...base,
          position: pos,
          points: pts,
          wins,
          name: fullName || base.name,
        });
      }
    }

    if (merged.length >= 10) {
      drivers = merged.sort((a, b) => a.position - b.position);
    }
  }

  // Merge live Constructor Standings
  let constructors: ConstructorTeam[] = [...constructorStandings2026];
  const apiConstructors =
    constructorApi?.MRData?.StandingsTable?.StandingsLists?.[0]
      ?.ConstructorStandings;
  const conSeason = Number(constructorApi?.MRData?.StandingsTable?.season ?? 0);

  if (apiConstructors && apiConstructors.length >= 8 && conSeason >= 2026) {
    usedLiveData = true;
    const nextConstructors = constructors.map((c) => {
      const match = apiConstructors.find((ac) =>
        (ac.Constructor?.name ?? "")
          .toLowerCase()
          .includes(c.shortName.toLowerCase())
      );
      if (!match) return c;
      return {
        ...c,
        position: Number(match.position ?? c.position),
        points: Number(match.points ?? c.points),
      };
    });
    constructors = nextConstructors.sort((a, b) => a.position - b.position);
  }

  // Merge live Weather from Open-Meteo
  const weatherByRace: Record<string, LiveWeatherSnapshot> = {};
  for (const [id, coords, data] of weatherResults) {
    if (data?.current && typeof data.current.temperature_2m === "number") {
      usedLiveData = true;
      const air = Math.round(data.current.temperature_2m);
      const rain = Math.round(data.current.precipitation_probability ?? 5);
      const windSpeed = Math.round(data.current.wind_speed_10m ?? 12);
      const windDir = compassDirection(data.current.wind_direction_10m ?? 0);
      const condition = mapWmoToCondition(
        data.current.weather_code ?? 0,
        coords.isNight
      );

      weatherByRace[id] = {
        airTemp: `${air}°C`,
        trackTemp: `${air + (condition === "SUNNY" ? 12 : 4)}°C`,
        rainChance: rain,
        wind: `${windSpeed} km/h ${windDir}`,
        condition,
      };
    }
  }

  // Live Race Control messages
  const liveMessages: string[] = [];
  if (Array.isArray(raceControlApi) && raceControlApi.length > 0) {
    usedLiveData = true;
    for (const msg of raceControlApi.slice(-4).reverse()) {
      if (msg.message) liveMessages.push(msg.message);
    }
  }

  if (liveMessages.length === 0) {
    liveMessages.push(
      "2026 FIA CHAMPIONSHIP LIVE: K. ANTONELLI (#12) CLINCHES WDC • MERCEDES CLINCHES WCC (652 PTS)",
      "NEXT SESSION: ROUND 21 LAS VEGAS GRAND PRIX — NOV 19–21, 2026",
      "TRACK CONTROL: ACTIVE AERO X/Z ZONES CALIBRATED FOR LOW-DRAG STRAIGHTS"
    );
  }

  // Merge live previous race results from Ergast/Jolpica if available
  let previousRaceResult: PreviousRaceResult = previousRaceResultSnapshot;
  const rawLastRace = lastResultApi?.MRData?.RaceTable?.Races?.[0];
  if (rawLastRace && Array.isArray(rawLastRace.Results) && rawLastRace.Results.length > 0) {
    usedLiveData = true;
    const parsedResults: RaceResultEntry[] = rawLastRace.Results.map((r, i) => {
      const code = (r.Driver?.code ?? "").toUpperCase();
      const pos = Number(r.position ?? i + 1);
      const conId = (r.Constructor?.constructorId ?? "").toLowerCase();
      const teamColor = TEAM_PALETTES[conId] ?? "#ffffff";
      const given = r.Driver?.givenName ?? "";
      const family = r.Driver?.familyName ?? "";
      const name = `${given} ${family}`.trim() || code;
      const status = r.status ?? "Finished";
      const timeOrGap =
        r.Time?.time ??
        (status === "Finished" ? "+1 Lap" : status);
      const grid = Number(r.grid ?? 0);
      const laps = Number(r.laps ?? 0);
      const points = Number(r.points ?? 0);
      const fastestLap = r.FastestLap?.Time?.time
        ? {
            rank: Number(r.FastestLap.rank ?? 0),
            lap: Number(r.FastestLap.lap ?? 0),
            time: r.FastestLap.Time.time,
          }
        : undefined;

      return {
        position: pos,
        positionText: r.positionText ?? String(pos),
        points,
        driverNumber: r.number ?? r.Driver?.permanentNumber ?? String(pos),
        driverCode: code,
        driverName: name,
        driverCountry: r.Driver?.nationality ?? "",
        driverFlag: getFlagForCountry(r.Driver?.nationality ?? ""),
        constructorId: conId,
        constructorName: r.Constructor?.name ?? conId.toUpperCase(),
        teamColor,
        grid,
        laps,
        status,
        timeOrGap,
        fastestLap,
      };
    });

    const winnerEntry = parsedResults[0];
    const flEntry = parsedResults.find((p) => p.fastestLap?.rank === 1);

    previousRaceResult = {
      season: rawLastRace.season ?? "2026",
      round: Number(rawLastRace.round ?? 20),
      raceName: rawLastRace.raceName ?? "Grand Prix",
      circuitName: rawLastRace.Circuit?.circuitName ?? "Circuit",
      locality: rawLastRace.Circuit?.Location?.locality ?? "",
      country: rawLastRace.Circuit?.Location?.country ?? "",
      flag: getFlagForCountry(rawLastRace.Circuit?.Location?.country ?? "Brazil"),
      date: rawLastRace.date ?? "2026-11-08",
      time: rawLastRace.time ?? "17:00:00Z",
      winner: {
        driverName: winnerEntry?.driverName ?? "Lando Norris",
        driverCode: winnerEntry?.driverCode ?? "NOR",
        driverNumber: winnerEntry?.driverNumber ?? "1",
        driverFlag: winnerEntry?.driverFlag ?? "🇬🇧",
        constructorName: winnerEntry?.constructorName ?? "McLaren",
        teamColor: winnerEntry?.teamColor ?? "#FF8000",
        time: winnerEntry?.timeOrGap ?? "1:35:23.504",
        points: winnerEntry?.points ?? 25,
      },
      fastestLapDriver:
        flEntry && flEntry.fastestLap
          ? {
              driverName: flEntry.driverName,
              driverCode: flEntry.driverCode,
              driverNumber: flEntry.driverNumber,
              constructorName: flEntry.constructorName,
              lapTime: flEntry.fastestLap.time,
              lap: flEntry.fastestLap.lap,
            }
          : undefined,
      results: parsedResults,
    };
  }

  // Merge live upcoming race details from Ergast/Jolpica if available
  let upcomingRace: UpcomingRaceDetail = upcomingRaceDetailSnapshot;
  const rawNextRace = nextRaceApi?.MRData?.RaceTable?.Races?.[0];
  if (rawNextRace) {
    usedLiveData = true;
    const sessions: RaceSessionSchedule[] = [];
    if (rawNextRace.FirstPractice) {
      sessions.push({
        name: "Practice 1 (FP1)",
        date: rawNextRace.FirstPractice.date ?? "",
        time: rawNextRace.FirstPractice.time,
        timestamp: `${rawNextRace.FirstPractice.date}T${rawNextRace.FirstPractice.time ?? "00:00:00Z"}`,
      });
    }
    if (rawNextRace.SprintQualifying) {
      sessions.push({
        name: "Sprint Shootout",
        date: rawNextRace.SprintQualifying.date ?? "",
        time: rawNextRace.SprintQualifying.time,
        timestamp: `${rawNextRace.SprintQualifying.date}T${rawNextRace.SprintQualifying.time ?? "00:00:00Z"}`,
      });
    }
    if (rawNextRace.SecondPractice) {
      sessions.push({
        name: "Practice 2 (FP2)",
        date: rawNextRace.SecondPractice.date ?? "",
        time: rawNextRace.SecondPractice.time,
        timestamp: `${rawNextRace.SecondPractice.date}T${rawNextRace.SecondPractice.time ?? "00:00:00Z"}`,
      });
    }
    if (rawNextRace.Sprint) {
      sessions.push({
        name: "Sprint Race",
        date: rawNextRace.Sprint.date ?? "",
        time: rawNextRace.Sprint.time,
        timestamp: `${rawNextRace.Sprint.date}T${rawNextRace.Sprint.time ?? "00:00:00Z"}`,
      });
    }
    if (rawNextRace.ThirdPractice) {
      sessions.push({
        name: "Practice 3 (FP3)",
        date: rawNextRace.ThirdPractice.date ?? "",
        time: rawNextRace.ThirdPractice.time,
        timestamp: `${rawNextRace.ThirdPractice.date}T${rawNextRace.ThirdPractice.time ?? "00:00:00Z"}`,
      });
    }
    if (rawNextRace.Qualifying) {
      sessions.push({
        name: "Qualifying",
        date: rawNextRace.Qualifying.date ?? "",
        time: rawNextRace.Qualifying.time,
        timestamp: `${rawNextRace.Qualifying.date}T${rawNextRace.Qualifying.time ?? "00:00:00Z"}`,
      });
    }
    if (rawNextRace.date) {
      sessions.push({
        name: "Grand Prix (Race)",
        date: rawNextRace.date,
        time: rawNextRace.time,
        timestamp: `${rawNextRace.date}T${rawNextRace.time ?? "04:00:00Z"}`,
      });
    }

    const raceIso = `${rawNextRace.date}T${rawNextRace.time ?? "04:00:00Z"}`;
    upcomingRace = {
      season: rawNextRace.season ?? "2026",
      round: Number(rawNextRace.round ?? 21),
      raceName: rawNextRace.raceName ?? "Grand Prix",
      circuitId: rawNextRace.Circuit?.circuitId ?? "vegas",
      circuitName: rawNextRace.Circuit?.circuitName ?? "Circuit",
      locality: rawNextRace.Circuit?.Location?.locality ?? "Las Vegas",
      country: rawNextRace.Circuit?.Location?.country ?? "USA",
      flag: getFlagForCountry(rawNextRace.Circuit?.Location?.country ?? "USA"),
      date: rawNextRace.date ?? "2026-11-22",
      time: rawNextRace.time ?? "04:00:00Z",
      raceTimestamp: raceIso,
      sessions,
      url: rawNextRace.url,
    };
  }

  const payload: LiveF1Payload = {
    source: usedLiveData ? "LIVE_API" : "LOCAL_SNAPSHOT",
    updatedAt: new Date().toISOString(),
    serverLatencyMs: Math.max(1, Math.round(performance.now() - started)),
    sessionBanner: usedLiveData
      ? "LIVE UPSTREAM FEED SYNCED"
      : "2026 OFFICIAL STANDINGS // LOW-LATENCY SNAPSHOT",
    drivers,
    constructors,
    weatherByRace,
    liveMessages,
    upcomingRace,
    previousRaceResult,
  };

  memoryCache = {
    payload,
    timestamp: Date.now(),
  };

  return payload;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "1";

  if (
    !forceRefresh &&
    memoryCache &&
    Date.now() - memoryCache.timestamp < CACHE_TTL_MS
  ) {
    return NextResponse.json(
      {
        ...memoryCache.payload,
        source:
          memoryCache.payload.source === "LIVE_API"
            ? "HYBRID_CACHE"
            : memoryCache.payload.source,
        serverLatencyMs: 1,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
        },
      }
    );
  }

  if (!refreshInFlight) {
    refreshInFlight = buildLiveSnapshot().finally(() => {
      refreshInFlight = null;
    });
  }

  // If we already have stale cache and aren't forcing refresh, return stale in <2ms while background refreshes
  if (!forceRefresh && memoryCache) {
    return NextResponse.json(memoryCache.payload, {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
      },
    });
  }

  const payload = await refreshInFlight;
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
    },
  });
}

