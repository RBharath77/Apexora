"use client";

import { Reveal } from "./MotionPrimitives";

type SectionTitleProps = {
  number: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
};

export default function SectionTitle({
  number,
  title,
  eyebrow,
  subtitle,
}: SectionTitleProps) {
  return (
    <Reveal direction="up" className="section-header-block">
      <div className="section-eyebrow-row">
        <span className="section-index">{number}</span>
        <span className="section-rule" aria-hidden="true" />
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      </div>

      <div className="section-title">
        <h2>{title}</h2>
      </div>

      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </Reveal>
  );
}
