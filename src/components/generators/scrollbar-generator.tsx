"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { SlidersHorizontal } from "lucide-react";

const presets = [
  { name: "Minimal", width: 6, radius: 999, thumb: "#525252", hover: "#737373", track: "#171717" },
  { name: "Pill", width: 10, radius: 999, thumb: "#a3a3a3", hover: "#fafafa", track: "#0a0a0a" },
  { name: "Sharp", width: 8, radius: 2, thumb: "#404040", hover: "#a3a3a3", track: "#0a0a0a" },
  { name: "Accent", width: 8, radius: 8, thumb: "#6366f1", hover: "#818cf8", track: "#1e1b4b" },
];

export function ScrollbarGenerator() {
  const [width, setWidth] = useState(8);
  const [radius, setRadius] = useState(999);
  const [thumbColor, setThumbColor] = useState("#525252");
  const [hoverColor, setHoverColor] = useState("#a3a3a3");
  const [trackColor, setTrackColor] = useState("#171717");

  const cssCode = `/* WebKit browsers (Chrome, Edge, Safari) */
::-webkit-scrollbar {
  width: ${width}px;
  height: ${width}px;
}

::-webkit-scrollbar-track {
  background: ${trackColor};
}

::-webkit-scrollbar-thumb {
  background: ${thumbColor};
  border-radius: ${radius}px;
}

::-webkit-scrollbar-thumb:hover {
  background: ${hoverColor};
}

/* Firefox */
* {
  scrollbar-width: ${width <= 8 ? "thin" : "auto"};
  scrollbar-color: ${thumbColor} ${trackColor};
}`;

  const tailwindCode = `[&::-webkit-scrollbar]:w-[${width}px] [&::-webkit-scrollbar-track]:bg-[${trackColor}] [&::-webkit-scrollbar-thumb]:bg-[${thumbColor}] [&::-webkit-scrollbar-thumb]:rounded-[${radius}px] [&::-webkit-scrollbar-thumb:hover]:bg-[${hoverColor}]`;

  const htmlCode = `<div class="custom-scroll" style="height: 240px; overflow-y: auto;">\n  <!-- Scrollable content -->\n</div>`;

  const reset = () => {
    setWidth(8);
    setRadius(999);
    setThumbColor("#525252");
    setHoverColor("#a3a3a3");
    setTrackColor("#171717");
  };

  const controls = (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Width</label>
          <span className="text-sm font-mono text-[var(--text-primary)]">{width}px</span>
        </div>
        <input
          type="range"
          min={4}
          max={20}
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value))}
          className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Thumb Radius</label>
          <span className="text-sm font-mono text-[var(--text-primary)]">{radius === 999 ? "full" : `${radius}px`}</span>
        </div>
        <input
          type="range"
          min={0}
          max={20}
          value={radius === 999 ? 20 : radius}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setRadius(val === 20 ? 999 : val);
          }}
          className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">
        {[
          { label: "Thumb", value: thumbColor, setter: setThumbColor },
          { label: "Hover", value: hoverColor, setter: setHoverColor },
          { label: "Track", value: trackColor, setter: setTrackColor },
        ].map((c) => (
          <label key={c.label} className="space-y-1.5 text-xs text-[var(--text-secondary)] block">
            <span>{c.label}</span>
            <input
              type="color"
              value={c.value}
              onChange={(e) => c.setter(e.target.value)}
              className="w-full h-8 rounded border border-[var(--border)] bg-transparent cursor-pointer"
            />
          </label>
        ))}
      </div>

      <div className="space-y-2.5 pt-3 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setWidth(p.width);
                setRadius(p.radius);
                setThumbColor(p.thumb);
                setHoverColor(p.hover);
                setTrackColor(p.track);
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
    <div className="w-full max-w-md">
      <style>{`
        .preview-custom-scroll::-webkit-scrollbar {
          width: ${width}px;
          height: ${width}px;
        }
        .preview-custom-scroll::-webkit-scrollbar-track {
          background: ${trackColor};
        }
        .preview-custom-scroll::-webkit-scrollbar-thumb {
          background: ${thumbColor};
          border-radius: ${radius}px;
        }
        .preview-custom-scroll::-webkit-scrollbar-thumb:hover {
          background: ${hoverColor};
        }
      `}</style>
      <div className="preview-custom-scroll h-64 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3 text-sm text-[var(--text-secondary)]">
        <p className="font-semibold text-[var(--text-primary)]">
          Scroll inside this container to preview your custom scrollbar
        </p>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-xs">
            Item #{i + 1} — Custom scrollbars keep dense panels, code editors, and sidebars clean across WebKit and Firefox.
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Scrollbar Studio"
      description="Customize cross-browser CSS scrollbars with live interactive preview."
      icon={<SlidersHorizontal className="w-5 h-5" />}
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
