"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { 
  Scissors, 
  Plus, 
  Trash2, 
  Maximize2, 
  Move, 
  Layout, 
  Square, 
  Hexagon, 
  Star, 
  MessageSquare,
  Image as ImageIcon,
  Palette,
  RotateCw,
  Layers
} from "lucide-react";
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
  Arrow: [{ x: 0, y: 20 }, { x: 60, y: 20 }, { x: 60, y: 0 }, { x: 100, y: 50 }, { x: 60, y: 100 }, { x: 60, y: 80 }, { x: 0, y: 80 }],
  Diamond: [{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }],
};

export function ClipPathGenerator() {
  const [points, setPoints] = useState<Point[]>(PRESETS.Pentagon);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [bgType, setBgType] = useState<"gradient" | "image" | "solid">("gradient");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
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
    const last = points[points.length - 1];
    const first = points[0];
    setPoints([...points, { x: Math.round((last.x + first.x) / 2), y: Math.round((last.y + first.y) / 2) }]);
  };

  const removePoint = (idx: number) => {
    if (points.length <= 3) return;
    setPoints(points.filter((_, i) => i !== idx));
  };

  const clipPathValue = `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(", ")})`;
  const cssCode = `clip-path: ${clipPathValue};`;
  const tailwindCode = `clip-[${clipPathValue}]`;
  const htmlCode = `<div style="clip-path: ${clipPathValue}; width: 300px; height: 300px; background: ${bgType === 'gradient' ? `linear-gradient(135deg, ${accentColor}, #22d3ee)` : accentColor};"></div>`;

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Presets</label>
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              onClick={() => setPoints(PRESETS[name])}
              className="flex flex-col items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all group"
            >
              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bg-card)] group-hover:bg-[var(--bg-hover)] group-hover:text-[var(--text-primary)] transition-colors">
                {name === "Square" && <Square className="w-3.5 h-3.5" />}
                {name === "Hexagon" && <Hexagon className="w-3.5 h-3.5" />}
                {name === "Star" && <Star className="w-3.5 h-3.5" />}
                {name === "Message" && <MessageSquare className="w-3.5 h-3.5" />}
                {name === "Triangle" && <Maximize2 className="w-3.5 h-3.5 rotate-45" />}
                {name === "Pentagon" && <Layout className="w-3.5 h-3.5" />}
                {name === "Arrow" && <Move className="w-3.5 h-3.5" />}
                {name === "Diamond" && <RotateCw className="w-3.5 h-3.5 rotate-45" />}
              </div>
              <span className="text-[8px] font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] uppercase tracking-tighter">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Visuals</label>
        <div className="flex gap-2 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          {(["gradient", "solid", "image"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setBgType(type)}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize",
                bgType === type ? "bg-[var(--text-primary)] text-[var(--bg)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-2">
          <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Accent Color</span>
          <input 
            type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
            className="w-10 h-6 p-0 border-none bg-transparent cursor-pointer rounded overflow-hidden"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Nodes ({points.length})</label>
          <button 
            onClick={addPoint}
            disabled={points.length >= 20}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-medium hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all disabled:opacity-30"
          >
            <Plus className="w-3 h-3" /> Add Node
          </button>
        </div>
        <div className="grid grid-cols-1 gap-1 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
          {points.map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] group/node">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-[var(--bg-hover)] text-[8px] font-bold text-[var(--text-secondary)]">
                {i + 1}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2 text-[9px] font-mono text-[var(--text-secondary)]">
                <span>X:{p.x}</span>
                <span>Y:{p.y}</span>
              </div>
              <button 
                onClick={() => removePoint(i)}
                className="opacity-0 group-hover/node:opacity-100 p-1 rounded-md hover:bg-rose-500/10 hover:text-rose-500 text-[var(--text-secondary)] transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="relative w-[240px] h-[240px] md:w-[320px] md:h-[320px]">
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-[var(--bg)] rounded-[12px] overflow-hidden border border-[var(--border)] shadow-2xl"
      >
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-[0.05] pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[var(--border)]" />
          ))}
        </div>

        <div 
          className={cn(
            "absolute inset-0 transition-all duration-500",
            bgType === "gradient" ? "bg-gradient-to-br from-brand-primary to-brand-secondary" : 
            bgType === "solid" ? "bg-brand-primary" : "bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"
          )}
          style={{ 
            clipPath: clipPathValue,
            backgroundColor: bgType === "solid" ? accentColor : undefined,
            backgroundImage: bgType === "gradient" ? `linear-gradient(135deg, ${accentColor}, #22d3ee)` : undefined
          }}
        />

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          <polyline
            points={points.map(p => `${p.x},${p.y}`).join(" ")}
            className="fill-none stroke-white/10 stroke-[0.5]"
            style={{ vectorEffect: "non-scaling-stroke" }}
          />
        </svg>

        {points.map((p, i) => (
          <div
            key={i}
            onMouseDown={() => handleMouseDown(i)}
            className={cn(
              "absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 cursor-move transition-all active:scale-125 z-20 flex items-center justify-center shadow-lg",
              draggingIdx === i ? "bg-white border-[var(--border-hover)] scale-125" : "bg-[var(--bg-active)] border-[var(--border-hover)]"
            )}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
             <div className="w-1 h-1 rounded-full bg-[var(--bg-active)]" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Clip-path Generator"
      description="Design custom clipping paths using SVG-like polygons with interactive manipulation."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => setPoints(PRESETS.Pentagon)}
    />
  );
}
