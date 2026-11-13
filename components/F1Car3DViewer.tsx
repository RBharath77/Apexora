"use client";

import {
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { GaragePart } from "../lib/constants";
import type { DriveTelemetryState } from "../lib/drive-telemetry";
import { clamp, cn, hexToRgba } from "../lib/utils";
import {
  buildF1Car,
  CAR_PART_ANCHORS,
  createStudioFloorShadowTexture,
  F1_LIVERIES,
  PART_CAMERA_VIEWS,
  STUDIO_PRESETS,
  type BuiltF1Car,
  type CameraViewPreset,
  type F1LiveryId,
} from "./f1CarModel";
import { useActiveRenderGate } from "./MotionPrimitives";

type F1Car3DViewerProps = {
  variant: "hero" | "garage";
  liveryId: F1LiveryId;
  onChangeLivery?: (id: F1LiveryId) => void;
  driverNumber?: string;
  isCrewmate?: boolean;
  drsOpen?: boolean;
  onToggleDrs?: () => void;
  zoom?: number;
  onChangeZoom?: (zoom: number) => void;
  selectedPartId?: string;
  onSelectPart?: (partId: string) => void;
  garageParts?: readonly GaragePart[];
  hideCallouts?: boolean;
  resetSignal?: number;
  driveTelemetryRef?: MutableRefObject<DriveTelemetryState>;
  onWakeRef?: MutableRefObject<(() => void) | null>;
  cameraPresetRequest?: { preset: keyof typeof STUDIO_PRESETS; seq: number } | null;
  className?: string;
};

const MIN_DISTANCE = 3.2;
const ONBOARD_MIN_DISTANCE = 2.05;
const COCKPIT_MIN_DISTANCE = 0.45;
const MAX_DISTANCE = 7.4;

function zoomToDistance(zoom: number): number {
  const norm = clamp((zoom - 1) / 0.8, 0, 1);
  return THREE.MathUtils.lerp(5.85, MIN_DISTANCE, norm);
}

function distanceToZoom(dist: number): number {
  const norm = clamp((5.85 - dist) / (5.85 - MIN_DISTANCE), 0, 1);
  return Number((1 + norm * 0.8).toFixed(2));
}

/**
 * Generates an instant <1ms procedural equirectangular studio reflection texture
 * with crisp overhead softbox strips and horizon accents (zero RoomEnvironment/PMREM stall).
 */
function createStudioEnvTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.18, "#cdd6e6");
    grad.addColorStop(0.42, "#2f3648");
    grad.addColorStop(0.52, "#161925");
    grad.addColorStop(1, "#08090d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);

    // Dual studio gantry light banks for razor-sharp automotive clearcoat specular ribbons
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(24, 10, 92, 9);
    ctx.fillRect(140, 10, 92, 9);
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.fillRect(46, 26, 68, 5);
    ctx.fillRect(142, 26, 68, 5);

    // Pure neutral studio horizon bounce bars (zero non-team color cast on paint)
    ctx.fillStyle = "rgba(255, 255, 255, 0.48)";
    ctx.fillRect(12, 56, 76, 5);
    ctx.fillStyle = "rgba(226, 232, 240, 0.42)";
    ctx.fillRect(168, 56, 76, 5);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

/** Boost anisotropic filtering & mipmap crispness across all car textures. */
function sharpenCarTextures(
  group: THREE.Object3D,
  renderer: THREE.WebGLRenderer
) {
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 4);
  const visited = new Set<THREE.Texture>();
  const touchTexture = (tex: THREE.Texture | null | undefined) => {
    if (!tex || visited.has(tex)) return;
    visited.add(tex);
    tex.anisotropy = maxAniso;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
  };
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!mat) continue;
      if (mat instanceof THREE.MeshStandardMaterial) {
        touchTexture(mat.map);
        touchTexture(mat.roughnessMap);
        touchTexture(mat.metalnessMap);
        touchTexture(mat.bumpMap);
        touchTexture(mat.normalMap);
        touchTexture(mat.emissiveMap);
      } else if (mat instanceof THREE.MeshBasicMaterial) {
        touchTexture(mat.map);
      }
    }
  });
}

const F1Car3DViewer = memo(function F1Car3DViewer({
  variant,
  liveryId,
  onChangeLivery,
  driverNumber,
  isCrewmate = false,
  drsOpen = false,
  onToggleDrs,
  zoom = 1,
  onChangeZoom,
  selectedPartId,
  onSelectPart,
  garageParts,
  hideCallouts = false,
  resetSignal = 0,
  driveTelemetryRef,
  onWakeRef,
  cameraPresetRequest,
  className,
}: F1Car3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const hotspotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const badgeAngleRef = useRef<HTMLSpanElement>(null);

  const isActiveRender = useActiveRenderGate(containerRef);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(
    variant === "hero"
  );
  const builtLiveryRef = useRef<F1LiveryId | null>(null);
  const driverMetaRef = useRef({ number: driverNumber, isCrewmate });
  driverMetaRef.current = { number: driverNumber, isCrewmate };
  const lastAppliedMetaRef = useRef({
    liveryId,
    number: driverNumber,
    isCrewmate,
  });
  const driveTelemetryPropRef = useRef(driveTelemetryRef);
  driveTelemetryPropRef.current = driveTelemetryRef;
  const onWakePropRef = useRef(onWakeRef);
  onWakePropRef.current = onWakeRef;

  // Start idle at 0% GPU; user can drag 360° smoothly or enable turntable spin anytime
  const [autoRotate, setAutoRotate] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [activePreset, setActivePreset] = useState<string>("threeQuarter");
  const activePresetRef = useRef<string>("threeQuarter");

  const updateActivePreset = (next: string) => {
    if (activePresetRef.current !== next) {
      activePresetRef.current = next;
      setActivePreset(next);
    }
  };

  // Lazily mount off-screen 3D sections (Garage) only when scrolled nearby
  useEffect(() => {
    if (hasEnteredViewport) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasEnteredViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "260px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEnteredViewport]);

  const sceneRefs = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    controls?: OrbitControls;
    car?: BuiltF1Car;
    rimLight?: THREE.DirectionalLight;
    turntableMat?: THREE.MeshBasicMaterial;
    turntableTex?: THREE.CanvasTexture;
    tweenTarget?: {
      startPos: THREE.Vector3;
      startLookAt: THREE.Vector3;
      camPos: THREE.Vector3;
      lookAt: THREE.Vector3;
      elapsed: number;
      duration: number;
      outOnly?: boolean;
    } | null;
    dirtyFrames: number;
    markProjectionDirty: () => void;
    requestWake: () => void;
  }>({
    dirtyFrames: 4,
    markProjectionDirty: () => {},
    requestWake: () => {},
  });

  const startCameraTween = (
    preset: CameraViewPreset,
    duration = 0.72,
    outOnly = false
  ) => {
    const { camera, controls } = sceneRefs.current;
    sceneRefs.current.tweenTarget = {
      startPos: camera
        ? camera.position.clone()
        : new THREE.Vector3(...STUDIO_PRESETS.threeQuarter.position),
      startLookAt: controls
        ? controls.target.clone()
        : new THREE.Vector3(...STUDIO_PRESETS.threeQuarter.target),
      camPos: new THREE.Vector3(...preset.position),
      lookAt: new THREE.Vector3(...preset.target),
      elapsed: 0,
      duration,
      outOnly,
    };
    sceneRefs.current.requestWake();
  };

  const stateRefs = useRef({
    autoRotate,
    drsOpen,
    isActiveRender,
    isDragging: false,
  });

  useEffect(() => {
    stateRefs.current.autoRotate = autoRotate;
    stateRefs.current.drsOpen = drsOpen;
    stateRefs.current.isActiveRender = isActiveRender;
    const isAutoSpinning = autoRotate && !stateRefs.current.isDragging;
    containerRef.current?.classList.toggle("is-auto-spinning", isAutoSpinning);
    if (sceneRefs.current.controls) {
      sceneRefs.current.controls.autoRotate = isAutoSpinning;
    }
    if (!isAutoSpinning) {
      sceneRefs.current.markProjectionDirty();
    }
    sceneRefs.current.dirtyFrames = Math.max(sceneRefs.current.dirtyFrames, 6);
    sceneRefs.current.requestWake();
  }, [autoRotate, drsOpen, isActiveRender]);

  useEffect(() => {
    const { camera, controls } = sceneRefs.current;
    if (!camera || !controls) return;
    if (activePresetRef.current === "onboard" || activePresetRef.current === "cockpit") return;
    controls.minDistance = MIN_DISTANCE;
    const targetDist = zoomToDistance(zoom);
    const offset = camera.position.clone().sub(controls.target);
    const currentDist = offset.length();
    if (Math.abs(currentDist - targetDist) > 0.04) {
      offset.setLength(targetDist);
      camera.position.copy(controls.target).add(offset);
      controls.update();
      sceneRefs.current.dirtyFrames = Math.max(sceneRefs.current.dirtyFrames, 4);
      sceneRefs.current.markProjectionDirty();
      sceneRefs.current.requestWake();
    }
  }, [zoom]);

  const prevPartRef = useRef<string | undefined>(selectedPartId);

  useEffect(() => {
    if (variant !== "garage" || !selectedPartId) return;
    if (prevPartRef.current === selectedPartId) return;
    prevPartRef.current = selectedPartId;

    const view = PART_CAMERA_VIEWS[selectedPartId];
    if (!view) return;
    if (sceneRefs.current.controls) {
      sceneRefs.current.controls.minDistance = MIN_DISTANCE;
    }
    setAutoRotate(false);
    updateActivePreset("");
    startCameraTween(view, 0.78);
  }, [selectedPartId, variant]);

  useEffect(() => {
    if (resetSignal === 0) return;
    if (sceneRefs.current.controls) {
      sceneRefs.current.controls.minDistance = MIN_DISTANCE;
    }
    updateActivePreset("threeQuarter");
    startCameraTween(STUDIO_PRESETS.threeQuarter, 0.72);
  }, [resetSignal]);

  // Re-project newly mounted 3D inspection callouts when returning from Driving Console
  useEffect(() => {
    if (!hideCallouts && variant === "garage") {
      sceneRefs.current.markProjectionDirty();
      sceneRefs.current.dirtyFrames = Math.max(sceneRefs.current.dirtyFrames, 2);
      sceneRefs.current.requestWake();
    }
  }, [hideCallouts, variant]);

  useEffect(() => {
    if (!hasEnteredViewport) return;
    const host = canvasHostRef.current;
    if (!host) return;
    const currentSceneRefs = sceneRefs.current;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: variant === "hero",
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglError(true);
      return;
    }

    let hostWidth = Math.max(host.clientWidth, 320);
    let hostHeight = Math.max(host.clientHeight, 260);
    // Render up to 1.65x DPR for razor-sharp Retina edges & liveries while keeping Auto Spin smooth
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    renderer.setSize(hostWidth, hostHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.transform = "translateZ(0)";

    host.innerHTML = "";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    if (variant !== "hero") {
      scene.background = new THREE.Color("#090b12");
    }
    const envTex = createStudioEnvTexture();
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(34, hostWidth / hostHeight, 0.1, 36);
    const initialPreset = STUDIO_PRESETS.threeQuarter;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isHeroEntry = variant === "hero" && !reduceMotion;

    if (isHeroEntry) {
      camera.position.set(5.4, 1.38, 4.9);
    } else {
      camera.position.set(...initialPreset.position);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    if (isHeroEntry) {
      controls.target.set(0.18, 0.5, -0.35);
    } else {
      controls.target.set(...initialPreset.target);
    }
    controls.enableDamping = true;
    controls.dampingFactor = 0.24;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = MIN_DISTANCE;
    controls.maxDistance = MAX_DISTANCE;
    controls.minPolarAngle = 0.14;
    controls.maxPolarAngle = Math.PI * 0.478;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.rotateSpeed = 1.18;
    controls.autoRotate = stateRefs.current.autoRotate;
    controls.autoRotateSpeed = 0.95;
    controls.update();

    // High-contrast studio lighting tuned for crisp paint reflections and clear aero separation
    const hemi = new THREE.HemisphereLight("#f8fafc", "#283044", 1.62);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight("#ffffff", 2.55);
    keyLight.position.set(3.8, 5.5, 4.2);
    scene.add(keyLight);

    const activeThemeAccent = F1_LIVERIES[liveryId]?.accent ?? "#27F4D2";
    const rearRim = new THREE.DirectionalLight(activeThemeAccent, 1.08);
    rearRim.position.set(-2.5, 2.2, -4.5);
    scene.add(rearRim);

    const turntableGeom = new THREE.CircleGeometry(3.45, 48);
    const initTex = createStudioFloorShadowTexture(activeThemeAccent);
    const turntableMat = new THREE.MeshBasicMaterial({
      map: initTex,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const turntable = new THREE.Mesh(turntableGeom, turntableMat);
    turntable.rotation.x = -Math.PI / 2;
    turntable.position.y = 0.001;
    scene.add(turntable);

    const car = buildF1Car(
      liveryId,
      driverMetaRef.current.number,
      driverMetaRef.current.isCrewmate
    );
    builtLiveryRef.current = liveryId;
    lastAppliedMetaRef.current = {
      liveryId,
      number: driverMetaRef.current.number,
      isCrewmate: driverMetaRef.current.isCrewmate,
    };
    sharpenCarTextures(car.group, renderer);
    scene.add(car.group);
    renderer.compile(scene, camera);

    sceneRefs.current.renderer = renderer;
    sceneRefs.current.scene = scene;
    sceneRefs.current.camera = camera;
    sceneRefs.current.controls = controls;
    sceneRefs.current.car = car;
    sceneRefs.current.rimLight = rearRim;
    sceneRefs.current.turntableMat = turntableMat;
    sceneRefs.current.turntableTex = initTex;

    const tmpProj = new THREE.Vector3();
    const tmpOffset = new THREE.Vector3();
    const hotspotCache = new Map<
      string,
      { x: number; y: number; v: boolean }
    >();
    let lastBadgeDeg = -1;
    let lastBadgeUpdate = 0;
    let projectionDirty = true;
    let internalControlsUpdate = false;

    sceneRefs.current.markProjectionDirty = () => {
      projectionDirty = true;
    };

    const projectHotspots = () => {
      if (!sceneRefs.current.car || !garageParts || garageParts.length === 0) {
        return;
      }
      for (const part of garageParts) {
        const btn = hotspotRefs.current[part.id];
        const localAnchor = CAR_PART_ANCHORS[part.id];
        if (!btn || !localAnchor) continue;

        tmpProj.copy(localAnchor).project(camera);
        const visible = tmpProj.z > -1 && tmpProj.z < 1;
        const xPx =
          Math.round(clamp(tmpProj.x * 0.5 + 0.5, 0.06, 0.94) * hostWidth * 2) /
          2;
        const yPx =
          Math.round(clamp(-tmpProj.y * 0.5 + 0.5, 0.08, 0.92) * hostHeight * 2) /
          2;

        const prev = hotspotCache.get(part.id);
        if (
          !prev ||
          Math.abs(prev.x - xPx) > 0.75 ||
          Math.abs(prev.y - yPx) > 0.75
        ) {
          btn.style.transform = `translate3d(${xPx}px, ${yPx}px, 0) translate(-50%, -50%)`;
        }
        if (!prev || prev.v !== visible) {
          btn.style.opacity = visible ? "1" : "0";
          btn.style.pointerEvents = visible ? "auto" : "none";
        }
        hotspotCache.set(part.id, { x: xPx, y: yPx, v: visible });
      }
    };

    const updateAngleBadge = (now: number, force = false) => {
      if (!badgeAngleRef.current) return;
      if (!force && now - lastBadgeUpdate < 85) return;
      tmpOffset.subVectors(camera.position, controls.target);
      const deg =
        Math.round(
          ((Math.atan2(tmpOffset.x, tmpOffset.z) * 180) / Math.PI + 360) % 360
        ) % 360;
      if (deg !== lastBadgeDeg) {
        lastBadgeDeg = deg;
        lastBadgeUpdate = now;
        badgeAngleRef.current.textContent = `${deg}°`;
      }
    };

    let drsProgress = stateRefs.current.drsOpen ? 1 : 0;
    let wheelSpeed = 0;
    let rafId = 0;
    let lastNow = performance.now();

    const step = (now: number) => {
      rafId = 0;
      const dt = clamp((now - lastNow) / 1000, 0.001, 0.05);
      lastNow = now;

      const { isActiveRender: active, drsOpen: drsTarget, autoRotate: spin } =
        stateRefs.current;

      if (!active) return;

      let keepRunning = false;
      let cameraMoved = false;

      const tween = sceneRefs.current.tweenTarget;
      if (tween) {
        tween.elapsed = Math.min(tween.duration, tween.elapsed + dt);
        const u = tween.duration > 0 ? clamp(tween.elapsed / tween.duration, 0, 1) : 1;
        const eased = tween.outOnly
          ? 1 - Math.pow(1 - u, 3)
          : u < 0.5
            ? 4 * u * u * u
            : 1 - Math.pow(-2 * u + 2, 3) / 2;

        camera.position.lerpVectors(tween.startPos, tween.camPos, eased);
        controls.target.lerpVectors(tween.startLookAt, tween.lookAt, eased);
        cameraMoved = true;

        if (u >= 1) {
          camera.position.copy(tween.camPos);
          controls.target.copy(tween.lookAt);
          sceneRefs.current.tweenTarget = null;
        } else {
          keepRunning = true;
        }
      }

      let needRender = cameraMoved || projectionDirty || sceneRefs.current.dirtyFrames > 0;

      const drive = driveTelemetryPropRef.current?.current;
      const effectiveDrs = drive?.active ? drive.drsOpen : drsTarget;

      const drsFactor = 1 - Math.exp(-10 * dt);
      const targetDrs = effectiveDrs ? 1 : 0;
      if (Math.abs(drsProgress - targetDrs) > 0.004) {
        drsProgress = THREE.MathUtils.lerp(drsProgress, targetDrs, drsFactor);
        keepRunning = true;
        needRender = true;
      } else if (drsProgress !== targetDrs) {
        drsProgress = targetDrs;
        needRender = true;
      }

      const activeCar = sceneRefs.current.car;
      if (activeCar) {
        activeCar.drsFlapPivot.rotation.x = -drsProgress * 0.58;
        for (const frontFlap of activeCar.frontFlapPivots) {
          frontFlap.rotation.x = -drsProgress * 0.14;
        }

        const speedFactor = 1 - Math.exp(-8.5 * dt);
        const rigFactor = 1 - Math.exp(-12 * dt);

        if (drive?.active) {
          const dir = drive.gear < 0 ? -1 : 1;
          const physicalOmega = drive.speedKmh / 3.6 / 0.357;
          const targetWheelOmega = dir * Math.min(physicalOmega, 46);
          wheelSpeed = THREE.MathUtils.lerp(wheelSpeed, targetWheelOmega, speedFactor);
          if (Math.abs(wheelSpeed) > 0.02) {
            for (const w of activeCar.wheels) {
              w.rotation.x += wheelSpeed * dt;
            }
            keepRunning = true;
            needRender = true;
          }

          // Steer front knuckles (+Y = nose left when steer < 0) & steering wheel column
          const steerTarget = -drive.steer * 0.32;
          const colTarget = drive.steer * 0.68;
          for (const knuckle of activeCar.frontSteerPivots) {
            knuckle.rotation.y = THREE.MathUtils.lerp(
              knuckle.rotation.y,
              steerTarget,
              rigFactor
            );
          }
          activeCar.steeringWheelPivot.rotation.z = THREE.MathUtils.lerp(
            activeCar.steeringWheelPivot.rotation.z,
            colTarget,
            rigFactor
          );

          // Chassis pitch under braking/acceleration & cornering roll
          const pitchTarget =
            drive.brake > 0.05 && drive.speedKmh > 2
              ? 0.017 * drive.brake
              : -0.011 * drive.throttle;
          const rollTarget =
            -drive.steer * Math.min(drive.speedKmh / 240, 1) * 0.015;
          activeCar.chassisPivot.rotation.x = THREE.MathUtils.lerp(
            activeCar.chassisPivot.rotation.x,
            pitchTarget,
            rigFactor
          );
          activeCar.chassisPivot.rotation.z = THREE.MathUtils.lerp(
            activeCar.chassisPivot.rotation.z,
            rollTarget,
            rigFactor
          );

          const heatGlow = clamp((drive.brakeTempC - 380) / 560, 0, 0.85);
          const targetBrakeGlow = clamp(
            drive.brake * 1.45 + heatGlow * 0.45,
            0.04,
            1.75
          );
          for (const rMat of activeCar.brakeGlowMaterials) {
            rMat.emissiveIntensity = THREE.MathUtils.lerp(
              rMat.emissiveIntensity,
              targetBrakeGlow,
              speedFactor
            );
          }

          const ersBoost =
            drive.ersMode === "OVERTAKE" &&
            drive.ersBattery > 1 &&
            drive.throttle > 0.2
              ? 0.68
              : drive.ersMode === "HOTLAP" && drive.throttle > 0.4
                ? 0.28
                : 0;
          const targetExhaust = 0.16 + drive.throttle * 1.1 + ersBoost;
          activeCar.exhaustGlowMaterial.emissiveIntensity = THREE.MathUtils.lerp(
            activeCar.exhaustGlowMaterial.emissiveIntensity,
            targetExhaust,
            speedFactor
          );

          activeCar.rainLightMaterial.emissiveIntensity =
            drive.pitLimiter || drive.ersMode === "CHARGE"
              ? 1.9 + Math.sin(now * 0.024) * 1.3
              : effectiveDrs
                ? 2.1
                : 1.4;

          const drivingActiveNow =
            drive.speedKmh > 0.25 ||
            Math.abs(wheelSpeed) > 0.04 ||
            drive.throttle > 0.01 ||
            drive.brake > 0.01 ||
            Math.abs(drive.steer) > 0.01 ||
            drive.pitLimiter ||
            drive.ersMode === "CHARGE" ||
            Math.abs(activeCar.chassisPivot.rotation.x) > 0.001 ||
            Math.abs(activeCar.frontSteerPivots[0]?.rotation.y ?? 0) > 0.002;
          if (drivingActiveNow) {
            keepRunning = true;
            needRender = true;
          }
        } else {
          const targetSpeed = drsTarget ? 9.6 : 0;
          if (Math.abs(wheelSpeed - targetSpeed) > 0.05) {
            wheelSpeed = THREE.MathUtils.lerp(wheelSpeed, targetSpeed, speedFactor);
            needRender = true;
          } else {
            wheelSpeed = targetSpeed;
          }

          if (wheelSpeed > 0.02) {
            for (const w of activeCar.wheels) {
              w.rotation.x += wheelSpeed * dt;
            }
            keepRunning = true;
            needRender = true;
          }

          // Cleanly re-center steering & suspension when outside Driving Console
          for (const knuckle of activeCar.frontSteerPivots) {
            if (Math.abs(knuckle.rotation.y) > 0.001) {
              knuckle.rotation.y = THREE.MathUtils.lerp(knuckle.rotation.y, 0, rigFactor);
              keepRunning = true;
              needRender = true;
            } else {
              knuckle.rotation.y = 0;
            }
          }
          if (Math.abs(activeCar.steeringWheelPivot.rotation.z) > 0.001) {
            activeCar.steeringWheelPivot.rotation.z = THREE.MathUtils.lerp(
              activeCar.steeringWheelPivot.rotation.z,
              0,
              rigFactor
            );
            keepRunning = true;
            needRender = true;
          } else {
            activeCar.steeringWheelPivot.rotation.z = 0;
          }
          if (
            Math.abs(activeCar.chassisPivot.rotation.x) > 0.0005 ||
            Math.abs(activeCar.chassisPivot.rotation.z) > 0.0005
          ) {
            activeCar.chassisPivot.rotation.x = THREE.MathUtils.lerp(
              activeCar.chassisPivot.rotation.x,
              0,
              rigFactor
            );
            activeCar.chassisPivot.rotation.z = THREE.MathUtils.lerp(
              activeCar.chassisPivot.rotation.z,
              0,
              rigFactor
            );
            keepRunning = true;
            needRender = true;
          } else {
            activeCar.chassisPivot.rotation.x = 0;
            activeCar.chassisPivot.rotation.z = 0;
          }

          const targetBrakeGlow = drsTarget ? 0.9 : 0.05;
          for (const rMat of activeCar.brakeGlowMaterials) {
            rMat.emissiveIntensity = THREE.MathUtils.lerp(
              rMat.emissiveIntensity,
              targetBrakeGlow,
              speedFactor
            );
          }
          activeCar.exhaustGlowMaterial.emissiveIntensity = THREE.MathUtils.lerp(
            activeCar.exhaustGlowMaterial.emissiveIntensity,
            0.18,
            speedFactor
          );

          activeCar.rainLightMaterial.emissiveIntensity = drsTarget
            ? 2.2 + Math.sin(now * 0.015) * 1.1
            : 1.6;
        }
      }

      const steadyAutoSpin = spin && !stateRefs.current.isDragging && !tween;
      controls.autoRotate = steadyAutoSpin;
      controls.dampingFactor = clamp(1 - Math.exp(-22 * dt), 0.2, 0.44);
      internalControlsUpdate = true;
      const moved = controls.update(dt);
      internalControlsUpdate = false;
      if (moved) {
        cameraMoved = true;
        needRender = true;
      }
      if (moved || controls.autoRotate || stateRefs.current.isDragging) {
        keepRunning = true;
      }

      if (needRender) {
        renderer.render(scene, camera);
      }

      if (cameraMoved || projectionDirty) {
        if (!steadyAutoSpin) {
          projectHotspots();
        }
        updateAngleBadge(now, !keepRunning);
        projectionDirty = false;
      }

      if (sceneRefs.current.dirtyFrames > 0) {
        sceneRefs.current.dirtyFrames -= 1;
        keepRunning = true;
      }

      if (keepRunning && stateRefs.current.isActiveRender) {
        rafId = requestAnimationFrame(step);
      }
    };

    const wake = () => {
      if (!rafId && stateRefs.current.isActiveRender) {
        lastNow = performance.now();
        rafId = requestAnimationFrame(step);
      }
    };

    sceneRefs.current.requestWake = wake;
    if (onWakePropRef.current) {
      onWakePropRef.current.current = () => {
        sceneRefs.current.dirtyFrames = Math.max(sceneRefs.current.dirtyFrames, 4);
        wake();
      };
    }

    // Choreographed Hero 3D camera sweep synced to FIA Lights-Out
    let heroFallbackTimer = 0;
    const launchHeroSweep = () => {
      if (!isHeroEntry) return;
      startCameraTween(STUDIO_PRESETS.threeQuarter, 1.05, true);
    };

    if (isHeroEntry) {
      if (document.documentElement.classList.contains("f1-entered")) {
        launchHeroSweep();
      } else {
        window.addEventListener("f1:lights-out", launchHeroSweep, { once: true });
        heroFallbackTimer = window.setTimeout(launchHeroSweep, 1300);
      }
    }

    const onControlStart = () => {
      stateRefs.current.isDragging = true;
      containerRef.current?.classList.add("is-dragging");
      containerRef.current?.classList.remove("is-auto-spinning");
      if (camera.position.distanceTo(controls.target) >= MIN_DISTANCE - 0.05) {
        controls.minDistance = MIN_DISTANCE;
      }
      updateActivePreset("");
      sceneRefs.current.tweenTarget = null;
      projectionDirty = true;
      sceneRefs.current.dirtyFrames = 2;
      wake();
    };

    const onControlChange = () => {
      if (internalControlsUpdate) return;
      projectionDirty = true;
      sceneRefs.current.dirtyFrames = Math.max(sceneRefs.current.dirtyFrames, 2);
      wake();
    };

    const onControlEnd = () => {
      stateRefs.current.isDragging = false;
      containerRef.current?.classList.remove("is-dragging");
      if (stateRefs.current.autoRotate) {
        containerRef.current?.classList.add("is-auto-spinning");
      }
      projectionDirty = true;
      sceneRefs.current.dirtyFrames = 3;
      wake();
    };

    controls.addEventListener("start", onControlStart);
    controls.addEventListener("change", onControlChange);
    controls.addEventListener("end", onControlEnd);

    const onWheel = (e: WheelEvent) => {
      if (!e.shiftKey) return;
      e.preventDefault();
      tmpOffset.subVectors(camera.position, controls.target);
      const nextDist = clamp(
        tmpOffset.length() + Math.sign(e.deltaY) * 0.35,
        controls.minDistance,
        MAX_DISTANCE
      );
      tmpOffset.setLength(nextDist);
      camera.position.copy(controls.target).add(tmpOffset);
      controls.update();
      onChangeZoom?.(distanceToZoom(nextDist));
      projectionDirty = true;
      sceneRefs.current.dirtyFrames = 2;
      wake();
    };
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      hostWidth = Math.max(entry.contentRect.width, 280);
      hostHeight = Math.max(entry.contentRect.height, 220);
      camera.aspect = hostWidth / hostHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
      renderer.setSize(hostWidth, hostHeight);
      projectionDirty = true;
      sceneRefs.current.dirtyFrames = Math.max(sceneRefs.current.dirtyFrames, 2);
      wake();
    });
    ro.observe(host);

    wake();

    return () => {
      if (onWakePropRef.current) {
        onWakePropRef.current.current = null;
      }
      if (rafId) cancelAnimationFrame(rafId);
      if (heroFallbackTimer) window.clearTimeout(heroFallbackTimer);
      window.removeEventListener("f1:lights-out", launchHeroSweep);
      ro.disconnect();
      renderer.domElement.removeEventListener("wheel", onWheel);
      controls.removeEventListener("start", onControlStart);
      controls.removeEventListener("change", onControlChange);
      controls.removeEventListener("end", onControlEnd);
      controls.dispose();
      currentSceneRefs.car?.dispose();
      turntableGeom.dispose();
      currentSceneRefs.turntableTex?.dispose();
      turntableMat.dispose();
      envTex.dispose();
      renderer.dispose();
      builtLiveryRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEnteredViewport, variant]);

  useEffect(() => {
    const { renderer, scene, camera, car, rimLight, turntableMat, turntableTex } =
      sceneRefs.current;
    if (!scene || builtLiveryRef.current === liveryId) return;
    builtLiveryRef.current = liveryId;

    if (car) {
      scene.remove(car.group);
      car.dispose();
    }
    const nextNum = driverMetaRef.current.number;
    const nextCrew = driverMetaRef.current.isCrewmate;
    const nextCar = buildF1Car(liveryId, nextNum, nextCrew);
    lastAppliedMetaRef.current = {
      liveryId,
      number: nextNum,
      isCrewmate: nextCrew,
    };
    if (renderer) {
      sharpenCarTextures(nextCar.group, renderer);
    }
    scene.add(nextCar.group);
    sceneRefs.current.car = nextCar;
    const nextAccent = F1_LIVERIES[liveryId]?.accent ?? "#27F4D2";
    if (rimLight) {
      rimLight.color.set(nextAccent);
    }
    if (renderer && camera) {
      renderer.compile(scene, camera);
    }

    if (turntableMat) {
      const nextFloorTex = createStudioFloorShadowTexture(nextAccent);
      turntableTex?.dispose();
      turntableMat.map = nextFloorTex;
      turntableMat.needsUpdate = true;
      sceneRefs.current.turntableTex = nextFloorTex;
    }

    sceneRefs.current.dirtyFrames = 4;
    sceneRefs.current.requestWake();
  }, [liveryId]);

  useEffect(() => {
    const prev = lastAppliedMetaRef.current;
    if (
      prev.liveryId === liveryId &&
      prev.number === driverNumber &&
      prev.isCrewmate === isCrewmate
    ) {
      return;
    }
    if (builtLiveryRef.current !== liveryId) return;
    const car = sceneRefs.current.car;
    if (!car) return;
    car.setDriverNumber(
      driverNumber ?? F1_LIVERIES[liveryId].number,
      isCrewmate
    );
    lastAppliedMetaRef.current = { liveryId, number: driverNumber, isCrewmate };
    sceneRefs.current.dirtyFrames = Math.max(sceneRefs.current.dirtyFrames, 4);
    sceneRefs.current.requestWake();
  }, [driverNumber, isCrewmate, liveryId]);

  const applyCameraPreset = (presetKey: keyof typeof STUDIO_PRESETS) => {
    if (
      presetKey === "onboard" ||
      presetKey === "chase" ||
      presetKey === "cockpit"
    ) {
      setAutoRotate(false);
    }
    if (sceneRefs.current.controls) {
      sceneRefs.current.controls.minDistance =
        presetKey === "cockpit"
          ? COCKPIT_MIN_DISTANCE
          : presetKey === "onboard"
          ? ONBOARD_MIN_DISTANCE
          : MIN_DISTANCE;
    }
    updateActivePreset(presetKey);
    startCameraTween(
      STUDIO_PRESETS[presetKey],
      presetKey === "cockpit" ? 0.62 : presetKey === "onboard" ? 0.65 : 0.72
    );
  };

  useEffect(() => {
    if (!cameraPresetRequest || cameraPresetRequest.seq <= 0) return;
    applyCameraPreset(cameraPresetRequest.preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraPresetRequest?.seq]);

  if (webglError) {
    return (
      <div className={cn("f1-3d-viewer-fallback", className)}>
        <img
          src="/images/garage-car.jpg"
          alt="2026 Formula 1 Race Car"
          className="hero-car-photo"
          draggable={false}
        />
      </div>
    );
  }

  const activeTheme = F1_LIVERIES[liveryId] ?? F1_LIVERIES.mercedes;
  const activeDisplayNumber = driverNumber ?? activeTheme.number;

  return (
    <div
      ref={containerRef}
      className={cn(
        "f1-3d-viewer",
        variant === "hero" ? "is-hero" : "is-garage",
        drsOpen && "is-drs-open",
        className
      )}
      style={
        {
          "--viewer-stage-glow": hexToRgba(activeTheme.accent, 0.16),
          "--viewer-drs-border": hexToRgba(activeTheme.accent, 0.58),
          "--viewer-drs-glow": hexToRgba(activeTheme.accent, 0.24),
        } as CSSProperties
      }
      onDoubleClick={() => applyCameraPreset("threeQuarter")}
    >
      <div className="f1-3d-canvas-wrap">
        <div
          ref={canvasHostRef}
          className="f1-3d-canvas-host"
          aria-label="Interactive 360 degree 3D Formula 1 Car"
        />

        {variant === "garage" &&
          !hideCallouts &&
          garageParts?.map((part) => {
            const isSelected = part.id === selectedPartId;
            return (
              <button
                key={part.id}
                ref={(el) => {
                  hotspotRefs.current[part.id] = el;
                }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPart?.(part.id);
                }}
                className={cn("garage-callout", isSelected && "is-selected")}
              >
                <span className="callout-dot" />
                <span className="callout-text">{part.label}</span>
              </button>
            );
          })}

        <div className="f1-3d-overlay-top">
          <span className="f1-3d-spec-badge">
            360° 3D • {activeTheme.label} • #{activeDisplayNumber}
          </span>
          <button
            type="button"
            className={cn("f1-3d-mini-btn", autoRotate && "is-on")}
            onClick={(e) => {
              e.stopPropagation();
              setAutoRotate((prev) => !prev);
            }}
          >
            {autoRotate ? "⟳ SPIN ON" : "⟳ AUTO SPIN"}
          </button>
        </div>
      </div>

      <div className="f1-3d-toolbar">
        <div className="f1-3d-presets" role="group" aria-label="3D Camera Angles">
          {(variant === "garage"
            ? ([
                ["cockpit", "COCKPIT"],
                ["threeQuarter", "3/4"],
                ["front", "FRONT"],
                ["side", "SIDE"],
                ["rear", "REAR"],
                ["top", "TOP"],
                ["onboard", "T-CAM"],
                ["chase", "CHASE"],
              ] as const)
            : ([
                ["threeQuarter", "3/4"],
                ["front", "FRONT"],
                ["side", "SIDE"],
                ["rear", "REAR"],
                ["top", "TOP"],
              ] as const)
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyCameraPreset(key)}
              className={cn(
                "f1-preset-btn",
                activePreset === key && "is-active"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="f1-3d-liveries" role="group" aria-label="Car Livery">
          {(Object.keys(F1_LIVERIES) as F1LiveryId[]).map((id) => {
            const theme = F1_LIVERIES[id];
            const active = liveryId === id;
            return (
              <button
                key={id}
                type="button"
                title={theme.label}
                aria-label={theme.label}
                onClick={() => {
                  onChangeLivery?.(id);
                }}
                className={cn("livery-swatch", active && "is-active")}
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                }}
              />
            );
          })}
        </div>

        <div className="drag-rotate-badge">
          <span className="rotate-icon" aria-hidden="true">
            ⟲
          </span>
          <span>
            DRAG 360° • <strong ref={badgeAngleRef}>42°</strong>
          </span>
          {onToggleDrs && (
            <button
              type="button"
              className={cn("f1-3d-drs-chip", drsOpen && "is-active")}
              onClick={() => {
                onToggleDrs();
              }}
            >
              {drsOpen ? "DRS OPEN" : "OPEN DRS"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default F1Car3DViewer;
