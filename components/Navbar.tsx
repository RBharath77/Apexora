"use client";

import { useEffect, useState } from "react";
import { navItems } from "../lib/constants";
import { useFavorites } from "../lib/favorites";
import { useLiveData } from "../lib/live-data";
import { cn } from "../lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const { totalSelectedCount } = useFavorites();
  const { latencyMs, source, isSyncing, liveSimActive, syncNow } =
    useLiveData();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-38% 0px -50% 0px", threshold: 0.01 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const liveBadgeText = liveSimActive
    ? "LIVE SIM"
    : source === "LIVE_API" || source === "HYBRID_CACHE"
      ? `LIVE • ${latencyMs}ms`
      : `SYNC • ${latencyMs}ms`;

  return (
    <header className={cn("site-nav", scrolled && "is-scrolled")}>
      <a
        className="brand"
        href="#home"
        onClick={() => {
          setMenuOpen(false);
        }}
      >
        <span className="brand-badge">APEX</span>
        <span>ORA</span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={cn(activeId === item.id && "is-active")}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className={cn(
            "live-latency-pill",
            liveSimActive && "is-sim",
            isSyncing && "is-syncing"
          )}
          onClick={() => {
            void syncNow();
          }}
          title="Click to sync live standings & weather immediately"
        >
          <span className="live-dot-green" />
          <span>{isSyncing ? "SYNCING..." : liveBadgeText}</span>
        </button>

        <a
          href="#my-f1"
          className="fav-nav-link"
          title="Jump to My F1 Favorites"
        >
          <span className="fav-heart" aria-hidden="true">
            ♥
          </span>
          <span>Favorites</span>
          <span className="fav-count">{totalSelectedCount}</span>
        </a>

        <button
          className={cn("menu-toggle", menuOpen && "is-open")}
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((value) => !value);
          }}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={cn("mobile-menu", menuOpen && "is-open")}>
        {navItems.map((item, index) => (
          <a
            key={item.id}
            href={item.href}
            className={cn(activeId === item.id && "is-active")}
            style={{ transitionDelay: `${index * 30}ms` }}
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            <span>0{index + 1}</span>
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
