"use client";

import { useState } from "react";
import { cn } from "../lib/utils";
import { Reveal } from "./MotionPrimitives";
import SectionTitle from "./SectionTitle";

const kpiMetrics = [
  { label: "GRAPHICS PIPELINE", value: "60 FPS", detail: "Procedural Three.js WebGL Engine" },
  { label: "GRID CONSTRUCTORS", value: "11 TEAMS", detail: "Official 2026 Liveries & Specs" },
  { label: "OFFICIAL DRIVERS", value: "22 PILOTS", detail: "Real-time Championship Standings" },
  { label: "GLOBAL GRANDS PRIX", value: "24 RACES", detail: "FIA Timetables & Local Sync" },
  { label: "TELEMETRY LATENCY", value: "<100 MS", detail: "Hybrid Jolpica & Open-Meteo" },
  { label: "SUSTAINABLE POWER", value: "100%", detail: "Advanced Drop-In Net Zero Fuels" },
];

const technicalPillars = [
  {
    id: "aero",
    badge: "ACTIVE AERODYNAMICS",
    title: "X-Mode & Z-Mode Dynamic Aero",
    desc: "Simulates the revolutionary 2026 active aerodynamics regulations. Drivers dynamically alternate between high-downforce Z-Mode through technical corners and low-drag X-Mode along high-speed straights to maximize top-end straightaway velocity.",
    metric: "35% DRAG REDUCTION",
    tag: "AERODYNAMICS",
  },
  {
    id: "powerunit",
    badge: "HYBRID ARCHITECTURE",
    title: "350 kW MGU-K Power Unit",
    desc: "A balanced 50/50 power split between the 1.6L turbocharged internal combustion engine (approx. 400 kW) and the upgraded 350 kW electric motor, nearly tripling electrical output for intense overtaking maneuvers.",
    metric: "350 KW ELECTRIC BOOST",
    tag: "POWER UNIT",
  },
  {
    id: "fuel",
    badge: "NET ZERO CARBON",
    title: "100% Advanced Sustainable Fuels",
    desc: "Formula 1's pioneering commitment to carbon neutrality. Powered entirely by drop-in non-fossil synthetic fuels and second-generation biofuels without compromising thermal efficiency or high-RPM acoustics.",
    metric: "100% DROP-IN BIOFUEL",
    tag: "SUSTAINABILITY",
  },
  {
    id: "telemetry",
    badge: "AUTOMATED SYNC",
    title: "Real-Time FIA Telemetry Engine",
    desc: "Zero-latency background polling connecting to official Ergast and Jolpica endpoints. Classifications, podium results, DHL fastest lap records, and weekend schedules update automatically with resilient offline snapshots.",
    metric: "<100MS API ROUNDTRIP",
    tag: "DATA PIPELINE",
  },
];

const techStack = [
  { name: "Next.js 15", category: "Framework", icon: "▲", desc: "React Server Components & Turbopack architecture" },
  { name: "React 19", category: "Core Library", icon: "⚛", desc: "Modern concurrent rendering and reactive live context" },
  { name: "Three.js & WebGL", category: "3D Rendering", icon: "🧊", desc: "Procedural 67-mesh car chassis without heavy 50MB downloads" },
  { name: "Web Audio API", category: "Audio Engine", icon: "🔊", desc: "Procedural multi-oscillator V6 turbo engine synthesis" },
  { name: "Tailwind CSS", category: "Design System", icon: "🎨", desc: "High-contrast carbon fiber broadcast aesthetics" },
  { name: "Jolpica Ergast API", category: "Data Provider", icon: "📡", desc: "Official FIA race schedules, standings, and classifications" },
  { name: "Open-Meteo API", category: "Meteorology", icon: "🌦️", desc: "Real-time track temperature, ambient weather, and rain radar" },
  { name: "TypeScript 5", category: "Type Safety", icon: "🛡️", desc: "Strict end-to-end type safety across telemetry schemas" },
];

export default function AboutSection() {
  const [activePillar, setActivePillar] = useState<string>(technicalPillars[0].id);

  const selectedPillar =
    technicalPillars.find((p) => p.id === activePillar) ?? technicalPillars[0];

  return (
    <section id="about" className="fanverse-section section-about about-section">
      <div className="section-inner">
        <SectionTitle
          number="09"
          eyebrow="THE MISSION & ARCHITECTURE"
          title="ABOUT F1 FANVERSE"
          subtitle="A premier digital paddock combining real-time FIA telemetrics, procedural 3D WebGL car physics, and next-generation 2026 technical regulations."
        />

        {/* Top Animated KPI Showcase */}
        <div className="about-kpi-grid">
          {kpiMetrics.map((kpi, idx) => (
            <Reveal key={kpi.label} direction="up" delay={idx * 40} className="about-kpi-card">
              <span className="kpi-label">{kpi.label}</span>
              <strong className="kpi-value">{kpi.value}</strong>
              <small className="kpi-detail">{kpi.detail}</small>
            </Reveal>
          ))}
        </div>

        {/* 2026 Technical Regulations Spotlight */}
        <div className="about-regulations-block">
          <div className="about-regulations-header">
            <div>
              <span className="about-kicker">NEXT-GEN FIA BLUEPRINT</span>
              <h3>2026 FORMULA 1 TECHNICAL REVOLUTION</h3>
            </div>
            {/* Pillar Selector Pills */}
            <div className="pillar-selector-pills">
              {technicalPillars.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePillar(p.id)}
                  className={cn("pillar-pill", activePillar === p.id && "is-active")}
                >
                  {p.tag}
                </button>
              ))}
            </div>
          </div>

          <div className="pillar-detail-card panel-swap-in">
            <div className="pillar-meta">
              <span className="pillar-badge">{selectedPillar.badge}</span>
              <h4>{selectedPillar.title}</h4>
              <p>{selectedPillar.desc}</p>
            </div>
            <div className="pillar-metric-box">
              <span>TARGET REGULATION</span>
              <strong>{selectedPillar.metric}</strong>
              <small>FIA 2026 HOMOLOGATION STANDARD</small>
            </div>
          </div>
        </div>

        {/* Technology Architecture Grid */}
        <div className="about-tech-section">
          <div className="about-tech-header">
            <span className="about-kicker">ENGINEERING SPECIFICATIONS</span>
            <h3>DIGITAL PADDOCK TECHNOLOGY STACK</h3>
            <p>Every line of code is optimized for instantaneous load times, responsive 60 FPS interactions, and live data telemetry accuracy.</p>
          </div>

          <div className="tech-stack-grid">
            {techStack.map((tech, idx) => (
              <Reveal key={tech.name} direction="up" delay={idx * 30} className="tech-stack-card">
                <div className="tech-card-top">
                  <span className="tech-icon">{tech.icon}</span>
                  <span className="tech-category">{tech.category}</span>
                </div>
                <h5>{tech.name}</h5>
                <p>{tech.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Creed & Open Source Statement */}
        <div className="about-creed-card">
          <div className="creed-content">
            <span className="creed-badge">🏎️ RACING COMMUNITY HERITAGE</span>
            <h4>BUILT BY MOTORSPORT PURISTS FOR F1 FANS</h4>
            <p>
              F1 Fanverse Foundation was crafted to give Formula 1 supporters an uncompromised, ad-free, high-speed telemetry terminal. From the driver reaction trainer to real-time session timetables and 3D aerodynamic chassis inspections, this portal celebrates the pinnacle of human and mechanical speed.
            </p>
          </div>
          <div className="creed-meta">
            <div className="meta-capsule">
              <span>VERSION</span>
              <strong>2026.1.0</strong>
            </div>
            <div className="meta-capsule">
              <span>LICENSE</span>
              <strong>FAN & EDUCATIONAL</strong>
            </div>
            <div className="meta-capsule">
              <span>STATUS</span>
              <strong className="status-live">ONLINE & SYNCED</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
