"use client";

import { navItems } from "../lib/constants";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <strong>
          <span className="brand-badge">F1</span> FANVERSE
        </strong>
        <span>BUILT FOR THE FANS. BUILT FOR THE LOVE OF RACING.</span>
      </div>

      <nav aria-label="Footer navigation">
        {navItems.map((item) => (
          <a key={item.id} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="footer-right">
        <a href="#home" className="back-to-top">
          BACK TO GRID ↑
        </a>
        <p suppressHydrationWarning>© {new Date().getFullYear()} F1 FANVERSE</p>
      </div>
    </footer>
  );
}
