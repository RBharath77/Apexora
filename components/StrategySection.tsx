"use client";

import { useEffect, useRef, useState } from "react";
import { tireCompounds } from "../lib/constants";
import { cn } from "../lib/utils";
import { Reveal } from "./MotionPrimitives";
import SectionTitle from "./SectionTitle";

type ReactionPhase =
  | "idle"
  | "arming"
  | "waiting"
  | "go"
  | "result"
  | "jumpstart";

export default function StrategySection() {
  const [selectedTireId, setSelectedTireId] = useState<string>(
    tireCompounds[0].id
  );

  const activeTire =
    tireCompounds.find((t) => t.id === selectedTireId) ?? tireCompounds[0];

  // Start Reaction Simulator State
  const [phase, setPhase] = useState<ReactionPhase>("idle");
  const [litLights, setLitLights] = useState(0);
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const [bestMs, setBestMs] = useState<number | null>(null);

  const goTimestampRef = useRef<number>(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const startLightsSequence = () => {
    clearTimers();
    setPhase("arming");
    setLitLights(0);
    setReactionMs(null);

    for (let i = 1; i <= 5; i++) {
      const t = window.setTimeout(() => {
        setLitLights(i);
        if (i === 5) {
          setPhase("waiting");
          const randomWait = 1000 + Math.random() * 1900;
          const outTimer = window.setTimeout(() => {
            setLitLights(0);
            setPhase("go");
            goTimestampRef.current = performance.now();
          }, randomWait);
          timersRef.current.push(outTimer);
        }
      }, i * 520);
      timersRef.current.push(t);
    }
  };

  const handleReactionPad = () => {
    if (phase === "idle" || phase === "result" || phase === "jumpstart") {
      startLightsSequence();
      return;
    }

    if (phase === "arming" || phase === "waiting") {
      clearTimers();
      setLitLights(0);
      setPhase("jumpstart");
      return;
    }

    if (phase === "go") {
      const ms = Math.round(performance.now() - goTimestampRef.current);
      setReactionMs(ms);
      setBestMs((prev) => (prev === null ? ms : Math.min(prev, ms)));
      setPhase("result");
    }
  };

  const getReactionGrade = (ms: number) => {
    if (ms < 185) return "ELITE F1 REFLEX // POLE LAUNCH";
    if (ms < 245) return "CHAMPIONSHIP PACE // CLEAN GETAWAY";
    if (ms < 340) return "MIDFIELD START // SLIGHT WHEELSPIN";
    return "DELAYED CLUTCH // LOST PLACES";
  };

  return (
    <section id="strategy" className="fanverse-section section-strategy">
      <div className="section-inner">
        <SectionTitle
          number="08"
          eyebrow="PIT WALL & REACTION LAB"
          title="STRATEGY & LIGHTS OUT"
          subtitle="Analyze Pirelli thermal degradation windows and test your starting-grid launch reflexes against a live 5-light FIA gantry."
        />

        <div className="strategy-grid">
          {/* Tire Compound & Degradation Lab */}
          <Reveal direction="left" className="strategy-card">
            <div className="card-header-row">
              <span>TIRE DEGRADATION TELEMETRY</span>
              <span className="compound-badge" style={{ color: activeTire.color }}>
                {activeTire.code} {"//"} {activeTire.windowLaps}
              </span>
            </div>

            <div className="tire-selector-row">
              {tireCompounds.map((tire) => (
                <button
                  key={tire.id}
                  type="button"
                  onClick={() => {
                    setSelectedTireId(tire.id);
                  }}
                  className={cn(
                    "tire-chip",
                    tire.id === activeTire.id && "is-active"
                  )}
                  style={
                    {
                      "--tire-color": tire.color,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className="tire-dot"
                    style={{ background: tire.color }}
                  />
                  {tire.id.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="tire-showcase">
              {/* Rotating F1 Wheel Graphic */}
              <div className="tire-wheel-wrap">
                <svg
                  className="tire-wheel-svg"
                  viewBox="0 0 140 140"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="70"
                    cy="70"
                    r="62"
                    fill="#0d0d10"
                    stroke="rgba(255,255,255,0.16)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="47"
                    stroke={activeTire.color}
                    strokeWidth="4.5"
                    strokeDasharray="62 18"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="34"
                    fill="#141418"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1.5"
                  />
                  <g className="wheel-spokes-center">
                    <line x1="70" y1="38" x2="70" y2="102" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                    <line x1="38" y1="70" x2="102" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                    <line x1="47" y1="47" x2="93" y2="93" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                    <line x1="47" y1="93" x2="93" y2="47" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                  </g>
                  <circle
                    cx="70"
                    cy="70"
                    r="10"
                    fill="#09090b"
                    stroke={activeTire.color}
                    strokeWidth="2.5"
                  />
                </svg>
                <span className="tire-temp-tag">OPT: {activeTire.optimalTemp}</span>
              </div>

              {/* Animated Degradation Curve SVG */}
              <div className="tire-curve-panel">
                <div className="curve-label">GRIP RETENTION OVER STINT</div>
                <svg
                  key={activeTire.id}
                  className="tire-curve-svg"
                  viewBox="0 0 300 160"
                  fill="none"
                >
                  <line x1="18" y1="20" x2="18" y2="145" stroke="rgba(255,255,255,0.16)" />
                  <line x1="18" y1="145" x2="286" y2="145" stroke="rgba(255,255,255,0.16)" />
                  <line x1="18" y1="82" x2="286" y2="82" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <path
                    className="curve-draw-line"
                    d={activeTire.curvePath}
                    stroke={activeTire.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="tire-desc">{activeTire.description}</p>
              </div>
            </div>

            <div className="tire-metrics">
              {[
                { label: "PEAK GRIP", value: activeTire.grip },
                { label: "DURABILITY", value: activeTire.durability },
                { label: "WARM-UP", value: activeTire.warmUp },
              ].map((m) => (
                <div key={m.label} className="tire-metric-item">
                  <div className="tire-metric-top">
                    <span>{m.label}</span>
                    <strong>{m.value}%</strong>
                  </div>
                  <div className="tire-metric-bar">
                    <div
                      style={{
                        transform: `scaleX(${(m.value / 100).toFixed(3)})`,
                        background: activeTire.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Interactive Lights Out Reaction Simulator */}
          <Reveal direction="right" delay={140} className="strategy-card reaction-card">
            <div className="card-header-row">
              <span>RACE START REACTION SIMULATOR</span>
              <span>
                BEST: {bestMs !== null ? `${bestMs} MS` : "-- MS"}
              </span>
            </div>

            <div className="sim-gantry" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((pod) => (
                <div key={pod} className="sim-pod">
                  <span
                    className={cn(
                      "sim-lamp",
                      pod <= litLights && "is-lit"
                    )}
                  />
                  <span
                    className={cn(
                      "sim-lamp",
                      pod <= litLights && "is-lit"
                    )}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleReactionPad}
              className={cn(
                "reaction-pad",
                phase === "go" && "is-go",
                phase === "jumpstart" && "is-penalty",
                (phase === "arming" || phase === "waiting") && "is-armed"
              )}
            >
              {phase === "idle" && (
                <div key="idle" className="reaction-phase-body panel-swap-in">
                  <span className="pad-eyebrow">GRID LAUNCH TEST</span>
                  <strong>TAP TO ARM LIGHTS</strong>
                  <span className="pad-sub">
                    Wait for all 5 red lights to extinguish, then react!
                  </span>
                </div>
              )}

              {(phase === "arming" || phase === "waiting") && (
                <div key="armed" className="reaction-phase-body panel-swap-in">
                  <span className="pad-eyebrow">HOLD CLUTCH...</span>
                  <strong>WAIT FOR LIGHTS OUT</strong>
                  <span className="pad-sub">Clicking early triggers a jump-start penalty</span>
                </div>
              )}

              {phase === "go" && (
                <div key="go" className="reaction-phase-body panel-swap-in">
                  <span className="pad-eyebrow">LIGHTS OUT!</span>
                  <strong>RELEASE CLUTCH NOW!</strong>
                  <span className="pad-sub">CLICK IMMEDIATELY</span>
                </div>
              )}

              {phase === "jumpstart" && (
                <div key="jumpstart" className="reaction-phase-body panel-swap-in">
                  <span className="pad-eyebrow">STEWARDS INVESTIGATION</span>
                  <strong>JUMP START // +5S PENALTY</strong>
                  <span className="pad-sub">You moved before the lights went out. Tap to retry.</span>
                </div>
              )}

              {phase === "result" && reactionMs !== null && (
                <div key="result" className="reaction-phase-body panel-swap-in">
                  <span className="pad-eyebrow">{getReactionGrade(reactionMs)}</span>
                  <strong className="reaction-score">{reactionMs} MS</strong>
                  <span className="pad-sub">
                    F1 Grid Average: ~215 ms • Tap to launch again
                  </span>
                </div>
              )}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

