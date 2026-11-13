"use client";

import { useState, type CSSProperties } from "react";
import type { ConstructorTeam, DriverStanding } from "../lib/constants";
import { useFavorites } from "../lib/favorites";
import { useLiveData } from "../lib/live-data";
import { cn, hexToRgba } from "../lib/utils";
import { Reveal, TiltCard } from "./MotionPrimitives";
import SectionTitle from "./SectionTitle";

export type OpenConsoleDetail = {
  teamId: string;
  driverId?: string;
  mode: "inspect" | "drive";
};

export default function TeamsSection() {
  const { constructors, drivers } = useLiveData();
  const [showAllTeams, setShowAllTeams] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    constructors[0]?.id ?? "mercedes"
  );
  const { favorites, setFavoriteTeam, setFavoriteDriver } = useFavorites();

  const teams = showAllTeams ? constructors : constructors.slice(0, 6);

  const activeTeam: ConstructorTeam =
    constructors.find((t) => t.id === selectedTeamId) ?? constructors[0];

  const teamCrewmates: DriverStanding[] = drivers.filter(
    (d) => d.teamId === activeTeam.id
  );
  const activeCrewmate =
    teamCrewmates.find((d) => d.id === favorites.driverId) ??
    teamCrewmates[0];

  const handleSelectTeam = (team: ConstructorTeam) => {
    setSelectedTeamId(team.id);
    const firstDriver = drivers.find((d) => d.teamId === team.id);
    if (
      firstDriver &&
      !drivers.some((d) => d.teamId === team.id && d.id === favorites.driverId)
    ) {
      setFavoriteDriver(firstDriver.id);
    }
  };

  const launchGarageConsole = (
    teamId: string,
    driverId: string | undefined,
    mode: "inspect" | "drive"
  ) => {
    setFavoriteTeam(teamId);
    if (driverId) setFavoriteDriver(driverId);
    window.dispatchEvent(
      new CustomEvent<OpenConsoleDetail>("f1:open-console", {
        detail: { teamId, driverId, mode },
      })
    );
    document.getElementById("garage")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section id="teams" className="fanverse-section section-teams">
      <div className="section-inner">
        <div className="section-top-row">
          <SectionTitle
            number="04"
            eyebrow="DIFFERENT COLORS. SAME DREAM."
            title="THE TEAMS"
            subtitle="Explore all 11 constructors competing in the 2026 Formula 1 era. Click any team to inspect crewmates, bespoke cars, official sponsors, and jump into the 3D driving console."
          />

          <Reveal direction="left" delay={100}>
            <button
              type="button"
              className="control-chip"
              onClick={() => {
                setShowAllTeams((prev) => !prev);
              }}
            >
              {showAllTeams ? "SHOW TOP 6 TEAMS" : "VIEW ALL 11 CONSTRUCTORS →"}
            </button>
          </Reveal>
        </div>

        <div className="teams-grid">
          {teams.map((team, idx) => {
            const isSelected = team.id === activeTeam.id;
            const isFav = favorites.teamId === team.id;

            return (
              <Reveal key={team.id} direction="up" delay={(idx % 6) * 55}>
                <TiltCard
                  className={cn("team-card", isSelected && "is-selected")}
                  onClick={() => {
                    handleSelectTeam(team);
                  }}
                  style={
                    {
                      "--team-color": team.color,
                      "--team-glow": team.accentGlow,
                    } as CSSProperties
                  }
                >
                  <div className="team-card-top">
                    <span className="team-pos-badge">
                      P{team.position} • {team.points} PTS
                    </span>
                    <button
                      type="button"
                      className={cn("mini-fav-btn", isFav && "is-fav")}
                      aria-label={`Favorite ${team.shortName}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavoriteTeam(team.id);
                      }}
                    >
                      ♥
                    </button>
                  </div>

                  <div className="team-crest-block">
                    <div
                      className="team-crest-mark"
                      style={{ borderColor: team.color, color: team.color }}
                    >
                      {team.shortName.slice(0, 2)}
                    </div>
                    <h3>{team.shortName}</h3>
                  </div>

                  {/* Official Constructor F1 Car Image */}
                  <div className="team-car-render">
                    <img
                      src={team.carImage}
                      alt={`${team.name} 2026 Formula 1 car`}
                      className="team-car-img"
                      loading={idx < 6 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <span
                      className="team-car-code"
                      style={{ color: team.color }}
                    >
                      {team.carCode}
                    </span>
                  </div>

                  <div className="team-drivers-list">
                    <span>{team.drivers[0]}</span>
                    <span>{team.drivers[1]}</span>
                  </div>

                  <div className="team-view-bar">
                    <span>{team.isChampion ? "2026 WCC CHAMPIONS" : "VIEW TEAM"}</span>
                    <span>→</span>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {/* Selected Team Technical Spec, Crewmates, Sponsors & Car Command Center */}
        <Reveal
          direction="up"
          delay={120}
          className="team-detail-banner"
          style={
            {
              "--team-color": activeTeam.color,
              "--team-glow": activeTeam.accentGlow,
              "--team-border": hexToRgba(activeTeam.color, 0.44),
            } as CSSProperties
          }
        >
          <div
            id="team-inspector"
            key={activeTeam.id}
            className="panel-swap-in"
          >
            <div className="team-detail-inner">
              <div className="team-detail-showcase">
                <img
                  src={activeTeam.carImage}
                  alt={`${activeTeam.name} ${activeTeam.carCode} studio car`}
                  className="team-detail-car-img"
                  decoding="async"
                />
                <span
                  className="team-detail-chassis-badge"
                  style={{ color: activeTeam.color }}
                >
                  2026 CHASSIS // {activeTeam.carCode} • {activeTeam.titleSponsor}
                </span>
              </div>

              <div className="team-detail-meta">
                <div>
                  <span className="team-detail-kicker">
                    CONSTRUCTOR P{activeTeam.position} {"//"} {activeTeam.base}
                  </span>
                  <h3>{activeTeam.name}</h3>
                  <div className="team-command-chain">
                    <span>
                      TP: <strong>{activeTeam.pitCrew.teamPrincipal}</strong>
                    </span>
                    <span>
                      TD: <strong>{activeTeam.pitCrew.technicalDirector}</strong>
                    </span>
                    <span>
                      PIT BEST: <strong>{activeTeam.pitCrew.pitStopBest}</strong>
                    </span>
                  </div>
                </div>

                <div className="team-detail-specs">
                  <div>
                    <span>POWER UNIT</span>
                    <strong>{activeTeam.powerUnit}</strong>
                  </div>
                  <div>
                    <span>2026 POINTS</span>
                    <strong>{activeTeam.points} PTS</strong>
                  </div>
                  <div>
                    <span>WEIGHT / VMAX</span>
                    <strong>
                      {activeTeam.chassisSpecs.weight} • {activeTeam.chassisSpecs.topSpeed}
                    </strong>
                  </div>
                  <div>
                    <span>HYBRID ERS</span>
                    <strong>{activeTeam.chassisSpecs.ersOutput}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Crewmates, Race Engineers & F1 Car Selection */}
            <div className="team-inspector-subgrid">
              <div className="team-inspector-block">
                <div className="inspector-subhead">
                  <span>CREWMATES & RACE ENGINEERS</span>
                  <small>
                    ACTIVE CAR #{activeCrewmate?.number ?? "1"} • CLICK TO PAIR
                  </small>
                </div>

                <div className="team-crewmates-grid">
                  {teamCrewmates.map((drv, idx) => {
                    const isSelectedCrew = drv.id === activeCrewmate?.id;
                    const pairedEng =
                      activeTeam.pitCrew.raceEngineers.find(
                        (e) =>
                          e.carNumber === drv.number ||
                          e.driverName
                            .toLowerCase()
                            .includes(
                              drv.name.split(" ").pop()?.toLowerCase() ?? ""
                            )
                      )?.engineer ?? "Senior Trackside Engineer";

                    return (
                      <button
                        key={drv.id}
                        type="button"
                        onClick={() => {
                          setFavoriteTeam(activeTeam.id);
                          setFavoriteDriver(drv.id);
                        }}
                        className={cn(
                          "crewmate-card",
                          isSelectedCrew && "is-active"
                        )}
                      >
                        <div className="crewmate-avatar-wrap" aria-hidden="true">
                          <img
                            src={drv.image}
                            alt={drv.name}
                            className="crewmate-avatar"
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                          />
                          <span className="crewmate-num">#{drv.number}</span>
                        </div>

                        <div className="crewmate-info">
                          <div className="crewmate-title-row">
                            <strong>
                              {drv.flag} {drv.name}
                            </strong>
                            <span className="crewmate-tcam-tag">
                              {idx === 0 ? "CAR #1 • BLK T-CAM" : "CAR #2 • ACC T-CAM"}
                            </span>
                          </div>
                          <div className="crewmate-stats-row">
                            <span>P{drv.position} WDC</span>
                            <span>{drv.points} PTS</span>
                            <span>
                              {drv.wins}W • {drv.podiums}P • {drv.poles} PP
                            </span>
                          </div>
                          <div className="crewmate-engineer-row">
                            R.E.: <strong>{pairedEng}</strong>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Official Sponsor Partners & Car Livery Zones */}
              <div className="team-inspector-block">
                <div className="inspector-subhead">
                  <span>OFFICIAL SPONSORS & LIVERY ZONES</span>
                  <small>{activeTeam.sponsors.length} VERIFIED PARTNERS</small>
                </div>

                <div className="team-sponsors-grid">
                  {activeTeam.sponsors.map((sp) => (
                    <div key={sp.name} className="team-sponsor-pill">
                      <div className="sponsor-pill-top">
                        <strong>{sp.name}</strong>
                        <span className="sponsor-zone-tag">{sp.zone}</span>
                      </div>
                      <span className="sponsor-role-lbl">{sp.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="team-launch-actions">
              <button
                type="button"
                className="team-launch-btn is-secondary"
                onClick={() =>
                  launchGarageConsole(
                    activeTeam.id,
                    activeCrewmate?.id,
                    "inspect"
                  )
                }
              >
                OPEN 3D {activeTeam.carCode} IN GARAGE →
              </button>
              <button
                type="button"
                className="team-launch-btn is-primary"
                onClick={() =>
                  launchGarageConsole(
                    activeTeam.id,
                    activeCrewmate?.id,
                    "drive"
                  )
                }
              >
                LAUNCH DRIVING CONSOLE (
                {activeCrewmate?.code ?? activeTeam.shortName} #
                {activeCrewmate?.number ?? "1"}) →
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

