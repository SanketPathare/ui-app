"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Eye, ArrowLeftRight, Check, X } from "lucide-react";

function getLuminance(hex: string) {
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return 0;
  const rgb = [0, 2, 4].map((i) => {
    const val = parseInt(clean.slice(i, i + 2), 16) / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrastRatio(fg: string, bg: string) {
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

const presets = [
  { name: "Dark High", fg: "#fafafa", bg: "#0a0a0a" },
  { name: "Light High", fg: "#0a0a0a", bg: "#ffffff" },
  { name: "Indigo", fg: "#ffffff", bg: "#4338ca" },
  { name: "Soft Slate", fg: "#0f172a", bg: "#e2e8f0" },
];

export function ContrastCheckerGenerator() {
  const [fg, setFg] = useState("#fafafa");
  const [bg, setBg] = useState("#0a0a0a");

  const ratio = getContrastRatio(fg, bg);
  const ratioFormatted = ratio.toFixed(2);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  const cssCode = `color: ${fg};\nbackground-color: ${bg};\n/* WCAG Contrast Ratio: ${ratioFormatted}:1 */`;
  const tailwindCode = `text-[${fg}] bg-[${bg}]`;
  const htmlCode = `<div style="color: ${fg}; background-color: ${bg}; padding: 24px; border-radius: 12px;">\n  Accessible UI Content (${ratioFormatted}:1)\n</div>`;

  const reset = () => {
    setFg("#fafafa");
    setBg("#0a0a0a");
  };

  const controls = (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Text Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            className="h-10 w-12 rounded-lg border border-[var(--border)] bg-transparent cursor-pointer shrink-0"
          />
          <input
            type="text"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            className="input-geist w-full font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Background Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            className="h-10 w-12 rounded-lg border border-[var(--border)] bg-transparent cursor-pointer shrink-0"
          />
          <input
            type="text"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            className="input-geist w-full font-mono text-sm"
          />
        </div>
      </div>

      <button
        onClick={() => {
          setFg(bg);
          setBg(fg);
        }}
        className="btn-secondary w-full text-xs"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        Swap Colors
      </button>

      <div className="space-y-2.5 pt-3 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setFg(p.fg);
                setBg(p.bg);
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

  const checks = [
    { label: "AA Normal", pass: aaNormal, req: "4.5:1" },
    { label: "AA Large", pass: aaLarge, req: "3.0:1" },
    { label: "AAA Normal", pass: aaaNormal, req: "7.0:1" },
    { label: "AAA Large", pass: aaaLarge, req: "4.5:1" },
  ];

  const preview = (
    <div className="w-full max-w-md space-y-4">
      <div
        className="rounded-xl border border-[var(--border)] p-6 space-y-2 transition-colors"
        style={{ backgroundColor: bg, color: fg }}
      >
        <div className="text-xs font-mono opacity-80">Contrast Ratio: {ratioFormatted}:1</div>
        <h3 className="text-xl font-bold tracking-tight">
          Readable UI Typography
        </h3>
        <p className="text-sm opacity-90 leading-relaxed">
          Good color contrast ensures your interfaces remain legible for all users across different screens and lighting conditions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {checks.map((c) => (
          <div
            key={c.label}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-xs"
          >
            <span className="font-medium text-[var(--text-primary)]">
              {c.label} <span className="text-[var(--text-tertiary)]">({c.req})</span>
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-[var(--text-primary)]">
              {c.pass ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 opacity-50" />}
              {c.pass ? "Pass" : "Fail"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Contrast Checker"
      description="Check WCAG 2.1 AA and AAA color contrast ratios in real time."
      icon={<Eye className="w-5 h-5" />}
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
