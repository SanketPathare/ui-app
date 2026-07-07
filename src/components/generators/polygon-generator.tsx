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
          <label className="text-sm font-medium text-[var(--text-secondary)]">Sides</label>
          <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{sides}</span>
        </div>
        <input 
          type="range" min={3} max={20} step={1}
          value={sides} onChange={(e) => setSides(parseInt(e.target.value))}
          className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Radius</label>
          <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{radius}%</span>
        </div>
        <input 
          type="range" min={10} max={50} step={1}
          value={radius} onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Rotation</label>
          <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{rotation}°</span>
        </div>
        <input 
          type="range" min={0} max={360} step={1}
          value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))}
          className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="pt-4 space-y-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between p-3 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-primary)]">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Star Mode</p>
              <p className="text-[9px] text-[var(--text-secondary)] font-medium tracking-tighter">Toggle between regular and star polygons.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsStar(!isStar)}
            className={`w-10 h-5 rounded-full transition-all relative ${isStar ? 'bg-brand-primary' : 'bg-[var(--bg-active)]'}`}
          >
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isStar ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {isStar && (
          <div className="space-y-4 px-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Star Inset</label>
              <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{inset}%</span>
            </div>
            <input 
              type="range" min={0} max={100} step={1}
              value={inset} onChange={(e) => setInset(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
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
       <div className="absolute inset-0 bg-[var(--bg-hover)] backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
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
