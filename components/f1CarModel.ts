import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type F1LiveryId =
  | "mercedes"
  | "ferrari"
  | "redbull"
  | "mclaren"
  | "racingbulls"
  | "alpine"
  | "haas"
  | "audi"
  | "williams"
  | "aston"
  | "cadillac";

export type F1LiveryTheme = {
  id: F1LiveryId;
  label: string;
  code: string;
  primary: string;
  secondary: string;
  accent: string;
  haloColor: string;
  caliper: string;
  number: string;
  secondaryNumber: string;
  tireStripe: string;
  titleSponsor: string;
  sidepodSponsor: string;
  wingSponsor: string;
  noseSponsor: string;
};

/**
 * Strictly scoped to the 11 participating 2026 F1 constructors.
 * Every painted surface, stripe, caliper, wheel locknut, T-cam tab,
 * and tire sidewall uses ONLY the selected participating team's color
 * paired with neutral raw carbon weave and brushed titanium.
 */
export const F1_LIVERIES: Record<F1LiveryId, F1LiveryTheme> = {
  mercedes: {
    id: "mercedes",
    label: "W17 MERCEDES",
    code: "W17",
    primary: "#27F4D2",
    secondary: "#0F685B",
    accent: "#27F4D2",
    haloColor: "#27F4D2",
    caliper: "#27F4D2",
    number: "12",
    secondaryNumber: "63",
    tireStripe: "#27F4D2",
    titleSponsor: "PETRONAS",
    sidepodSponsor: "PETRONAS",
    wingSponsor: "PETRONAS",
    noseSponsor: "TEAMVIEWER",
  },
  ferrari: {
    id: "ferrari",
    label: "SCUDERIA FERRARI",
    code: "SF-26",
    primary: "#E10600",
    secondary: "#700400",
    accent: "#E10600",
    haloColor: "#E10600",
    caliper: "#E10600",
    number: "44",
    secondaryNumber: "16",
    tireStripe: "#E10600",
    titleSponsor: "HP • SHELL",
    sidepodSponsor: "HP • FERRARI",
    wingSponsor: "FERRARI",
    noseSponsor: "SHELL",
  },
  redbull: {
    id: "redbull",
    label: "RED BULL RB22",
    code: "RB22",
    primary: "#3671C6",
    secondary: "#173461",
    accent: "#3671C6",
    haloColor: "#3671C6",
    caliper: "#3671C6",
    number: "3",
    secondaryNumber: "6",
    tireStripe: "#3671C6",
    titleSponsor: "ORACLE",
    sidepodSponsor: "ORACLE",
    wingSponsor: "ORACLE",
    noseSponsor: "BYBIT",
  },
  mclaren: {
    id: "mclaren",
    label: "MCLAREN MCL40",
    code: "MCL40",
    primary: "#FF8000",
    secondary: "#7D3E00",
    accent: "#FF8000",
    haloColor: "#FF8000",
    caliper: "#FF8000",
    number: "1",
    secondaryNumber: "81",
    tireStripe: "#FF8000",
    titleSponsor: "OKX • MASTERCARD",
    sidepodSponsor: "OKX • CHROME",
    wingSponsor: "McLAREN",
    noseSponsor: "MASTERCARD",
  },
  racingbulls: {
    id: "racingbulls",
    label: "RACING BULLS VCARB",
    code: "VCARB",
    primary: "#6692FF",
    secondary: "#25438F",
    accent: "#6692FF",
    haloColor: "#6692FF",
    caliper: "#6692FF",
    number: "30",
    secondaryNumber: "41",
    tireStripe: "#6692FF",
    titleSponsor: "VISA CASH APP",
    sidepodSponsor: "CASH APP",
    wingSponsor: "VCARB",
    noseSponsor: "HUGO",
  },
  alpine: {
    id: "alpine",
    label: "BWT ALPINE A526",
    code: "A526",
    primary: "#FF87BC",
    secondary: "#7E3255",
    accent: "#FF87BC",
    haloColor: "#FF87BC",
    caliper: "#FF87BC",
    number: "10",
    secondaryNumber: "43",
    tireStripe: "#FF87BC",
    titleSponsor: "BWT • ENI",
    sidepodSponsor: "BWT • ENI",
    wingSponsor: "ALPINE",
    noseSponsor: "CASTORE",
  },
  haas: {
    id: "haas",
    label: "HAAS VF-26",
    code: "VF-26",
    primary: "#B6BABD",
    secondary: "#54585E",
    accent: "#B6BABD",
    haloColor: "#B6BABD",
    caliper: "#B6BABD",
    number: "87",
    secondaryNumber: "31",
    tireStripe: "#B6BABD",
    titleSponsor: "MONEYGRAM",
    sidepodSponsor: "MONEYGRAM",
    wingSponsor: "HAAS F1",
    noseSponsor: "TRITON",
  },
  audi: {
    id: "audi",
    label: "AUDI AFR26",
    code: "AFR26",
    primary: "#F50537",
    secondary: "#75021B",
    accent: "#F50537",
    haloColor: "#F50537",
    caliper: "#F50537",
    number: "5",
    secondaryNumber: "27",
    tireStripe: "#F50537",
    titleSponsor: "REVOLUT • BP",
    sidepodSponsor: "REVOLUT",
    wingSponsor: "AUDI F1",
    noseSponsor: "CASTROL",
  },
  williams: {
    id: "williams",
    label: "WILLIAMS FW48",
    code: "FW48",
    primary: "#64C4FF",
    secondary: "#1A5C8A",
    accent: "#64C4FF",
    haloColor: "#64C4FF",
    caliper: "#64C4FF",
    number: "55",
    secondaryNumber: "23",
    tireStripe: "#64C4FF",
    titleSponsor: "ATLASSIAN",
    sidepodSponsor: "ATLASSIAN",
    wingSponsor: "WILLIAMS",
    noseSponsor: "KRAKEN",
  },
  aston: {
    id: "aston",
    label: "ASTON MARTIN AMR26",
    code: "AMR26",
    primary: "#229971",
    secondary: "#0F4C38",
    accent: "#229971",
    haloColor: "#229971",
    caliper: "#229971",
    number: "14",
    secondaryNumber: "18",
    tireStripe: "#229971",
    titleSponsor: "ARAMCO",
    sidepodSponsor: "aramco",
    wingSponsor: "ARAMCO",
    noseSponsor: "VALVOLINE",
  },
  cadillac: {
    id: "cadillac",
    label: "CADILLAC F1-26",
    code: "CAD26",
    primary: "#D4AF37",
    secondary: "#685414",
    accent: "#D4AF37",
    haloColor: "#D4AF37",
    caliper: "#D4AF37",
    number: "77",
    secondaryNumber: "11",
    tireStripe: "#D4AF37",
    titleSponsor: "TWG • GM",
    sidepodSponsor: "CADILLAC",
    wingSponsor: "CADILLAC",
    noseSponsor: "TOMMY",
  },
};

export function resolveLiveryFromTeamId(teamId?: string): F1LiveryId {
  if (!teamId) return "mercedes";
  if (teamId === "astonmartin" || teamId === "aston") return "aston";
  if (teamId in F1_LIVERIES) return teamId as F1LiveryId;
  return "mercedes";
}

export const CAR_PART_ANCHORS: Record<string, THREE.Vector3> = {
  "front-wing": new THREE.Vector3(0.45, 0.22, 2.38),
  cockpit: new THREE.Vector3(0, 0.84, 0.12),
  sidepod: new THREE.Vector3(0.56, 0.44, -0.22),
  "rear-wing": new THREE.Vector3(0, 0.96, -2.44),
  floor: new THREE.Vector3(-0.76, 0.11, -0.35),
  tyres: new THREE.Vector3(0.84, 0.38, 1.68),
};

export type CameraViewPreset = {
  position: [number, number, number];
  target: [number, number, number];
};

export const PART_CAMERA_VIEWS: Record<string, CameraViewPreset> = {
  "front-wing": { position: [2.25, 1.08, 4.05], target: [0, 0.24, 1.72] },
  cockpit: { position: [1.52, 1.74, 1.15], target: [0, 0.56, 0.08] },
  sidepod: { position: [3.15, 1.12, 0.38], target: [0.15, 0.39, -0.22] },
  "rear-wing": { position: [-2.35, 1.52, -3.65], target: [0, 0.64, -1.96] },
  floor: { position: [-3.25, 0.7, 0.52], target: [-0.25, 0.2, -0.32] },
  tyres: { position: [2.25, 0.9, 2.48], target: [0.68, 0.35, 1.62] },
};

export const STUDIO_PRESETS: Record<
  "cockpit" | "threeQuarter" | "front" | "side" | "rear" | "top" | "onboard" | "chase",
  CameraViewPreset
> = {
  cockpit: { position: [0.0, 0.62, 0.16], target: [0.0, 0.46, 2.45] },
  threeQuarter: { position: [3.85, 1.68, 4.12], target: [0, 0.36, -0.04] },
  front: { position: [0.02, 1.02, 5.35], target: [0, 0.36, 0.2] },
  side: { position: [5.38, 1.12, 0], target: [0, 0.36, 0] },
  rear: { position: [-0.36, 1.32, -5.22], target: [0, 0.46, -0.38] },
  top: { position: [0.02, 5.65, 0.32], target: [0, 0.2, 0] },
  onboard: { position: [0.0, 0.98, -0.22], target: [0.0, 0.44, 2.65] },
  chase: { position: [0.0, 1.48, -4.65], target: [0.0, 0.44, 0.65] },
};

export type BuiltF1Car = {
  group: THREE.Group;
  chassisPivot: THREE.Group;
  wheels: THREE.Group[];
  frontSteerPivots: THREE.Group[];
  steeringWheelPivot: THREE.Group;
  drsFlapPivot: THREE.Group;
  frontFlapPivots: THREE.Group[];
  brakeGlowMaterials: THREE.MeshStandardMaterial[];
  rainLightMaterial: THREE.MeshStandardMaterial;
  exhaustGlowMaterial: THREE.MeshStandardMaterial;
  setDriverNumber: (num: string, isCrewmate?: boolean) => void;
  dispose: () => void;
};

type LoftStation = {
  z: number;
  wBot: number;
  wTop: number;
  yBot: number;
  yMid: number;
  yTop: number;
  wMid: number;
  xCenter?: number;
};

function createLoftedShell(stations: LoftStation[], radialSteps = 24): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const ringCount = stations.length;
  const cols = radialSteps + 1;

  for (let i = 0; i < ringCount; i++) {
    const st = stations[i];
    const xc = st.xCenter ?? 0;
    const vCoord = i / (ringCount - 1);

    for (let j = 0; j <= radialSteps; j++) {
      const t = j / radialSteps;
      const angle = t * Math.PI * 2;
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);

      let x = xc;
      let y = st.yMid;

      if (cosA >= 0) {
        const upFactor = Math.pow(cosA, 0.84);
        const halfW = THREE.MathUtils.lerp(st.wMid, st.wTop, upFactor * 0.45);
        x = xc + sinA * halfW;
        y = THREE.MathUtils.lerp(st.yMid, st.yTop, upFactor);
      } else {
        const downFactor = Math.pow(-cosA, 0.86);
        const halfW = THREE.MathUtils.lerp(st.wMid, st.wBot, downFactor);
        x = xc + sinA * halfW;
        y = THREE.MathUtils.lerp(st.yMid, st.yBot, downFactor);
      }

      positions.push(x, y, st.z);
      uvs.push(t, vCoord);
    }
  }

  for (let i = 0; i < ringCount - 1; i++) {
    for (let j = 0; j < radialSteps; j++) {
      const a = i * cols + j;
      const b = (i + 1) * cols + j;
      const c = (i + 1) * cols + (j + 1);
      const d = i * cols + (j + 1);
      indices.push(a, d, b);
      indices.push(b, d, c);
    }
  }

  const firstCenterIdx = positions.length / 3;
  const s0 = stations[0];
  positions.push(s0.xCenter ?? 0, s0.yMid, s0.z);
  uvs.push(0.5, 0);
  for (let j = 0; j < radialSteps; j++) {
    indices.push(firstCenterIdx, j + 1, j);
  }

  const lastCenterIdx = positions.length / 3;
  const sLast = stations[ringCount - 1];
  const lastBase = (ringCount - 1) * cols;
  positions.push(sLast.xCenter ?? 0, sLast.yMid, sLast.z);
  uvs.push(0.5, 1);
  for (let j = 0; j < radialSteps; j++) {
    indices.push(lastCenterIdx, lastBase + j, lastBase + j + 1);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

type SweptWingOptions = {
  span: number;
  centerChord: number;
  tipChord: number;
  thickness: number;
  sweepZ: number;
  archY: number;
  camber: number;
  washoutRad?: number;
  spanSteps?: number;
};

/**
 * Generates a swept, tapered, cambered F1 airfoil geometry with spoon/gull-wing arch.
 */
function createSweptWingGeometry(opts: SweptWingOptions): THREE.BufferGeometry {
  const {
    span,
    centerChord,
    tipChord,
    thickness,
    sweepZ,
    archY,
    camber,
    washoutRad = 0,
    spanSteps = 18,
  } = opts;

  const profileSteps = 18;
  const halfSpan = span * 0.5;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const cols = profileSteps + 1;

  for (let i = 0; i <= spanSteps; i++) {
    const uSpan = i / spanSteps;
    const xNorm = uSpan * 2 - 1; // -1 .. +1
    const absX = Math.abs(xNorm);
    const x = xNorm * halfSpan;

    const chord = THREE.MathUtils.lerp(centerChord, tipChord, Math.pow(absX, 1.15));
    const zOffset = -sweepZ * Math.pow(absX, 1.35);
    const yOffset = archY * Math.pow(absX, 1.55);
    const twist = washoutRad * absX;
    const cosT = Math.cos(twist);
    const sinT = Math.sin(twist);

    for (let k = 0; k <= profileSteps; k++) {
      const s = k / profileSteps;
      const theta = s * Math.PI * 2;
      // Airfoil parametric section: z runs +0.5*chord (leading edge) -> -0.5*chord (trailing edge)
      const localZ = 0.5 * chord * Math.cos(theta);
      const tNorm = 0.5 - localZ / Math.max(chord, 0.001); // 0 LE .. 1 TE
      const nacaHalfT =
        thickness *
        (0.2969 * Math.sqrt(Math.max(tNorm, 0.0001)) -
          0.126 * tNorm -
          0.3516 * tNorm * tNorm +
          0.2843 * Math.pow(tNorm, 3) -
          0.1015 * Math.pow(tNorm, 4)) *
        3.2;

      const camberLine = camber * Math.sin(Math.PI * tNorm);
      const localY = camberLine + (Math.sin(theta) >= 0 ? nacaHalfT : -nacaHalfT * 0.45);

      const rotY = localY * cosT - localZ * sinT;
      const rotZ = localY * sinT + localZ * cosT;

      positions.push(x, yOffset + rotY, zOffset + rotZ);
      uvs.push(uSpan, s);
    }
  }

  for (let i = 0; i < spanSteps; i++) {
    for (let k = 0; k < profileSteps; k++) {
      const a = i * cols + k;
      const b = (i + 1) * cols + k;
      const c = (i + 1) * cols + (k + 1);
      const d = i * cols + (k + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Cap left (-X) and right (+X) wingtips
  const leftCenterIdx = positions.length / 3;
  positions.push(-halfSpan, archY, -sweepZ);
  uvs.push(0, 0.5);
  for (let k = 0; k < profileSteps; k++) {
    indices.push(leftCenterIdx, k, k + 1);
  }

  const rightCenterIdx = positions.length / 3;
  const rightBase = spanSteps * cols;
  positions.push(halfSpan, archY, -sweepZ);
  uvs.push(1, 0.5);
  for (let k = 0; k < profileSteps; k++) {
    indices.push(rightCenterIdx, rightBase + k + 1, rightBase + k);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

function createCarbonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(2, 2);
    ctx.fillStyle = "#262b36";
    ctx.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 64; y += 8) {
      for (let x = 0; x < 64; x += 8) {
        const shift = ((x + y) / 8) % 2 === 0;
        ctx.fillStyle = shift ? "#3c4354" : "#222630";
        ctx.fillRect(x, y, 4, 8);
        ctx.fillStyle = shift ? "#2a2f3d" : "#4d5568";
        ctx.fillRect(x + 4, y, 4, 8);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Generates an aerodynamic UV-mapped livery texture directly onto lofted monocoque/sidepod shells.
 * U = circumference around hull (0/1 top, 0.25/0.75 flanks, 0.5 belly); V = front (0) -> rear (1).
 */
function createChassisLiveryTexture(livery: F1LiveryTheme): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(2, 2);

    // Base clearcoat team paint (virtual 512x512 rendered at 1024px resolution)
    ctx.fillStyle = livery.primary;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle metallic depth shading nose-to-tail
    const bodyGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bodyGrad.addColorStop(0, "rgba(255,255,255,0.10)");
    bodyGrad.addColorStop(0.52, "rgba(0,0,0,0)");
    bodyGrad.addColorStop(1, "rgba(0,0,0,0.36)");
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Exposed woven-carbon lower floor keel & engine cover tail transition
    const drawCarbonZone = (x: number, y: number, w: number, h: number) => {
      ctx.fillStyle = "#171a22";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "rgba(95, 108, 132, 0.22)";
      for (let cy = y; cy < y + h; cy += 4) {
        for (let cx = x + ((cy / 4) % 2) * 2; cx < x + w; cx += 4) {
          ctx.fillRect(cx, cy, 2, 2);
        }
      }
    };

    // Underbody belly carbon (U around 0.34..0.66)
    drawCarbonZone(176, 0, 160, 512);

    // Tapered rear engine-cover carbon undercut sweeping up near tail
    ctx.beginPath();
    ctx.moveTo(0, 405);
    ctx.lineTo(190, 290);
    ctx.lineTo(322, 290);
    ctx.lineTo(512, 405);
    ctx.lineTo(512, 512);
    ctx.lineTo(0, 512);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    drawCarbonZone(0, 285, 512, 230);
    ctx.restore();

    // Sweeping secondary contrast spine, Dzus fasteners & shark-gill cooling louvers
    const drawFlankDetail = (sideSign: -1 | 1) => {
      const centerX = sideSign > 0 ? 128 : 384;
      ctx.fillStyle = livery.secondary;
      ctx.beginPath();
      ctx.moveTo(centerX - sideSign * 26, 90);
      ctx.quadraticCurveTo(centerX - sideSign * 14, 240, centerX + sideSign * 34, 415);
      ctx.lineTo(centerX + sideSign * 12, 425);
      ctx.quadraticCurveTo(centerX - sideSign * 34, 245, centerX - sideSign * 42, 95);
      ctx.closePath();
      ctx.fill();

      // Razor accent pinstripe hugging secondary wedge
      ctx.strokeStyle = livery.accent;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(centerX - sideSign * 26, 90);
      ctx.quadraticCurveTo(centerX - sideSign * 14, 240, centerX + sideSign * 34, 415);
      ctx.stroke();

      // Belly undercut pinstripe separating paint & raw carbon
      ctx.strokeStyle = livery.accent;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(sideSign > 0 ? 174 : 338, 12);
      ctx.lineTo(sideSign > 0 ? 174 : 338, 290);
      ctx.lineTo(sideSign > 0 ? 0 : 512, 406);
      ctx.stroke();

      // Cooling louver slots along mid-engine cover flank
      for (let i = 0; i < 6; i++) {
        const ly = 248 + i * 11;
        const lx = sideSign > 0 ? 52 + i * 2 : 460 - i * 2;
        ctx.fillStyle = "#111319";
        ctx.fillRect(Math.min(lx, lx - sideSign * 28), ly, 28, 3.2);
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.fillRect(Math.min(lx, lx - sideSign * 28), ly + 3.2, 28, 0.9);
      }

      // Micro brushed titanium Dzus panel fasteners along monocoque seam
      ctx.fillStyle = "#d5dce8";
      for (let fy = 104; fy <= 364; fy += 26) {
        const fx = sideSign > 0 ? 96 : 416;
        ctx.beginPath();
        ctx.arc(fx, fy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawFlankDetail(1);
    drawFlankDetail(-1);

    // Center dorsal top pinstripe (U=0 / U=1 seam)
    ctx.fillStyle = livery.accent;
    ctx.fillRect(0, 32, 9, 444);
    ctx.fillRect(503, 32, 9, 444);

    // Nose vanity panel, bulkheads & engine cowl micro-seams + heatshield fade
    ctx.strokeStyle = "rgba(0, 0, 0, 0.42)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(48, 86);
    ctx.lineTo(464, 86);
    ctx.moveTo(56, 128);
    ctx.lineTo(456, 128);
    ctx.moveTo(40, 292);
    ctx.lineTo(472, 292);
    ctx.stroke();

    const tailShieldGrad = ctx.createLinearGradient(0, 448, 0, 512);
    tailShieldGrad.addColorStop(0, "rgba(198,206,221,0)");
    tailShieldGrad.addColorStop(1, "rgba(198,206,221,0.14)");
    ctx.fillStyle = tailShieldGrad;
    ctx.fillRect(0, 448, 512, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTireTreadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#1c1e24";
    ctx.fillRect(0, 0, 128, 128);
    // Subtle satin center mold ridge & vulcanized grain
    ctx.fillStyle = "#262932";
    ctx.fillRect(0, 62, 128, 4);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let y = 0; y < 128; y += 8) {
      ctx.fillRect(0, y, 128, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createPirelliSidewallTexture(stripeColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = 256;
    const cy = 256;
    ctx.fillStyle = "#17191f";
    ctx.fillRect(0, 0, 512, 512);

    for (let r = 148; r < 248; r += 5) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle =
        r % 10 === 0 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.42)";
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    const drawArcStripe = (startDeg: number, endDeg: number, color: string) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 200, (startDeg * Math.PI) / 180, (endDeg * Math.PI) / 180);
      ctx.strokeStyle = color;
      ctx.lineWidth = 13;
      ctx.lineCap = "round";
      ctx.stroke();
    };
    drawArcStripe(24, 146, stripeColor);
    drawArcStripe(204, 326, stripeColor);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "900 24px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("P ZERO", 0, -188);
    ctx.fillStyle = stripeColor;
    ctx.font = "900 22px system-ui, -apple-system, sans-serif";
    ctx.fillText("PIRELLI", 0, 205);
    ctx.fillStyle = "rgba(226,232,240,0.45)";
    ctx.font = "700 13px ui-monospace, monospace";
    ctx.fillText("18 INCH", -170, 4);
    ctx.fillText("F1 26", 170, 4);
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBrakeRotorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#484d59";
    ctx.fillRect(0, 0, 128, 128);
    for (let r = 24; r < 60; r += 6) {
      for (let a = 0; a < 24; a++) {
        const ang = (a / 24) * Math.PI * 2 + r * 0.05;
        ctx.fillStyle = "#16181e";
        ctx.beginPath();
        ctx.arc(64 + Math.cos(ang) * r, 64 + Math.sin(ang) * r, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function isLightHex(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 152;
}

function paintNumberBadgeToCanvas(
  canvas: HTMLCanvasElement,
  num: string,
  bgColor: string,
  accentColor: string,
  code?: string,
  sponsorTag?: string
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const logicalW = 256;
  const logicalH = 128;
  const scaleX = canvas.width / logicalW;
  const scaleY = canvas.height / logicalH;
  const inkColor = isLightHex(bgColor) ? "#0a0d12" : "#ffffff";
  ctx.save();
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  ctx.clearRect(0, 0, logicalW, logicalH);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, logicalW, logicalH);

  // Subtle top/bottom carbon & accent telemetry rules
  ctx.fillStyle = "rgba(10, 12, 16, 0.32)";
  ctx.fillRect(0, logicalH - 22, logicalW, 22);
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, logicalH - 25, logicalW, 3);

  ctx.fillStyle = inkColor;
  ctx.font = "italic 900 80px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(num, logicalW * 0.5, 52);

  if (code) {
    ctx.fillStyle = inkColor;
    ctx.globalAlpha = 0.8;
    ctx.font = "800 13px ui-monospace, monospace";
    ctx.fillText(code, logicalW - 36, 18);
    ctx.globalAlpha = 1;
  }

  if (sponsorTag) {
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.92;
    ctx.font = "900 11px ui-monospace, monospace";
    ctx.fillText(sponsorTag, logicalW * 0.5, logicalH - 11);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function createNumberBadgeTexture(
  num: string,
  bgColor: string,
  accentColor: string,
  code?: string,
  sponsorTag?: string
): { texture: THREE.CanvasTexture; canvas: HTMLCanvasElement } {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  paintNumberBadgeToCanvas(canvas, num, bgColor, accentColor, code, sponsorTag);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { texture, canvas };
}

function createSponsorPlaqueTexture(
  mainText: string,
  subText: string | undefined,
  bgColor: string,
  accentColor: string,
  width = 512,
  height = 128
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width * 2;
  canvas.height = height * 2;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(2, 2);
    const lightBg = isLightHex(bgColor);
    const inkColor = lightBg ? "#0a0d12" : "#ffffff";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Racing border & endplate keylines strictly inside team palette + monochrome
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, width, 6);
    ctx.fillRect(0, height - 6, width, 6);

    ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
    ctx.fillRect(0, 6, width, 8);

    ctx.fillStyle = inkColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const mainSize = mainText.length > 10 ? Math.round(height * 0.34) : Math.round(height * 0.44);
    ctx.font = `900 ${mainSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(mainText, width * 0.5, subText ? height * 0.44 : height * 0.52);

    if (subText) {
      ctx.fillStyle = inkColor;
      ctx.globalAlpha = 0.78;
      ctx.font = `800 ${Math.round(height * 0.16)}px ui-monospace, monospace`;
      ctx.fillText(subText, width * 0.5, height * 0.78);
      ctx.globalAlpha = 1;
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSteeringWheelTexture(accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Carbon fiber backdrop
    ctx.fillStyle = "#0a0c12";
    ctx.fillRect(0, 0, 1024, 768);

    // Carbon fiber micro-weave lattice
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 8) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 768);
      ctx.stroke();
    }
    for (let y = 0; y < 768; y += 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Top FIA 15-LED RPM Shift Array (5 Green, 5 Red, 5 Blue/Magenta)
    const ledCount = 15;
    const startX = 148;
    const gap = 52;
    const ledY = 62;
    for (let i = 0; i < ledCount; i++) {
      const cx = startX + i * gap;
      const color = i < 5 ? "#10b981" : i < 10 ? "#ef4444" : "#3b82f6";
      const isLit = i < 12;

      // Bezel ring
      ctx.fillStyle = "#1e2430";
      ctx.beginPath();
      ctx.arc(cx, ledY, 16, 0, Math.PI * 2);
      ctx.fill();

      // LED lamp
      ctx.fillStyle = isLit ? color : "#242a38";
      ctx.shadowColor = isLit ? color : "transparent";
      ctx.shadowBlur = isLit ? 10 : 0;
      ctx.beginPath();
      ctx.arc(cx, ledY, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // FIA Flag Marshalling LEDs on Left and Right flanks
    const flagColors = ["#eab308", "#ef4444", "#3b82f6"];
    for (let i = 0; i < flagColors.length; i++) {
      ctx.fillStyle = "#1a1f2b";
      ctx.beginPath();
      ctx.arc(68, 54 + i * 36, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = i === 0 ? flagColors[i] : "#232834";
      ctx.beginPath();
      ctx.arc(68, 54 + i * 36, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < flagColors.length; i++) {
      ctx.fillStyle = "#1a1f2b";
      ctx.beginPath();
      ctx.arc(956, 54 + i * 36, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = i === 0 ? flagColors[i] : "#232834";
      ctx.beginPath();
      ctx.arc(956, 54 + i * 36, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // High-Contrast PCU-8D OLED Telemetry Display
    const screenX = 140;
    const screenY = 106;
    const screenW = 744;
    const screenH = 434;

    // Display Screen Housing
    ctx.fillStyle = "#04060a";
    ctx.fillRect(screenX, screenY, screenW, screenH);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(screenX, screenY, screenW, screenH);

    // Header bar inside OLED
    ctx.fillStyle = "#0c101a";
    ctx.fillRect(screenX + 4, screenY + 4, screenW - 8, 44);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "800 22px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("LAP 24/57", screenX + 24, screenY + 34);

    ctx.textAlign = "center";
    ctx.fillStyle = "#10b981";
    ctx.font = "900 26px ui-monospace, monospace";
    ctx.fillText("DELTA -0.284", screenX + screenW * 0.5, screenY + 34);

    ctx.textAlign = "right";
    ctx.fillStyle = "#94a3b8";
    ctx.font = "800 22px ui-monospace, monospace";
    ctx.fillText("1:18.420", screenX + screenW - 24, screenY + 34);

    // Large Center Gear Box
    const gearBoxX = screenX + 224;
    const gearBoxY = screenY + 62;
    const gearBoxW = 168;
    const gearBoxH = 214;
    ctx.fillStyle = "#080b12";
    ctx.fillRect(gearBoxX, gearBoxY, gearBoxW, gearBoxH);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 2;
    ctx.strokeRect(gearBoxX, gearBoxY, gearBoxW, gearBoxH);

    ctx.fillStyle = "#64748b";
    ctx.font = "800 18px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("GEAR", gearBoxX + gearBoxW * 0.5, gearBoxY + 30);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 134px ui-monospace, monospace";
    ctx.fillText("7", gearBoxX + gearBoxW * 0.5, gearBoxY + 168);

    // Speed & RPM (Right of Gear)
    ctx.textAlign = "center";
    ctx.fillStyle = "#38bdf8";
    ctx.font = "900 84px ui-monospace, monospace";
    ctx.fillText("324", screenX + 545, screenY + 152);
    ctx.fillStyle = "#64748b";
    ctx.font = "800 20px ui-monospace, monospace";
    ctx.fillText("KM/H", screenX + 545, screenY + 188);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "900 22px ui-monospace, monospace";
    ctx.fillText("11,840 RPM", screenX + 545, screenY + 226);

    // Left Telemetry Readouts (Brake Bias, Diff, Engine Strat, DRS)
    ctx.textAlign = "left";
    ctx.fillStyle = "#94a3b8";
    ctx.font = "800 18px ui-monospace, monospace";
    ctx.fillText("BB:", screenX + 28, screenY + 98);
    ctx.fillStyle = "#facc15";
    ctx.font = "900 22px ui-monospace, monospace";
    ctx.fillText("54.5%", screenX + 80, screenY + 98);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "800 18px ui-monospace, monospace";
    ctx.fillText("DIFF:", screenX + 28, screenY + 142);
    ctx.fillStyle = "#facc15";
    ctx.font = "900 22px ui-monospace, monospace";
    ctx.fillText("ENTRY 6", screenX + 90, screenY + 142);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "800 18px ui-monospace, monospace";
    ctx.fillText("STRAT:", screenX + 28, screenY + 186);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "900 22px ui-monospace, monospace";
    ctx.fillText("MODE 2", screenX + 105, screenY + 186);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "800 18px ui-monospace, monospace";
    ctx.fillText("DRS:", screenX + 28, screenY + 230);
    ctx.fillStyle = "#10b981";
    ctx.font = "900 22px ui-monospace, monospace";
    ctx.fillText("ENABLED", screenX + 85, screenY + 230);

    // ERS Battery Bar across Bottom of Screen
    const ersBarY = screenY + 292;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "800 18px ui-monospace, monospace";
    ctx.fillText("ERS 88%", screenX + 28, ersBarY + 17);

    const barW = 540;
    const barH = 22;
    const barX = screenX + 148;
    ctx.fillStyle = "#161e2e";
    ctx.fillRect(barX, ersBarY, barW, barH);
    ctx.fillStyle = accentColor;
    ctx.fillRect(barX, ersBarY, barW * 0.88, barH);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.strokeRect(barX, ersBarY, barW, barH);

    // 4 Tire Temperatures Box
    const tireY = screenY + 338;
    ctx.fillStyle = "#070a10";
    ctx.fillRect(screenX + 24, tireY, screenW - 48, 74);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.strokeRect(screenX + 24, tireY, screenW - 48, 74);

    ctx.font = "900 18px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#10b981";
    ctx.fillText("FL 102°C", screenX + 115, tireY + 44);
    ctx.fillText("FR 104°C", screenX + 285, tireY + 44);
    ctx.fillText("RL 101°C", screenX + 460, tireY + 44);
    ctx.fillText("RR 103°C", screenX + 630, tireY + 44);

    // Steering Wheel Face Tactile Pushbuttons
    // Left Buttons: DRS (Green), RADIO (Yellow), PIT (Blue)
    const leftBtns = [
      { label: "DRS", color: "#10b981", y: 580 },
      { label: "RADIO", color: "#facc15", y: 646 },
      { label: "PIT", color: "#38bdf8", y: 712 },
    ];
    for (const btn of leftBtns) {
      ctx.fillStyle = "#161c28";
      ctx.beginPath();
      ctx.arc(78, btn.y, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = btn.color;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 15px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(btn.label, 78, btn.y + 5);
    }

    // Right Buttons: OT (Red), N (Green), TALK (White)
    const rightBtns = [
      { label: "OT", color: "#ef4444", y: 580 },
      { label: "N", color: "#22c55e", y: 646 },
      { label: "TALK", color: "#e2e8f0", y: 712 },
    ];
    for (const btn of rightBtns) {
      ctx.fillStyle = "#161c28";
      ctx.beginPath();
      ctx.arc(946, btn.y, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = btn.color;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 15px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(btn.label, 946, btn.y + 5);
    }

    // Bottom Center Multi-Position Rotary Knobs
    const dials = [
      { x: 300, label: "ENG" },
      { x: 440, label: "DIFF" },
      { x: 580, label: "B-MIG" },
      { x: 720, label: "TYRE" },
    ];
    for (const d of dials) {
      ctx.fillStyle = "#151b26";
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(d.x, 650, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Notch indicator
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(d.x, 622);
      ctx.lineTo(d.x, 634);
      ctx.stroke();

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "900 15px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(d.label, d.x, 712);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBakedContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 256, 512);
    const drawSoftBlob = (cx: number, cy: number, rx: number, ry: number, alpha: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, ry / rx);
      const grad = ctx.createRadialGradient(0, 0, rx * 0.14, 0, 0, rx);
      grad.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawSoftBlob(128, 256, 76, 198, 0.9);
    drawSoftBlob(128, 44, 100, 34, 0.72);
    drawSoftBlob(46, 114, 34, 42, 0.94);
    drawSoftBlob(210, 114, 34, 42, 0.94);
    drawSoftBlob(46, 402, 38, 46, 0.94);
    drawSoftBlob(210, 402, 38, 46, 0.94);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createStudioFloorShadowTexture(accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = 256;
    const cy = 256;
    ctx.clearRect(0, 0, 512, 512);

    const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 248);
    grad.addColorStop(0, "rgba(28, 30, 40, 0.92)");
    grad.addColorStop(0.68, "rgba(14, 16, 22, 0.85)");
    grad.addColorStop(0.95, "rgba(6, 7, 10, 0.14)");
    grad.addColorStop(1, "rgba(6, 7, 10, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 224, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#ffffff";
    ctx.globalAlpha = 0.16;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 184, 0, Math.PI * 2);
    ctx.stroke();

    for (let deg = 0; deg < 360; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const major = deg % 30 === 0;
      const r1 = major ? 210 : 216;
      const r2 = 224;
      ctx.strokeStyle = major ? accentColor : "rgba(255,255,255,0.28)";
      ctx.globalAlpha = major ? 0.85 : 0.35;
      ctx.lineWidth = major ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * r1, cy + Math.sin(rad) * r1);
      ctx.lineTo(cx + Math.cos(rad) * r2, cy + Math.sin(rad) * r2);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStrut(
  from: [number, number, number],
  to: [number, number, number],
  radius: number,
  mat: THREE.Material
): THREE.Mesh {
  const curve = new THREE.LineCurve3(
    new THREE.Vector3(...from),
    new THREE.Vector3(...to)
  );
  const geom = new THREE.TubeGeometry(curve, 1, radius, 8, false);
  return new THREE.Mesh(geom, mat);
}

/**
 * Merges static sibling/descendant meshes sharing identical materials into single
 * draw calls while leaving dynamic articulated pivots (DRS, active flaps, wheels) intact.
 */
function batchStaticMeshes(
  targetGroup: THREE.Object3D,
  skipNodes: Set<THREE.Object3D>,
  track: <T extends { dispose: () => void }>(item: T) => T
): void {
  targetGroup.updateMatrixWorld(true);
  const invTargetMatrix = new THREE.Matrix4().copy(targetGroup.matrixWorld).invert();
  const relMatrix = new THREE.Matrix4();
  const buckets = new Map<THREE.Material, THREE.Mesh[]>();

  const collect = (node: THREE.Object3D) => {
    if (skipNodes.has(node)) return;
    if (node instanceof THREE.Mesh && !Array.isArray(node.material)) {
      const mat = node.material;
      // Leave semi-transparent layers (baked ground shadow) unmerged to preserve draw order
      if (!mat.transparent) {
        let list = buckets.get(mat);
        if (!list) {
          list = [];
          buckets.set(mat, list);
        }
        list.push(node);
      }
      return;
    }
    for (let i = 0; i < node.children.length; i++) {
      collect(node.children[i]);
    }
  };

  for (let i = 0; i < targetGroup.children.length; i++) {
    collect(targetGroup.children[i]);
  }

  for (const [mat, meshes] of buckets) {
    if (meshes.length < 2) continue;

    const normalized: THREE.BufferGeometry[] = [];
    let valid = true;

    for (const mesh of meshes) {
      const base = mesh.geometry;
      const clone = base.index ? base.toNonIndexed() : base.clone();
      relMatrix.multiplyMatrices(invTargetMatrix, mesh.matrixWorld);
      clone.applyMatrix4(relMatrix);

      if (!clone.getAttribute("normal")) {
        clone.computeVertexNormals();
      }
      const posAttr = clone.getAttribute("position");
      if (!posAttr) {
        clone.dispose();
        valid = false;
        break;
      }
      if (!clone.getAttribute("uv")) {
        clone.setAttribute(
          "uv",
          new THREE.BufferAttribute(new Float32Array(posAttr.count * 2), 2)
        );
      }

      // Normalize attribute set to strictly {position, normal, uv} for reliable merging
      for (const attrName of Object.keys(clone.attributes)) {
        if (attrName !== "position" && attrName !== "normal" && attrName !== "uv") {
          clone.deleteAttribute(attrName);
        }
      }
      normalized.push(clone);
    }

    const merged = valid ? mergeGeometries(normalized, false) : null;
    for (const g of normalized) g.dispose();

    if (!merged) continue;

    for (const mesh of meshes) {
      mesh.parent?.remove(mesh);
    }
    const batchedMesh = new THREE.Mesh(track(merged), mat);
    batchedMesh.frustumCulled = false;
    targetGroup.add(batchedMesh);
  }
}

export function buildF1Car(
  liveryId: F1LiveryId,
  driverNumber?: string,
  isCrewmate = false
): BuiltF1Car {
  const livery = F1_LIVERIES[liveryId] ?? F1_LIVERIES.mercedes;
  const assembly = new THREE.Group();
  const root = new THREE.Group();
  assembly.add(root);
  const activeNumber = driverNumber?.trim() || livery.number;
  const disposables: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  // Textures
  const carbonTex = track(createCarbonTexture());
  const chassisLiveryTex = track(createChassisLiveryTexture(livery));
  const treadTex = track(createTireTreadTexture());
  const tireSidewallTex = track(createPirelliSidewallTexture(livery.tireStripe));
  const rotorTex = track(createBrakeRotorTexture());
  const { texture: numberTex, canvas: numberCanvas } = createNumberBadgeTexture(
    activeNumber,
    livery.primary,
    livery.accent,
    livery.code,
    livery.titleSponsor
  );
  track(numberTex);
  const noseSponsorTex = track(
    createSponsorPlaqueTexture(
      livery.noseSponsor,
      livery.code,
      "#13161e",
      livery.accent,
      256,
      96
    )
  );
  const wingBannerTex = track(
    createSponsorPlaqueTexture(
      livery.wingSponsor,
      livery.titleSponsor,
      livery.secondary,
      livery.accent,
      512,
      112
    )
  );
  const endplateSponsorTex = track(
    createSponsorPlaqueTexture(
      livery.sidepodSponsor,
      livery.titleSponsor,
      "#13161e",
      livery.accent,
      384,
      160
    )
  );
  const wheelDisplayTex = track(createSteeringWheelTexture(livery.accent));
  const contactShadowTex = track(createBakedContactShadowTexture());

  // Baked Ground Contact Shadow
  const contactShadow = new THREE.Mesh(
    track(new THREE.PlaneGeometry(2.55, 5.75)),
    track(
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
      })
    )
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.004;
  assembly.add(contactShadow);

  // Studio PBR High-Gloss Paint Materials (optimized single-pass BRDF for 120fps rotation)
  const bodyLiveryMat = track(
    new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: chassisLiveryTex,
      metalness: 0.24,
      roughness: 0.16,
      envMapIntensity: 1.72,
    })
  );

  const bodyPaintMat = track(
    new THREE.MeshStandardMaterial({
      color: livery.primary,
      metalness: 0.22,
      roughness: 0.15,
      envMapIntensity: 1.72,
    })
  );

  const secondaryPaintMat = track(
    new THREE.MeshStandardMaterial({
      color: livery.secondary,
      metalness: 0.28,
      roughness: 0.2,
      envMapIntensity: 1.52,
    })
  );

  const accentMat = track(
    new THREE.MeshStandardMaterial({
      color: livery.accent,
      metalness: 0.16,
      roughness: 0.2,
      envMapIntensity: 1.5,
    })
  );

  const carbonMat = track(
    new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: carbonTex,
      metalness: 0.24,
      roughness: 0.32,
      envMapIntensity: 1.35,
    })
  );

  const matteDarkMat = track(
    new THREE.MeshStandardMaterial({
      color: "#111319",
      roughness: 0.84,
      metalness: 0.08,
    })
  );

  const rubberMat = track(
    new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: treadTex,
      roughness: 0.74,
      metalness: 0.06,
      envMapIntensity: 0.9,
    })
  );

  const rimMat = track(
    new THREE.MeshStandardMaterial({
      color: "#8892a6",
      metalness: 0.88,
      roughness: 0.18,
      envMapIntensity: 1.75,
      side: THREE.DoubleSide,
    })
  );

  const barrelDarkMat = track(
    new THREE.MeshStandardMaterial({
      color: "#222733",
      metalness: 0.8,
      roughness: 0.26,
      envMapIntensity: 1.4,
      side: THREE.DoubleSide,
    })
  );

  const titaniumMat = track(
    new THREE.MeshStandardMaterial({
      color: "#c6cedd",
      metalness: 0.92,
      roughness: 0.16,
      envMapIntensity: 1.85,
    })
  );

  const helmetMat = track(
    new THREE.MeshStandardMaterial({
      color: livery.accent,
      metalness: 0.42,
      roughness: 0.12,
      envMapIntensity: 1.9,
    })
  );

  const visorMat = track(
    new THREE.MeshStandardMaterial({
      color: "#15171d",
      metalness: 0.96,
      roughness: 0.05,
      envMapIntensity: 2.25,
    })
  );

  const caliperMat = track(
    new THREE.MeshStandardMaterial({
      color: livery.caliper,
      metalness: 0.52,
      roughness: 0.22,
    })
  );

  const haloMat = track(
    new THREE.MeshStandardMaterial({
      color: livery.haloColor,
      metalness: 0.25,
      roughness: 0.17,
      envMapIntensity: 1.65,
    })
  );

  const rainLightMaterial = track(
    new THREE.MeshStandardMaterial({
      color: livery.accent,
      emissive: new THREE.Color(livery.accent),
      emissiveIntensity: 1.6,
      roughness: 0.2,
    })
  );

  const wheelDisplayMat = track(
    new THREE.MeshStandardMaterial({
      map: wheelDisplayTex,
      emissive: new THREE.Color("#ffffff"),
      emissiveMap: wheelDisplayTex,
      emissiveIntensity: 0.85,
      roughness: 0.25,
    })
  );

  const sidewallMat = track(
    new THREE.MeshStandardMaterial({
      map: tireSidewallTex,
      roughness: 0.68,
      metalness: 0.08,
      side: THREE.DoubleSide,
    })
  );

  const numberDecalMat = track(
    new THREE.MeshStandardMaterial({
      map: numberTex,
      roughness: 0.24,
      metalness: 0.12,
    })
  );

  const noseSponsorMat = track(
    new THREE.MeshStandardMaterial({
      map: noseSponsorTex,
      roughness: 0.24,
      metalness: 0.16,
    })
  );

  const rearWingBannerMat = track(
    new THREE.MeshStandardMaterial({
      map: wingBannerTex,
      roughness: 0.24,
      metalness: 0.18,
    })
  );

  const endplateSponsorMat = track(
    new THREE.MeshStandardMaterial({
      map: endplateSponsorTex,
      roughness: 0.26,
      metalness: 0.16,
    })
  );

  const exhaustGlowMaterial = track(
    new THREE.MeshStandardMaterial({
      color: "#1a1e26",
      emissive: new THREE.Color(livery.accent),
      emissiveIntensity: 0.18,
      metalness: 0.85,
      roughness: 0.22,
      side: THREE.DoubleSide,
    })
  );

  const tCamTipMat = track(
    new THREE.MeshStandardMaterial({
      color: isCrewmate ? livery.accent : "#181c24",
      roughness: 0.22,
      metalness: 0.2,
    })
  );

  const goldSkidMat = track(
    new THREE.MeshStandardMaterial({
      color: "#d97706",
      metalness: 0.9,
      roughness: 0.22,
      envMapIntensity: 1.6,
    })
  );

  const drsButtonMat = track(
    new THREE.MeshStandardMaterial({
      color: "#10b981",
      emissive: new THREE.Color("#059669"),
      emissiveIntensity: 0.6,
      roughness: 0.3,
    })
  );

  const otButtonMat = track(
    new THREE.MeshStandardMaterial({
      color: "#ef4444",
      emissive: new THREE.Color("#dc2626"),
      emissiveIntensity: 0.6,
      roughness: 0.3,
    })
  );

  const radioBtnMat = track(
    new THREE.MeshStandardMaterial({
      color: "#facc15",
      emissive: new THREE.Color("#ca8a04"),
      emissiveIntensity: 0.6,
      roughness: 0.3,
    })
  );

  const pitBtnMat = track(
    new THREE.MeshStandardMaterial({
      color: "#38bdf8",
      emissive: new THREE.Color("#0284c7"),
      emissiveIntensity: 0.6,
      roughness: 0.3,
    })
  );

  const mirrorGlassMat = track(
    new THREE.MeshStandardMaterial({
      color: "#e2e8f0",
      metalness: 0.98,
      roughness: 0.04,
      envMapIntensity: 2.6,
    })
  );

  const brakeGlowMaterials: THREE.MeshStandardMaterial[] = [];

  // =========================================================
  // 1. UV-LIVERIED MONOCOQUE, NEEDLE NOSE & ENGINE COVER
  // =========================================================
  const chassisGeom = track(
    createLoftedShell([
      { z: 2.75, wBot: 0.042, wMid: 0.068, wTop: 0.032, yBot: 0.142, yMid: 0.172, yTop: 0.198 },
      { z: 2.42, wBot: 0.075, wMid: 0.118, wTop: 0.068, yBot: 0.17, yMid: 0.24, yTop: 0.285 },
      { z: 2.02, wBot: 0.125, wMid: 0.185, wTop: 0.115, yBot: 0.195, yMid: 0.32, yTop: 0.415 },
      { z: 1.48, wBot: 0.165, wMid: 0.238, wTop: 0.155, yBot: 0.2, yMid: 0.385, yTop: 0.515 },
      { z: 0.92, wBot: 0.205, wMid: 0.285, wTop: 0.195, yBot: 0.135, yMid: 0.42, yTop: 0.615 },
      { z: 0.48, wBot: 0.215, wMid: 0.292, wTop: 0.195, yBot: 0.118, yMid: 0.42, yTop: 0.615 },
      { z: 0.22, wBot: 0.21, wMid: 0.282, wTop: 0.2, yBot: 0.118, yMid: 0.36, yTop: 0.49 },
      { z: -0.08, wBot: 0.21, wMid: 0.28, wTop: 0.198, yBot: 0.118, yMid: 0.38, yTop: 0.56 },
      { z: -0.34, wBot: 0.2, wMid: 0.292, wTop: 0.178, yBot: 0.128, yMid: 0.56, yTop: 0.945 },
      { z: -0.82, wBot: 0.17, wMid: 0.262, wTop: 0.128, yBot: 0.14, yMid: 0.525, yTop: 0.875 },
      { z: -1.42, wBot: 0.12, wMid: 0.188, wTop: 0.08, yBot: 0.16, yMid: 0.44, yTop: 0.665 },
      { z: -2.08, wBot: 0.07, wMid: 0.11, wTop: 0.05, yBot: 0.195, yMid: 0.34, yTop: 0.445 },
      { z: -2.48, wBot: 0.048, wMid: 0.068, wTop: 0.038, yBot: 0.22, yMid: 0.28, yTop: 0.335 },
    ])
  );
  root.add(new THREE.Mesh(chassisGeom, bodyLiveryMat));

  // Tapered Aero Front Nose-to-Wing Pylons & Pitot Tube
  const pylonShape = new THREE.Shape();
  pylonShape.moveTo(0, 0);
  pylonShape.lineTo(0.24, 0);
  pylonShape.lineTo(0.22, 0.11);
  pylonShape.lineTo(0.02, 0.085);
  pylonShape.closePath();

  const nosePylonGeom = track(
    new THREE.ExtrudeGeometry(pylonShape, {
      depth: 0.014,
      bevelEnabled: true,
      bevelSize: 0.002,
      bevelThickness: 0.002,
    })
  );
  nosePylonGeom.rotateY(Math.PI / 2);
  nosePylonGeom.translate(-0.007, 0, 0);
  for (const side of [-1, 1] as const) {
    const pylon = new THREE.Mesh(nosePylonGeom, carbonMat);
    pylon.position.set(side * 0.055, 0.095, 2.58);
    root.add(pylon);

    // FIA Forward Nose Camera Aero Pod Winglets
    const camPod = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.055, 0.022, 0.095)),
      carbonMat
    );
    camPod.position.set(side * 0.105, 0.245, 2.04);
    camPod.rotation.z = side * -0.08;
    root.add(camPod);

    // Rear Engine-Cover Cannon Exhaust Louvers flanking Dorsal Spine
    const cannonExit = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.036, 0.044, 0.26, 12)),
      matteDarkMat
    );
    cannonExit.rotation.x = Math.PI / 2 + 0.14;
    cannonExit.position.set(side * 0.145, 0.48, -1.48);
    root.add(cannonExit);
  }

  // Front Nose Number Plate, Vanity Sponsor Plaque & Nose Pitot Sensor Mast
  const nosePlate = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.21, 0.24)),
    numberDecalMat
  );
  nosePlate.position.set(0, 0.365, 2.14);
  nosePlate.rotation.x = -Math.PI / 2 + 0.27;
  root.add(nosePlate);

  const noseSponsorBadge = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.115, 0.046)),
    noseSponsorMat
  );
  noseSponsorBadge.position.set(0, 0.273, 2.48);
  noseSponsorBadge.rotation.x = -Math.PI / 2 + 0.26;
  root.add(noseSponsorBadge);

  // Rear Roll-Hoop Telemetry Whip Antenna
  const telemetryMast = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.0025, 0.0045, 0.14, 8)),
    titaniumMat
  );
  telemetryMast.position.set(0, 0.96, -0.78);
  telemetryMast.rotation.x = -0.18;
  root.add(telemetryMast);

  const pitotMast = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.004, 0.007, 0.09, 8)),
    titaniumMat
  );
  pitotMast.position.set(0, 0.61, 1.02);
  pitotMast.rotation.x = 0.2;
  root.add(pitotMast);

  const pitotProbe = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.003, 0.003, 0.08, 8)),
    titaniumMat
  );
  pitotProbe.position.set(0, 0.65, 1.045);
  pitotProbe.rotation.x = Math.PI / 2;
  root.add(pitotProbe);

  // Titanium Airspeed Pitot Needle Tip
  const pitotNeedle = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.001, 0.0024, 0.05, 8)),
    titaniumMat
  );
  pitotNeedle.position.set(0, 0.65, 1.105);
  pitotNeedle.rotation.x = Math.PI / 2;
  root.add(pitotNeedle);

  // Bulkhead Telemetry & Radio Aerial Array
  for (const antSide of [-1, 1] as const) {
    const chassisAntenna = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.002, 0.0035, 0.11, 8)),
      carbonMat
    );
    chassisAntenna.position.set(antSide * 0.038, 0.64, 0.94);
    chassisAntenna.rotation.x = -0.12;
    chassisAntenna.rotation.z = antSide * 0.05;
    root.add(chassisAntenna);
  }

  // S-Duct Aero Outlet Scoop on Nosecone Step
  const sDuctOutlet = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.072, 0.012, 0.032)),
    matteDarkMat
  );
  sDuctOutlet.position.set(0, 0.585, 0.86);
  sDuctOutlet.rotation.x = 0.22;
  root.add(sDuctOutlet);

  // Raised Sculpted Cockpit Side Coaming Walls
  for (const side of [-1, 1] as const) {
    const coamingGeom = track(
      createLoftedShell([
        { xCenter: side * 0.232, z: 0.54, wBot: 0.048, wMid: 0.058, wTop: 0.036, yBot: 0.45, yMid: 0.54, yTop: 0.6 },
        { xCenter: side * 0.248, z: 0.22, wBot: 0.048, wMid: 0.058, wTop: 0.036, yBot: 0.42, yMid: 0.535, yTop: 0.625 },
        { xCenter: side * 0.238, z: -0.14, wBot: 0.048, wMid: 0.058, wTop: 0.036, yBot: 0.46, yMid: 0.585, yTop: 0.685 },
      ], 14)
    );
    root.add(new THREE.Mesh(coamingGeom, secondaryPaintMat));
  }

  // Dorsal Shark Fin & Racing Number Plates
  const sharkShape = new THREE.Shape();
  sharkShape.moveTo(-0.34, 0.92);
  sharkShape.lineTo(-0.9, 0.91);
  sharkShape.quadraticCurveTo(-1.42, 0.82, -1.82, 0.56);
  sharkShape.lineTo(-1.74, 0.44);
  sharkShape.lineTo(-0.42, 0.72);
  sharkShape.closePath();

  const sharkFinGeom = track(
    new THREE.ExtrudeGeometry(sharkShape, {
      depth: 0.016,
      bevelEnabled: true,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    })
  );
  sharkFinGeom.rotateY(-Math.PI / 2);
  sharkFinGeom.translate(0.008, 0, 0);
  root.add(new THREE.Mesh(sharkFinGeom, secondaryPaintMat));

  const finBadgeGeom = track(new THREE.PlaneGeometry(0.42, 0.2));
  for (const side of [-1, 1] as const) {
    const badge = new THREE.Mesh(finBadgeGeom, numberDecalMat);
    badge.position.set(side * 0.015, 0.74, -1.08);
    badge.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    root.add(badge);
  }

  // Shark Fin Secondary Broadcast Camera Housing Pod
  const sharkCam = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.018, 0.024, 0.058)),
    carbonMat
  );
  sharkCam.position.set(0, 0.88, -1.35);
  root.add(sharkCam);

  const sharkCamLens = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.005, 0.005, 0.008, 8)),
    titaniumMat
  );
  sharkCamLens.rotation.x = Math.PI / 2;
  sharkCamLens.position.set(0, 0.88, -1.32);
  root.add(sharkCamLens);

  // Sculpted Oval Roll-Hoop Airbox Intake & Twin Cooling Ears + Broadcast T-Cam
  const intakeCollarShape = new THREE.Shape();
  intakeCollarShape.absellipse(0, 0, 0.115, 0.095, 0, Math.PI * 2, false, 0);
  const intakeHole = new THREE.Path();
  intakeHole.absellipse(0, -0.006, 0.084, 0.068, 0, Math.PI * 2, true, 0);
  intakeCollarShape.holes.push(intakeHole);

  const intakeCollarGeom = track(
    new THREE.ExtrudeGeometry(intakeCollarShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSize: 0.008,
      bevelThickness: 0.01,
    })
  );
  const intakeCollar = new THREE.Mesh(intakeCollarGeom, accentMat);
  intakeCollar.position.set(0, 0.895, -0.4);
  root.add(intakeCollar);

  const intakePlenum = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.08, 0.075, 0.14, 16)),
    matteDarkMat
  );
  intakePlenum.rotation.x = Math.PI / 2;
  intakePlenum.position.set(0, 0.888, -0.35);
  root.add(intakePlenum);

  // Aero Side Cooling Horns alongside Roll Hoop
  for (const side of [-1, 1] as const) {
    const horn = new THREE.Mesh(
      track(createSweptWingGeometry({
        span: 0.08,
        centerChord: 0.16,
        tipChord: 0.09,
        thickness: 0.014,
        sweepZ: 0.03,
        archY: 0.01,
        camber: 0.004,
        spanSteps: 6,
      })),
      carbonMat
    );
    horn.position.set(side * 0.13, 0.86, -0.42);
    horn.rotation.z = side * -0.4;
    root.add(horn);
  }

  const tCamStem = new THREE.Mesh(
    track(createSweptWingGeometry({
      span: 0.14,
      centerChord: 0.07,
      tipChord: 0.055,
      thickness: 0.018,
      sweepZ: 0.02,
      archY: 0,
      camber: 0,
      spanSteps: 4,
    })),
    carbonMat
  );
  tCamStem.rotation.z = Math.PI / 2;
  tCamStem.position.set(0, 1.03, -0.32);
  root.add(tCamStem);

  const tCamBar = new THREE.Mesh(
    track(createSweptWingGeometry({
      span: 0.36,
      centerChord: 0.075,
      tipChord: 0.068,
      thickness: 0.018,
      sweepZ: 0.01,
      archY: 0,
      camber: 0,
      spanSteps: 8,
    })),
    carbonMat
  );
  tCamBar.position.set(0, 1.1, -0.32);
  root.add(tCamBar);

  for (const side of [-1, 1] as const) {
    const tip = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.055, 0.024, 0.082)),
      tCamTipMat
    );
    tip.position.set(side * 0.155, 1.1, -0.325);
    root.add(tip);
  }

  // =========================================================
  // 2. SCULPTED DOWNWASH SIDEPODS, SHARK INLETS & WING MIRRORS
  // =========================================================
  for (const side of [-1, 1] as const) {
    const podGeom = track(
      createLoftedShell([
        { xCenter: side * 0.42, z: 0.35, wBot: 0.11, wMid: 0.19, wTop: 0.165, yBot: 0.25, yMid: 0.45, yTop: 0.565 },
        { xCenter: side * 0.475, z: 0.04, wBot: 0.125, wMid: 0.215, wTop: 0.185, yBot: 0.175, yMid: 0.395, yTop: 0.555 },
        { xCenter: side * 0.445, z: -0.44, wBot: 0.145, wMid: 0.202, wTop: 0.16, yBot: 0.13, yMid: 0.315, yTop: 0.485 },
        { xCenter: side * 0.36, z: -0.98, wBot: 0.13, wMid: 0.17, wTop: 0.12, yBot: 0.11, yMid: 0.25, yTop: 0.39 },
        { xCenter: side * 0.22, z: -1.58, wBot: 0.08, wMid: 0.11, wTop: 0.07, yBot: 0.12, yMid: 0.21, yTop: 0.29 },
      ])
    );
    root.add(new THREE.Mesh(podGeom, bodyLiveryMat));

    // Sculpted Overbite Sidepod Hood & Deep Radiator Mouth
    const overbiteHood = new THREE.Mesh(
      track(createSweptWingGeometry({
        span: 0.32,
        centerChord: 0.15,
        tipChord: 0.11,
        thickness: 0.022,
        sweepZ: 0.04,
        archY: -0.025,
        camber: 0.01,
        spanSteps: 10,
      })),
      secondaryPaintMat
    );
    overbiteHood.position.set(side * 0.43, 0.55, 0.385);
    root.add(overbiteHood);

    const inletMouth = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.25, 0.16, 0.055)),
      matteDarkMat
    );
    inletMouth.position.set(side * 0.425, 0.44, 0.36);
    inletMouth.rotation.y = side * -0.1;
    root.add(inletMouth);

    // Side Impact Structure (SIS) Carbon Fairing Winglet ahead of Inlet
    const sisSpar = new THREE.Mesh(
      track(createSweptWingGeometry({
        span: 0.19,
        centerChord: 0.07,
        tipChord: 0.05,
        thickness: 0.015,
        sweepZ: 0.03,
        archY: 0,
        camber: 0.005,
        spanSteps: 6,
      })),
      carbonMat
    );
    sisSpar.position.set(side * 0.36, 0.51, 0.48);
    root.add(sisSpar);

    // Sculpted Top Cooling Louvers
    for (let g = 0; g < 6; g++) {
      const gill = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.115, 0.011, 0.018)),
        matteDarkMat
      );
      gill.position.set(side * 0.385, 0.515 - g * 0.026, -0.18 - g * 0.115);
      gill.rotation.y = side * 0.32;
      root.add(gill);
    }

    // Twin-Stay Sculpted Teardrop Wing Mirrors
    const mirrorStem = new THREE.Mesh(
      track(createSweptWingGeometry({
        span: 0.16,
        centerChord: 0.036,
        tipChord: 0.028,
        thickness: 0.01,
        sweepZ: 0.02,
        archY: 0.018,
        camber: 0,
        spanSteps: 6,
      })),
      carbonMat
    );
    mirrorStem.position.set(side * 0.37, 0.59, 0.36);
    root.add(mirrorStem);

    const mirrorStay = createStrut(
      [side * 0.44, 0.56, 0.34],
      [side * 0.44, 0.62, 0.34],
      0.008,
      carbonMat
    );
    track(mirrorStay.geometry);
    root.add(mirrorStay);

    const mirrorPodGeom = track(
      createLoftedShell([
        { xCenter: side * 0.44, z: 0.39, wBot: 0.04, wMid: 0.058, wTop: 0.04, yBot: 0.605, yMid: 0.635, yTop: 0.665 },
        { xCenter: side * 0.44, z: 0.33, wBot: 0.048, wMid: 0.068, wTop: 0.048, yBot: 0.6, yMid: 0.635, yTop: 0.67 },
        { xCenter: side * 0.44, z: 0.275, wBot: 0.042, wMid: 0.058, wTop: 0.042, yBot: 0.605, yMid: 0.635, yTop: 0.665 },
      ], 14)
    );
    root.add(new THREE.Mesh(mirrorPodGeom, bodyPaintMat));

    const mirrorGlass = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.088, 0.04)),
      mirrorGlassMat
    );
    mirrorGlass.position.set(side * 0.44, 0.635, 0.273);
    mirrorGlass.rotation.y = Math.PI + side * 0.16;
    mirrorGlass.rotation.x = -0.04;
    root.add(mirrorGlass);
  }

  // =========================================================
  // 3. COCKPIT TUB, DRIVER, BUTTERFLY STEERING WHEEL & HALO
  // =========================================================
  const cockpitWell = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.38, 0.14, 0.74)),
    matteDarkMat
  );
  cockpitWell.position.set(0, 0.34, 0.14);
  root.add(cockpitWell);

  // Cockpit Inner Knee Suede Bolsters
  for (const side of [-1, 1] as const) {
    const kneePad = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.024, 0.08, 0.26)),
      matteDarkMat
    );
    kneePad.position.set(side * 0.17, 0.36, 0.28);
    root.add(kneePad);
  }

  // Driver Racing Suit Shoulders, Harness Straps & HANS Collar
  const torso = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.15, 0.17, 0.22, 16)),
    secondaryPaintMat
  );
  torso.scale.set(1.25, 1, 0.72);
  torso.position.set(0, 0.39, 0.05);
  torso.rotation.x = 0.32;
  root.add(torso);

  for (const side of [-1, 1] as const) {
    const belt = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.042, 0.17, 0.025)),
      accentMat
    );
    belt.position.set(side * 0.075, 0.45, 0.11);
    belt.rotation.x = 0.42;
    belt.rotation.z = side * -0.14;
    root.add(belt);
  }

  // Central 6-Point Harness Titanium Rotary Release Buckle
  const harnessBuckle = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.02, 0.02, 0.012, 16)),
    titaniumMat
  );
  harnessBuckle.rotation.x = Math.PI / 2 - 0.32;
  harnessBuckle.position.set(0, 0.41, 0.135);
  root.add(harnessBuckle);

  const headrest = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.16, 0.038, 12, 22, Math.PI * 1.18)),
    secondaryPaintMat
  );
  headrest.position.set(0, 0.545, 0.025);
  headrest.rotation.x = Math.PI / 2;
  headrest.rotation.z = Math.PI - Math.PI * 0.09;
  root.add(headrest);

  // FIA Confor Safety Foam Inner Collar Framing Headrest
  const safetyCollar = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.13, 0.024, 10, 20, Math.PI * 1.05)),
    matteDarkMat
  );
  safetyCollar.position.set(0, 0.555, 0.038);
  safetyCollar.rotation.x = Math.PI / 2;
  safetyCollar.rotation.z = Math.PI - Math.PI * 0.025;
  root.add(safetyCollar);

  // Driver Helmet with Aero Rear Spoiler & Iridescent Visor
  const helmetGroup = new THREE.Group();
  helmetGroup.position.set(0, 0.56, 0.05);
  const helmetDome = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.126, 22, 18)),
    helmetMat
  );
  helmetDome.scale.set(0.95, 1.0, 1.15);
  helmetGroup.add(helmetDome);

  const helmetSpoiler = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.11, 0.025, 0.085)),
    bodyPaintMat
  );
  helmetSpoiler.position.set(0, 0.068, -0.095);
  helmetSpoiler.rotation.x = -0.3;
  helmetGroup.add(helmetSpoiler);

  const visor = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.126, 0.126, 0.068, 22, 1, true, -0.88, 1.76)),
    visorMat
  );
  visor.position.set(0, 0.008, 0.016);
  helmetGroup.add(visor);
  root.add(helmetGroup);

  // Driver Forearms in Racing Suit extending to Steering Wheel
  for (const side of [-1, 1] as const) {
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.17, 0.42, 0.11),
      new THREE.Vector3(side * 0.145, 0.45, 0.25),
      new THREE.Vector3(side * 0.108, 0.48, 0.38),
    ]);
    const armMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(armCurve, 10, 0.028, 10, false)),
      secondaryPaintMat
    );
    root.add(armMesh);

    // Team Accent Sleeve Racing Stripe
    const armStripeMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(armCurve, 10, 0.03, 6, false)),
      accentMat
    );
    armStripeMesh.scale.set(1.02, 0.22, 1.02);
    armStripeMesh.position.y += 0.01;
    root.add(armStripeMesh);
  }

  // Butterfly Carbon Steering Wheel Rig + Carbon Shifter Paddles + OLED Telemetry
  const steeringMount = new THREE.Group();
  steeringMount.position.set(0, 0.492, 0.418);
  steeringMount.rotation.x = -0.38;
  root.add(steeringMount);

  const steeringWheelPivot = new THREE.Group();
  steeringMount.add(steeringWheelPivot);

  const steeringColumn = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.014, 0.016, 0.16, 12)),
    titaniumMat
  );
  steeringColumn.rotation.x = Math.PI / 2;
  steeringColumn.position.set(0, 0, 0.08);
  steeringWheelPivot.add(steeringColumn);

  const wheelPod = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.214, 0.118, 0.026)),
    carbonMat
  );
  steeringWheelPivot.add(wheelPod);

  // Steering Wheel Top Bezel Guard
  const wheelBezel = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.18, 0.016, 0.028)),
    matteDarkMat
  );
  wheelBezel.position.set(0, 0.056, -0.002);
  steeringWheelPivot.add(wheelBezel);

  for (const side of [-1, 1] as const) {
    const grip = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.018, 0.018, 0.11, 10)),
      matteDarkMat
    );
    grip.position.set(side * 0.105, 0, 0);
    grip.rotation.z = side * 0.06;
    steeringWheelPivot.add(grip);

    // 3D Driver Racing Glove gripping the steering wheel handles (rotates with steeringWheelPivot)
    const gloveHand = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.025, 10, 10)),
      matteDarkMat
    );
    gloveHand.scale.set(1.15, 1.45, 1.0);
    gloveHand.position.set(side * 0.106, 0, 0.008);
    steeringWheelPivot.add(gloveHand);

    // Glove Team Accent Knuckle Stripe
    const gloveStripe = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.022, 0.038, 0.012)),
      accentMat
    );
    gloveStripe.position.set(side * 0.106, 0, -0.014);
    steeringWheelPivot.add(gloveStripe);

    // Glove Thumb wrapped around front handle rim
    const gloveThumb = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.008, 0.009, 0.034, 8)),
      matteDarkMat
    );
    gloveThumb.position.set(side * 0.088, 0.022, -0.012);
    gloveThumb.rotation.z = side * -0.55;
    gloveThumb.rotation.x = 0.3;
    steeringWheelPivot.add(gloveThumb);

    // Upper Carbon Upshift/Downshift Rocker Paddle
    const shiftPaddle = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.048, 0.024, 0.006)),
      carbonMat
    );
    shiftPaddle.position.set(side * 0.072, 0.018, 0.021);
    shiftPaddle.rotation.y = side * -0.18;
    steeringWheelPivot.add(shiftPaddle);

    // Lower Titanium Clutch Bite-Point Paddle
    const clutchPaddle = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.042, 0.018, 0.005)),
      titaniumMat
    );
    clutchPaddle.position.set(side * 0.068, -0.024, 0.021);
    clutchPaddle.rotation.y = side * -0.14;
    steeringWheelPivot.add(clutchPaddle);

    // Thumb Rotary Encoder Dial in Team Accent
    const rotary = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.011, 0.011, 0.01, 12)),
      accentMat
    );
    rotary.rotation.x = Math.PI / 2;
    rotary.position.set(side * 0.074, 0.032, -0.014);
    steeringWheelPivot.add(rotary);
  }

  // 3D Pushbuttons on steering wheel face
  const wheelButtons = [
    { x: -0.072, y: 0.014, mat: drsButtonMat },   // DRS Green
    { x: -0.072, y: -0.018, mat: radioBtnMat },   // Radio Yellow
    { x: -0.072, y: -0.046, mat: pitBtnMat },     // Pit Blue
    { x: 0.072, y: 0.014, mat: otButtonMat },     // Overtake Red
    { x: 0.072, y: -0.018, mat: drsButtonMat },   // Neutral Green
    { x: 0.072, y: -0.046, mat: titaniumMat },    // Mark / Oil White
  ];
  for (const btn of wheelButtons) {
    const btnMesh = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.007, 0.007, 0.007, 10)),
      btn.mat
    );
    btnMesh.rotation.x = Math.PI / 2;
    btnMesh.position.set(btn.x, btn.y, -0.016);
    steeringWheelPivot.add(btnMesh);
  }

  // Bottom Center Rotary Knobs (ENG, DIFF, B-MIG)
  for (const rx of [-0.042, 0, 0.042]) {
    const rot = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.009, 0.009, 0.008, 12)),
      accentMat
    );
    rot.rotation.x = Math.PI / 2;
    rot.position.set(rx, -0.046, -0.015);
    steeringWheelPivot.add(rot);
  }

  const wheelOled = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.15, 0.1)),
    wheelDisplayMat
  );
  wheelOled.position.set(0, 0.002, -0.015);
  wheelOled.rotation.y = Math.PI;
  steeringWheelPivot.add(wheelOled);

  // 3-Point Aerodynamic Halo with Central Fairing Fin
  for (const side of [-1, 1] as const) {
    const haloCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.625, 0.59),
      new THREE.Vector3(side * 0.085, 0.76, 0.45),
      new THREE.Vector3(side * 0.228, 0.772, 0.18),
      new THREE.Vector3(side * 0.24, 0.73, -0.18),
    ]);
    const haloTube = new THREE.Mesh(
      track(new THREE.TubeGeometry(haloCurve, 24, 0.022, 12, false)),
      haloMat
    );
    root.add(haloTube);
  }
  const haloPylonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.575, 0.62),
    new THREE.Vector3(0, 0.74, 0.49),
  ]);
  const haloPylon = new THREE.Mesh(
    track(new THREE.TubeGeometry(haloPylonCurve, 10, 0.021, 10, false)),
    haloMat
  );
  root.add(haloPylon);

  // =========================================================
  // 4. GROUND-EFFECT FLOOR, SWEPT EDGE WINGS, VENTURI & EXHAUST
  // =========================================================
  const floorShape = new THREE.Shape();
  floorShape.moveTo(0, 0.94);
  floorShape.lineTo(0.46, 0.79);
  floorShape.lineTo(0.87, 0.52);
  floorShape.lineTo(0.87, -1.25);
  floorShape.quadraticCurveTo(0.84, -1.62, 0.56, -1.85);
  floorShape.lineTo(0.48, -2.42);
  floorShape.lineTo(-0.48, -2.42);
  floorShape.lineTo(-0.56, -1.85);
  floorShape.quadraticCurveTo(-0.84, -1.62, -0.87, -1.25);
  floorShape.lineTo(-0.87, 0.52);
  floorShape.lineTo(-0.46, 0.79);
  floorShape.closePath();

  const floorGeom = track(
    new THREE.ExtrudeGeometry(floorShape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSize: 0.008,
      bevelThickness: 0.006,
    })
  );
  floorGeom.rotateX(Math.PI / 2);
  const floorMesh = new THREE.Mesh(floorGeom, carbonMat);
  floorMesh.position.y = 0.078;
  root.add(floorMesh);

  // Titanium Legality Skid Plank with Golden Wear Blocks
  const skidPlank = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.34, 0.012, 2.36)),
    matteDarkMat
  );
  skidPlank.position.set(0, 0.046, -0.62);
  root.add(skidPlank);

  for (const puckZ of [0.35, -0.42, -1.18, -1.72]) {
    for (const puckSide of [-1, 1] as const) {
      const wearPuck = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.022, 0.022, 0.008, 12)),
        goldSkidMat
      );
      wearPuck.position.set(puckSide * 0.11, 0.04, puckZ);
      root.add(wearPuck);
    }
  }

  // Floor Edge Aero Wing Strips, Venturi Fences & Chassis Bargeboard Vanes
  for (const side of [-1, 1] as const) {
    const edgeWing = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.048, 0.024, 1.56)),
      carbonMat
    );
    edgeWing.position.set(side * 0.885, 0.092, -0.34);
    edgeWing.rotation.z = side * 0.14;
    root.add(edgeWing);

    const edgeAccent = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.018, 0.016, 1.56)),
      accentMat
    );
    edgeAccent.position.set(side * 0.905, 0.095, -0.34);
    root.add(edgeAccent);

    // Curved rear-tire floor kicker vane
    const rearKick = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.08, 0.055, 0.14)),
      carbonMat
    );
    rearKick.position.set(side * 0.76, 0.1, -1.25);
    rearKick.rotation.y = side * -0.35;
    rearKick.rotation.x = -0.22;
    root.add(rearKick);

    // 3 Swept Venturi Intake Fences
    for (let f = 0; f < 3; f++) {
      const fence = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.014, 0.155, 0.42 - f * 0.06)),
        carbonMat
      );
      fence.position.set(side * (0.38 + f * 0.18), 0.145, 0.58 - f * 0.07);
      fence.rotation.y = side * (0.14 + f * 0.08);
      root.add(fence);
    }

    // Chassis Floor Bargeboard Deflector
    const bargeboard = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.014, 0.19, 0.28)),
      carbonMat
    );
    bargeboard.position.set(side * 0.29, 0.21, 0.72);
    bargeboard.rotation.y = side * 0.22;
    root.add(bargeboard);

    // 4 Ground-Effect Edge Wing Scroll Vortex Vanes
    for (let v = 0; v < 4; v++) {
      const scrollVane = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.032, 0.036, 0.065)),
        carbonMat
      );
      scrollVane.position.set(side * 0.87, 0.105, -0.04 - v * 0.28);
      scrollVane.rotation.y = side * -0.28;
      root.add(scrollVane);
    }
  }

  // Forward T-Tray Titanium Wear-Skid Block & Laser Ride-Height Pod
  const skidBlock = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.26, 0.014, 0.56)),
    titaniumMat
  );
  skidBlock.position.set(0, 0.066, 0.68);
  root.add(skidBlock);

  // Multi-Channel Ground Effect Rear Diffuser
  const diffuserRamp = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.94, 0.026, 0.74)),
    carbonMat
  );
  diffuserRamp.position.set(0, 0.165, -2.18);
  diffuserRamp.rotation.x = 0.24;
  root.add(diffuserRamp);

  for (const sx of [-0.4, -0.26, -0.13, 0, 0.13, 0.26, 0.4]) {
    const strake = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.013, 0.16, 0.64)),
      carbonMat
    );
    strake.position.set(sx, 0.125, -2.22);
    root.add(strake);
  }

  // FIA Impact Structure, Illuminated Rain Light & Triple Titanium Exhausts
  const crashBox = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.15, 0.125, 0.24)),
    carbonMat
  );
  crashBox.position.set(0, 0.24, -2.52);
  root.add(crashBox);

  const rainLightBezel = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.075, 0.095, 0.018)),
    matteDarkMat
  );
  rainLightBezel.position.set(0, 0.24, -2.635);
  root.add(rainLightBezel);

  const rainLight = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.048, 0.072, 0.016)),
    rainLightMaterial
  );
  rainLight.position.set(0, 0.24, -2.642);
  root.add(rainLight);

  const exhaustOuter = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.048, 0.052, 0.36, 18, 1, true)),
    titaniumMat
  );
  exhaustOuter.rotation.x = Math.PI / 2 - 0.07;
  exhaustOuter.position.set(0, 0.39, -2.44);
  root.add(exhaustOuter);

  // Inner Tailpipe Thermal Liner (glows subtly with throttle/ERS deploy)
  const exhaustGlowCore = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.041, 0.043, 0.16, 16, 1, true)),
    exhaustGlowMaterial
  );
  exhaustGlowCore.rotation.x = Math.PI / 2 - 0.07;
  exhaustGlowCore.position.set(0, 0.397, -2.54);
  root.add(exhaustGlowCore);

  const exhaustBore = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.039, 0.039, 0.28, 16)),
    matteDarkMat
  );
  exhaustBore.rotation.x = Math.PI / 2 - 0.07;
  exhaustBore.position.set(0, 0.386, -2.38);
  root.add(exhaustBore);

  for (const side of [-1, 1] as const) {
    const wastegate = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.016, 0.018, 0.26, 10)),
      titaniumMat
    );
    wastegate.rotation.x = Math.PI / 2 - 0.06;
    wastegate.position.set(side * 0.062, 0.37, -2.41);
    root.add(wastegate);
  }

  // =========================================================
  // 5. SWEPT GULL-WING MULTI-ELEMENT ACTIVE FRONT WING
  // =========================================================
  const frontFlapPivots: THREE.Group[] = [];

  const frontMainGeom = track(
    createSweptWingGeometry({
      span: 1.84,
      centerChord: 0.28,
      tipChord: 0.22,
      thickness: 0.036,
      sweepZ: 0.16,
      archY: 0.038,
      camber: 0.016,
      spanSteps: 20,
    })
  );
  const frontMain = new THREE.Mesh(frontMainGeom, carbonMat);
  frontMain.position.set(0, 0.095, 2.55);
  root.add(frontMain);

  const flapSpecs = [
    { z: 2.38, y: 0.128, centerC: 0.18, tipC: 0.15, sweep: 0.14, span: 1.78, mat: bodyPaintMat },
    { z: 2.24, y: 0.168, centerC: 0.16, tipC: 0.135, sweep: 0.12, span: 1.76, mat: bodyPaintMat },
    { z: 2.11, y: 0.208, centerC: 0.14, tipC: 0.115, sweep: 0.1, span: 1.72, mat: accentMat },
  ];

  for (const spec of flapSpecs) {
    const pivot = new THREE.Group();
    pivot.position.set(0, spec.y, spec.z);
    const flap = new THREE.Mesh(
      track(
        createSweptWingGeometry({
          span: spec.span,
          centerChord: spec.centerC,
          tipChord: spec.tipC,
          thickness: 0.022,
          sweepZ: spec.sweep,
          archY: 0.035,
          camber: 0.012,
          washoutRad: 0.05,
          spanSteps: 18,
        })
      ),
      spec.mat
    );
    flap.rotation.x = 0.22;
    pivot.add(flap);
    root.add(pivot);
    frontFlapPivots.push(pivot);
  }

  // Brushed Titanium Front Wing Slot-Gap Separator Brackets
  for (const side of [-1, 1] as const) {
    for (const bx of [0.28, 0.52, 0.72]) {
      const separator = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.008, 0.044, 0.036)),
        titaniumMat
      );
      separator.position.set(side * bx, 0.168, 2.25);
      separator.rotation.x = 0.24;
      root.add(separator);
    }

    const endplateShape = new THREE.Shape();
    endplateShape.moveTo(0, 0);
    endplateShape.lineTo(0.6, 0);
    endplateShape.lineTo(0.49, 0.25);
    endplateShape.quadraticCurveTo(0.24, 0.29, 0.01, 0.09);
    endplateShape.closePath();

    const epGeom = track(
      new THREE.ExtrudeGeometry(endplateShape, {
        depth: 0.022,
        bevelEnabled: true,
        bevelSize: 0.004,
        bevelThickness: 0.004,
      })
    );
    epGeom.rotateY(Math.PI / 2);
    epGeom.translate(-0.011, 0, 0);

    const endplateMount = new THREE.Group();
    endplateMount.position.set(side * 0.915, 0.088, 2.52);
    endplateMount.rotation.y = side * 0.06;

    const endplate = new THREE.Mesh(epGeom, carbonMat);
    endplateMount.add(endplate);

    // Flushed Outer Front Wing Endplate Sponsor Plaque
    const fwSponsor = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.32, 0.092)),
      endplateSponsorMat
    );
    fwSponsor.position.set(side * 0.016, 0.105, -0.31);
    fwSponsor.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    endplateMount.add(fwSponsor);

    root.add(endplateMount);

    // Outwash Floor Footplate + Curved Diveplane
    const footplate = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.065, 0.012, 0.44)),
      carbonMat
    );
    footplate.position.set(side * 0.945, 0.092, 2.24);
    root.add(footplate);

    const diveplane = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.058, 0.014, 0.28)),
      accentMat
    );
    diveplane.position.set(side * 0.935, 0.2, 2.16);
    diveplane.rotation.x = -0.24;
    diveplane.rotation.z = side * 0.14;
    root.add(diveplane);
  }

  // =========================================================
  // 6. SWAN-NECK DRS REAR WING, SPOON MAINPLANE & ACTUATOR POD
  // =========================================================
  const beamWing = new THREE.Mesh(
    track(
      createSweptWingGeometry({
        span: 0.98,
        centerChord: 0.21,
        tipChord: 0.18,
        thickness: 0.028,
        sweepZ: 0.04,
        archY: 0.022,
        camber: 0.014,
        spanSteps: 14,
      })
    ),
    carbonMat
  );
  beamWing.position.set(0, 0.43, -2.42);
  beamWing.rotation.x = 0.24;
  root.add(beamWing);

  for (const side of [-1, 1] as const) {
    const pylonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.088, 0.34, -2.26),
      new THREE.Vector3(side * 0.088, 0.74, -2.29),
      new THREE.Vector3(side * 0.088, 0.96, -2.37),
      new THREE.Vector3(side * 0.088, 0.91, -2.46),
    ]);
    const pylon = new THREE.Mesh(
      track(new THREE.TubeGeometry(pylonCurve, 16, 0.017, 8, false)),
      carbonMat
    );
    root.add(pylon);
  }

  const rearMain = new THREE.Mesh(
    track(
      createSweptWingGeometry({
        span: 1.04,
        centerChord: 0.3,
        tipChord: 0.24,
        thickness: 0.042,
        sweepZ: -0.04,
        archY: 0.042,
        camber: 0.022,
        spanSteps: 16,
      })
    ),
    carbonMat
  );
  rearMain.position.set(0, 0.815, -2.45);
  rearMain.rotation.x = 0.26;
  root.add(rearMain);

  const drsFlapPivot = new THREE.Group();
  drsFlapPivot.position.set(0, 0.995, -2.63);
  const rearUpperFlap = new THREE.Mesh(
    track(
      createSweptWingGeometry({
        span: 1.02,
        centerChord: 0.19,
        tipChord: 0.16,
        thickness: 0.024,
        sweepZ: -0.02,
        archY: 0.036,
        camber: 0.012,
        spanSteps: 16,
      })
    ),
    bodyPaintMat
  );
  rearUpperFlap.position.set(0, -0.048, 0.072);
  rearUpperFlap.rotation.x = 0.64;

  // Dual-Sided Official Sponsor Banner on Active DRS Upper Flap
  const rearBannerBackGeom = track(new THREE.PlaneGeometry(0.88, 0.145));
  rearBannerBackGeom.rotateZ(Math.PI);
  rearBannerBackGeom.rotateX(Math.PI / 2);
  const rearBannerBack = new THREE.Mesh(rearBannerBackGeom, rearWingBannerMat);
  rearBannerBack.position.set(0, -0.008, 0);
  rearUpperFlap.add(rearBannerBack);

  const rearBannerTopGeom = track(new THREE.PlaneGeometry(0.88, 0.145));
  rearBannerTopGeom.rotateX(-Math.PI / 2);
  const rearBannerTop = new THREE.Mesh(rearBannerTopGeom, rearWingBannerMat);
  rearBannerTop.position.set(0, 0.024, 0);
  rearUpperFlap.add(rearBannerTop);

  const drsAccentEdge = new THREE.Mesh(
    track(new THREE.BoxGeometry(1.02, 0.012, 0.02)),
    accentMat
  );
  drsAccentEdge.position.set(0, 0.01, -0.095);
  rearUpperFlap.add(drsAccentEdge);

  drsFlapPivot.add(rearUpperFlap);
  root.add(drsFlapPivot);

  // Central Aero DRS Actuator Bullet Pod + Titanium Pushrod Link
  const drsActuatorPod = new THREE.Mesh(
    track(new THREE.CapsuleGeometry(0.026, 0.17, 6, 12)),
    carbonMat
  );
  drsActuatorPod.rotation.x = Math.PI / 2 - 0.16;
  drsActuatorPod.position.set(0, 0.94, -2.46);
  root.add(drsActuatorPod);

  const drsPushrod = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.005, 0.005, 0.14, 8)),
    titaniumMat
  );
  drsPushrod.rotation.x = Math.PI / 2 - 0.45;
  drsPushrod.position.set(0, 0.96, -2.53);
  root.add(drsPushrod);

  for (const side of [-1, 1] as const) {
    const rwEpShape = new THREE.Shape();
    rwEpShape.moveTo(0, 0);
    rwEpShape.lineTo(0.43, 0.08);
    rwEpShape.lineTo(0.47, 0.65);
    rwEpShape.quadraticCurveTo(0.25, 0.7, 0.04, 0.64);
    rwEpShape.closePath();

    const rwEpGeom = track(
      new THREE.ExtrudeGeometry(rwEpShape, {
        depth: 0.022,
        bevelEnabled: true,
        bevelSize: 0.004,
        bevelThickness: 0.004,
      })
    );
    rwEpGeom.rotateY(Math.PI / 2);
    rwEpGeom.translate(-0.011, 0, 0);
    const rwEp = new THREE.Mesh(rwEpGeom, carbonMat);
    rwEp.position.set(side * 0.535, 0.36, -2.22);
    root.add(rwEp);

    // Flush Outer Rear Wing Endplate Sponsor Plaque
    const rwSponsorPlaque = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.32, 0.24)),
      endplateSponsorMat
    );
    rwSponsorPlaque.position.set(side * 0.551, 0.66, -2.44);
    rwSponsorPlaque.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    root.add(rwSponsorPlaque);

    // 3 Rear Endplate Vortex Cut-Out Louver Strakes
    for (let l = 0; l < 3; l++) {
      const louver = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.026, 0.01, 0.095)),
        titaniumMat
      );
      louver.position.set(side * 0.535, 0.855 + l * 0.022, -2.29);
      louver.rotation.x = -0.35;
      root.add(louver);
    }

    const rwStripe = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.028, 0.042, 0.4)),
      accentMat
    );
    rwStripe.position.set(side * 0.535, 0.9, -2.44);
    root.add(rwStripe);
  }

  // =========================================================
  // 7. 18" FORGED Y-SPOKE WHEELS, BREMBO CALIPERS & AERO WISHBONES
  // =========================================================
  const wheels: THREE.Group[] = [];
  const frontSteerPivots: THREE.Group[] = [];

  const wheelConfigs = [
    { x: 0.81, z: 1.68, width: 0.33, chassisX: 0.2, isFront: true },
    { x: -0.81, z: 1.68, width: 0.33, chassisX: -0.2, isFront: true },
    { x: 0.81, z: -1.68, width: 0.41, chassisX: 0.14, isFront: false },
    { x: -0.81, z: -1.68, width: 0.41, chassisX: -0.14, isFront: false },
  ];

  const buildTireMesh = (width: number): THREE.BufferGeometry => {
    const hw = width * 0.5;
    const pts = [
      new THREE.Vector2(0.226, -hw * 0.92),
      new THREE.Vector2(0.322, -hw),
      new THREE.Vector2(0.352, -hw * 0.8),
      new THREE.Vector2(0.357, 0),
      new THREE.Vector2(0.352, hw * 0.8),
      new THREE.Vector2(0.322, hw),
      new THREE.Vector2(0.226, hw * 0.92),
    ];
    const geom = new THREE.LatheGeometry(pts, 28);
    geom.rotateZ(Math.PI / 2);
    return geom;
  };

  const buildRimBarrelMesh = (width: number): THREE.BufferGeometry => {
    const hw = width * 0.46;
    const pts = [
      new THREE.Vector2(0.226, -hw),
      new THREE.Vector2(0.214, -hw * 0.88),
      new THREE.Vector2(0.188, -hw * 0.45),
      new THREE.Vector2(0.188, hw * 0.52),
      new THREE.Vector2(0.216, hw * 0.86),
      new THREE.Vector2(0.226, hw),
    ];
    const geom = new THREE.LatheGeometry(pts, 24);
    geom.rotateZ(Math.PI / 2);
    return geom;
  };

  const frontTireGeom = track(buildTireMesh(0.33));
  const rearTireGeom = track(buildTireMesh(0.41));
  const frontBarrelGeom = track(buildRimBarrelMesh(0.33));
  const rearBarrelGeom = track(buildRimBarrelMesh(0.41));
  const sidewallRingGeom = track(new THREE.RingGeometry(0.222, 0.336, 28));
  const aeroWheelRingGeom = track(new THREE.RingGeometry(0.174, 0.22, 24));
  const splitSpokeGeom = track(new THREE.BoxGeometry(0.016, 0.162, 0.015));

  const lockMat = track(
    new THREE.MeshStandardMaterial({
      color: livery.primary,
      metalness: 0.72,
      roughness: 0.18,
    })
  );
  const aeroCoverMat = track(
    new THREE.MeshStandardMaterial({
      color: "#15171e",
      metalness: 0.3,
      roughness: 0.36,
      side: THREE.DoubleSide,
    })
  );
  const sharedRotorMat = track(
    new THREE.MeshStandardMaterial({
      map: rotorTex,
      color: "#7a8090",
      emissive: new THREE.Color(livery.accent),
      emissiveIntensity: 0.04,
      metalness: 0.65,
      roughness: 0.42,
    })
  );
  brakeGlowMaterials.push(sharedRotorMat);

  for (const cfg of wheelConfigs) {
    const sideSign = Math.sign(cfg.x);
    const wheelWrap = new THREE.Group();
    wheelWrap.position.set(cfg.x, 0.357, cfg.z);

    const spinGroup = new THREE.Group();

    const tireMesh = new THREE.Mesh(
      cfg.isFront ? frontTireGeom : rearTireGeom,
      rubberMat
    );
    spinGroup.add(tireMesh);

    const outerSidewall = new THREE.Mesh(sidewallRingGeom, sidewallMat);
    outerSidewall.position.x = sideSign * (cfg.width * 0.502);
    outerSidewall.rotation.y = sideSign > 0 ? Math.PI / 2 : -Math.PI / 2;
    spinGroup.add(outerSidewall);

    const innerSidewall = new THREE.Mesh(sidewallRingGeom, sidewallMat);
    innerSidewall.position.x = -sideSign * (cfg.width * 0.502);
    innerSidewall.rotation.y = sideSign > 0 ? -Math.PI / 2 : Math.PI / 2;
    spinGroup.add(innerSidewall);

    // Deep Stepped Forged Barrel + Outer Aero Rim Ring & Flange Lip
    spinGroup.add(
      new THREE.Mesh(
        cfg.isFront ? frontBarrelGeom : rearBarrelGeom,
        barrelDarkMat
      )
    );

    const aeroOuterTrim = new THREE.Mesh(aeroWheelRingGeom, aeroCoverMat);
    aeroOuterTrim.position.x = sideSign * (cfg.width * 0.405);
    aeroOuterTrim.rotation.y = sideSign > 0 ? Math.PI / 2 : -Math.PI / 2;
    spinGroup.add(aeroOuterTrim);

    const rimLipRing = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.225, 0.008, 8, 24)),
      rimMat
    );
    rimLipRing.rotation.y = Math.PI / 2;
    rimLipRing.position.x = sideSign * (cfg.width * 0.45);
    spinGroup.add(rimLipRing);

    const hubCap = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.064, 0.084, cfg.width * 0.72, 16)),
      rimMat
    );
    hubCap.rotation.z = Math.PI / 2;
    spinGroup.add(hubCap);

    // 5-Split CNC Y-Spokes (10 angled paired spokes)
    for (let s = 0; s < 5; s++) {
      const baseAngle = (s / 5) * Math.PI * 2;
      for (const pair of [-0.14, 0.14] as const) {
        const angle = baseAngle + pair;
        const spoke = new THREE.Mesh(splitSpokeGeom, rimMat);
        const rMid = 0.142;
        spoke.position.set(
          sideSign * (cfg.width * 0.355),
          Math.cos(angle) * rMid,
          Math.sin(angle) * rMid
        );
        spoke.rotation.x = baseAngle + pair * 0.45;
        spinGroup.add(spoke);
      }
    }

    const locknut = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.036, 0.042, 0.058, 6)),
      lockMat
    );
    locknut.rotation.z = Math.PI / 2;
    locknut.position.x = sideSign * (cfg.width * 0.43);
    spinGroup.add(locknut);

    const rotor = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.168, 0.168, 0.028, 18)),
      sharedRotorMat
    );
    rotor.rotation.z = Math.PI / 2;
    rotor.position.x = sideSign * 0.032;
    spinGroup.add(rotor);

    wheelWrap.add(spinGroup);
    wheels.push(spinGroup);

    // Multi-Piston Caliper + Recessed Carbon Brake Duct Scoop
    const caliper = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.062, 0.125, 0.078)),
      caliperMat
    );
    caliper.position.set(
      sideSign * 0.038,
      -0.02,
      cfg.isFront ? -0.145 : 0.145
    );
    wheelWrap.add(caliper);

    const brakeScoop = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.16, 0.18, 0.05, 16)),
      carbonMat
    );
    brakeScoop.rotation.z = Math.PI / 2;
    brakeScoop.position.set(-sideSign * (cfg.width * 0.47), 0, 0);
    wheelWrap.add(brakeScoop);

    // Internal Aero Turning Vanes inside Front Brake Duct
    if (cfg.isFront) {
      for (const vOffset of [-0.032, 0.032]) {
        const vane = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.005, 0.11, 0.038)),
          carbonMat
        );
        vane.position.set(-sideSign * (cfg.width * 0.47), vOffset, 0);
        vane.rotation.y = sideSign * 0.18;
        wheelWrap.add(vane);
      }
    }

    // Vertical Aero Wheel Deflector Winglet (front wheel wake)
    if (cfg.isFront) {
      const deflector = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.014, 0.24, 0.14)),
        carbonMat
      );
      deflector.position.set(-sideSign * (cfg.width * 0.52), 0.1, 0.06);
      deflector.rotation.z = sideSign * -0.12;
      wheelWrap.add(deflector);
    }

    if (cfg.isFront) {
      frontSteerPivots.push(wheelWrap);
    }

    assembly.add(wheelWrap);

    const hubInnerX = cfg.x - sideSign * (cfg.width * 0.46);
    const cX = cfg.chassisX;

    const addAeroStrut = (
      from: [number, number, number],
      to: [number, number, number],
      radius: number
    ) => {
      const mesh = createStrut(from, to, radius, carbonMat);
      track(mesh.geometry);
      root.add(mesh);
    };

    addAeroStrut([cX, 0.43, cfg.z + 0.18], [hubInnerX, 0.45, cfg.z], 0.014);
    addAeroStrut([cX, 0.43, cfg.z - 0.19], [hubInnerX, 0.45, cfg.z], 0.014);
    addAeroStrut([cX, 0.25, cfg.z + 0.21], [hubInnerX, 0.24, cfg.z], 0.015);
    addAeroStrut([cX, 0.25, cfg.z - 0.21], [hubInnerX, 0.24, cfg.z], 0.015);
    addAeroStrut(
      [cX, cfg.isFront ? 0.27 : 0.46, cfg.z + (cfg.isFront ? -0.06 : 0.08)],
      [hubInnerX, cfg.isFront ? 0.45 : 0.25, cfg.z],
      0.012
    );
    addAeroStrut(
      [cX, 0.34, cfg.z + (cfg.isFront ? -0.08 : 0.08)],
      [hubInnerX, 0.34, cfg.z],
      0.01
    );
  }

  // Batch rigid chassis/aero meshes and per-wheel rim sub-meshes for ~80% fewer WebGL draw calls
  const dynamicSkipSet = new Set<THREE.Object3D>([
    drsFlapPivot,
    ...frontFlapPivots,
    steeringMount,
  ]);
  batchStaticMeshes(root, dynamicSkipSet, track);
  const emptySkipSet = new Set<THREE.Object3D>();
  batchStaticMeshes(steeringWheelPivot, emptySkipSet, track);
  for (const spinGroup of wheels) {
    batchStaticMeshes(spinGroup, emptySkipSet, track);
  }

  const setDriverNumber = (num: string, nextIsCrewmate = false) => {
    const cleanNum = num?.trim() || livery.number;
    paintNumberBadgeToCanvas(
      numberCanvas,
      cleanNum,
      livery.primary,
      livery.accent,
      livery.code,
      livery.titleSponsor
    );
    numberTex.needsUpdate = true;
    tCamTipMat.color.set(nextIsCrewmate ? livery.accent : "#181c24");
    tCamTipMat.needsUpdate = true;
  };

  return {
    group: assembly,
    chassisPivot: root,
    wheels,
    frontSteerPivots,
    steeringWheelPivot,
    drsFlapPivot,
    frontFlapPivots,
    brakeGlowMaterials,
    rainLightMaterial,
    exhaustGlowMaterial,
    setDriverNumber,
    dispose: () => {
      for (const item of disposables) {
        item.dispose();
      }
    },
  };
}
