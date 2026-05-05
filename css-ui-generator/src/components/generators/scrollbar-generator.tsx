"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Sparkles, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const presets = [
  { name: "Modern iOS", width: 8, radius: 20, thumb: "#a1a1aa", track: "transparent", border: 0, hover: "#71717a" },
  { name: "Cyber Neon", width: 10, radius: 0, thumb: "#f0abfc", track: "#1e1b4b", border: 2, hover: "#e879f9" },
  { name: "Terminal", width: 14, radius: 4, thumb: "#22c55e", track: "#052e16", border: 3, hover: "#4ade80" },
  { name: "Minimalist", width: 4, radius: 10, thumb: "#6366f1", track: "#f8fafc", border: 0, hover: "#4f46e5" },
];

export function ScrollbarGenerator() {
  const [width, setWidth] = useState(10);
  const [borderRadius, setBorderRadius] = useState(10);
  const [thumbColor, setThumbColor] = useState("#6366f1");
  const [trackColor, setTrackColor] = useState("#1e293b");
  const [thumbHoverColor, setThumbHoverColor] = useState("#4f46e5");
  const [borderWidth, setBorderWidth] = useState(2);
  const [hasGradient, setHasGradient] = useState(false);
  const [color2, setColor2] = useState("#a855f7");
  const [thumbHeight, setThumbHeight] = useState(30); // percentage of track

  const applyPreset = (p: typeof presets[0]) => {
    setWidth(p.width);
    setBorderRadius(p.radius);
    setThumbColor(p.thumb);
    setTrackColor(p.track);
    setThumbHoverColor(p.hover);
    setBorderWidth(p.border);
    setHasGradient(false);
  };

  const thumbBg = hasGradient
    ? `linear-gradient(to bottom, ${thumbColor}, ${color2})`
    : thumbColor;

  const cssCode = `/* Firefox */
* {
  scrollbar-width: ${width < 10 ? "thin" : "auto"};
  scrollbar-color: ${thumbColor} ${trackColor};
}

/* Chrome, Edge, Safari */
*::-webkit-scrollbar {
  width: ${width}px;
  height: ${width}px;
}

*::-webkit-scrollbar-track {
  background: ${trackColor};
  border-radius: ${borderRadius}px;
}

*::-webkit-scrollbar-thumb {
  background: ${hasGradient ? `linear-gradient(to bottom, ${thumbColor}, ${color2})` : thumbColor};
  border-radius: ${borderRadius}px;
  border: ${borderWidth}px solid ${trackColor};
}

*::-webkit-scrollbar-thumb:hover {
  background: ${thumbHoverColor};
}`;

  const tailwindCode = `/* Tailwind CSS does not support scrollbar styling natively.
   Use a plugin like 'tailwind-scrollbar' or custom CSS. */`;

  const htmlCode = `<div class="scrollable-container">
  <!-- your content -->
</div>

<style>
.scrollable-container {
  max-height: 400px;
  overflow-y: auto;
}

.scrollable-container::-webkit-scrollbar {
  width: ${width}px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: ${trackColor};
  border-radius: ${borderRadius}px;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: ${hasGradient ? `linear-gradient(to bottom, ${thumbColor}, ${color2})` : thumbColor};
  border-radius: ${borderRadius}px;
  border: ${borderWidth}px solid ${trackColor};
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: ${thumbHoverColor};
}
</style>`;

  const reset = () => {
    setWidth(10);
    setBorderRadius(10);
    setThumbColor("#6366f1");
    setTrackColor("#1e293b");
    setThumbHoverColor("#4f46e5");
    setBorderWidth(2);
    setHasGradient(false);
    setColor2("#a855f7");
    setThumbHeight(30);
  };

  const controls = (
    <div className="space-y-6">
      {/* Presets */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-brand-primary hover:border-brand-primary transition-all"
            >
              <Sparkles className="w-3 h-3" /> {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        {[
          { label: "Width", value: width, setter: setWidth, min: 2, max: 30, unit: "px" },
          { label: "Radius", value: borderRadius, setter: setBorderRadius, min: 0, max: 30, unit: "px" },
          { label: "Border", value: borderWidth, setter: setBorderWidth, min: 0, max: 10, unit: "px" },
          { label: "Thumb Size", value: thumbHeight, setter: setThumbHeight, min: 10, max: 80, unit: "%" },
        ].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">{item.label}</label>
              <span className="text-[10px] font-bold text-brand-primary font-mono">{item.value}{item.unit}</span>
            </div>
            <input
              type="range"
              value={item.value}
              min={item.min}
              max={item.max}
              step={1}
              onChange={(e) => item.setter(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
        ))}
      </div>

      {/* Colors */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Thumb</label>
            <input type="color" value={thumbColor} onChange={(e) => setThumbColor(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-white/10 rounded-lg cursor-pointer" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Track</label>
            <input type="color" value={trackColor} onChange={(e) => setTrackColor(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-white/10 rounded-lg cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Hover</label>
          <input type="color" value={thumbHoverColor} onChange={(e) => setThumbHoverColor(e.target.value)} className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Gradient</label>
          <button
            onClick={() => setHasGradient(!hasGradient)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
              hasGradient ? "bg-brand-primary text-white" : "bg-white/5 text-slate-500"
            )}
          >
            {hasGradient ? "On" : "Off"}
          </button>
        </div>

        {hasGradient && (
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Color 2</label>
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer" />
          </div>
        )}
      </div>

      <button
        onClick={reset}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg"
      >
        <RefreshCcw className="w-4 h-4" /> Reset
      </button>
    </div>
  );

  // ─── Visual simulation of a scrollbar ───
  const preview = (
    <div className="flex items-stretch gap-0 w-72 h-[320px]">
      {/* Fake page content area */}
      <div className="flex-1 bg-slate-900 rounded-l-2xl border border-r-0 border-white/10 p-5 space-y-4 overflow-hidden">
        <div className="h-3 w-3/4 bg-slate-300 dark:bg-white/10 rounded-full" />
        <div className="h-3 w-full bg-slate-200 dark:bg-white/5 rounded-full" />
        <div className="h-3 w-5/6 bg-slate-200 dark:bg-white/5 rounded-full" />
        <div className="h-8 w-full bg-slate-200 dark:bg-white/[0.04] rounded-xl mt-3" />
        <div className="h-3 w-2/3 bg-slate-200 dark:bg-white/5 rounded-full" />
        <div className="h-3 w-full bg-slate-200 dark:bg-white/5 rounded-full" />
        <div className="h-12 w-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-xl" />
        <div className="h-3 w-4/5 bg-slate-200 dark:bg-white/5 rounded-full" />
        <div className="h-3 w-full bg-slate-200 dark:bg-white/5 rounded-full" />
        <div className="h-3 w-1/2 bg-slate-200 dark:bg-white/5 rounded-full" />
      </div>

      {/* Scrollbar track */}
      <div
        className="relative flex-shrink-0 flex items-start transition-all duration-300"
        style={{
          width: `${width}px`,
          background: trackColor,
          borderRadius: `0 ${borderRadius}px ${borderRadius}px 0`,
        }}
      >
        {/* Scrollbar thumb */}
        <div
          className="absolute left-0 right-0 transition-all duration-300 hover:opacity-80 cursor-pointer"
          style={{
            top: "15%",
            height: `${thumbHeight}%`,
            background: thumbBg,
            borderRadius: `${borderRadius}px`,
            border: borderWidth > 0 ? `${borderWidth}px solid ${trackColor}` : "none",
          }}
        />
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Custom Scrollbar"
      description="Design high-fidelity custom scrollbars with gradient support and professional presets."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
