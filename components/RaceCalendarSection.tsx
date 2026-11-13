"use client";

import { useState } from "react";
import {
  getDynamicRaceStatus,
  getNextUpcomingRace,
  raceCalendarData,
  type WeatherSessionForecast,
} from "../lib/constants";
import { useFavorites } from "../lib/favorites";
import { useLiveData } from "../lib/live-data";
import { cn } from "../lib/utils";
import { Reveal } from "./MotionPrimitives";
import SectionTitle from "./SectionTitle";

function WeatherIcon({
  condition,
}: {
  condition: WeatherSessionForecast["condition"];
}) {
  if (condition === "RAIN") {
    return (
      <svg className="weather-svg is-rain" viewBox="0 0 36 36" fill="none">
        <path
          d="M10 21h15a5 5 0 0 0 .8-9.9A6.5 6.5 0 0 0 13.2 9.5 5.5 5.5 0 0 0 10 21Z"
          stroke="#60a5fa"
          strokeWidth="2"
        />
        <line x1="13" y1="25" x2="11" y2="30" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
        <line x1="19" y1="25" x2="17" y2="30" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="25" x2="23" y2="30" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (condition === "CLOUDY") {
    return (
      <svg className="weather-svg" viewBox="0 0 36 36" fill="none">
        <path
          d="M10 24h16a5 5 0 0 0 .8-9.9A6.5 6.5 0 0 0 14.2 12.5 5.5 5.5 0 0 0 10 24Z"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      </svg>
    );
  }
  if (condition === "NIGHT") {
    return (
      <svg className="weather-svg" viewBox="0 0 36 36" fill="none">
        <path
          d="M23.5 22.8A9 9 0 0 1 13.2 12.5a9 9 0 1 0 10.3 10.3Z"
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="25" cy="11" r="1.4" fill="#e10600" />
      </svg>
    );
  }
  return (
    <svg className="weather-svg is-sun" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="6" stroke="#facc15" strokeWidth="2" />
      <path
        d="M18 6v3M18 27v3M6 18h3M27 18h3M9.5 9.5l2.1 2.1M24.4 24.4l2.1 2.1M26.5 9.5l-2.1 2.1M11.6 24.4l-2.1 2.1"
        stroke="#facc15"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatSessionLocal(timestampStr: string): {
  localDate: string;
  localTime: string;
  utcTime: string;
} {
  try {
    const d = new Date(timestampStr);
    if (isNaN(d.getTime())) {
      return { localDate: timestampStr, localTime: "", utcTime: "" };
    }
    const localDate = d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const localTime = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const utcTime =
      d.toLocaleTimeString("en-GB", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
      }) + " UTC";
    return { localDate, localTime, utcTime };
  } catch {
    return { localDate: timestampStr, localTime: "", utcTime: "" };
  }
}

export default function RaceCalendarSection() {
  const { favorites, setFavoriteRace } = useFavorites();
  const { weatherByRace, upcomingRace, previousRaceResult } = useLiveData();
  const defaultNextRace = getNextUpcomingRace(raceCalendarData);
  const [selectedId, setSelectedId] = useState<string>(
    () => favorites.raceId || defaultNextRace.id
  );
  const [activeTab, setActiveTab] = useState<"CALENDAR" | "LAST_RESULT">("CALENDAR");
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "CLASSIC">("ALL");

  const filteredRaces = raceCalendarData.filter((race) => {
    if (filter === "UPCOMING") return race.status !== "SEASON CLASSIC";
    if (filter === "CLASSIC") return race.status === "SEASON CLASSIC";
    return true;
  });

  const activeRace =
    raceCalendarData.find((r) => r.id === selectedId) ?? defaultNextRace;

  const liveWeather = weatherByRace[activeRace.id];

  // Merge live weather into Grand Prix / Live session when upstream Open-Meteo responds
  const displaySessions = activeRace.sessions.map((sess, idx) => {
    if (idx === 2 && liveWeather) {
      return {
        ...sess,
        session: "LIVE CIRCUIT NOW",
        airTemp: liveWeather.airTemp,
        trackTemp: liveWeather.trackTemp,
        rainChance: liveWeather.rainChance,
        wind: liveWeather.wind,
        condition: liveWeather.condition,
      };
    }
    return sess;
  });

  return (
    <section id="races" className="fanverse-section section-races">
      <div className="section-inner">
        <div className="section-top-row">
          <SectionTitle
            number="01"
            eyebrow={
              activeTab === "LAST_RESULT"
                ? "OFFICIAL FIA GRAND PRIX RESULTS"
                : "2026 CALENDAR & LIVE TRACK FORECAST"
            }
            title={
              activeTab === "LAST_RESULT"
                ? `${previousRaceResult.raceName.toUpperCase()}`
                : "THE RACE CALENDAR"
            }
            subtitle={
              activeTab === "LAST_RESULT"
                ? `Official classification for Round ${previousRaceResult.round} at ${previousRaceResult.circuitName}, ${previousRaceResult.locality}.`
                : "Explore upcoming Grands Prix, inspect real-time track meteorology & strategy forecasts, and pin your favorite race."
            }
          />

          <div className="calendar-controls-wrapper">
            {/* View Switcher Pills */}
            <div className="calendar-view-pills" role="tablist" aria-label="Race Calendar View">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "CALENDAR"}
                onClick={() => setActiveTab("CALENDAR")}
                className={cn("calendar-view-btn", activeTab === "CALENDAR" && "is-active")}
              >
                🏁 2026 CALENDAR
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "LAST_RESULT"}
                onClick={() => setActiveTab("LAST_RESULT")}
                className={cn("calendar-view-btn", activeTab === "LAST_RESULT" && "is-active")}
              >
                🏆 PREVIOUS RESULT ({previousRaceResult.winner.driverCode} WON)
              </button>
            </div>

            {/* Filter Pills for Calendar */}
            {activeTab === "CALENDAR" && (
              <Reveal direction="left" delay={80} className="mode-pills">
                {(["ALL", "UPCOMING", "CLASSIC"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setFilter(tab);
                    }}
                    className={cn("mode-pill", filter === tab && "is-active")}
                  >
                    {tab} RACES
                  </button>
                ))}
              </Reveal>
            )}
          </div>
        </div>

        {/* View 1: Previous Race Results Classification */}
        {activeTab === "LAST_RESULT" ? (
          <div className="previous-results-container panel-swap-in">
            {/* Header Meta Bar */}
            <div className="results-header-bar">
              <div className="results-meta-left">
                <span className="results-badge">
                  {previousRaceResult.flag} ROUND {previousRaceResult.round} • 2026 OFFICIAL CLASSIFICATION
                </span>
                <h2>{previousRaceResult.raceName}</h2>
                <p>
                  📍 {previousRaceResult.circuitName} • {previousRaceResult.locality}, {previousRaceResult.country} • {previousRaceResult.date}
                </p>
              </div>
              <div className="results-winner-stat">
                <span>RACE WINNER</span>
                <strong>{previousRaceResult.winner.driverName}</strong>
                <small>
                  {previousRaceResult.winner.constructorName} • {previousRaceResult.winner.time}
                </small>
              </div>
            </div>

            {/* Top 3 Podium Cards */}
            <div className="podium-cards-grid">
              {/* P1 Winner */}
              {previousRaceResult.results[0] && (
                <div className="podium-card is-p1">
                  <div className="podium-badge">🥇 P1 WINNER</div>
                  <div className="podium-driver-meta">
                    <span className="podium-flag">{previousRaceResult.results[0].driverFlag}</span>
                    <div>
                      <h3>{previousRaceResult.results[0].driverName}</h3>
                      <span className="podium-team" style={{ color: previousRaceResult.results[0].teamColor }}>
                        {previousRaceResult.results[0].constructorName} #{previousRaceResult.results[0].driverNumber}
                      </span>
                    </div>
                  </div>
                  <div className="podium-stats-row">
                    <div>
                      <span>TIME</span>
                      <strong>{previousRaceResult.results[0].timeOrGap}</strong>
                    </div>
                    <div>
                      <span>POINTS</span>
                      <strong className="pts-val">+{previousRaceResult.results[0].points} PTS</strong>
                    </div>
                    <div>
                      <span>GRID</span>
                      <strong>P{previousRaceResult.results[0].grid}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* P2 Runner-Up */}
              {previousRaceResult.results[1] && (
                <div className="podium-card is-p2">
                  <div className="podium-badge">🥈 P2 RUNNER-UP</div>
                  <div className="podium-driver-meta">
                    <span className="podium-flag">{previousRaceResult.results[1].driverFlag}</span>
                    <div>
                      <h3>{previousRaceResult.results[1].driverName}</h3>
                      <span className="podium-team" style={{ color: previousRaceResult.results[1].teamColor }}>
                        {previousRaceResult.results[1].constructorName} #{previousRaceResult.results[1].driverNumber}
                      </span>
                    </div>
                  </div>
                  <div className="podium-stats-row">
                    <div>
                      <span>GAP</span>
                      <strong>{previousRaceResult.results[1].timeOrGap}</strong>
                    </div>
                    <div>
                      <span>POINTS</span>
                      <strong className="pts-val">+{previousRaceResult.results[1].points} PTS</strong>
                    </div>
                    <div>
                      <span>GRID</span>
                      <strong>
                        P{previousRaceResult.results[1].grid}{" "}
                        {previousRaceResult.results[1].grid > previousRaceResult.results[1].position
                          ? `(▲ +${previousRaceResult.results[1].grid - previousRaceResult.results[1].position})`
                          : ""}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* P3 Third Place */}
              {previousRaceResult.results[2] && (
                <div className="podium-card is-p3">
                  <div className="podium-badge">🥉 P3 PODIUM</div>
                  <div className="podium-driver-meta">
                    <span className="podium-flag">{previousRaceResult.results[2].driverFlag}</span>
                    <div>
                      <h3>{previousRaceResult.results[2].driverName}</h3>
                      <span className="podium-team" style={{ color: previousRaceResult.results[2].teamColor }}>
                        {previousRaceResult.results[2].constructorName} #{previousRaceResult.results[2].driverNumber}
                      </span>
                    </div>
                  </div>
                  <div className="podium-stats-row">
                    <div>
                      <span>GAP</span>
                      <strong>{previousRaceResult.results[2].timeOrGap}</strong>
                    </div>
                    <div>
                      <span>POINTS</span>
                      <strong className="pts-val">+{previousRaceResult.results[2].points} PTS</strong>
                    </div>
                    <div>
                      <span>GRID</span>
                      <strong>P{previousRaceResult.results[2].grid}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DHL Fastest Lap Highlight Bar */}
            {previousRaceResult.fastestLapDriver && (
              <div className="results-fastest-lap-bar">
                <div className="fl-left">
                  <span className="fl-badge">⚡ DHL OFFICIAL FASTEST LAP</span>
                  <strong>
                    {previousRaceResult.fastestLapDriver.driverName} ({previousRaceResult.fastestLapDriver.constructorName} #{previousRaceResult.fastestLapDriver.driverNumber})
                  </strong>
                </div>
                <div className="fl-right">
                  <span>LAP {previousRaceResult.fastestLapDriver.lap}</span>
                  <strong className="fl-time">{previousRaceResult.fastestLapDriver.lapTime}</strong>
                  <span className="fl-bonus">+1 BONUS PT</span>
                </div>
              </div>
            )}

            {/* Full 22-Driver Classification Table */}
            <div className="results-table-card">
              <div className="results-table-header">
                <h3>FULL RACE CLASSIFICATION</h3>
                <span>{previousRaceResult.results.length} CARS ENTERED • LAPS: 71 • DRY/INTERMEDIATE</span>
              </div>
              <div className="results-table-scroll">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th className="col-pos">POS</th>
                      <th className="col-no">NO</th>
                      <th className="col-driver">DRIVER</th>
                      <th className="col-team">CONSTRUCTOR</th>
                      <th className="col-grid">GRID</th>
                      <th className="col-laps">LAPS</th>
                      <th className="col-time">TIME / RETIRED</th>
                      <th className="col-pts">POINTS</th>
                      <th className="col-fl">FASTEST LAP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousRaceResult.results.map((entry) => {
                      const gridDiff = entry.grid > 0 ? entry.grid - entry.position : 0;
                      return (
                        <tr
                          key={`${entry.position}-${entry.driverNumber}`}
                          className={cn(
                            entry.position === 1 && "is-winner-row",
                            entry.position <= 3 && "is-podium-row",
                            entry.position <= 10 && "is-points-row",
                            entry.status.toLowerCase().includes("ret") && "is-dnf-row"
                          )}
                        >
                          <td className="col-pos">
                            <span className={cn("pos-pill", entry.position <= 3 && `is-top-${entry.position}`)}>
                              {entry.positionText}
                            </span>
                          </td>
                          <td className="col-no">
                            <strong>#{entry.driverNumber}</strong>
                          </td>
                          <td className="col-driver">
                            <span className="driver-flag">{entry.driverFlag}</span>
                            <span className="driver-name">{entry.driverName}</span>
                            <span className="driver-code">{entry.driverCode}</span>
                          </td>
                          <td className="col-team">
                            <span className="team-dot" style={{ backgroundColor: entry.teamColor }} />
                            <span>{entry.constructorName}</span>
                          </td>
                          <td className="col-grid">
                            <span className="grid-pos">P{entry.grid}</span>
                            {gridDiff > 0 && <span className="grid-gain">▲ +{gridDiff}</span>}
                            {gridDiff < 0 && <span className="grid-loss">▼ {gridDiff}</span>}
                            {gridDiff === 0 && <span className="grid-even">—</span>}
                          </td>
                          <td className="col-laps">{entry.laps}</td>
                          <td className="col-time">
                            <strong className={entry.position === 1 ? "time-winner" : "time-gap"}>
                              {entry.timeOrGap}
                            </strong>
                          </td>
                          <td className="col-pts">
                            {entry.points > 0 ? (
                              <span className="pts-pill">+{entry.points}</span>
                            ) : (
                              <span className="zero-pts">0</span>
                            )}
                          </td>
                          <td className="col-fl">
                            {entry.fastestLap ? (
                              <span className={cn("fl-entry", entry.fastestLap.rank === 1 && "is-rank-1")}>
                                {entry.fastestLap.time} {entry.fastestLap.rank === 1 ? "⚡" : ""}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Race Calendar Posters & Weekend Forecast */
          <>
            {/* Glowing Poster Cards Row */}
            <div key={filter} className="calendar-cards-grid">
              {filteredRaces.map((race, idx) => {
                const isSelected = race.id === activeRace.id;
                const isFav = favorites.raceId === race.id;
                return (
                  <Reveal key={race.id} direction="up" delay={idx * 40}>
                    <article
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedId(race.id);
                        setFavoriteRace(race.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedId(race.id);
                          setFavoriteRace(race.id);
                        }
                      }}
                      className={cn(
                        "race-poster-card",
                        isSelected && "is-selected",
                        `race-tint-${race.id}`
                      )}
                    >
                      <img
                        src={race.image}
                        alt={race.name}
                        className="race-poster-bg"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="race-poster-scrim" />

                      <div className="race-poster-top">
                        <span className="race-flag-pill">
                          {race.flag} {race.round}
                        </span>
                        <button
                          type="button"
                          className={cn("mini-fav-btn", isFav && "is-fav")}
                          aria-label={`Set ${race.name} as favorite race`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFavoriteRace(race.id);
                          }}
                        >
                          ♥
                        </button>
                      </div>

                      <div className="race-poster-bottom">
                        {(() => {
                          const dynStatus = getDynamicRaceStatus(race);
                          return (
                            <span
                              className={cn(
                                "race-status-tag",
                                dynStatus === "LIVE NOW" && "is-live",
                                dynStatus === "COMPLETED" && "is-completed"
                              )}
                            >
                              {dynStatus}
                            </span>
                          );
                        })()}
                        <h3>{race.shortName}</h3>
                        <p>{race.city}</p>
                        <span className="race-date">{race.dateLabel}</span>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            {/* Interactive Weekend Weather & Strategy Forecast Panel */}
            <Reveal direction="up" delay={90} className="forecast-panel">
              <div key={activeRace.id} className="forecast-panel-inner panel-swap-in">
                <div className="forecast-head">
                  <div>
                    <span className="forecast-kicker">
                      {liveWeather
                        ? "LIVE CIRCUIT METEOROLOGY SYNCED"
                        : "WEEKEND METEOROLOGY & TRACK FORECAST"}
                    </span>
                    <h3>
                      {activeRace.flag} {activeRace.name} —{" "}
                      <span>{activeRace.circuitName}</span>
                    </h3>
                  </div>

                  <div className="forecast-strategy-pill">
                    <span>AI STRATEGY FORECAST</span>
                    <strong>{activeRace.strategyForecast}</strong>
                  </div>
                </div>

                <div className="forecast-sessions-grid">
                  {displaySessions.map((sess) => (
                    <div key={sess.session} className="forecast-session-card">
                      <div className="forecast-session-top">
                        <span>{sess.session}</span>
                        <WeatherIcon condition={sess.condition} />
                      </div>

                      <div className="forecast-temps">
                        <div>
                          <span>AIR TEMP</span>
                          <strong>{sess.airTemp}</strong>
                        </div>
                        <div>
                          <span>TRACK TEMP</span>
                          <strong>{sess.trackTemp}</strong>
                        </div>
                        <div>
                          <span>WIND</span>
                          <strong>{sess.wind}</strong>
                        </div>
                      </div>

                      <div className="forecast-rain-row">
                        <div className="forecast-rain-meta">
                          <span>RAIN PROBABILITY</span>
                          <strong>{sess.rainChance}%</strong>
                        </div>
                        <div className="forecast-rain-bar">
                          <div
                            style={{
                              transform: `scaleX(${Math.max(
                                0.04,
                                sess.rainChance / 100
                              ).toFixed(3)})`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="forecast-grip-badge">
                        GRIP OUTLOOK: <strong>{sess.gripLevel}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Official FIA Upcoming Weekend Session Timetable */}
                {activeRace.id === upcomingRace.circuitId && upcomingRace.sessions.length > 0 && (
                  <div className="forecast-timetable-section">
                    <div className="timetable-heading">
                      <span className="timetable-kicker">
                        OFFICIAL FIA WEEKEND SESSION TIMETABLE • AUTOMATICALLY SYNCED
                      </span>
                      <h4>{upcomingRace.raceName} Schedule (Local & UTC Time)</h4>
                    </div>
                    <div className="timetable-cards-grid">
                      {upcomingRace.sessions.map((item) => {
                        const { localDate, localTime, utcTime } = formatSessionLocal(item.timestamp);
                        const isRace =
                          item.name.toLowerCase().includes("race") ||
                          item.name.toLowerCase().includes("grand prix");
                        const isQuali = item.name.toLowerCase().includes("quali");
                        return (
                          <div
                            key={item.name}
                            className={cn(
                              "timetable-card",
                              isRace && "is-race-session",
                              isQuali && "is-quali-session"
                            )}
                          >
                            <div className="session-tag">
                              <span>{item.name}</span>
                              {isRace && <span className="race-badge">POINTS RACE</span>}
                            </div>
                            <div className="session-date">{localDate}</div>
                            <div className="session-time-local">{localTime}</div>
                            <div className="session-time-utc">{utcTime}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="forecast-footer-bar">
                  <span>
                    SAFETY CAR PROBABILITY:{" "}
                    <strong>{activeRace.safetyCarProb}%</strong>
                  </span>
                  <span>
                    METEO ENGINE:{" "}
                    <strong>
                      {liveWeather ? "OPEN-METEO LIVE CIRCUIT FEED" : "2026 TELEMETRY MODEL"}
                    </strong>
                  </span>
                </div>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
