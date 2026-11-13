"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STAGE_LABELS = [
  "FIA SYSTEM STANDBY",
  "POD 1 • 1.6L TURBO SPOOLING",
  "POD 2 • 350 KW ERS SYNCHRONIZED",
  "POD 3 • ACTIVE AERO FLAPS PRIMED",
  "POD 4 • PIRELLI SOFT THERMAL WINDOW OK",
  "POD 5 • CLUTCH LOCKED // ALL 5 REDS ON",
  "LIGHTS OUT. AWAY WE GO.",
] as const;

export default function LoadingScreen() {
  const [litCount, setLitCount] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(3);

  const timersRef = useRef<number[]>([]);
  const intervalsRef = useRef<number[]>([]);
  const enteredDispatchedRef = useRef(false);

  const emitEntrySignal = useCallback(() => {
    if (enteredDispatchedRef.current) return;
    enteredDispatchedRef.current = true;
    document.documentElement.classList.add("f1-entered");
    window.dispatchEvent(new CustomEvent("f1:lights-out"));
  }, []);

  const clearScheduled = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
    for (const id of intervalsRef.current) {
      window.clearInterval(id);
    }
    intervalsRef.current = [];
  }, []);

  const triggerExit = useCallback(
    (instant = false) => {
      clearScheduled();
      setLightsOut(true);
      setLitCount(0);
      setExiting(true);
      setSecondsLeft(0);
      emitEntrySignal();
      timersRef.current.push(
        window.setTimeout(() => {
          setHidden(true);
        }, instant ? 200 : 340)
      );
    },
    [clearScheduled, emitEntrySignal]
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      emitEntrySignal();
      setHidden(true);
      return;
    }

    // Dynamic 3-second countdown ticker for the SKIP word
    const startTimestamp = performance.now();
    const intervalId = window.setInterval(() => {
      const elapsed = performance.now() - startTimestamp;
      const remaining = Math.max(0, Math.ceil((2950 - elapsed) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        window.clearInterval(intervalId);
      }
    }, 100);
    intervalsRef.current.push(intervalId);

    // Realistic FIA 5-pod ignition sequence with ample time to appreciate each step
    const podTimings = [450, 900, 1350, 1800, 2250];
    podTimings.forEach((ms, idx) => {
      timersRef.current.push(
        window.setTimeout(() => {
          setLitCount(idx + 1);
        }, ms)
      );
    });

    // FIA suspense hold: all 5 pods glare before simultaneous LIGHTS OUT at 2950ms
    timersRef.current.push(
      window.setTimeout(() => {
        setLitCount(0);
        setLightsOut(true);
        setSecondsLeft(0);
        emitEntrySignal();
      }, 2950)
    );

    // Screen launches upward with high-speed blur dissolve
    timersRef.current.push(
      window.setTimeout(() => {
        setExiting(true);
      }, 3350)
    );

    // Completely unmount after entrance sweep finishes
    timersRef.current.push(
      window.setTimeout(() => {
        setHidden(true);
      }, 3750)
    );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        triggerExit(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearScheduled();
      emitEntrySignal();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [clearScheduled, emitEntrySignal, triggerExit]);

  if (hidden) return null;

  const statusText = lightsOut
    ? STAGE_LABELS[6]
    : STAGE_LABELS[Math.min(litCount, 5)];

  return (
    <div
      className={`loading-screen ${exiting ? "is-exiting" : ""} ${
        lightsOut ? "is-lights-out" : ""
      }`}
      aria-label="F1 Fanverse Race Start Sequence"
      role="status"
    >
      {/* Background Atmosphere: Spotlight Flare & Grid Straight */}
      <div className="loading-bg-glow" aria-hidden="true" />
      <div className="loading-track-grid" aria-hidden="true" />

      {/* Top Telemetry Eyebrow */}
      <div className="loading-eyebrow-bar" aria-hidden="true">
        <span className="eyebrow-beacon" />
        <span>FIA FORMULA 1 WORLD CHAMPIONSHIP™ {"//"} 2026 SEASON OPENER</span>
      </div>

      {/* Main Start Gantry with 5 pods */}
      <div className={`gantry-assembly ${litCount > 0 ? "is-revving" : ""}`} aria-hidden="true">
        <div className="gantry-truss">
          <span className="truss-title">FIA START GANTRY</span>
          <span className={`truss-status ${lightsOut ? "is-go" : ""}`}>
            {lightsOut ? "GREEN // GO!" : `${litCount}/5`}
          </span>
        </div>

        <div className="gantry-bar">
          {[1, 2, 3, 4, 5].map((pod) => {
            const isLit = !lightsOut && pod <= litCount;
            return (
              <div
                key={pod}
                className={`gantry-pod ${isLit ? "is-pod-lit" : ""}`}
              >
                <div className="gantry-hood" />
                <span className={`gantry-lamp ${isLit ? "is-lit" : ""}`}>
                  <span className="lamp-core" />
                </span>
                <span className={`gantry-lamp ${isLit ? "is-lit" : ""}`}>
                  <span className="lamp-core" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Cluster with Title & Animated Progress */}
      <div className="loading-center-cluster">
        <div className="loading-mark">
          <span className="mark-f1">F1</span>
          <span className="mark-text">FANVERSE</span>
          <em className="mark-year">2026</em>
        </div>

        <div className="loading-progress">
          <div className="loading-track">
            <div className="loading-track-fill" />
          </div>

          <div className="loading-label">
            <span className="stage-name">{statusText}</span>
            <span className="stage-counter">{lightsOut ? "GO!" : `${litCount}/5`}</span>
          </div>
        </div>
      </div>

      {/* Minimalist Typographic Skip Word & Arrow */}
      <button
        type="button"
        className="loading-skip-word"
        onClick={() => {
          triggerExit(true);
        }}
        aria-label="Skip start sequence"
      >
        <span className="skip-text">SKIP</span>
        <span className="skip-arrow" aria-hidden="true">{"->"}</span>
        <span className="skip-countdown" aria-hidden="true">
          {secondsLeft > 0 ? `${secondsLeft}s` : "GO"}
        </span>
      </button>
    </div>
  );
}
