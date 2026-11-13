"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
}: ButtonProps) {
  const classes = cn(
    "primary-button",
    variant === "ghost" && "ghost-button",
    className
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        onClick={onClick}
      >
        <span className="button-sweep" aria-hidden="true" />
        <span className="button-label">{children}</span>
      </a>
    );
  }

  return (
    <button
      className={classes}
      type="button"
      onClick={onClick}
    >
      <span className="button-sweep" aria-hidden="true" />
      <span className="button-label">{children}</span>
    </button>
  );
}
