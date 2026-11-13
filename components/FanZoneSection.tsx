"use client";

import { useState } from "react";
import {
  getNextUpcomingRace,
  pollOptions2026,
  raceCalendarData,
  worldCircuits,
} from "../lib/constants";
import { useFavorites } from "../lib/favorites";
import { useLiveData } from "../lib/live-data";
import { cn } from "../lib/utils";
import { Reveal } from "./MotionPrimitives";
import SectionTitle from "./SectionTitle";

export default function FanZoneSection() {
  const {
    favorites,
    setFavoriteDriver,
    setFavoriteTeam,
    setFavoriteRace,
    setFavoriteCircuit,
  } = useFavorites();
  const { drivers, constructors } = useLiveData();

  // Interactive Poll State
  const [selectedVote, setSelectedVote] = useState<string>(pollOptions2026[0].id);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>(() =>
    Object.fromEntries(pollOptions2026.map((o) => [o.id, o.baseVotes]))
  );
  const [pollLiked, setPollLiked] = useState(false);

  // Community Feed State
  const [postLiked, setPostLiked] = useState(false);
  const [postSaved, setPostSaved] = useState(false);
  const [comments, setComments] = useState<string[]>([
    "Antonelli (#12) wrapping up the 2026 title already — Vegas under the lights is gonna be wild!",
  ]);
  const [draftComment, setDraftComment] = useState("");

  // Manage Favorites Drawer
  const [managingFavs, setManagingFavs] = useState(false);

  const totalVotes = Object.values(votes).reduce((acc, v) => acc + v, 0);

  const handleCastVote = () => {
    if (!hasVoted) {
      setVotes((prev) => ({
        ...prev,
        [selectedVote]: (prev[selectedVote] ?? 0) + 1,
      }));
      setHasVoted(true);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftComment.trim();
    if (!trimmed) return;
    setComments((prev) => [trimmed, ...prev]);
    setDraftComment("");
  };

  const favDriver =
    drivers.find((d) => d.id === favorites.driverId) ?? drivers[0];
  const favTeam =
    constructors.find((t) => t.id === favorites.teamId) ?? constructors[0];
  const favRace =
    raceCalendarData.find((r) => r.id === favorites.raceId) ??
    getNextUpcomingRace(raceCalendarData);
  const favCircuit =
    worldCircuits.find((c) => c.id === favorites.circuitId) ??
    worldCircuits[0];

  return (
    <section id="fan-zone" className="fanverse-section section-fan-zone">
      <div className="section-inner">
        <SectionTitle
          number="07"
          eyebrow="JOIN THE CONVERSATION. SHARE YOUR PASSION."
          title="FAN ZONE & MY F1"
          subtitle="Vote on live 2026 race predictions, share paddock reactions, and customize your personal F1 dashboard."
        />

        <div className="fanzone-layout">
          {/* Card 1: Live Interactive Poll */}
          <Reveal direction="left" className="fan-card">
            <div className="fan-post-head">
              <div className="fan-avatar">RF</div>
              <div>
                <strong>RacingFan93</strong>
                <span>2m ago • LIVE POLL</span>
              </div>
            </div>

            <h3 className="fan-poll-question">
              Who wins under the lights in Las Vegas?
            </h3>

            <div className="poll-options">
              {pollOptions2026.map((opt) => {
                const count = votes[opt.id] ?? 0;
                const pct = Math.round((count / totalVotes) * 100);
                const isSelected = selectedVote === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedVote(opt.id);
                    }}
                    className={cn("poll-option-btn", isSelected && "is-selected")}
                  >
                    <div
                      className="poll-bar-fill"
                      style={{
                        transform: `scaleX(${(pct / 100).toFixed(3)})`,
                      }}
                    />
                    <span className="poll-label">{opt.label}</span>
                    <strong className="poll-pct">{pct}%</strong>
                  </button>
                );
              })}
            </div>

            <div className="poll-actions-row">
              <button
                type="button"
                className={cn("vote-btn", hasVoted && "is-voted")}
                onClick={handleCastVote}
              >
                {hasVoted ? "VOTE RECORDED ✓" : "Vote"}
              </button>

              <div className="social-counters">
                <button
                  type="button"
                  onClick={() => {
                    setPollLiked((p) => !p);
                  }}
                  className={cn("social-chip", pollLiked && "is-liked")}
                >
                  ♥ {1240 + (pollLiked ? 1 : 0)}
                </button>
                <span className="social-chip">💬 {342 + comments.length}</span>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Community Paddock Feed */}
          <Reveal direction="up" delay={90} className="fan-card">
            <div className="fan-post-head">
              <div className="fan-avatar accent">F1</div>
              <div>
                <strong>F1_Lover</strong>
                <span>1h ago • PADDOCK FEED</span>
              </div>
            </div>

            <p className="fan-post-text">
              Monaco twilight & Las Vegas night sprints — the 2026 active aero
              cars look unreal on street circuits!
            </p>

            <div className="fan-post-media">
              <img
                src="/images/race-monaco.jpg"
                alt="Formula 1 Harbor Circuit"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="poll-actions-row">
              <div className="social-counters">
                <button
                  type="button"
                  onClick={() => {
                    setPostLiked((p) => !p);
                  }}
                  className={cn("social-chip", postLiked && "is-liked")}
                >
                  ♥ {892 + (postLiked ? 1 : 0)}
                </button>
                <span className="social-chip">💬 {120 + comments.length}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPostSaved((p) => !p);
                }}
                className={cn("social-chip", postSaved && "is-liked")}
              >
                {postSaved ? "SAVED ★" : "SAVE ☆"}
              </button>
            </div>

            <form className="fan-comment-form" onSubmit={handlePostComment}>
              <input
                type="text"
                value={draftComment}
                onChange={(e) => setDraftComment(e.target.value)}
                placeholder="Drop your race prediction..."
                aria-label="Write a fan comment"
              />
              <button type="submit">POST</button>
            </form>

            <div className="fan-comments-list">
              {comments.slice(0, 2).map((c, idx) => (
                <p
                  key={`${comments.length - idx}-${c}`}
                  className="fan-comment-line panel-swap-in"
                >
                  <span>FAN:</span> {c}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Card 3: MY F1 Personalization Dashboard */}
          <Reveal
            direction="right"
            delay={160}
            className="fan-card my-f1-card"
          >
            <div id="my-f1" className="my-f1-header">
              <div>
                <h3>
                  <span>MY</span> F1
                </h3>
                <p>Your favorite driver, team & circuit.</p>
              </div>
              <button
                type="button"
                className="control-chip"
                onClick={() => {
                  setManagingFavs((p) => !p);
                }}
              >
                {managingFavs ? "DONE" : "MANAGE"}
              </button>
            </div>

            {managingFavs ? (
              <div key="fav-editor" className="fav-editor panel-swap-in">
                <label>
                  <span>FAVORITE DRIVER</span>
                  <select
                    value={favorites.driverId}
                    onChange={(e) => setFavoriteDriver(e.target.value)}
                  >
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        P{d.position} #{d.number} {d.name} ({d.team})
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>FAVORITE TEAM</span>
                  <select
                    value={favorites.teamId}
                    onChange={(e) => setFavoriteTeam(e.target.value)}
                  >
                    {constructors.map((t) => (
                      <option key={t.id} value={t.id}>
                        P{t.position} {t.shortName} ({t.points} PTS)
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>FAVORITE RACE</span>
                  <select
                    value={favorites.raceId}
                    onChange={(e) => setFavoriteRace(e.target.value)}
                  >
                    {raceCalendarData.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>FAVORITE CIRCUIT</span>
                  <select
                    value={favorites.circuitId}
                    onChange={(e) => setFavoriteCircuit(e.target.value)}
                  >
                    {worldCircuits.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.raceTitle}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <div key="fav-items" className="my-f1-items panel-swap-in">
                <div className="my-f1-row">
                  <div
                    className="my-f1-icon"
                    style={{ borderColor: favDriver.teamColor, color: favDriver.teamColor }}
                  >
                    #{favDriver.number}
                  </div>
                  <div>
                    <span>FAVORITE DRIVER</span>
                    <strong>{favDriver.name}</strong>
                    <small>
                      P{favDriver.position} • {favDriver.points} PTS
                    </small>
                  </div>
                </div>

                <div className="my-f1-row">
                  <div
                    className="my-f1-icon"
                    style={{ borderColor: favTeam.color, color: favTeam.color }}
                  >
                    {favTeam.shortName.slice(0, 2)}
                  </div>
                  <div>
                    <span>FAVORITE TEAM</span>
                    <strong>{favTeam.shortName}</strong>
                    <small>
                      P{favTeam.position} • {favTeam.points} PTS
                    </small>
                  </div>
                </div>

                <div className="my-f1-row">
                  <div className="my-f1-icon flag">{favRace.flag}</div>
                  <div>
                    <span>FAVORITE RACE</span>
                    <strong>{favRace.shortName}</strong>
                    <small>{favRace.dateLabel}</small>
                  </div>
                </div>

                <div className="my-f1-row">
                  <div className="my-f1-icon">◎</div>
                  <div>
                    <span>FAVORITE CIRCUIT</span>
                    <strong>{favCircuit.name.toUpperCase()}</strong>
                    <small>
                      {favCircuit.lengthKm} • {favCircuit.lapRecord}
                    </small>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              className="manage-favs-btn"
              onClick={() => {
                setManagingFavs((p) => !p);
              }}
            >
              {managingFavs ? "Save Preferences" : "Manage Favorites"}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

