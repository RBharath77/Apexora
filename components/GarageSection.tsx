"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { garageParts } from "../lib/constants";
import { createInitialDriveTelemetry } from "../lib/drive-telemetry";
import { useFavorites } from "../lib/favorites";
import { useLiveData } from "../lib/live-data";
import { clamp, cn } from "../lib/utils";
import DrivingConsole from "./DrivingConsole";
import F1Car3DViewer from "./F1Car3DViewer";
import {
  resolveLiveryFromTeamId,
  STUDIO_PRESETS,
  type F1LiveryId,
} from "./f1CarModel";
import { Reveal } from "./MotionPrimitives";
import SectionTitle from "./SectionTitle";
import type { OpenConsoleDetail } from "./TeamsSection";

export default function GarageSection() {
  const { constructors, drivers } = useLiveData();
  const { favorites, setFavoriteTeam, setFavoriteDriver } = useFavorites();
  const [mode, setMode] = useState<"inspect" | "drive">("inspect");
  const [selectedId, setSelectedId] = useState<string>(garageParts[0].id);
  const [zoom, setZoom] = useState(1.1);
  const [drsOpen, setDrsOpen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [liveryId, setLiveryId] = useState<F1LiveryId>(() =>
    resolveLiveryFromTeamId(favorites.teamId)
  );
  const [cameraPresetRequest, setCameraPresetRequest] = useState<{
    preset: keyof typeof STUDIO_PRESETS;
    seq: number;
  } | null>(null);

  const driveTelemetryRef = useRef(createInitialDriveTelemetry());
  const onWakeCarRef = useRef<(() => void) | null>(null);
  const camSeqRef = useRef(0);

  // Sync driving active flag with selected Garage mode
  driveTelemetryRef.current.active = mode === "drive";

  useEffect(() => {
    setLiveryId(resolveLiveryFromTeamId(favorites.teamId));
  }, [favorites.teamId]);

  useEffect(() => {
    const onOpenConsole = (evt: Event) => {
      const detail = (evt as CustomEvent<OpenConsoleDetail>).detail;
      if (!detail) return;
      const nextLivery = resolveLiveryFromTeamId(detail.teamId);
      setLiveryId(nextLivery);
      setFavoriteTeam(detail.teamId);
      if (detail.driverId) {
        setFavoriteDriver(detail.driverId);
      }
      const nextMode = detail.mode ?? "drive";
      setMode(nextMode);
      driveTelemetryRef.current.active = nextMode === "drive";
      setCameraPresetRequest({
        preset: nextMode === "drive" ? "cockpit" : "threeQuarter",
        seq: ++camSeqRef.current,
      });
      window.setTimeout(() => {
        onWakeCarRef.current?.();
      }, 60);
    };

    window.addEventListener("f1:open-console", onOpenConsole);
    return () => window.removeEventListener("f1:open-console", onOpenConsole);
  }, [setFavoriteDriver, setFavoriteTeam]);

  const activeTeam =
    constructors.find((t) => resolveLiveryFromTeamId(t.id) === liveryId) ??
    constructors[0];

  const teamCrewmates = drivers.filter((d) => d.teamId === activeTeam.id);
  const matchedCrewIndex = teamCrewmates.findIndex(
    (d) => d.id === favorites.driverId
  );
  const activeCrewIndex = matchedCrewIndex >= 0 ? matchedCrewIndex : 0;
  const activeDriver = teamCrewmates[activeCrewIndex] ?? drivers[0];

  const activePart =
    garageParts.find((p) => p.id === selectedId) ?? garageParts[0];

  const handleToggleDrs = useCallback(() => {
    setDrsOpen((prev) => {
      const next = !prev;
      driveTelemetryRef.current.drsOpen = next;
      return next;
    });
  }, []);

  const handleChangeLivery = useCallback(
    (nextLivery: F1LiveryId) => {
      setLiveryId(nextLivery);
      const matchingTeam = constructors.find(
        (t) => resolveLiveryFromTeamId(t.id) === nextLivery
      );
      if (matchingTeam) {
        setFavoriteTeam(matchingTeam.id);
        const firstDriver = drivers.find((d) => d.teamId === matchingTeam.id);
        if (firstDriver) {
          setFavoriteDriver(firstDriver.id);
        }
      }
    },
    [constructors, drivers, setFavoriteDriver, setFavoriteTeam]
  );

  const handleSwitchMode = (nextMode: "inspect" | "drive") => {
    setMode(nextMode);
    driveTelemetryRef.current.active = nextMode === "drive";
    setCameraPresetRequest({
      preset: nextMode === "drive" ? "cockpit" : "threeQuarter",
      seq: ++camSeqRef.current,
    });
    window.setTimeout(() => {
      onWakeCarRef.current?.();
    }, 50);
  };

  const handleRequestCamera = useCallback(
    (preset: keyof typeof STUDIO_PRESETS) => {
      setCameraPresetRequest({
        preset,
        seq: ++camSeqRef.current,
      });
    },
    []
  );

  const handleChangeZoom = useCallback((z: number) => {
    setZoom(clamp(z, 1, 1.8));
  }, []);

  const handleSelectDriver = useCallback(
    (driverId: string) => {
      setFavoriteTeam(activeTeam.id);
      setFavoriteDriver(driverId);
    },
    [activeTeam.id, setFavoriteDriver, setFavoriteTeam]
  );

  return (
    <section id="garage" className="fanverse-section section-garage">
      <div className="section-inner">
        <div className="section-top-row">
          <SectionTitle
            number="06"
            eyebrow="EXPLORE EVERY DETAIL OF THE F1 CAR"
            title="3D GARAGE & DRIVING CONSOLE"
            subtitle="Inspect 2026 sponsor liveries & aero packages, swap crewmates live, or jump straight into the carbon steering wheel simulator."
          />

          <div className="garage-mode-bar" role="tablist" aria-label="Garage Mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "inspect"}
              className={cn("garage-mode-btn", mode === "inspect" && "is-active")}
              onClick={() => handleSwitchMode("inspect")}
            >
              AERO INSPECTOR
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "drive"}
              className={cn("garage-mode-btn", mode === "drive" && "is-active")}
              onClick={() => handleSwitchMode("drive")}
            >
              DRIVING CONSOLE ▸
            </button>
          </div>
        </div>

        {/* Active Constructor + Crewmate + Title Sponsor Command Strip */}
        <div
          className="garage-crew-strip"
          style={
            {
              "--team-color": activeTeam.color,
            } as React.CSSProperties
          }
        >
          <div className="garage-crew-team">
            <span className="garage-team-tag">{activeTeam.carCode}</span>
            <strong>{activeTeam.name}</strong>
            <span className="garage-sponsor-badge">
              {activeTeam.titleSponsor}
            </span>
          </div>

          <div className="garage-crew-buttons" role="group" aria-label="Crewmate Car">
            {teamCrewmates.map((drv, idx) => {
              const selected = drv.id === activeDriver.id;
              return (
                <button
                  key={drv.id}
                  type="button"
                  onClick={() => {
                    setFavoriteTeam(activeTeam.id);
                    setFavoriteDriver(drv.id);
                  }}
                  className={cn("garage-crew-pill", selected && "is-active")}
                >
                  <span className="crew-badge-num">#{drv.number}</span>
                  <span>{drv.name}</span>
                  <small>{idx === 0 ? "CAR 1" : "CAR 2"}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            "garage-split",
            mode === "drive" && "is-console-mode"
          )}
        >
          {mode === "inspect" && (
            /* Left Glowing Inspector Card */
            <Reveal direction="left" className="garage-inspector-card">
              <div key={activePart.id} className="inspector-content-anim">
                <div className="inspector-top-tag">
                  <span className="garage-badge-dot" />
                  <span>{activePart.label}</span>
                </div>

                <p className="garage-desc">{activePart.summary}</p>

                {/* Constructor Studio F1 Car Preview */}
                <div className="garage-cutaway-preview" aria-hidden="true">
                  <img
                    src={activeTeam.carImage}
                    alt={`${activeTeam.name} ${activePart.label}`}
                    className="cutaway-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="cutaway-grid-overlay" />
                  <span className="cutaway-tag">
                    {activeTeam.carCode} {"//"} #{activeDriver.number} {activeDriver.code}
                  </span>
                </div>

                <div className="telemetry-bars">
                  {activePart.specs.map((spec) => (
                    <div key={spec.label} className="telemetry-bar-item">
                      <div className="telemetry-bar-head">
                        <span>{spec.label}</span>
                        <strong>{spec.value}</strong>
                      </div>
                      <div className="telemetry-bar-track">
                        <div
                          className="telemetry-bar-fill"
                          style={{
                            transform: `scaleX(${(spec.percent / 100).toFixed(3)})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="garage-inspector-sponsors">
                  <span className="inspector-sponsors-kicker">
                    ACTIVE LIVERY PARTNERS ({activeTeam.shortName})
                  </span>
                  <div className="inspector-sponsors-list">
                    {activeTeam.sponsors.slice(0, 4).map((sp) => (
                      <span key={sp.name} className="inspector-sponsor-chip">
                        <strong>{sp.name}</strong> • {sp.zone}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* Right / Full-Width Interactive 360° 3D Garage Car Stage */}
          <Reveal direction="right" delay={100} className="garage-stage-wrap">
            <div className="garage-stage">
              <F1Car3DViewer
                variant="garage"
                liveryId={liveryId}
                onChangeLivery={handleChangeLivery}
                driverNumber={String(activeDriver.number)}
                isCrewmate={activeCrewIndex === 1}
                drsOpen={drsOpen}
                onToggleDrs={handleToggleDrs}
                zoom={zoom}
                onChangeZoom={handleChangeZoom}
                selectedPartId={selectedId}
                onSelectPart={setSelectedId}
                garageParts={garageParts}
                hideCallouts={mode === "drive"}
                resetSignal={resetSignal}
                driveTelemetryRef={driveTelemetryRef}
                onWakeRef={onWakeCarRef}
                cameraPresetRequest={cameraPresetRequest}
              />
            </div>

            {mode === "drive" ? (
              <DrivingConsole
                team={activeTeam}
                drivers={teamCrewmates}
                activeDriver={activeDriver}
                isCrewmate={activeCrewIndex === 1}
                onSelectDriver={handleSelectDriver}
                telemetryRef={driveTelemetryRef}
                onWakeCarRef={onWakeCarRef}
                onSyncDrsState={setDrsOpen}
                onRequestCamera={handleRequestCamera}
              />
            ) : (
              <div className="garage-controls-bar">
                <span className="garage-hint">
                  ⟲ Drag full 360° around F1 car • Shift+Scroll or slider to zoom
                </span>

                <div className="garage-zoom-controls">
                  <button
                    type="button"
                    className="garage-zoom-btn"
                    aria-label="Zoom out"
                    onClick={() => {
                      setZoom((z) => clamp(Number((z - 0.15).toFixed(2)), 1, 1.8));
                    }}
                  >
                    −
                  </button>
                  <label htmlFor="garage-zoom-range">ZOOM {zoom.toFixed(1)}X</label>
                  <input
                    id="garage-zoom-range"
                    type="range"
                    min={1}
                    max={1.8}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                  <button
                    type="button"
                    className="garage-zoom-btn"
                    aria-label="Zoom in"
                    onClick={() => {
                      setZoom((z) => clamp(Number((z + 0.15).toFixed(2)), 1, 1.8));
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="control-chip"
                    onClick={() => {
                      setZoom(1.1);
                      setDrsOpen(false);
                      driveTelemetryRef.current.drsOpen = false;
                      setSelectedId(garageParts[0].id);
                      setResetSignal((s) => s + 1);
                    }}
                  >
                    RESET
                  </button>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

