"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Spline, Play } from "lucide-react";

const presets = [
  { name: "Ease Out", x1: 0.16, y1: 1, x2: 0.3, y2: 1 },
  { name: "Snappy", x1: 0.2, y1: 0.9, x2: 0.3, y2: 1 },
  { name: "Springy", x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
  { name: "Smooth", x1: 0.4, y1: 0, x2: 0.2, y2: 1 },
];

export function CubicBezierGenerator() {
  const [x1, setX1] = useState(0.22);
  const [y1, y1Set] = useState(1);
  const [x2, setX2] = useState(0.36);
  const [y2, y2Set] = useState(1);
  const [duration, setDuration] = useState(600);
  const [active, setActive] = useState(false);

  const bezier = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  const cssCode = `transition-property: transform, opacity;\ntransition-duration: ${duration}ms;\ntransition-timing-function: ${bezier};`;
  const tailwindCode = `transition-all duration-[${duration}ms] ease-[cubic-bezier(${x1},${y1},${x2},${y2})]`;
  const htmlCode = `<div style="transition: transform ${duration}ms ${bezier};">Animated Element</div>`;

  const reset = () => {
    setX1(0.22);
    y1Set(1);
    setX2(0.36);
    y2Set(1);
    setDuration(600);
  };

  // Map 0..1 coordinates to 160x160 SVG box (with y inverted and padding for overshoot)
  const pad = 20;
  const size = 120;
  const px1 = pad + x1 * size;
  const py1 = pad + (1 - y1) * size;
  const px2 = pad + x2 * size;
  const py2 = pad + (1 - y2) * size;
  const startX = pad;
  const startY = pad + size;
  const endX = pad + size;
  const endY = pad;

  const controls = (
    <div className="space-y-5">
      {[
        { label: "P1 X (x1)", value: x1, setter: setX1, min: 0, max: 1, step: 0.01 },
        { label: "P1 Y (y1)", value: y1, setter: y1Set, min: -0.5, max: 1.8, step: 0.01 },
        { label: "P2 X (x2)", value: x2, setter: setX2, min: 0, max: 1, step: 0.01 },
        { label: "P2 Y (y2)", value: y2, setter: y2Set, min: -0.5, max: 1.8, step: 0.01 },
        { label: "Duration", value: duration, setter: setDuration, min: 100, max: 2000, step: 50, unit: "ms" },
      ].map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              {item.label}
            </label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">
              {item.value}
              {item.unit ?? ""}
            </span>
          </div>
          <input
            type="range"
            min={item.min}
            max={item.max}
            step={item.step}
            value={item.value}
            onChange={(e) => item.setter(parseFloat(e.target.value))}
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>
      ))}

      <div className="space-y-2.5 pt-3 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          Easing Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setX1(p.x1);
                y1Set(p.y1);
                setX2(p.x2);
                y2Set(p.y2);
              }}
              className="px-2 py-2 rounded-lg card text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full max-w-md space-y-6">
      <div className="flex items-center justify-between gap-4">
        <svg
          viewBox="0 0 160 160"
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shrink-0"
        >
          <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="currentColor" strokeOpacity="0.15" strokeDasharray="3 3" className="text-[var(--text-secondary)]" />
          <line x1={startX} y1={startY} x2={px1} y2={py1} stroke="currentColor" strokeOpacity="0.4" className="text-[var(--text-secondary)]" />
          <line x1={endX} y1={endY} x2={px2} y2={py2} stroke="currentColor" strokeOpacity="0.4" className="text-[var(--text-secondary)]" />
          <path
            d={`M ${startX} ${startY} C ${px1} ${py1}, ${px2} ${py2}, ${endX} ${endY}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-[var(--text-primary)]"
          />
          <circle cx={px1} cy={py1} r="4" fill="currentColor" className="text-[var(--text-primary)]" />
          <circle cx={px2} cy={py2} r="4" fill="currentColor" className="text-[var(--text-primary)]" />
        </svg>

        <div className="flex-1 space-y-3">
          <div className="text-xs font-mono text-[var(--text-secondary)] break-all">
            {bezier}
          </div>
          <button
            onClick={() => setActive((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] px-3.5 py-2 text-xs font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
          >
            <Play className="w-3.5 h-3.5" />
            Compare Motion
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-[var(--text-secondary)]">Custom Curve</span>
          <div className="h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1.5 flex items-center">
            <div
              className="h-7 w-7 rounded-lg bg-[var(--text-primary)]"
              style={{
                transform: active ? "translateX(180px)" : "translateX(0px)",
                transition: `transform ${duration}ms ${bezier}`,
              }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-[var(--text-secondary)]">Linear Reference</span>
          <div className="h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1.5 flex items-center">
            <div
              className="h-7 w-7 rounded-lg border border-[var(--border-hover)] bg-[var(--bg-hover)]"
              style={{
                transform: active ? "translateX(180px)" : "translateX(0px)",
                transition: `transform ${duration}ms linear`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Cubic Bezier"
      description="Design custom CSS easing curves and compare motion timing in real time."
      icon={<Spline className="w-5 h-5" />}
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
