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
  const htmlCode = `<div class="element" style="opacity: ${opacity}; transition: opacity ${transitionTime}s ease;">\n  Content Here\n</div>`;

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Base Opacity</label>
            <span className="text-[10px] font-black text-brand-primary font-mono">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity * 100}
            onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
            className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Hover State</label>
            <span className="text-[10px] font-black text-brand-primary font-mono">{Math.round(hoverOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={hoverOpacity * 100}
            onChange={(e) => setHoverOpacity(parseInt(e.target.value) / 100)}
            className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Transition</label>
            <span className="text-[10px] font-black text-brand-primary font-mono">{transitionTime}s</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={transitionTime}
            onChange={(e) => setTransitionTime(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-white/5">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 block">Presets</label>
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
              className="px-2 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[9px] font-black uppercase tracking-tighter text-slate-500 hover:text-brand-primary transition-all"
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
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Hover to test transition</p>
      <div 
        className="w-40 h-40 md:w-56 md:h-56 bg-brand-primary rounded-3xl shadow-2xl flex items-center justify-center group cursor-pointer"
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
