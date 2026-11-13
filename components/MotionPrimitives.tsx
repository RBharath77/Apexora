"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { clamp, cn, lerp } from "../lib/utils";

/**
 * Returns true only while the target element is inside the viewport
 * AND the browser tab is visible — cutting off-screen CPU/GPU overhead to zero.
 */
export function useActiveRenderGate(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    setTabVisible(!document.hidden);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(Boolean(entries[0]?.isIntersecting));
      },
      { threshold: 0.02 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView && tabVisible;
}

export function ScrollProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
      rafId = 0;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div ref={fillRef} className="scroll-progress-fill" />
    </div>
  );
}

export function TelemetryCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || reduceMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovering = false;
    let isPressed = false;
    let isVisible = false;
    let rafId = 0;
    let lastMoveTime = 0;

    const render = () => {
      if (document.hidden || !isVisible) {
        rafId = 0;
        return;
      }

      ringX = lerp(ringX, mouseX, 0.24);
      ringY = lerp(ringY, mouseY, 0.24);

      if (ringRef.current) {
        ringRef.current.style.opacity = "1";
        const scale = isPressed ? 0.84 : isHovering ? 1.42 : 1;
        ringRef.current.style.transform = `translate3d(${ringX.toFixed(
          1
        )}px, ${ringY.toFixed(1)}px, 0) scale(${scale})`;
        ringRef.current.classList.toggle("is-hovering", isHovering);
      }

      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${
          isPressed ? 1.35 : 1
        })`;
      }

      const settled =
        Math.abs(ringX - mouseX) < 0.35 &&
        Math.abs(ringY - mouseY) < 0.35 &&
        performance.now() - lastMoveTime > 120;

      if (!settled) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = 0;
      }
    };

    const wake = () => {
      if (!rafId && isVisible) {
        rafId = requestAnimationFrame(render);
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTime = performance.now();
      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
      }

      const target = e.target as HTMLElement | null;
      isHovering = Boolean(
        target?.closest("a, button, [data-interactive='true']")
      );

      wake();
    };

    const onDown = () => {
      isPressed = true;
      lastMoveTime = performance.now();
      wake();
    };

    const onUp = () => {
      isPressed = false;
      lastMoveTime = performance.now();
      wake();
    };

    const onLeave = () => {
      isVisible = false;
      isPressed = false;
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="telemetry-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="telemetry-cursor-dot" aria-hidden="true" />
    </>
  );
}

type RevealProps = {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -24px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-block",
        `reveal-${direction}`,
        visible && "is-visible",
        className
      )}
      style={{ ...style, transitionDelay: `${Math.min(delay, 420)}ms` }}
    >
      {children}
    </div>
  );
}

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
};

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 650,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const prevTargetRef = useRef(value);

  useEffect(() => {
    const startVal = prevTargetRef.current;
    if (startVal === value) return;
    prevTargetRef.current = value;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(startVal + (value - startVal) * eased));
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [duration, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

export function TiltCard({
  children,
  className,
  onClick,
  style,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const animRef = useRef({
    targetX: 0,
    targetY: 0,
    targetLift: 0,
    curX: 0,
    curY: 0,
    curLift: 0,
    rafId: 0,
  });

  useEffect(() => {
    const anim = animRef.current;
    return () => {
      if (anim.rafId) cancelAnimationFrame(anim.rafId);
    };
  }, []);

  const scheduleTick = () => {
    const anim = animRef.current;
    if (anim.rafId) return;

    const tick = () => {
      const el = cardRef.current;
      if (!el) {
        anim.rafId = 0;
        return;
      }

      anim.curX = lerp(anim.curX, anim.targetX, 0.18);
      anim.curY = lerp(anim.curY, anim.targetY, 0.18);
      anim.curLift = lerp(anim.curLift, anim.targetLift, 0.18);

      const settled =
        Math.abs(anim.curX - anim.targetX) < 0.03 &&
        Math.abs(anim.curY - anim.targetY) < 0.03 &&
        Math.abs(anim.curLift - anim.targetLift) < 0.03;

      if (settled) {
        anim.curX = anim.targetX;
        anim.curY = anim.targetY;
        anim.curLift = anim.targetLift;
      }

      el.style.transform =
        anim.curX === 0 && anim.curY === 0 && anim.curLift === 0
          ? ""
          : `perspective(960px) rotateX(${anim.curX.toFixed(
              2
            )}deg) rotateY(${anim.curY.toFixed(
              2
            )}deg) translate3d(0, ${anim.curLift.toFixed(2)}px, 0)`;

      if (!settled) {
        anim.rafId = requestAnimationFrame(tick);
      } else {
        anim.rafId = 0;
      }
    };

    anim.rafId = requestAnimationFrame(tick);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);

    animRef.current.targetY = (x - 0.5) * 9;
    animRef.current.targetX = (0.5 - y) * 9;
    animRef.current.targetLift = -4;

    el.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
    scheduleTick();
  };

  const handleMouseLeave = () => {
    animRef.current.targetX = 0;
    animRef.current.targetY = 0;
    animRef.current.targetLift = 0;
    scheduleTick();
  };

  return (
    <div
      ref={cardRef}
      data-interactive="true"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("tilt-card", className)}
      style={style}
    >
      {children}
      <div className="tilt-glare" aria-hidden="true" />
    </div>
  );
}
