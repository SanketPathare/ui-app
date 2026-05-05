"use client";

import { useState, useMemo } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Hexagon, RotateCw, Maximize2, Star, Disc } from "lucide-react";

export function PolygonGenerator() {
  const [sides, setSides] = useState(6);
  const [radius, setRadius] = useState(50);
  const [rotation, setRotation] = useState(0);
  const [isStar, setIsStar] = useState(false);
  const [inset, setInset] = useState(50);

  const points = useMemo(() => {
    const pts = [];
    const numPoints = isStar ? sides * 2 : sides;
    const center = 50;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 360) / numPoints + rotation;
      const rad = (angle * Math.PI) / 180;
      
      let r = radius;
      if (isStar && i % 2 !== 0) {
        r = (radius * inset) / 100;
      }

      const x = center + r * Math.cos(rad);
      const y = center + r * Math.sin(rad);
      pts.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }
    return pts;
  }, [sides, radius, rotation, isStar, inset]);

  const clipPathValue = `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(", ")})`;
  const cssCode = `clip-path: ${clipPathValue};`;
  const tailwindCode = `clip-[${clipPathValue}]`;
  const htmlCode = `<div style="clip-path: ${clipPathValue}; width: 300px; height: 300px; background: linear-gradient(135deg, #10b981, #3b82f6);"></div>`;

  const reset = () => {
    setSides(6);
    setRadius(50);
    setRotation(0);
    setIsStar(false);
    setInset(50);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Sides</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{sides}</span>
        </div>
        <input 
          type="range" min={3} max={20} step={1}
          value={sides} onChange={(e) => setSides(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Radius</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{radius}%</span>
        </div>
        <input 
          type="range" min={10} max={50} step={1}
          value={radius} onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Rotation</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{rotation}°</span>
        </div>
        <input 
          type="range" min={0} max={360} step={1}
          value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="pt-4 space-y-4 border-t border-white/5">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white">Star Mode</p>
              <p className="text-[9px] text-slate-500 font-medium tracking-tighter">Toggle between regular and star polygons.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsStar(!isStar)}
            className={`w-10 h-5 rounded-full transition-all relative ${isStar ? 'bg-brand-primary' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isStar ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {isStar && (
          <div className="space-y-4 px-2">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Star Inset</label>
              <span className="text-[10px] font-bold text-brand-primary font-mono">{inset}%</span>
            </div>
            <input 
              type="range" min={0} max={100} step={1}
              value={inset} onChange={(e) => setInset(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
        )}
      </div>
    </div>
  );

  const preview = (
    <div 
      className="w-64 h-64 bg-gradient-to-br from-emerald-400 to-blue-600 transition-all duration-300 shadow-2xl relative"
      style={{ clipPath: clipPathValue }}
    >
       <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  return (
    <GeneratorLayout
      title="Polygon Generator"
      description="Create mathematically perfect regular polygons and stars using CSS clip-path."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
