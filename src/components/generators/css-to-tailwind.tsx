"use client";

import { useState, useMemo } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Terminal, Zap } from "lucide-react";

const DEFAULT_CSS = `.card {
  background-color: #111827;
  color: #f9fafb;
  padding: 32px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}`;

function toSpacingScale(val: string): string | null {
  const pxMatch = val.match(/^(-?\d+(?:\.\d+)?)px$/);
  if (pxMatch) {
    const px = parseFloat(pxMatch[1]);
    if (px === 0) return "0";
    const step = px / 4;
    if (Number.isInteger(step) && step >= 0 && step <= 96) return String(step);
    return `[${val}]`;
  }
  const remMatch = val.match(/^(-?\d+(?:\.\d+)?)rem$/);
  if (remMatch) {
    const step = parseFloat(remMatch[1]) * 4;
    if (Number.isInteger(step) && step >= 0 && step <= 96) return String(step);
    return `[${val}]`;
  }
  return `[${val.replace(/\s+/g, "_")}]`;
}

function convertCssToTailwind(css: string): { classes: string; styleObj: Record<string, string> } {
  const body = css.includes("{")
    ? css.slice(css.indexOf("{") + 1, css.lastIndexOf("}") > css.indexOf("{") ? css.lastIndexOf("}") : undefined)
    : css;

  const classes: string[] = [];
  const styleObj: Record<string, string> = {};

  for (const rawLine of body.split(";")) {
    const colonIdx = rawLine.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = rawLine.slice(0, colonIdx).trim().toLowerCase();
    const val = rawLine.slice(colonIdx + 1).trim();
    if (!prop || !val) continue;

    const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    styleObj[camelProp] = val;

    const cleanVal = val.replace(/\s+/g, "_");

    if (prop === "display") {
      if (val === "none") classes.push("hidden");
      else classes.push(val);
    } else if (prop === "flex-direction") {
      const map: Record<string, string> = { row: "flex-row", "row-reverse": "flex-row-reverse", column: "flex-col", "column-reverse": "flex-col-reverse" };
      classes.push(map[val] || `[flex-direction:${cleanVal}]`);
    } else if (prop === "justify-content") {
      const map: Record<string, string> = { "flex-start": "justify-start", "flex-end": "justify-end", center: "justify-center", "space-between": "justify-between", "space-around": "justify-around", "space-evenly": "justify-evenly" };
      classes.push(map[val] || `[justify-content:${cleanVal}]`);
    } else if (prop === "align-items") {
      const map: Record<string, string> = { "flex-start": "items-start", "flex-end": "items-end", center: "items-center", baseline: "items-baseline", stretch: "items-stretch" };
      classes.push(map[val] || `[align-items:${cleanVal}]`);
    } else if (prop === "background" || prop === "background-color") {
      classes.push(`bg-[${cleanVal}]`);
    } else if (prop === "color") {
      classes.push(`text-[${cleanVal}]`);
    } else if (prop === "padding") {
      const s = toSpacingScale(val);
      classes.push(s ? `p-${s}` : `p-[${cleanVal}]`);
    } else if (prop === "margin") {
      const s = toSpacingScale(val);
      classes.push(s ? `m-${s}` : `m-[${cleanVal}]`);
    } else if (prop === "gap") {
      const s = toSpacingScale(val);
      classes.push(s ? `gap-${s}` : `gap-[${cleanVal}]`);
    } else if (prop === "width") {
      classes.push(val === "100%" ? "w-full" : `w-[${cleanVal}]`);
    } else if (prop === "height") {
      classes.push(val === "100%" ? "h-full" : `h-[${cleanVal}]`);
    } else if (prop === "border-radius") {
      classes.push(`rounded-[${cleanVal}]`);
    } else if (prop === "font-size") {
      classes.push(`text-[${cleanVal}]`);
    } else if (prop === "font-weight") {
      classes.push(`[font-weight:${cleanVal}]`);
    } else if (prop === "text-align") {
      classes.push(`text-${val}`);
    } else if (prop === "opacity") {
      classes.push(`opacity-[${cleanVal}]`);
    } else if (prop === "box-shadow") {
      classes.push(`shadow-[${cleanVal}]`);
    } else {
      classes.push(`[${prop}:${cleanVal}]`);
    }
  }

  return { classes: classes.join(" "), styleObj };
}

export function CssToTailwind() {
  const [input, setInput] = useState(DEFAULT_CSS);

  const { classes: output, styleObj } = useMemo(
    () => convertCssToTailwind(input),
    [input]
  );

  const tailwindCode = output
    ? `<div className="${output}">\n  Styled Element\n</div>`
    : `<div className="">\n  Styled Element\n</div>`;

  const htmlCode = `<style>\n${input}\n</style>\n<div class="card">\n  Styled Element\n</div>`;

  const reset = () => {
    setInput(DEFAULT_CSS);
  };

  const controls = (
    <div className="space-y-5">
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Traditional CSS</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your CSS properties here..."
          className="w-full h-56 card p-4 text-xs font-mono text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--focus-ring)] outline-none transition-all"
        />
      </div>

      <div className="p-4 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border)]">
        <div className="flex items-center gap-2 text-[var(--text-primary)] mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">Live Converter</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Automatically translates CSS rules into valid Tailwind CSS utilities as you type.
        </p>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full max-w-md space-y-4">
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-6 flex flex-col items-center justify-center gap-4">
        <div
          className="w-full transition-all"
          style={styleObj}
        >
          <div className="text-sm font-semibold">Live Preview</div>
          <div className="text-xs opacity-80">Rendered directly from your CSS rules.</div>
        </div>
        {output && (
          <div className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-xs font-mono text-[var(--text-secondary)] break-words">
            <Zap className="w-3.5 h-3.5 inline mr-1.5 text-[var(--text-primary)]" />
            {output}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="CSS to Tailwind"
      description="Translate traditional CSS properties into equivalent Tailwind utilities."
      controls={controls}
      preview={preview}
      cssCode={input}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
