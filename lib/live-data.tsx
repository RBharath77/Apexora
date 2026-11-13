"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  LiveF1Payload,
  LiveWeatherSnapshot,
} from "../app/api/f1-live/route";
import {
  constructorStandings2026,
  driverStandings2026,
  previousRaceResultSnapshot,
  upcomingRaceDetailSnapshot,
  type ConstructorTeam,
  type DriverStanding,
  type PreviousRaceResult,
  type UpcomingRaceDetail,
} from "./constants";

type LiveDataContextValue = {
  drivers: DriverStanding[];
  constructors: ConstructorTeam[];
  weatherByRace: Record<string, LiveWeatherSnapshot>;
  liveMessages: string[];
  upcomingRace: UpcomingRaceDetail;
  previousRaceResult: PreviousRaceResult;
  source: LiveF1Payload["source"] | "LIVE_SIM";
  updatedAt: string;
  latencyMs: number;
  isSyncing: boolean;
  liveSimActive: boolean;
  positionDeltas: Record<string, number>;
  pointsDeltas: Record<string, number>;
  toggleLiveSim: () => void;
  syncNow: () => Promise<void>;
};

const LiveDataContext = createContext<LiveDataContextValue | null>(null);

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<DriverStanding[]>(() => [
    ...driverStandings2026,
  ]);
  const [constructors, setConstructors] = useState<ConstructorTeam[]>(() => [
    ...constructorStandings2026,
  ]);
  const [weatherByRace, setWeatherByRace] = useState<
    Record<string, LiveWeatherSnapshot>
  >({});
  const [upcomingRace, setUpcomingRace] = useState<UpcomingRaceDetail>(
    () => upcomingRaceDetailSnapshot
  );
  const [previousRaceResult, setPreviousRaceResult] = useState<PreviousRaceResult>(
    () => previousRaceResultSnapshot
  );
  const [liveMessages, setLiveMessages] = useState<string[]>([
    "2026 CHAMPIONSHIP: K. ANTONELLI (#12) CLINCHES WDC • MERCEDES CLINCHES WCC (652 PTS)",
    "NEXT GRAND PRIX: ROUND 21 LAS VEGAS GP — NOV 19–21, 2026",
  ]);
  const [source, setSource] = useState<LiveDataContextValue["source"]>(
    "LOCAL_SNAPSHOT"
  );
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [latencyMs, setLatencyMs] = useState<number>(1);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [liveSimActive, setLiveSimActive] = useState<boolean>(false);
  const [positionDeltas, setPositionDeltas] = useState<Record<string, number>>(
    {}
  );
  const [pointsDeltas, setPointsDeltas] = useState<Record<string, number>>({});

  const prevPositionsRef = useRef<Record<string, number>>(
    Object.fromEntries(driverStandings2026.map((d) => [d.id, d.position]))
  );
  const driversRef = useRef<DriverStanding[]>([...driverStandings2026]);
  const constructorsRef = useRef<ConstructorTeam[]>([...constructorStandings2026]);

  useEffect(() => {
    driversRef.current = drivers;
  }, [drivers]);

  useEffect(() => {
    constructorsRef.current = constructors;
  }, [constructors]);

  const applyNewDrivers = useCallback((nextDrivers: DriverStanding[]) => {
    const posDiffs: Record<string, number> = {};
    const prevMap = prevPositionsRef.current;

    for (const d of nextDrivers) {
      const oldPos = prevMap[d.id];
      if (typeof oldPos === "number" && oldPos !== d.position) {
        posDiffs[d.id] = oldPos - d.position; // Positive = gained positions
      }
      prevMap[d.id] = d.position;
    }

    if (Object.keys(posDiffs).length > 0) {
      setPositionDeltas(posDiffs);
    }
    setDrivers(nextDrivers);
  }, []);

  const fetchLive = useCallback(
    async (force = false) => {
      if (document.hidden && !force) return;
      setIsSyncing(true);
      const t0 = performance.now();

      try {
        const res = await fetch(
          force ? "/api/f1-live?refresh=1" : "/api/f1-live",
          {
            cache: "no-store",
            signal: AbortSignal.timeout(3000),
          }
        );
        if (!res.ok) return;
        const data = (await res.json()) as LiveF1Payload;
        const rtt = Math.max(1, Math.round(performance.now() - t0));

        setLatencyMs(rtt);
        setUpdatedAt(data.updatedAt);
        setSource(data.source);

        if (!liveSimActive) {
          if (Array.isArray(data.drivers) && data.drivers.length > 0) {
            applyNewDrivers(data.drivers);
          }
          if (
            Array.isArray(data.constructors) &&
            data.constructors.length > 0
          ) {
            setConstructors(data.constructors);
          }
        }

        if (data.weatherByRace) {
          setWeatherByRace(data.weatherByRace);
        }
        if (data.upcomingRace) {
          setUpcomingRace(data.upcomingRace);
        }
        if (data.previousRaceResult) {
          setPreviousRaceResult(data.previousRaceResult);
        }
        if (Array.isArray(data.liveMessages) && data.liveMessages.length > 0) {
          setLiveMessages(data.liveMessages);
        }
      } catch {
        // Keep existing state instantaneously if offline
      } finally {
        setIsSyncing(false);
      }
    },
    [applyNewDrivers, liveSimActive]
  );

  // Silent initial sync + low-overhead 20s visibility-aware polling
  useEffect(() => {
    setUpdatedAt((prev) => prev || new Date().toISOString());
    void fetchLive(false);

    const interval = window.setInterval(() => {
      if (!document.hidden && !liveSimActive) {
        void fetchLive(false);
      }
    }, 20_000);

    const onVisChange = () => {
      if (!document.hidden && !liveSimActive) {
        void fetchLive(false);
      }
    };
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [fetchLive, liveSimActive]);

  // Live Race Projection Simulation Mode (Demonstrates live scoring/position updates every 2.8s)
  useEffect(() => {
    if (!liveSimActive) {
      setPointsDeltas({});
      return;
    }

    setSource("LIVE_SIM");
    const simInterval = window.setInterval(() => {
      if (document.hidden) return;

      const clone = driversRef.current.map((d) => ({ ...d }));
      // Pick two close contenders in top 8 to swap/gain points dynamically
      const idx = Math.floor(Math.random() * 6) + 1; // P2..P7 battle
      const racer = clone[idx];
      if (!racer) return;

      const ptsGain = Math.random() > 0.45 ? 3 : 2;
      racer.points += ptsGain;

      const sorted = [...clone]
        .sort((a, b) => b.points - a.points)
        .map((d, i) => ({ ...d, position: i + 1 }));

      const diffs: Record<string, number> = {};
      for (const d of sorted) {
        const oldP = prevPositionsRef.current[d.id];
        if (typeof oldP === "number" && oldP !== d.position) {
          diffs[d.id] = oldP - d.position;
        }
        prevPositionsRef.current[d.id] = d.position;
      }

      const teamTotals = new Map<string, number>();
      for (const drv of sorted) {
        teamTotals.set(
          drv.teamId,
          (teamTotals.get(drv.teamId) ?? 0) + drv.points
        );
      }
      const nextConstructors = constructorsRef.current
        .map((t) => ({
          ...t,
          points: Math.max(t.points, teamTotals.get(t.id) ?? t.points),
        }))
        .sort((a, b) => b.points - a.points)
        .map((t, idxT) => ({ ...t, position: idxT + 1 }));

      driversRef.current = sorted;
      constructorsRef.current = nextConstructors;

      setDrivers(sorted);
      setPointsDeltas((pd) => ({
        ...pd,
        [racer.id]: (pd[racer.id] ?? 0) + ptsGain,
      }));
      if (Object.keys(diffs).length > 0) {
        setPositionDeltas(diffs);
      }
      setConstructors(nextConstructors);
      setLiveMessages((msgs) => [
        `LIVE PROJECTION: ${racer.name} (#${racer.number}) +${ptsGain} LIVE PTS — TOTAL ${racer.points} PTS`,
        ...msgs.slice(0, 3),
      ]);
      setUpdatedAt(new Date().toISOString());
    }, 2800);

    return () => window.clearInterval(simInterval);
  }, [liveSimActive]);

  const toggleLiveSim = useCallback(() => {
    setLiveSimActive((prev) => {
      const next = !prev;
      if (!next) {
        // Restore official 2026 snapshot cleanly when turning off sim
        const reset = [...driverStandings2026];
        prevPositionsRef.current = Object.fromEntries(
          reset.map((d) => [d.id, d.position])
        );
        setPositionDeltas({});
        setPointsDeltas({});
        setDrivers(reset);
        setConstructors([...constructorStandings2026]);
        void fetchLive(true);
      }
      return next;
    });
  }, [fetchLive]);

  const syncNow = useCallback(async () => {
    setLiveSimActive(false);
    setPositionDeltas({});
    setPointsDeltas({});
    await fetchLive(true);
  }, [fetchLive]);

  return (
    <LiveDataContext.Provider
      value={{
        drivers,
        constructors,
        weatherByRace,
        liveMessages,
        upcomingRace,
        previousRaceResult,
        source,
        updatedAt,
        latencyMs,
        isSyncing,
        liveSimActive,
        positionDeltas,
        pointsDeltas,
        toggleLiveSim,
        syncNow,
      }}
    >
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  const ctx = useContext(LiveDataContext);
  if (!ctx) {
    throw new Error("useLiveData must be used inside LiveDataProvider");
  }
  return ctx;
}
