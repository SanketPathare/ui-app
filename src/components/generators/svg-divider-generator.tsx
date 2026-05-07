"use client";

import { useState, useMemo } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Spline, MoveVertical, Activity, Layers, Shuffle, Repeat } from "lucide-react";

type DividerType = "waves" | "steps" | "peaks" | "curve";

export function SvgDividerGenerator() {
  const [type, setType] = useState<DividerType>("waves");
  const [height, setHeight] = useState(100);
  const [frequency, setFrequency] = useState(3);
  const [color, setColor] = useState("#8b5cf6");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isInverted, setIsInverted] = useState(false);

  const pathData = useMemo(() => {
    const width = 1440;
    const h = height;
    const f = frequency;
    let path = "";

    if (type === "waves") {
      path = `M0,${h} `;
      for (let i = 0; i <= width; i += 10) {
        const y = h + Math.sin((i / width) * f * Math.PI * 2) * (h / 2);
        path += `L${i},${y} `;
      }
      path += `L${width},320 L0,320 Z`;
    } else if (type === "steps") {
      const stepWidth = width / f;
      path = `M0,${h} `;
      for (let i = 0; i < f; i++) {
        path += `L${i * stepWidth},${h} L${(i + 1) * stepWidth},${h} L${(i + 1) * stepWidth},${h + 40} `;
      }
      path += `L${width},320 L0,320 Z`;
    } else if (type === "peaks") {
      const peakWidth = width / f;
      path = `M0,320 `;
      for (let i = 0; i <= f; i++) {
        path += `L${i * peakWidth},${i % 2 === 0 ? 320 - h : 320} `;
      }
      path += `L${width},320 L0,320 Z`;
    } else if (type === "curve") {
      path = `M0,160 Q${width / 2},${160 - h * 2} ${width},160 L${width},320 L0,320 Z`;
    }

    return path;
  }, [type, height, frequency]);

  const svgCode = `<svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" style="transform: ${isFlipped ? 'scaleX(-1)' : ''} ${isInverted ? 'scaleY(-1)' : ''}">
  <path d="${pathData}" fill="${color}" />
</svg>`;

  const reset = () => {
    setType("waves");
    setHeight(100);
    setFrequency(3);
    setColor("#8b5cf6");
    setIsFlipped(false);
    setIsInverted(false);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Divider Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(["waves", "steps", "peaks", "curve"] as DividerType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all uppercase text-[10px] font-black tracking-widest ${
                type === t ? "bg-brand-primary/10 border-brand-primary text-brand-primary" : "bg-white/5 border-white/5 text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "waves" && <Activity className="w-4 h-4" />}
              {t === "steps" && <Layers className="w-4 h-4" />}
              {t === "peaks" && <Shuffle className="w-4 h-4" />}
              {t === "curve" && <Spline className="w-4 h-4" />}
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Height</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{height}px</span>
        </div>
        <input 
          type="range" min={20} max={200} step={1}
          value={height} onChange={(e) => setHeight(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Frequency</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{frequency}</span>
        </div>
        <input 
          type="range" min={1} max={10} step={1}
          value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Color</label>
          <input 
            type="color" value={color} onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
            isFlipped ? "bg-brand-primary/10 border-brand-primary text-brand-primary" : "bg-white/5 border-white/5 text-slate-500"
          }`}
        >
          <Repeat className="w-3.5 h-3.5" /> Flip
        </button>
        <button 
          onClick={() => setIsInverted(!isInverted)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
            isInverted ? "bg-brand-primary/10 border-brand-primary text-brand-primary" : "bg-white/5 border-white/5 text-slate-500"
          }`}
        >
          <MoveVertical className="w-3.5 h-3.5" /> Invert
        </button>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full max-w-[600px] h-[300px] bg-slate-900 rounded-[2.5rem] overflow-hidden relative border border-white/5 flex flex-col justify-end shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      <svg 
        viewBox="0 0 1440 320" 
        className="w-full h-full transition-all duration-700 ease-in-out"
        style={{ 
          transform: `${isFlipped ? 'scaleX(-1)' : ''} ${isInverted ? 'scaleY(-1)' : ''}`,
          fill: color 
        }}
        preserveAspectRatio="none"
      >
        <path d={pathData} />
      </svg>
    </div>
  );

  return (
    <GeneratorLayout
      title="SVG Divider Generator"
      description="Create beautiful, responsive SVG section dividers for your website layouts."
      controls={controls}
      preview={preview}
      cssCode={`.divider {\n  background-image: url("data:image/svg+xml,${encodeURIComponent(svgCode)}");\n}`}
      htmlCode={svgCode}
      onReset={reset}
    />
  );
}
