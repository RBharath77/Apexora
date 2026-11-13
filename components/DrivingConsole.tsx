"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import type { ConstructorTeam, DriverStanding } from "../lib/constants";
import type { DriveTelemetryState, ErsMode } from "../lib/drive-telemetry";
import { cn, hexToRgba } from "../lib/utils";

type DrivingConsoleProps = {
  team: ConstructorTeam;
  drivers: readonly DriverStanding[];
  activeDriver: DriverStanding;
  isCrewmate: boolean;
  onSelectDriver: (driverId: string) => void;
  telemetryRef: MutableRefObject<DriveTelemetryState>;
  onWakeCarRef: MutableRefObject<(() => void) | null>;
  onSyncDrsState: (open: boolean) => void;
  onRequestCamera: (
    preset: "cockpit" | "onboard" | "chase" | "threeQuarter" | "front"
  ) => void;
};

const GEAR_TOP_SPEEDS = [92, 134, 174, 214, 254, 294, 328, 358] as const;

function formatLapTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const rem = sec - m * 60;
  return `${m}:${rem < 10 ? "0" : ""}${rem.toFixed(2)}`;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export default function DrivingConsole({
  team,
  drivers,
  activeDriver,
  isCrewmate,
  onSelectDriver,
  telemetryRef,
  onWakeCarRef,
  onSyncDrsState,
  onRequestCamera,
}: DrivingConsoleProps) {
  const [autoGearbox, setAutoGearbox] = useState(true);
  const [drsUiOpen, setDrsUiOpen] = useState(() => telemetryRef.current.drsOpen);
  const [ersMode, setErsMode] = useState<ErsMode>(() => telemetryRef.current.ersMode);
  const [pitLimiter, setPitLimiter] = useState(() => telemetryRef.current.pitLimiter);
  const [brakeMig, setBrakeMig] = useState(56.0);
  const [diffEntry, setDiffEntry] = useState(7);
  const [keyboardArmed, setKeyboardArmed] = useState(true);
  const [activeCam, setActiveCam] = useState<
    "cockpit" | "onboard" | "chase" | "threeQuarter" | "front"
  >("cockpit");

  const inputsRef = useRef({
    throttleHold: false,
    brakeHold: false,
    leftHold: false,
    rightHold: false,
    boostHold: false,
    manualSteer: 0,
    manualSteerActive: false,
  });

  // 60fps Direct DOM Telemetry Refs (0 React re-renders while driving)
  const ledRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const speedElRef = useRef<HTMLDivElement>(null);
  const gearElRef = useRef<HTMLDivElement>(null);
  const rpmElRef = useRef<HTMLSpanElement>(null);
  const ersPctElRef = useRef<HTMLSpanElement>(null);
  const ersBarElRef = useRef<HTMLDivElement>(null);
  const brakeTempElRef = useRef<HTMLSpanElement>(null);
  const lapTimeElRef = useRef<HTMLSpanElement>(null);
  const deltaElRef = useRef<HTMLSpanElement>(null);
  const throttleBarRef = useRef<HTMLDivElement>(null);
  const brakeBarRef = useRef<HTMLDivElement>(null);
  const wheelVisualRef = useRef<HTMLDivElement>(null);
  const lastDrsSyncedRef = useRef<boolean>(telemetryRef.current.drsOpen);
  const wakePhysicsRef = useRef<() => void>(() => {});

  const wakeViewer = () => {
    wakePhysicsRef.current();
    onWakeCarRef.current?.();
  };

  const shiftGear = (delta: -1 | 1) => {
    const t = telemetryRef.current;
    t.autoGearbox = false;
    setAutoGearbox(false);
    t.gear = Math.max(-1, Math.min(8, t.gear + delta));
    wakeViewer();
  };

  const toggleDrs = () => {
    const next = !telemetryRef.current.drsOpen;
    telemetryRef.current.drsOpen = next;
    lastDrsSyncedRef.current = next;
    setDrsUiOpen(next);
    onSyncDrsState(next);
    wakeViewer();
  };

  const cycleErsMode = (mode?: ErsMode) => {
    const order: ErsMode[] = ["CHARGE", "HOTLAP", "OVERTAKE"];
    const next =
      mode ?? order[(order.indexOf(telemetryRef.current.ersMode) + 1) % order.length];
    telemetryRef.current.ersMode = next;
    setErsMode(next);
    wakeViewer();
  };

  const togglePitLimiter = () => {
    const next = !telemetryRef.current.pitLimiter;
    telemetryRef.current.pitLimiter = next;
    setPitLimiter(next);
    wakeViewer();
  };

  const resetLapSession = () => {
    const t = telemetryRef.current;
    t.speedKmh = 0;
    t.rpm = 4100;
    t.gear = 1;
    t.lapTimeSec = 0;
    t.deltaSec = 0;
    t.ersBattery = 100;
    t.brakeTempC = 340;
    t.drsOpen = false;
    lastDrsSyncedRef.current = false;
    setDrsUiOpen(false);
    onSyncDrsState(false);
    wakeViewer();
  };

  const switchCamera = (
    preset: "cockpit" | "onboard" | "chase" | "threeQuarter" | "front"
  ) => {
    setActiveCam(preset);
    onRequestCamera(preset);
  };

  useEffect(() => {
    telemetryRef.current.autoGearbox = autoGearbox;
  }, [autoGearbox, telemetryRef]);

  useEffect(() => {
    const clearHolds = () => {
      inputsRef.current.throttleHold = false;
      inputsRef.current.brakeHold = false;
      inputsRef.current.leftHold = false;
      inputsRef.current.rightHold = false;
      inputsRef.current.boostHold = false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!keyboardArmed || isEditableTarget(e.target)) return;
      const key = e.key.toLowerCase();

      if (key === "w" || e.key === "ArrowUp") {
        e.preventDefault();
        inputsRef.current.throttleHold = true;
        wakeViewer();
      } else if (key === "s" || e.key === "ArrowDown") {
        e.preventDefault();
        inputsRef.current.brakeHold = true;
        wakeViewer();
      } else if (key === "a" || e.key === "ArrowLeft") {
        e.preventDefault();
        inputsRef.current.leftHold = true;
        inputsRef.current.manualSteerActive = false;
        wakeViewer();
      } else if (key === "d" || e.key === "ArrowRight") {
        e.preventDefault();
        inputsRef.current.rightHold = true;
        inputsRef.current.manualSteerActive = false;
        wakeViewer();
      } else if (e.code === "Space") {
        e.preventDefault();
        if (!inputsRef.current.boostHold) {
          inputsRef.current.boostHold = true;
          telemetryRef.current.ersMode = "OVERTAKE";
          setErsMode("OVERTAKE");
          wakeViewer();
        }
      } else if (key === "e" && !e.repeat) {
        e.preventDefault();
        toggleDrs();
      } else if (key === "q" && !e.repeat) {
        e.preventDefault();
        shiftGear(-1);
      } else if (key === "r" && !e.repeat) {
        e.preventDefault();
        shiftGear(1);
      } else if (key === "p" && !e.repeat) {
        e.preventDefault();
        togglePitLimiter();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "w" || e.key === "ArrowUp") inputsRef.current.throttleHold = false;
      if (key === "s" || e.key === "ArrowDown") inputsRef.current.brakeHold = false;
      if (key === "a" || e.key === "ArrowLeft") inputsRef.current.leftHold = false;
      if (key === "d" || e.key === "ArrowRight") inputsRef.current.rightHold = false;
      if (e.code === "Space") inputsRef.current.boostHold = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearHolds);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearHolds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardArmed]);

  // 60fps Vehicle Dynamics & Cached Imperative Telemetry Display Loop (auto-sleeps when parked)
  useEffect(() => {
    let rafId = 0;
    let lastNow = performance.now();
    let prevLedCount = -1;
    let prevSpeedStr = "";
    let prevGearStr = "";
    let prevRpmStr = "";
    let prevErsStr = "";
    let prevErsScale = "";
    let prevTempStr = "";
    let prevLapStr = "";
    let prevDeltaStr = "";
    let prevThrottleScale = "";
    let prevBrakeScale = "";
    let prevSteerTransform = "";

    const paintHud = () => {
      const t = telemetryRef.current;

      const speedStr = String(Math.round(t.speedKmh)).padStart(3, "0");
      if (speedStr !== prevSpeedStr && speedElRef.current) {
        prevSpeedStr = speedStr;
        speedElRef.current.textContent = speedStr;
      }

      const gearStr = t.gear === -1 ? "R" : t.gear === 0 ? "N" : String(t.gear);
      if (gearStr !== prevGearStr && gearElRef.current) {
        prevGearStr = gearStr;
        gearElRef.current.textContent = gearStr;
      }

      const roundedRpm = Math.round(t.rpm / 20) * 20;
      const rpmStr = `${roundedRpm.toLocaleString()} RPM`;
      if (rpmStr !== prevRpmStr && rpmElRef.current) {
        prevRpmStr = rpmStr;
        rpmElRef.current.textContent = rpmStr;
      }

      const ersStr = `${Math.round(t.ersBattery)}%`;
      if (ersStr !== prevErsStr && ersPctElRef.current) {
        prevErsStr = ersStr;
        ersPctElRef.current.textContent = ersStr;
      }

      const ersScale = (Math.max(0, Math.min(100, t.ersBattery)) / 100).toFixed(3);
      if (ersScale !== prevErsScale && ersBarElRef.current) {
        prevErsScale = ersScale;
        ersBarElRef.current.style.transform = `scaleX(${ersScale})`;
      }

      const tempStr = `${Math.round(t.brakeTempC)}°C`;
      if (tempStr !== prevTempStr && brakeTempElRef.current) {
        prevTempStr = tempStr;
        brakeTempElRef.current.textContent = tempStr;
      }

      const lapStr = formatLapTime(t.lapTimeSec);
      if (lapStr !== prevLapStr && lapTimeElRef.current) {
        prevLapStr = lapStr;
        lapTimeElRef.current.textContent = lapStr;
      }

      const sign = t.deltaSec <= 0 ? "-" : "+";
      const deltaStr = `${sign}${Math.abs(t.deltaSec).toFixed(3)}`;
      if (deltaStr !== prevDeltaStr && deltaElRef.current) {
        prevDeltaStr = deltaStr;
        deltaElRef.current.textContent = deltaStr;
      }

      const throttleScale = Math.max(0, Math.min(1, t.throttle)).toFixed(3);
      if (throttleScale !== prevThrottleScale && throttleBarRef.current) {
        prevThrottleScale = throttleScale;
        throttleBarRef.current.style.transform = `scaleX(${throttleScale})`;
      }

      const brakeScale = Math.max(0, Math.min(1, t.brake)).toFixed(3);
      if (brakeScale !== prevBrakeScale && brakeBarRef.current) {
        prevBrakeScale = brakeScale;
        brakeBarRef.current.style.transform = `scaleX(${brakeScale})`;
      }

      const steerDeg = (t.steer * 34).toFixed(1);
      if (steerDeg !== prevSteerTransform && wheelVisualRef.current) {
        prevSteerTransform = steerDeg;
        wheelVisualRef.current.style.transform = `rotate(${steerDeg}deg)`;
      }

      const litCount = Math.max(
        0,
        Math.min(15, Math.round(((t.rpm - 6200) / (12900 - 6200)) * 15))
      );
      if (litCount !== prevLedCount) {
        prevLedCount = litCount;
        for (let i = 0; i < 15; i++) {
          const el = ledRefs.current[i];
          if (el) {
            el.classList.toggle("is-lit", i < litCount);
          }
        }
      }
    };

    const tick = (now: number) => {
      rafId = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;

      const t = telemetryRef.current;
      const inp = inputsRef.current;
      t.active = true;

      // Smooth pedal & steering actuators
      const targetThrottle = inp.throttleHold ? 1 : 0;
      const targetBrake = inp.brakeHold ? 1 : 0;
      t.throttle += (targetThrottle - t.throttle) * (1 - Math.exp(-16 * dt));
      t.brake += (targetBrake - t.brake) * (1 - Math.exp(-18 * dt));
      if (t.throttle < 0.005) t.throttle = 0;
      if (t.brake < 0.005) t.brake = 0;

      const keySteer = (inp.rightHold ? 1 : 0) - (inp.leftHold ? 1 : 0);
      const targetSteer = inp.manualSteerActive ? inp.manualSteer : keySteer;
      t.steer += (targetSteer - t.steer) * (1 - Math.exp(-13 * dt));
      if (Math.abs(t.steer) < 0.004 && targetSteer === 0) t.steer = 0;

      // Longitudinal acceleration / drag / DRS / 350 kW ERS deployment
      const activeErsGain =
        t.ersBattery > 1 && t.throttle > 0.1
          ? t.ersMode === "OVERTAKE"
            ? 1.3
            : t.ersMode === "HOTLAP"
              ? 1.14
              : 0.96
          : 0.94;
      const drsAeroMul = t.drsOpen ? 1.07 : 1.0;

      let accel = 0;
      if (t.gear === -1) {
        if (t.throttle > 0.05 && t.speedKmh < 48) {
          accel = t.throttle * 38;
        }
        accel -= t.brake * 82 + 12;
        if (t.speedKmh <= 0.1 && t.throttle < 0.05) accel = 0;
      } else if (t.gear === 0) {
        accel = -t.brake * 95 - (8 + t.speedKmh * 0.09);
      } else {
        const gearTop =
          (GEAR_TOP_SPEEDS[Math.max(0, t.gear - 1)] ?? 350) *
          drsAeroMul *
          (t.ersMode === "OVERTAKE" && t.ersBattery > 1 ? 1.035 : 1.0);
        const lowEndTorque = t.gear <= 3 ? 118 : t.gear <= 5 ? 82 : 52;
        const driveForce =
          t.throttle > 0.02 && t.speedKmh < gearTop
            ? t.throttle * lowEndTorque * activeErsGain
            : 0;
        const aeroDrag = 4.5 + Math.pow(t.speedKmh / 100, 2) * (t.drsOpen ? 11.5 : 15.2);
        const brakeDecel = t.brake * (135 + t.speedKmh * 0.34);
        accel = driveForce - brakeDecel - aeroDrag;
      }

      t.speedKmh = Math.max(0, Math.min(362, t.speedKmh + accel * dt));
      if (t.pitLimiter && t.speedKmh > 80) {
        t.speedKmh = Math.max(80, t.speedKmh - 140 * dt);
      }
      if (t.speedKmh < 0.15 && t.throttle < 0.02) {
        t.speedKmh = 0;
      }

      // Auto-close DRS when braking hard
      if (t.drsOpen && t.brake > 0.4 && t.speedKmh > 25) {
        t.drsOpen = false;
      }
      if (lastDrsSyncedRef.current !== t.drsOpen) {
        lastDrsSyncedRef.current = t.drsOpen;
        setDrsUiOpen(t.drsOpen);
        onSyncDrsState(t.drsOpen);
      }

      // Hybrid ERS Battery & Carbon Brake Heat
      if (t.brake > 0.08 && t.speedKmh > 18) {
        const harvest = t.ersMode === "CHARGE" ? 16 : 9.5;
        t.ersBattery = Math.min(100, t.ersBattery + harvest * t.brake * dt);
      } else if (t.throttle > 0.25 && t.gear >= 2) {
        const drain =
          t.ersMode === "OVERTAKE" ? 10.5 : t.ersMode === "HOTLAP" ? 3.8 : -2.6;
        t.ersBattery = Math.max(0, Math.min(100, t.ersBattery - drain * t.throttle * dt));
      } else if (t.ersMode === "CHARGE") {
        t.ersBattery = Math.min(100, t.ersBattery + 3.2 * dt);
      }

      const targetTemp =
        t.brake > 0.08 && t.speedKmh > 15
          ? 960
          : 320 + Math.min(180, t.speedKmh * 0.4);
      const heatRate = t.brake > 0.08 ? 4.2 : 0.85;
      t.brakeTempC += (targetTemp - t.brakeTempC) * (1 - Math.exp(-heatRate * dt));

      // Transmission & Engine RPM
      if (t.gear === 0) {
        const freeRev = 4100 + t.throttle * 8600;
        t.rpm += (freeRev - t.rpm) * (1 - Math.exp(-12 * dt));
      } else if (t.gear === -1) {
        const revRpm = 4100 + (t.speedKmh / 48) * 7600 + t.throttle * 1200;
        t.rpm += (revRpm - t.rpm) * (1 - Math.exp(-11 * dt));
      } else {
        const currTop = GEAR_TOP_SPEEDS[t.gear - 1] ?? 358;
        const prevTop = t.gear > 1 ? GEAR_TOP_SPEEDS[t.gear - 2] * 0.66 : 0;
        const ratio = Math.max(0, Math.min(1.06, (t.speedKmh - prevTop) / Math.max(24, currTop - prevTop)));
        const loadRpm = 4100 + ratio * 8700 + (t.speedKmh < 5 ? t.throttle * 3400 : 0);
        t.rpm += (Math.min(13200, loadRpm) - t.rpm) * (1 - Math.exp(-14 * dt));

        if (t.autoGearbox) {
          if (t.rpm > 11950 && t.gear < 8 && t.throttle > 0.15) {
            t.gear += 1;
          } else if (t.rpm < 7600 && t.gear > 1 && t.speedKmh < GEAR_TOP_SPEEDS[t.gear - 2] * 0.86) {
            t.gear -= 1;
          }
        }
      }

      // Track timing
      if (t.speedKmh > 2.5) {
        t.lapTimeSec += dt;
        t.distanceMeters += (t.speedKmh / 3.6) * dt;
        const paceBias = t.throttle > 0.5 && t.drsOpen ? -0.14 : t.speedKmh > 220 ? -0.06 : 0.04;
        t.deltaSec = Math.max(-2.45, Math.min(3.5, t.deltaSec + paceBias * dt * 0.4));
      }

      paintHud();

      const hasInput =
        inp.throttleHold ||
        inp.brakeHold ||
        inp.leftHold ||
        inp.rightHold ||
        inp.boostHold ||
        inp.manualSteerActive;

      const needsCooling =
        Math.abs(t.rpm - 4100) > 18 ||
        Math.abs(t.brakeTempC - 320) > 2.5 ||
        (t.ersMode === "CHARGE" && t.ersBattery < 99.8);

      const isMoving =
        t.speedKmh > 0.05 ||
        t.throttle > 0 ||
        t.brake > 0 ||
        Math.abs(t.steer) >= 0.004;

      if (hasInput || isMoving || needsCooling) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const wakePhysics = () => {
      if (!rafId) {
        lastNow = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    wakePhysicsRef.current = wakePhysics;
    paintHud();
    wakePhysics();

    return () => {
      wakePhysicsRef.current = () => {};
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onSyncDrsState, telemetryRef]);

  const holdProps = (
    key: "throttleHold" | "brakeHold" | "leftHold" | "rightHold"
  ) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      inputsRef.current[key] = true;
      if (key === "leftHold" || key === "rightHold") {
        inputsRef.current.manualSteerActive = false;
      }
      wakeViewer();
    },
    onPointerUp: () => {
      inputsRef.current[key] = false;
    },
    onPointerCancel: () => {
      inputsRef.current[key] = false;
    },
    onLostPointerCapture: () => {
      inputsRef.current[key] = false;
    },
  });

  const activeEngineer =
    team.pitCrew.raceEngineers.find(
      (re) =>
        re.carNumber === activeDriver.number ||
        re.driverName.toLowerCase().includes(activeDriver.name.split(" ").pop()?.toLowerCase() ?? "")
    )?.engineer ?? team.pitCrew.raceEngineers[0]?.engineer;

  return (
    <div
      className="driving-console"
      style={
        {
          "--team-color": team.color,
          "--team-soft": hexToRgba(team.color, 0.16),
          "--team-border": hexToRgba(team.color, 0.45),
        } as CSSProperties
      }
    >
      {/* Top Crewmate & Camera Command Header */}
      <div className="driving-console-head">
        <div className="driving-crew-switch">
          <span className="driving-mini-kicker">
            {team.carCode} COCKPIT RIG • {team.titleSponsor}
          </span>
          <div className="crew-pill-row" role="group" aria-label="Switch Crewmate Car">
            {drivers.map((drv, idx) => {
              const selected = drv.id === activeDriver.id;
              return (
                <button
                  key={drv.id}
                  type="button"
                  onClick={() => onSelectDriver(drv.id)}
                  className={cn("crew-switch-pill", selected && "is-active")}
                >
                  <span className="crew-num">#{drv.number}</span>
                  <span>{drv.name}</span>
                  <span className="crew-tcam">
                    {idx === 0 ? "T-CAM BLK" : "T-CAM ACC"}
                  </span>
                </button>
              );
            })}
          </div>
          {activeEngineer && (
            <div className="driving-engineer-line">
              RACE ENGINEER: <strong>{activeEngineer}</strong> • PIT RECORD:{" "}
              <strong>{team.pitCrew.pitStopBest}</strong> • T-CAM:{" "}
              <strong>{isCrewmate ? "CAR #2 HI-VIS" : "CAR #1 CARBON"}</strong>
            </div>
          )}
        </div>

        <div className="driving-cam-strip">
          {(
            [
              ["cockpit", "🏎️ COCKPIT VIEW"],
              ["onboard", "🎥 T-CAM ONBOARD"],
              ["chase", "🏎️ CHASE CAM"],
              ["threeQuarter", "📸 3/4 STUDIO"],
              ["front", "🏁 NOSE WING"],
            ] as const
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => switchCamera(preset)}
              className={cn("cam-mode-btn", activeCam === preset && "is-active")}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setKeyboardArmed((prev) => !prev)}
            className={cn("cam-mode-btn", keyboardArmed && "is-active")}
          >
            {keyboardArmed ? "WASD ARMED" : "ARM WASD"}
          </button>
        </div>
      </div>

      {/* Main Butterfly Carbon Steering Wheel & PCU-8D Telemetry Deck */}
      <div className="f1-wheel-deck">
        {/* Left Hand Switch Cluster: Pit Limiter, Differential & Brake Migration */}
        <div className="f1-wheel-wing">
          <div className="f1-wheel-brand">{team.shortName} SW-26</div>
          <div className="f1-dial-grid">
            <button
              type="button"
              onClick={togglePitLimiter}
              className={cn("f1-wheel-key", pitLimiter && "is-active")}
            >
              <span>PIT</span>
              <strong>{pitLimiter ? "80 KPH" : "LIMITER"}</strong>
            </button>
            <button
              type="button"
              onClick={() =>
                setBrakeMig((prev) =>
                  prev >= 58.0 ? 54.0 : Number((prev + 0.5).toFixed(1))
                )
              }
              className="f1-wheel-key"
            >
              <span>BMIG</span>
              <strong>{brakeMig.toFixed(1)}%</strong>
            </button>
            <button
              type="button"
              onClick={() => setDiffEntry((prev) => (prev >= 10 ? 5 : prev + 1))}
              className="f1-wheel-key"
            >
              <span>DIFF</span>
              <strong>ENTRY {diffEntry}</strong>
            </button>
            <button
              type="button"
              onClick={() => setAutoGearbox((prev) => !prev)}
              className={cn("f1-wheel-key", autoGearbox && "is-active")}
            >
              <span>SHIFT</span>
              <strong>{autoGearbox ? "AUTO" : "MANUAL"}</strong>
            </button>
          </div>
          <div className="f1-steer-pad">
            <button
              type="button"
              className="steer-btn"
              {...holdProps("leftHold")}
              aria-label="Steer Left"
            >
              ◀ LEFT [A]
            </button>
            <button
              type="button"
              className="steer-btn"
              {...holdProps("rightHold")}
              aria-label="Steer Right"
            >
              RIGHT [D] ▶
            </button>
          </div>
        </div>

        {/* Center PCU-8D High-Contrast OLED Display & 15 Shift LEDs */}
        <div className="f1-oled-center">
          <div className="f1-led-strip" aria-hidden="true">
            {Array.from({ length: 15 }).map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  ledRefs.current[i] = el;
                }}
                className={cn(
                  "f1-shift-led",
                  i < 5 ? "tier-low" : i < 10 ? "tier-mid" : "tier-peak"
                )}
              />
            ))}
          </div>

          <div className="f1-oled-screen">
            <div className="f1-oled-row-top">
              <span ref={rpmElRef}>4,100 RPM</span>
              <span>
                LAP <strong ref={lapTimeElRef}>0:00.00</strong>
              </span>
              <span ref={deltaElRef} className="f1-delta-val">
                +0.000
              </span>
            </div>

            <div className="f1-oled-core">
              <div className="f1-gear-block">
                <span className="oled-mini-lbl">GEAR</span>
                <div ref={gearElRef} className="f1-gear-digit">
                  1
                </div>
              </div>

              <div className="f1-speed-block">
                <div ref={speedElRef} className="f1-speed-digit">
                  000
                </div>
                <span className="oled-mini-lbl">KM/H</span>
              </div>

              <div className="f1-wheel-mimic" aria-hidden="true">
                <div ref={wheelVisualRef} className="f1-wheel-yoke">
                  <span />
                </div>
                <small>STEER</small>
              </div>
            </div>

            <div className="f1-oled-bars">
              <div className="oled-meter">
                <div className="oled-meter-head">
                  <span>ERS BATTERY ({ersMode})</span>
                  <span ref={ersPctElRef}>92%</span>
                </div>
                <div className="oled-meter-track">
                  <div
                    ref={ersBarElRef}
                    className="oled-meter-fill is-ers"
                    style={{ transform: "scaleX(0.92)" }}
                  />
                </div>
              </div>

              <div className="oled-meter">
                <div className="oled-meter-head">
                  <span>THROTTLE / BRAKE • ROTOR</span>
                  <span ref={brakeTempElRef}>340°C</span>
                </div>
                <div className="oled-dual-track">
                  <div
                    ref={throttleBarRef}
                    className="oled-meter-fill is-throttle"
                    style={{ transform: "scaleX(0)" }}
                  />
                  <div
                    ref={brakeBarRef}
                    className="oled-meter-fill is-brake"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="f1-pedal-bank">
            <button
              type="button"
              className="f1-pedal is-brake"
              {...holdProps("brakeHold")}
            >
              <span className="pedal-lbl">CARBON BRAKE [S]</span>
              <strong className="pedal-sub">HOLD TO DECEL & REGEN</strong>
            </button>
            <button
              type="button"
              className="f1-pedal is-throttle"
              {...holdProps("throttleHold")}
            >
              <span className="pedal-lbl">THROTTLE [W]</span>
              <strong className="pedal-sub">HOLD FOR FULL 350KW PUSH</strong>
            </button>
          </div>
        </div>

        {/* Right Hand Switch Cluster: DRS, ERS Deployment, Paddle Shifts & Reset */}
        <div className="f1-wheel-wing">
          <div className="f1-wheel-brand">{activeDriver.code} #{activeDriver.number}</div>
          <div className="f1-dial-grid">
            <button
              type="button"
              onClick={toggleDrs}
              className={cn("f1-wheel-key", drsUiOpen && "is-active")}
            >
              <span>DRS [E]</span>
              <strong>{drsUiOpen ? "OPEN" : "CLOSED"}</strong>
            </button>
            <button
              type="button"
              onClick={() => cycleErsMode()}
              className={cn(
                "f1-wheel-key",
                ersMode === "OVERTAKE" && "is-active"
              )}
            >
              <span>ERS [SPC]</span>
              <strong>{ersMode}</strong>
            </button>
            <button
              type="button"
              onClick={() => shiftGear(-1)}
              className="f1-wheel-key"
            >
              <span>DOWN [Q]</span>
              <strong>- GEAR</strong>
            </button>
            <button
              type="button"
              onClick={() => shiftGear(1)}
              className="f1-wheel-key"
            >
              <span>UP [R]</span>
              <strong>+ GEAR</strong>
            </button>
          </div>

          <div className="f1-steer-pad">
            <label className="steer-slider-wrap">
              <span>FINE STEER</span>
              <input
                type="range"
                min={-100}
                max={100}
                defaultValue={0}
                onChange={(e) => {
                  const v = Number(e.target.value) / 100;
                  inputsRef.current.manualSteer = v;
                  inputsRef.current.manualSteerActive = Math.abs(v) > 0.02;
                  wakeViewer();
                }}
              />
            </label>
            <button type="button" onClick={resetLapSession} className="steer-btn">
              ↺ RESET PIT
            </button>
          </div>
        </div>
      </div>

      <div className="driving-console-foot">
        <span>
          CONTROLS: <strong>[W/S]</strong> THROTTLE/BRAKE • <strong>[A/D]</strong>{" "}
          STEER • <strong>[E]</strong> DRS • <strong>[SPACE]</strong> OVERTAKE •{" "}
          <strong>[Q/R]</strong> GEAR PADDLES • <strong>[P]</strong> PIT LIMITER
        </span>
        <span>
          {team.powerUnit} • {team.chassisSpecs.ersOutput} • TOP SPEED{" "}
          {team.chassisSpecs.topSpeed}
        </span>
      </div>
    </div>
  );
}

