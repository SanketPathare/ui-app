"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

export function OpacityGenerator() {
  const [opacity, setOpacity] = useState(0.5);
  const [hoverOpacity, setHoverOpacity] = useState(1);
  const [transitionTime, setTransitionTime] = useState(0.3);

  const cssCode = `.element {
  opacity: ${opacity};
  transition: opacity ${transitionTime}s ease;
}

.element:hover {
  opacity: ${hoverOpacity};
}`;

  const tailwindCode = `opacity-[${opacity}] hover:opacity-[${hoverOpacity}] transition-opacity duration-[${transitionTime * 1000}ms]`;
  const htmlCode = `<style>\n${cssCode}\n</style>\n<div class="element" style="width: 160px; height: 160px; background: #8b5cf6; border-radius: 12px;"></div>`;

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Base Opacity</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity * 100}
            onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Hover State</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{Math.round(hoverOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={hoverOpacity * 100}
            onChange={(e) => setHoverOpacity(parseInt(e.target.value) / 100)}
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Transition</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{transitionTime}s</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={transitionTime}
            onChange={(e) => setTransitionTime(parseFloat(e.target.value))}
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-4 block">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Ghost", b: 0.1, h: 0.4 },
            { name: "Muted", b: 0.4, h: 0.7 },
            { name: "Focus", b: 0.7, h: 1 },
            { name: "Reveal", b: 0, h: 1 },
          ].map((p) => (
            <button
              key={p.name}
              onClick={() => { setOpacity(p.b); setHoverOpacity(p.h); }}
              className="px-2 py-2 rounded-lg card text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-widest animate-pulse">Hover to test transition</p>
      <div 
        className="w-40 h-40 md:w-56 md:h-56 bg-violet-500 rounded-[12px] shadow-2xl flex items-center justify-center group cursor-pointer"
        style={{ 
          opacity: opacity,
          transition: `opacity ${transitionTime}s ease`,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = hoverOpacity.toString())}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = opacity.toString())}
      >
        <div className="w-12 h-12 bg-white rounded-full opacity-20" />
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Opacity Control"
      description="Master transparency and alpha channel transitions with precise interactive states."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setOpacity(0.5);
        setHoverOpacity(1);
        setTransitionTime(0.3);
      }}
    />
  );
}
