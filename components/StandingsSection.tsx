"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useFavorites } from "../lib/favorites";
import { useLiveData } from "../lib/live-data";
import { cn } from "../lib/utils";
import { AnimatedCounter, Reveal } from "./MotionPrimitives";
import SectionTitle from "./SectionTitle";

export default function StandingsSection() {
  const [tab, setTab] = useState<"DRIVERS" | "CONSTRUCTORS">("DRIVERS");
  const [showAllDrivers, setShowAllDrivers] = useState(false);
  const { favorites, setFavoriteDriver, setFavoriteTeam } = useFavorites();
  const {
    drivers,
    constructors,
    source,
    updatedAt,
    latencyMs,
    isSyncing,
    liveSimActive,
    positionDeltas,
    pointsDeltas,
    toggleLiveSim,
    syncNow,
  } = useLiveData();

  const visibleDrivers = showAllDrivers ? drivers : drivers.slice(0, 10);
  const leaderPoints = drivers[0]?.points ?? 390;
  const constructorLeaderPts = constructors[0]?.points ?? 652;

  const rowsRef = useRef<HTMLDivElement>(null);
  const prevTopsRef = useRef<Map<string, number>>(new Map());
  const prevModeRef = useRef(`${tab}-${showAllDrivers}`);

  useLayoutEffect(() => {
    const container = rowsRef.current;
    if (!container) return;

    const currentMode = `${tab}-${showAllDrivers}`;
    const modeChanged = prevModeRef.current !== currentMode;
    prevModeRef.current = currentMode;

    const rowEls = Array.from(
      container.querySelectorAll<HTMLElement>("[data-flip-id]")
    );
    const nextTops = new Map<string, number>();
    const movedEls: HTMLElement[] = [];

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    for (const el of rowEls) {
      const id = el.dataset.flipId;
      if (!id) continue;
      const top = el.getBoundingClientRect().top;
      nextTops.set(id, top);

      if (!modeChanged && !reduceMotion) {
        const prevTop = prevTopsRef.current.get(id);
        if (prevTop !== undefined) {
          const dy = prevTop - top;
          if (Math.abs(dy) > 1.5) {
            el.style.transition = "none";
            el.style.transform = `translate3d(0, ${dy}px, 0)`;
            movedEls.push(el);
          }
        }
      }
    }

    prevTopsRef.current = nextTops;
    if (movedEls.length === 0) return;

    // Force single layout flush before sliding rows into their new championship positions
    void container.offsetHeight;
    const raf = requestAnimationFrame(() => {
      for (const el of movedEls) {
        el.style.transition =
          "transform 0.48s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "translate3d(0, 0, 0)";
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [drivers, constructors, tab, showAllDrivers]);

  const formattedTime = updatedAt
    ? new Date(updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  return (
    <section id="standings" className="fanverse-section section-standings">
      <div className="section-inner">
        <div className="section-top-row">
          <SectionTitle
            number="02"
            eyebrow="LIVE FIA CHAMPIONSHIP FEED"
            title="CHAMPIONSHIP STANDINGS"
            subtitle="Live-synced 2026 driver positions, official car numbers, and real-time points deltas with ultra-low latency caching."
          />

          <Reveal direction="left" delay={80} className="standings-controls">
            <div className="mode-pills">
              {(["DRIVERS", "CONSTRUCTORS"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setTab(mode);
                  }}
                  className={cn("mode-pill", tab === mode && "is-active")}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="live-controls-bar">
              <button
                type="button"
                className={cn("control-chip", liveSimActive && "is-live-sim")}
                onClick={() => {
                  toggleLiveSim();
                }}
              >
                {liveSimActive ? "● LIVE UPDATES ON" : "SIMULATE LIVE RACE"}
              </button>

              <button
                type="button"
                className="control-chip"
                onClick={() => {
                  void syncNow();
                }}
              >
                {isSyncing ? "SYNCING..." : `SYNC (${latencyMs}ms)`}
              </button>
            </div>
          </Reveal>
        </div>

        {/* Live Telemetry Sync Status Strip */}
        <div className="live-feed-strip">
          <div className="live-feed-left">
            <span
              className={cn(
                "live-dot-green",
                liveSimActive && "is-sim-pulse"
              )}
            />
            <strong>
              {liveSimActive
                ? "LIVE RACE PROJECTION STREAM"
                : source === "LIVE_API" || source === "HYBRID_CACHE"
                  ? "LIVE API CONNECTED"
                  : "LOW-LATENCY 2026 SNAPSHOT"}
            </strong>
          </div>
          <div className="live-feed-right">
            <span>RTT: {latencyMs} MS</span>
            <span>UPDATED: {formattedTime}</span>
          </div>
        </div>

        {tab === "DRIVERS" ? (
          <div key="tab-drivers" className="panel-swap-in">
            {/* Top 3 Championship Podium Strip */}
            <div className="podium-strip">
              {drivers.slice(0, 3).map((driver, i) => {
                const ptsGain = pointsDeltas[driver.id] ?? 0;
                return (
                  <Reveal
                    key={`podium-slot-${i}`}
                    direction="up"
                    delay={i * 65}
                    className={cn(
                      "podium-card",
                      driver.position === 1 && "is-p1"
                    )}
                    style={
                      {
                        "--team-color": driver.teamColor,
                      } as React.CSSProperties
                    }
                  >
                    <div key={driver.id} className="podium-card-inner panel-swap-in">
                      <div className="podium-rank-row">
                        <span className="podium-pos">P{driver.position}</span>
                        {driver.isChampion ? (
                          <span className="champ-pill">2026 WDC CHAMPION</span>
                        ) : (
                          <span className="car-num-pill">#{driver.number}</span>
                        )}
                      </div>

                      <div className="podium-identity">
                        <span className="podium-team">
                          {driver.flag} {driver.team}
                        </span>
                        <h3>{driver.name}</h3>
                        <span className="podium-car-num">
                          CAR #{driver.number} • {driver.code}
                        </span>
                      </div>

                      <div className="podium-points-row">
                        <div>
                          <strong>
                            <AnimatedCounter value={driver.points} />
                          </strong>
                          <span>PTS</span>
                          {ptsGain > 0 && (
                            <em className="live-pts-gain">+{ptsGain}</em>
                          )}
                        </div>
                        <div className="podium-mini-stats">
                          <span>{driver.wins} WINS</span>
                          <span>{driver.podiums} PODIUMS</span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Full Interactive Standings Table */}
            <Reveal direction="up" delay={100} className="standings-table-wrap">
              <div className="standings-table-head">
                <span>POS</span>
                <span>NO.</span>
                <span>DRIVER</span>
                <span>CONSTRUCTOR</span>
                <span>WINS</span>
                <span>POINTS</span>
                <span aria-label="Favorite" />
              </div>

              <div ref={rowsRef} className="standings-rows">
                {visibleDrivers.map((d) => {
                  const pct = Math.max(2, (d.points / leaderPoints) * 100);
                  const isFav = favorites.driverId === d.id;
                  const posDelta = positionDeltas[d.id] ?? 0;
                  const ptsGain = pointsDeltas[d.id] ?? 0;

                  return (
                    <div
                      key={d.id}
                      data-flip-id={d.id}
                      onClick={() => {
                        setFavoriteDriver(d.id);
                      }}
                      className={cn(
                        "standings-row",
                        d.position === 1 && "is-leader",
                        isFav && "is-selected-fav",
                        posDelta > 0 && "is-gained",
                        posDelta < 0 && "is-dropped"
                      )}
                      style={
                        {
                          "--team-color": d.teamColor,
                        } as React.CSSProperties
                      }
                    >
                      <span className="st-pos">
                        {String(d.position).padStart(2, "0")}
                        {posDelta !== 0 && (
                          <em
                            className={cn(
                              "pos-delta",
                              posDelta > 0 ? "up" : "down"
                            )}
                          >
                            {posDelta > 0 ? `▲${posDelta}` : `▼${Math.abs(posDelta)}`}
                          </em>
                        )}
                      </span>

                      <span className="st-number">#{d.number}</span>

                      <div className="st-driver">
                        <span
                          className="st-team-bar"
                          style={{ background: d.teamColor }}
                        />
                        <span>
                          {d.flag} <strong>{d.name}</strong>{" "}
                          {d.isChampion && (
                            <em className="st-champ-badge">WDC</em>
                          )}
                        </span>
                      </div>

                      <span className="st-team">{d.team}</span>

                      <span className="st-wins">{d.wins}</span>

                      <div className="st-points-cell">
                        <div className="st-pts-num-line">
                          <strong>{d.points}</strong>
                          {ptsGain > 0 && (
                            <span className="live-pts-gain">+{ptsGain}</span>
                          )}
                        </div>
                        <div className="st-pts-track">
                          <div
                            style={{
                              transform: `scaleX(${(pct / 100).toFixed(4)})`,
                              background: d.teamColor,
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className={cn("mini-fav-btn", isFav && "is-fav")}
                        aria-label={`Favorite ${d.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFavoriteDriver(d.id);
                        }}
                      >
                        ♥
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="standings-footer">
                <button
                  type="button"
                  className="control-chip"
                  onClick={() => {
                    setShowAllDrivers((prev) => !prev);
                  }}
                >
                  {showAllDrivers
                    ? "SHOW TOP 10 DRIVERS"
                    : `VIEW FULL ${drivers.length}-DRIVER GRID →`}
                </button>
              </div>
            </Reveal>
          </div>
        ) : (
          /* Constructors Championship Table */
          <div key="tab-constructors" className="panel-swap-in">
            <Reveal direction="up" className="standings-table-wrap">
              <div className="standings-table-head constructors-head">
                <span>POS</span>
                <span>CONSTRUCTOR</span>
                <span>2026 DRIVER LINEUP</span>
                <span>POWER UNIT</span>
                <span>POINTS</span>
                <span aria-label="Favorite" />
              </div>

              <div ref={rowsRef} className="standings-rows">
                {constructors.map((team) => {
                  const pct = Math.max(
                    2,
                    (team.points / constructorLeaderPts) * 100
                  );
                  const isFav = favorites.teamId === team.id;

                  return (
                    <div
                      key={team.id}
                      data-flip-id={team.id}
                      onClick={() => {
                        setFavoriteTeam(team.id);
                      }}
                      className={cn(
                        "standings-row constructors-row",
                        team.position === 1 && "is-leader",
                        isFav && "is-selected-fav"
                      )}
                      style={
                        {
                          "--team-color": team.color,
                        } as React.CSSProperties
                      }
                    >
                      <span className="st-pos">
                        {String(team.position).padStart(2, "0")}
                      </span>

                      <div className="st-driver">
                        <span
                          className="st-team-bar"
                          style={{ background: team.color }}
                        />
                        <span>
                          <strong>{team.name}</strong>{" "}
                          {team.isChampion && (
                            <em className="st-champ-badge">WCC</em>
                          )}
                        </span>
                      </div>

                      <span className="st-team">
                        {team.drivers[0]} • {team.drivers[1]}
                      </span>

                      <span className="st-wins">{team.powerUnit}</span>

                      <div className="st-points-cell">
                        <strong>{team.points}</strong>
                        <div className="st-pts-track">
                          <div
                            style={{
                              transform: `scaleX(${(pct / 100).toFixed(4)})`,
                              background: team.color,
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className={cn("mini-fav-btn", isFav && "is-fav")}
                        aria-label={`Favorite ${team.shortName}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFavoriteTeam(team.id);
                        }}
                      >
                        ♥
                      </button>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
