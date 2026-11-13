"use client";

import { useEffect, useRef, useState } from "react";
import { worldCircuits } from "../lib/constants";
import { useFavorites } from "../lib/favorites";
import { clamp, cn } from "../lib/utils";
import { Reveal, useActiveRenderGate } from "./MotionPrimitives";
import SectionTitle from "./SectionTitle";

export default function CircuitsWorldSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isActiveRender = useActiveRenderGate(sectionRef);

  const { favorites, setFavoriteCircuit } = useFavorites();
  const [selectedId, setSelectedId] = useState<string>(worldCircuits[0].id);
  const [liveTelemetry, setLiveTelemetry] = useState({
    speed: worldCircuits[0].speedKmh,
    gear: 2,
    throttle: 86,
    brake: 0,
  });

  const globeCanvasRef = useRef<HTMLCanvasElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const carDotRef = useRef<SVGGElement>(null);

  const rotationRef = useRef<{ lon: number; lat: number }>({
    lon: -worldCircuits[0].lon,
    lat: 20,
  });
  const targetRotRef = useRef<{ lon: number; lat: number }>({
    lon: -worldCircuits[0].lon,
    lat: 20,
  });
  const draggingGlobeRef = useRef(false);
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const wakeGlobeRef = useRef<() => void>(() => {});

  const circuit =
    worldCircuits.find((c) => c.id === selectedId) ?? worldCircuits[0];

  useEffect(() => {
    targetRotRef.current = {
      lon: -circuit.lon,
      lat: clamp(circuit.lat * 0.45, -25, 35),
    };
  }, [circuit.lat, circuit.lon]);

  // Viewport + visibility gated 3D Canvas Globe Renderer
  useEffect(() => {
    const canvas = globeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const size = 280;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 104;

    const project = (
      latDeg: number,
      lonDeg: number,
      rotLon: number,
      rotLat: number
    ) => {
      const lat = (latDeg * Math.PI) / 180;
      const lon = ((lonDeg + rotLon) * Math.PI) / 180;
      const tilt = (rotLat * Math.PI) / 180;

      const x0 = Math.cos(lat) * Math.sin(lon);
      const y0 = Math.sin(lat);
      const z0 = Math.cos(lat) * Math.cos(lon);

      const y1 = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z1 = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);

      return {
        x: cx + x0 * radius,
        y: cy - y1 * radius,
        visible: z1 > -0.08,
      };
    };

    let rafId = 0;

    const drawGlobe = () => {
      rafId = 0;
      ctx.clearRect(0, 0, size, size);

      let moving = draggingGlobeRef.current;
      if (!draggingGlobeRef.current && !reduceMotion) {
        const dLon = targetRotRef.current.lon - rotationRef.current.lon;
        const dLat = targetRotRef.current.lat - rotationRef.current.lat;
        if (Math.abs(dLon) > 0.06 || Math.abs(dLat) > 0.06) {
          rotationRef.current.lon += dLon * 0.1;
          rotationRef.current.lat += dLat * 0.1;
          moving = true;
        } else {
          rotationRef.current.lon = targetRotRef.current.lon;
          rotationRef.current.lat = targetRotRef.current.lat;
        }
      }

      const rLon = rotationRef.current.lon;
      const rLat = rotationRef.current.lat;

      const halo = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.72,
        cx,
        cy,
        radius * 1.24
      );
      halo.addColorStop(0, "rgba(28, 125, 255, 0.16)");
      halo.addColorStop(0.75, "rgba(225, 6, 0, 0.12)");
      halo.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.22, 0, Math.PI * 2);
      ctx.fill();

      const sphereGrad = ctx.createRadialGradient(
        cx - 32,
        cy - 34,
        14,
        cx,
        cy,
        radius
      );
      sphereGrad.addColorStop(0, "#122645");
      sphereGrad.addColorStop(0.55, "#091324");
      sphereGrad.addColorStop(1, "#03060c");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(100, 180, 255, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.strokeStyle = "rgba(120, 180, 255, 0.13)";
      ctx.lineWidth = 0.8;
      for (let lon = -150; lon <= 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -85; lat <= 85; lat += 6) {
          const p = project(lat, lon, rLon, rLat);
          if (p.visible) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 8) {
          const p = project(lat, lon, rLon, rLat);
          if (p.visible) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      for (const item of worldCircuits) {
        const p = project(item.lat, item.lon, rLon, rLat);
        if (!p.visible) continue;
        const isCurrent = item.id === circuit.id;

        if (isCurrent) {
          ctx.fillStyle = "rgba(225, 6, 0, 0.28)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isCurrent ? "#ff2a24" : "#60a5fa";
        ctx.beginPath();
        ctx.arc(p.x, p.y, isCurrent ? 4.8 : 3, 0, Math.PI * 2);
        ctx.fill();

        if (isCurrent) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }

      if (!reduceMotion && isActiveRender && moving) {
        rafId = requestAnimationFrame(drawGlobe);
      }
    };

    const wake = () => {
      if (!rafId && isActiveRender) {
        rafId = requestAnimationFrame(drawGlobe);
      }
    };
    wakeGlobeRef.current = wake;

    if (isActiveRender) {
      drawGlobe();
    }

    return () => {
      wakeGlobeRef.current = () => {};
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [circuit.id, isActiveRender]);

  // Viewport + visibility gated SVG Ghost Lap Animation
  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl || !isActiveRender) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const totalLen = pathEl.getTotalLength();
    let dist = 0;
    let lastTime = performance.now();
    let lastUi = 0;
    let rafId = 0;

    const sampleCurvature = (d: number) => {
      const p1 = pathEl.getPointAtLength((d - 12 + totalLen) % totalLen);
      const p2 = pathEl.getPointAtLength(d % totalLen);
      const p3 = pathEl.getPointAtLength((d + 12) % totalLen);
      const a1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const a2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
      let delta = Math.abs(a2 - a1);
      if (delta > Math.PI) delta = 2 * Math.PI - delta;
      return delta;
    };

    const tick = (now: number) => {
      if (!isActiveRender) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!reduceMotion) {
        const curv = sampleCurvature(dist);
        const cornerFactor = clamp(curv / 0.45, 0, 1);
        const speed = Math.round(344 - cornerFactor * 258);
        dist = (dist + (100 + (speed / 344) * 145) * dt) % totalLen;

        const pt = pathEl.getPointAtLength(dist);
        if (carDotRef.current) {
          carDotRef.current.setAttribute(
            "transform",
            `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`
          );
        }

        if (now - lastUi > 120) {
          lastUi = now;
          const braking = cornerFactor > 0.36;
          setLiveTelemetry({
            speed,
            gear: clamp(Math.ceil((speed / 344) * 8), 1, 8),
            throttle: braking ? Math.round((1 - cornerFactor) * 32) : 98,
            brake: braking ? Math.round(cornerFactor * 94) : 0,
          });
        }

        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [circuit, isActiveRender]);

  return (
    <section
      ref={sectionRef}
      id="circuits"
      className="fanverse-section section-circuits-world"
    >
      <div className="section-inner">
        <SectionTitle
          number="05"
          eyebrow="F1 WORLD & TELEMETRY CIRCUITS"
          title="F1 WORLD & THE CIRCUIT"
          subtitle="Spin the interactive 3D global circuit map, explore iconic braking zones, and watch live telemetry navigate every apex."
        />

        <div className="world-circuit-split">
          <Reveal direction="left" className="world-globe-card">
            <div className="panel-mini-head">
              <h3>
                <span>F1</span> WORLD
              </h3>
              <p>Explore global race locations.</p>
            </div>

            <div className="world-globe-body">
              <ul className="world-city-list">
                {worldCircuits.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(item.id);
                      }}
                      className={cn(
                        "city-btn",
                        item.id === circuit.id && "is-active"
                      )}
                    >
                      <span className="city-dot" />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div
                className="globe-canvas-wrap"
                onPointerDown={(e) => {
                  draggingGlobeRef.current = true;
                  lastMouseRef.current = { x: e.clientX, y: e.clientY };
                  e.currentTarget.setPointerCapture(e.pointerId);
                  wakeGlobeRef.current();
                }}
                onPointerMove={(e) => {
                  if (!draggingGlobeRef.current) return;
                  const dx = e.clientX - lastMouseRef.current.x;
                  const dy = e.clientY - lastMouseRef.current.y;
                  lastMouseRef.current = { x: e.clientX, y: e.clientY };
                  rotationRef.current.lon += dx * 0.55;
                  rotationRef.current.lat = clamp(
                    rotationRef.current.lat + dy * 0.35,
                    -65,
                    65
                  );
                  wakeGlobeRef.current();
                }}
                onPointerUp={() => {
                  draggingGlobeRef.current = false;
                  wakeGlobeRef.current();
                }}
              >
                <canvas ref={globeCanvasRef} className="globe-canvas" />
                <span className="globe-hint">⟲ Rotate Globe</span>
              </div>

              <div key={`popup-${circuit.id}`} className="world-popup-card panel-swap-in">
                <div className="popup-top">
                  <strong>{circuit.raceTitle}</strong>
                  <button
                    type="button"
                    className={cn(
                      "mini-fav-btn",
                      favorites.circuitId === circuit.id && "is-fav"
                    )}
                    aria-label={`Favorite ${circuit.name}`}
                    onClick={() => {
                      setFavoriteCircuit(circuit.id);
                    }}
                  >
                    ♥
                  </button>
                </div>
                <span className="popup-sub">
                  {circuit.country} • {circuit.lengthKm}
                </span>
                <a href="#races" className="popup-btn">
                  VIEW RACE →
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={100} className="circuit-stage-card">
            <img
              src={
                circuit.id === "vegas"
                  ? "/images/race-vegas.jpg"
                  : "/images/race-monaco.jpg"
              }
              alt={circuit.raceTitle}
              className="circuit-backdrop-photo"
              loading="lazy"
              decoding="async"
            />
            <div className="circuit-backdrop-scrim" />

            <div className="circuit-stage-content">
              <div className="panel-mini-head">
                <div>
                  <h3>
                    <span>THE</span> CIRCUIT
                  </h3>
                  <p>Live racing line telemetry — {circuit.raceTitle}</p>
                </div>
                <span className="circuit-record-badge">
                  RECORD: {circuit.lapRecord}
                </span>
              </div>

              <div className="circuit-live-grid">
                <div className="circuit-svg-box">
                  <svg
                    key={circuit.id}
                    viewBox="0 0 420 250"
                    fill="none"
                    className="track-svg"
                  >
                    <path
                      d={circuit.path}
                      stroke="rgba(225, 6, 0, 0.25)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={circuit.path}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      ref={pathRef}
                      className="circuit-draw-path"
                      d={circuit.path}
                      stroke="#e10600"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g ref={carDotRef}>
                      <circle
                        r="10"
                        fill="rgba(225, 6, 0, 0.35)"
                        className="marker-ping"
                      />
                      <circle
                        r="5"
                        fill="#e10600"
                        stroke="#fff"
                        strokeWidth="1.6"
                      />
                    </g>
                  </svg>
                </div>

                <div className="corner-telemetry-card">
                  <span className="corner-kicker">{circuit.turnName}</span>
                  <p className="corner-desc">{circuit.turnDesc}</p>

                  <div className="corner-stats">
                    <div>
                      <span>LIVE SPEED</span>
                      <strong>{liveTelemetry.speed} km/h</strong>
                    </div>
                    <div>
                      <span>GEAR</span>
                      <strong>{liveTelemetry.gear}th</strong>
                    </div>
                    <div>
                      <span>CORNER APEX</span>
                      <strong>
                        {circuit.speedKmh} km/h ({circuit.gear})
                      </strong>
                    </div>
                    <div>
                      <span>BRAKING DIST</span>
                      <strong>{circuit.distanceM} m</strong>
                    </div>
                  </div>

                  <div className="corner-pedals">
                    <div className="pedal-track">
                      <div
                        className="pedal-fill throttle"
                        style={{
                          transform: `scaleX(${(liveTelemetry.throttle / 100).toFixed(3)})`,
                        }}
                      />
                    </div>
                    <div className="pedal-track">
                      <div
                        className="pedal-fill brake"
                        style={{
                          transform: `scaleX(${(liveTelemetry.brake / 100).toFixed(3)})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
