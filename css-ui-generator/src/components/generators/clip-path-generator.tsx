"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Scissors, Plus, Trash2, Maximize2, Move, Layout, Square, Hexagon, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

const PRESETS: Record<string, Point[]> = {
  Triangle: [{ x: 50, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
  Square: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
  Pentagon: [{ x: 50, y: 0 }, { x: 100, y: 38 }, { x: 82, y: 100 }, { x: 18, y: 100 }, { x: 0, y: 38 }],
  Hexagon: [{ x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 50 }, { x: 75, y: 100 }, { x: 25, y: 100 }, { x: 0, y: 50 }],
  Star: [{ x: 50, y: 0 }, { x: 63, y: 38 }, { x: 100, y: 35 }, { x: 71, y: 59 }, { x: 81, y: 100 }, { x: 50, y: 79 }, { x: 19, y: 100 }, { x: 29, y: 59 }, { x: 0, y: 35 }, { x: 37, y: 38 }],
  Message: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 75 }, { x: 75, y: 75 }, { x: 75, y: 100 }, { x: 50, y: 75 }, { x: 0, y: 75 }],
};

export function ClipPathGenerator() {
  const [points, setPoints] = useState<Point[]>(PRESETS.Pentagon);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (idx: number) => {
    setDraggingIdx(idx);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggingIdx === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100);
    const y = Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * 100), 100);

    const newPoints = [...points];
    newPoints[draggingIdx] = { x: Math.round(x), y: Math.round(y) };
    setPoints(newPoints);
  }, [draggingIdx, points]);

  const handleMouseUp = useCallback(() => {
    setDraggingIdx(null);
  }, []);

  useEffect(() => {
    if (draggingIdx !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingIdx, handleMouseMove, handleMouseUp]);

  const addPoint = () => {
    if (points.length >= 20) return;
    const p1 = points[points.length - 1];
    const p2 = points[0];
    setPoints([...points, { x: Math.round((p1.x + p2.x) / 2), y: Math.round((p1.y + p2.y) / 2) }]);
  };

  const removePoint = (idx: number) => {
    if (points.length <= 3) return;
    setPoints(points.filter((_, i) => i !== idx));
  };

  const clipPathValue = `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(", ")})`;
  const cssCode = `clip-path: ${clipPathValue};`;
  const tailwindCode = `clip-[${clipPathValue}]`;
  const htmlCode = `<div style="clip-path: ${clipPathValue}; width: 300px; height: 300px; background: linear-gradient(135deg, #6366f1, #a855f7);"></div>`;

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              onClick={() => setPoints(PRESETS[name])}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-primary/50 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                {name === "Square" && <Square className="w-4 h-4" />}
                {name === "Hexagon" && <Hexagon className="w-4 h-4" />}
                {name === "Star" && <Star className="w-4 h-4" />}
                {name === "Message" && <MessageSquare className="w-4 h-4" />}
                {name === "Triangle" && <Maximize2 className="w-4 h-4 rotate-45" />}
                {name === "Pentagon" && <Layout className="w-4 h-4" />}
              </div>
              <span className="text-[9px] font-bold text-slate-400 group-hover:text-white uppercase tracking-tighter">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Points ({points.length})</label>
          <button 
            onClick={addPoint}
            disabled={points.length >= 20}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/20 transition-all disabled:opacity-50"
          >
            <Plus className="w-3 h-3" /> Add Point
          </button>
        </div>
        <div className="grid grid-cols-1 gap-1 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
          {points.map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 group/point">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-white/5 text-[9px] font-bold text-slate-500">
                {i + 1}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-bold text-slate-500">X:</span>
                   <span className="text-[10px] font-mono text-brand-primary">{p.x}%</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-bold text-slate-500">Y:</span>
                   <span className="text-[10px] font-mono text-brand-primary">{p.y}%</span>
                </div>
              </div>
              <button 
                onClick={() => removePoint(i)}
                className="opacity-0 group-hover/point:opacity-100 p-1.5 rounded-md hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
        <p className="text-[10px] text-indigo-300 leading-relaxed font-medium">
          <Move className="w-3 h-3 inline mr-1 text-indigo-400" />
          Drag the points on the preview canvas to modify the shape in real-time.
        </p>
      </div>
    </div>
  );

  const preview = (
    <div className="relative w-full max-w-[400px] aspect-square">
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5"
      >
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-20 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/10" />
          ))}
        </div>

        <div 
          className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-accent to-brand-secondary transition-all duration-300 shadow-2xl"
          style={{ clipPath: clipPathValue }}
        />

        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          <polyline
            points={points.map(p => `${p.x}%,${p.y}%`).join(" ")}
            className="fill-none stroke-brand-primary/30 stroke-1"
            style={{ vectorEffect: "non-scaling-stroke" }}
          />
        </svg>

        {points.map((p, i) => (
          <div
            key={i}
            onMouseDown={() => handleMouseDown(i)}
            className={cn(
              "absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white cursor-move transition-transform active:scale-125 z-20",
              draggingIdx === i ? "bg-white scale-125 shadow-xl shadow-brand-primary/50" : "bg-brand-primary"
            )}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-20 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Clip-path Generator"
      description="Design custom clipping paths using SVG-like polygons with interactive point manipulation."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => setPoints(PRESETS.Pentagon)}
    />
  );
}
