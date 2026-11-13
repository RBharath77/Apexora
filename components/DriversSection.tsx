"use client";

import { useState } from "react";
import { useFavorites } from "../lib/favorites";
import { useLiveData } from "../lib/live-data";
import { cn } from "../lib/utils";
import { Reveal, TiltCard } from "./MotionPrimitives";
import SectionTitle from "./SectionTitle";

export default function DriversSection() {
  const { drivers } = useLiveData();
  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    drivers[0]?.id ?? "antonelli"
  );
  const [gridLimit, setGridLimit] = useState<6 | 12 | 22>(6);
  const { favorites, setFavoriteDriver } = useFavorites();

  const displayedDrivers = drivers.slice(0, gridLimit);

  const activeDriver =
    drivers.find((d) => d.id === selectedDriverId) ?? drivers[0];

  return (
    <section id="drivers" className="fanverse-section section-drivers">
      <div className="section-inner">
        <div className="section-top-row">
          <SectionTitle
            number="03"
            eyebrow="MEET THE 2026 LINEUP"
            title="THE GRID"
            subtitle="Drivers ordered by championship position with official 2026 numbers. Select any driver to inspect full telemetry and season ratings."
          />

          <Reveal direction="left" delay={100}>
            <div className="driver-view-tabs" role="group" aria-label="Grid view count">
              {([6, 12, 22] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  className={cn("control-chip", gridLimit === count && "is-active")}
                  onClick={() => {
                    setGridLimit(count);
                  }}
                >
                  {count === 22 ? `ALL ${drivers.length}` : `TOP ${count}`}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Portrait Grid Cards with Official 2026 Driver Portraits */}
        <div className="grid-portrait-row">
          {displayedDrivers.map((driver, index) => {
            const isSelected = driver.id === activeDriver.id;
            const isFav = favorites.driverId === driver.id;
            return (
              <Reveal
                key={driver.id}
                direction="up"
                delay={(index % 6) * 55}
              >
                <TiltCard
                  className={cn(
                    "driver-portrait-card",
                    isSelected && "is-selected"
                  )}
                  onClick={() => {
                    setSelectedDriverId(driver.id);
                  }}
                  style={
                    {
                      "--team-color": driver.teamColor,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="driver-card-accent"
                    style={{ background: driver.teamColor }}
                  />

                  <div className="portrait-top">
                    <span className="portrait-pos">P{driver.position}</span>
                    <button
                      type="button"
                      className={cn("mini-fav-btn", isFav && "is-fav")}
                      aria-label={`Favorite ${driver.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavoriteDriver(driver.id);
                      }}
                    >
                      ♥
                    </button>
                  </div>

                  {/* 2026 Studio Driver Portrait */}
                  <div className="portrait-avatar-stage">
                    <span className="portrait-bg-num" aria-hidden="true">
                      {driver.number}
                    </span>
                    <img
                      src={driver.image}
                      alt={`${driver.name} (${driver.team})`}
                      className="portrait-photo"
                      loading={index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                    />
                    <div className="portrait-stage-vignette" aria-hidden="true" />
                  </div>

                  <div className="portrait-meta">
                    <h3>{driver.name}</h3>
                    <span className="portrait-team">{driver.team}</span>
                    <div className="portrait-bottom-row">
                      <strong style={{ color: driver.teamColor }}>
                        #{driver.number}
                      </strong>
                      <span>
                        {driver.flag} {driver.points} PTS
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {/* Driver Telemetry Spotlight Panel */}
        <Reveal direction="up" delay={120} className="driver-spotlight wide-spotlight">
          <div
            key={activeDriver.id}
            className="spotlight-inner spotlight-grid-layout"
            style={
              {
                "--team-color": activeDriver.teamColor,
              } as React.CSSProperties
            }
          >
            <div>
              <div className="spotlight-head">
                <div className="spotlight-portrait">
                  <img
                    src={activeDriver.image}
                    alt={`${activeDriver.name} official 2026 portrait`}
                    className="spotlight-photo"
                    decoding="async"
                    draggable={false}
                  />
                </div>

                <div>
                  <span className="spotlight-team">
                    P{activeDriver.position} IN 2026 STANDINGS •{" "}
                    {activeDriver.team}
                  </span>
                  <h3>
                    <span>#{activeDriver.number}</span> {activeDriver.name}
                  </h3>
                </div>
              </div>

              <blockquote className="driver-quote">
                “{activeDriver.quote}”
              </blockquote>

              <div className="driver-career-pills four-col">
                <div>
                  <span>STANDINGS POS</span>
                  <strong>P{activeDriver.position}</strong>
                </div>
                <div>
                  <span>2026 POINTS</span>
                  <strong>{activeDriver.points}</strong>
                </div>
                <div>
                  <span>2026 WINS</span>
                  <strong>{activeDriver.wins}</strong>
                </div>
                <div>
                  <span>PODIUMS</span>
                  <strong>{activeDriver.podiums}</strong>
                </div>
              </div>
            </div>

            <div className="driver-ratings">
              {[
                { label: "RACE PACE", value: activeDriver.stats.pace },
                { label: "RACECRAFT", value: activeDriver.stats.racecraft },
                { label: "QUALIFYING", value: activeDriver.stats.qualifying },
                { label: "WET WEATHER", value: activeDriver.stats.wetWeather },
                { label: "CONSISTENCY", value: activeDriver.stats.consistency },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rating-row"
                >
                  <div className="rating-meta">
                    <span>{stat.label}</span>
                    <strong>{stat.value}/100</strong>
                  </div>
                  <div className="rating-track">
                    <div
                      className="rating-fill"
                      style={{
                        transform: `scaleX(${(stat.value / 100).toFixed(3)})`,
                        background: activeDriver.teamColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
