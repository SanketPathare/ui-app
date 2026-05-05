"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

export function NoiseGenerator() {
  const [opacity, setOpacity] = useState(0.2);
  const [density, setDensity] = useState(0.5);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#6366f1");

  const svgFilter = `<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
  <filter id='noiseFilter'>
    <feTurbulence 
      type='fractalNoise' 
      baseFrequency='${density}' 
      numOctaves='3' 
      stitchTiles='stitch' />
  </filter>
  <rect width='100%' height='100%' filter='url(#noiseFilter)' />
</svg>`;

  const cssCode = `.noise-container {
  background-color: ${bgColor};
  position: relative;
}

.noise-container::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: ${opacity};
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${density}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  filter: contrast(150%) brightness(1000%);
}`;

  const reset = () => {
    setOpacity(0.2);
    setDensity(0.5);
    setColor("#000000");
    setBgColor("#6366f1");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Background Color</label>
          <input 
            type="color" 
            value={bgColor} 
            onChange={(e) => setBgColor(e.target.value)}
            className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Noise Density</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{density.toFixed(2)}</span>
        </div>
        <input 
          type="range"
          value={density * 100} 
          min={1} 
          max={100} 
          step={1} 
          onChange={(e) => setDensity(parseInt(e.target.value) / 100)} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Noise Opacity</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{Math.round(opacity * 100)}%</span>
        </div>
        <input 
          type="range"
          value={opacity * 100} 
          min={0} 
          max={100} 
          step={1} 
          onChange={(e) => setOpacity(parseInt(e.target.value) / 100)} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-2">
        <div className="flex items-center gap-2 mb-2">
           <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Implementation Tip</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          Use the <code>::after</code> pseudo-element approach for the best performance and control over the texture layering.
        </p>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="w-[300px] h-[300px] rounded-3xl relative overflow-hidden shadow-2xl border border-white/10"
      style={{ backgroundColor: bgColor }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: opacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${density}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          filter: "contrast(150%) brightness(1000%)"
        }}
      />
    </div>
  );

  return (
    <GeneratorLayout
      title="Noise Texture"
      description="Generate procedural grain and noise textures using SVG filters for a tactile organic feel."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      htmlCode={svgFilter}
      onReset={reset}
    />
  );
}
