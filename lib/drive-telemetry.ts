export type ErsMode = "CHARGE" | "HOTLAP" | "OVERTAKE";

export type DriveTelemetryState = {
  /** Whether the 3D driving rig is actively driven by the console physics */
  active: boolean;
  /** Vehicle forward or reverse speed magnitude in km/h (0..356) */
  speedKmh: number;
  /** Power unit ICE crankshaft speed in RPM (3800..13200) */
  rpm: number;
  /** Selected transmission gear (-1 = R, 0 = N, 1..8 = Forward gears) */
  gear: number;
  /** Auto-shift vs manual paddle shifting */
  autoGearbox: boolean;
  /** Normalized accelerator pedal input 0..1 */
  throttle: number;
  /** Normalized brake pedal input 0..1 */
  brake: number;
  /** Normalized front-axle steering input -1 (left) .. +1 (right) */
  steer: number;
  /** DRS rear flap activation state */
  drsOpen: boolean;
  /** Hybrid MGU-K 350 kW deployment strategy */
  ersMode: ErsMode;
  /** Energy Store state of charge 0..100 */
  ersBattery: number;
  /** Pit lane speed limiter (80 km/h) */
  pitLimiter: boolean;
  /** Estimated carbon-ceramic brake rotor temperature (°C) */
  brakeTempC: number;
  /** Active lap timer & delta seconds */
  lapTimeSec: number;
  deltaSec: number;
  /** Distance traveled along the circuit in meters */
  distanceMeters: number;
};

export function createInitialDriveTelemetry(): DriveTelemetryState {
  return {
    active: true,
    speedKmh: 0,
    rpm: 4100,
    gear: 1,
    autoGearbox: true,
    throttle: 0,
    brake: 0,
    steer: 0,
    drsOpen: false,
    ersMode: "HOTLAP",
    ersBattery: 92,
    pitLimiter: false,
    brakeTempC: 340,
    lapTimeSec: 0,
    deltaSec: 0,
    distanceMeters: 0,
  };
}

