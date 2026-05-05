"use client";

import { useState, useMemo } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Zap, RefreshCcw, Sparkles, Activity, Palette, Move } from "lucide-react";

export function SvgShapeGenerator() {
  const [seed, setSeed] = useState(1);
  const [waviness, setWaviness] = useState(20);
  const [complexity, setComplexity] = useState(6);
  const [size, setSize] = useState(300);
  const [color, setColor] = useState("#8b5cf6");

  const pathData = useMemo(() => {
    const center = 150;
    const radius = 100;
    const points = [];
    const step = (Math.PI * 2) / complexity;

    for (let i = 0; i < complexity; i++) {
      const angle = i * step;
      // Simple pseudo-randomness based on seed and angle
      const offset = Math.sin(angle * 3 + seed) * waviness;
      const r = radius + offset;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      points.push({ x, y });
    }

    // Generate smooth cubic bezier path
    let d = `M${points[0].x},${points[0].y} `;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const p3 = points[(i + 2) % points.length];
      
      const cp1x = p1.x + (p2.x - points[(i - 1 + points.length) % points.length].x) * 0.2;
      const cp1y = p1.y + (p2.y - points[(i - 1 + points.length) % points.length].y) * 0.2;
      const cp2x = p2.x - (p3.x - p1.x) * 0.2;
      const cp2y = p2.y - (p3.y - p1.y) * 0.2;
      
      d += `C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
    }
    return d + "Z";
  }, [seed, waviness, complexity]);

  const svgCode = `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <path d="${pathData}" fill="${color}" />
</svg>`;

  const reset = () => {
    setSeed(1);
    setWaviness(20);
    setComplexity(6);
    setSize(300);
    setColor("#8b5cf6");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Waviness</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{waviness}</span>
        </div>
        <input 
          type="range" min={0} max={60} step={1}
          value={waviness} onChange={(e) => setWaviness(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Complexity</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{complexity}</span>
        </div>
        <input 
          type="range" min={3} max={12} step={1}
          value={complexity} onChange={(e) => setComplexity(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Size</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{size}px</span>
        </div>
        <input 
          type="range" min={100} max={450} step={1}
          value={size} onChange={(e) => setSize(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Fill Color</label>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
            <input 
              type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={() => setSeed(Math.random() * 100)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-accent transition-all active:scale-95 shadow-lg shadow-brand-primary/20"
      >
        <RefreshCcw className="w-4 h-4" />
        Regenerate Shape
      </button>
    </div>
  );

  const preview = (
    <div 
      className="flex items-center justify-center transition-all duration-700 ease-in-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg 
        viewBox="0 0 300 300" 
        className="w-full h-full drop-shadow-2xl"
        style={{ fill: color }}
      >
        <path d={pathData} className="transition-all duration-700 ease-in-out" />
      </svg>
    </div>
  );

  return (
    <GeneratorLayout
      title="SVG Shape Generator"
      description="Create unique organic SVG shapes with procedural generation for backgrounds and UI accents."
      controls={controls}
      preview={preview}
      cssCode={`.shape {\n  background-image: url("data:image/svg+xml,${encodeURIComponent(svgCode)}");\n}`}
      htmlCode={svgCode}
      onReset={reset}
    />
  );
}
