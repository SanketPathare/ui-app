"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Plus, Trash2, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeshPoint {
  id: string;
  color: string;
  x: number;
  y: number;
  size: number;
}

export function MeshGradientGenerator() {
  const [points, setPoints] = useState<MeshPoint[]>([
    { id: "1", color: "#6366f1", x: 20, y: 20, size: 50 },
    { id: "2", color: "#a855f7", x: 80, y: 30, size: 60 },
    { id: "3", color: "#ec4899", x: 40, y: 80, size: 55 },
    { id: "4", color: "#3b82f6", x: 70, y: 70, size: 45 },
  ]);
  const [baseColor, setBaseColor] = useState("#ffffff");

  const updatePoint = (id: string, updates: Partial<MeshPoint>) => {
    setPoints(points.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addPoint = () => {
    if (points.length >= 8) return;
    const newPoint: MeshPoint = {
      id: Math.random().toString(36).substr(2, 9),
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 40,
    };
    setPoints([...points, newPoint]);
  };

  const removePoint = (id: string) => {
    if (points.length <= 2) return;
    setPoints(points.filter(p => p.id !== id));
  };

  const getGradientString = () => {
    const gradients = points.map(p => 
      `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent 50%)`
    );
    return `${gradients.join(", ")}, ${baseColor}`;
  };

  const cssCode = `background-color: ${baseColor};
background-image: ${getGradientString()};`;

  const tailwindCode = `<div class="bg-[${baseColor}] bg-[${getGradientString().replace(/, /g, ",")}]"></div>`;

  const htmlCode = `<div class="mesh-gradient"></div>

<style>
.mesh-gradient {
  width: 100%;
  height: 400px;
  background-color: ${baseColor};
  background-image: ${getGradientString()};
}
</style>`;

  const reset = () => {
    setPoints([
      { id: "1", color: "#6366f1", x: 20, y: 20, size: 50 },
      { id: "2", color: "#a855f7", x: 80, y: 30, size: 60 },
      { id: "3", color: "#ec4899", x: 40, y: 80, size: 55 },
      { id: "4", color: "#3b82f6", x: 70, y: 70, size: 45 },
    ]);
    setBaseColor("#ffffff");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Base Background</label>
          <input 
            type="color" 
            value={baseColor} 
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Mesh Points ({points.length}/8)</label>
          <button 
            onClick={addPoint}
            disabled={points.length >= 8}
            className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {points.map((point, index) => (
            <div key={point.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-4 relative group">
              <button 
                onClick={() => removePoint(point.id)}
                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase">Point {index + 1}</span>
                <input 
                  type="color" 
                  value={point.color} 
                  onChange={(e) => updatePoint(point.id, { color: e.target.value })}
                  className="w-8 h-6 p-0 border-none bg-transparent cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                  <span>Position X</span>
                  <span className="font-mono">{point.x}%</span>
                </div>
                <input 
                  type="range"
                  value={point.x} 
                  min={0} 
                  max={100} 
                  step={1} 
                  onChange={(e) => updatePoint(point.id, { x: parseInt(e.target.value) })} 
                  className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                  <span>Position Y</span>
                  <span className="font-mono">{point.y}%</span>
                </div>
                <input 
                  type="range"
                  value={point.y} 
                  min={0} 
                  max={100} 
                  step={1} 
                  onChange={(e) => updatePoint(point.id, { y: parseInt(e.target.value) })} 
                  className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setPoints(points.map(p => ({
            ...p,
            x: Math.random() * 100,
            y: Math.random() * 100,
          })));
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg"
      >
        <RefreshCcw className="w-4 h-4" />
        Shuffle Positions
      </button>
    </div>
  );

  const preview = (
    <div 
      className="w-full h-full min-h-[350px] md:min-h-[400px] rounded-3xl transition-all duration-1000 ease-in-out shadow-2xl overflow-hidden relative"
      style={{
        backgroundColor: baseColor,
        backgroundImage: getGradientString(),
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[100px]" />
    </div>
  );

  return (
    <GeneratorLayout
      title="Mesh Gradient"
      description="Create beautiful, fluid gradients by layering multiple radial points."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
