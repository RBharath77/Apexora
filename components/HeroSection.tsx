"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  getDynamicRaceStatus,
  getNextUpcomingRace,
  heroTelemetry,
  raceCalendarData,
} from "../lib/constants";
import { useFavorites } from "../lib/favorites";
import { useLiveData } from "../lib/live-data";
import { cn, hexToRgba } from "../lib/utils";
import Button from "./Button";
import F1Car3DViewer from "./F1Car3DViewer";
import {
  F1_LIVERIES,
  resolveLiveryFromTeamId,
  type F1LiveryId,
} from "./f1CarModel";

type CountdownParts = {
  days: string;
  hrs: string;
  mins: string;
  secs: string;
  isLive?: boolean;
};

function computeCountdown(targetIso: string): CountdownParts {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) {
    const isLive = diff > -4 * 60 * 60 * 1000;
    return {
      days: "00",
      hrs: "00",
      mins: "00",
      secs: "00",
      isLive,
    };
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return {
    days: String(d).padStart(2, "0"),
    hrs: String(h).padStart(2, "0"),
    mins: String(m).padStart(2, "0"),
    secs: String(s).padStart(2, "0"),
    isLive: false,
  };
}

export default function HeroSection() {
  const [drsOpen, setDrsOpen] = useState(false);
  const { favorites } = useFavorites();
  const {
    drivers,
    constructors,
    weatherByRace,
    liveMessages,
    upcomingRace,
    previousRaceResult,
  } = useLiveData();
  const [liveryId, setLiveryId] = useState<F1LiveryId>(() =>
    resolveLiveryFromTeamId(favorites.teamId)
  );

  useEffect(() => {
    setLiveryId(resolveLiveryFromTeamId(favorites.teamId));
  }, [favorites.teamId]);

  // Automatic rollover: after race day (+4h buffer), automatically advances to next upcoming Grand Prix
  const [autoRaceId, setAutoRaceId] = useState(() => getNextUpcomingRace(raceCalendarData).id);

  useEffect(() => {
    const checkRollover = () => {
      const currentNext = getNextUpcomingRace(raceCalendarData);
      setAutoRaceId(currentNext.id);
    };
    checkRollover();
    const id = window.setInterval(checkRollover, 10000);
    return () => window.clearInterval(id);
  }, []);

  const activeRaceId = favorites.raceId || autoRaceId;
  const selectedRace =
    raceCalendarData.find((r) => r.id === activeRaceId) ??
    getNextUpcomingRace(raceCalendarData);
  const dynamicStatus = getDynamicRaceStatus(selectedRace);

  const liveWeather = weatherByRace[selectedRace.id];
  const raceNightWeather = liveWeather ?? selectedRace.sessions[2];

  const [countdown, setCountdown] = useState<CountdownParts>({
    days: "00",
    hrs: "00",
    mins: "00",
    secs: "00",
  });

  useEffect(() => {
    setCountdown(computeCountdown(selectedRace.targetIso));
    const id = window.setInterval(() => {
      if (!document.hidden) {
        setCountdown(computeCountdown(selectedRace.targetIso));
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [selectedRace.targetIso]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      document.documentElement.classList.add("f1-entered");
    }, 1450);
    return () => window.clearTimeout(id);
  }, []);

  const handleDrsToggle = () => {
    setDrsOpen((prev) => !prev);
  };

  const leader = drivers[0];
  const leaderTeam = constructors[0];

  const liveTickerItems = [
    {
      label: "LAST GP WINNER",
      value: `🏆 ${previousRaceResult?.winner?.driverName?.toUpperCase() ?? "L. NORRIS"} (${previousRaceResult?.winner?.constructorName?.toUpperCase() ?? "MCLAREN"}) • ${previousRaceResult?.raceName?.toUpperCase() ?? "BRAZILIAN GP"}`,
    },
    {
      label: "NEXT GRAND PRIX",
      value: `🏁 ${upcomingRace?.raceName?.toUpperCase() ?? "LAS VEGAS GP"} (RD ${upcomingRace?.round ?? 21}) • ${upcomingRace?.date ?? "NOV 22"}`,
    },
    {
      label: "P1 WDC LIVE",
      value: `${leader?.name ?? "K. ANTONELLI"} (#${leader?.number ?? "12"}) • ${leader?.points ?? 390} PTS`,
    },
    {
      label: "P1 WCC LIVE",
      value: `${leaderTeam?.shortName ?? "MERCEDES"} • ${leaderTeam?.points ?? 652} PTS`,
    },
    {
      label: "RACE CONTROL",
      value: liveMessages[0] ?? "TRACK CLEAR",
    },
    ...heroTelemetry.slice(2),
  ];

  const activeTeamAccent = F1_LIVERIES[liveryId]?.accent ?? "#27F4D2";

  return (
    <section
      id="home"
      className={cn("hero-shell", drsOpen && "drs-active")}
      style={
        {
          "--hero-team-solid": activeTeamAccent,
          "--hero-stage-accent": hexToRgba(activeTeamAccent, 0.22),
          "--hero-drs-accent": hexToRgba(activeTeamAccent, 0.34),
        } as CSSProperties
      }
    >
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow hero-glow-left" aria-hidden="true" />
      <div className="hero-glow hero-glow-right" aria-hidden="true" />

      {/* Center / Right Real-Time 360° Interactive 3D F1 Car */}
      <div className="hero-3d-stage hero-stagger-stage">
        <F1Car3DViewer
          variant="hero"
          liveryId={liveryId}
          onChangeLivery={setLiveryId}
          drsOpen={drsOpen}
          onToggleDrs={handleDrsToggle}
        />
      </div>

      {/* Top-Right Live Race Countdown + Live Weather Widget */}
      <aside
        className="hero-countdown-card hero-stagger-card"
        aria-label="Next Race Countdown"
      >
        <div className="countdown-top-row">
          <span className="countdown-label">
            <span className="status-pulse" />
            {countdown.isLive ? "LIVE ON TRACK" : dynamicStatus}
          </span>
          <span className="countdown-round">{selectedRace.round}</span>
        </div>

        <h2 className="countdown-race-name">
          {selectedRace.flag} {selectedRace.name}
        </h2>
        <span className="countdown-city">{selectedRace.city}</span>

        <div className="countdown-digits">
          <div>
            <strong>{countdown.days}</strong>
            <span>DAYS</span>
          </div>
          <div>
            <strong>{countdown.hrs}</strong>
            <span>HRS</span>
          </div>
          <div>
            <strong>{countdown.mins}</strong>
            <span>MINS</span>
          </div>
          <div>
            <strong>{countdown.secs}</strong>
            <span>SECS</span>
          </div>
        </div>

        <a href="#races" className="countdown-weather-pill">
          <span>LIVE WEATHER: {raceNightWeather.condition}</span>
          <span>
            {raceNightWeather.airTemp} / {raceNightWeather.rainChance}% RAIN
          </span>
        </a>
      </aside>

      {/* Hero Foreground Content */}
      <div className="hero-content">
        <p className="eyebrow hero-stagger-1">
          <span className="eyebrow-dot" />
          2026 LIVE TELEMETRY • ROUND 21
        </p>

        <h1 className="hero-stagger-2">
          FEEL
          <br />
          THE
          <span>SPEED.</span>
        </h1>

        <p className="hero-subtitle hero-stagger-3">
          THE ULTIMATE 3D EXPERIENCE FOR F1 FANS.
        </p>

        <div className="hero-actions hero-stagger-4">
          <Button href="#standings">LIVE STANDINGS →</Button>
          <Button variant="ghost" href="#garage">
            ENTER GARAGE
          </Button>
          <Button
            variant="ghost"
            onClick={handleDrsToggle}
            className={cn(drsOpen && "is-drs-engaged")}
          >
            {drsOpen ? "DRS ENGAGED" : "BOOST DRS"}
          </Button>
        </div>

        <p className="hero-lights-tagline hero-stagger-5">
          LIGHTS OUT. <span>AWAY WE GO.</span>
        </p>
      </div>

      {/* Continuous Scrolling Telemetry Ticker */}
      <div className="hero-ticker hero-stagger-ticker" aria-hidden="true">
        <div className="hero-ticker-track">
          {[...liveTickerItems, ...liveTickerItems].map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="ticker-item">
              <span className="ticker-label">{item.label}</span>
              <span className="ticker-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
