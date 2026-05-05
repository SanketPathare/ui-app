"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { 
  Activity, 
  Plus, 
  Trash2, 
  Move, 
  Zap, 
  RefreshCcw, 
  Waves, 
  CircleDot, 
  Variable, 
  Palette,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

const PRESETS: Record<string, Point[]> = {
  "S-Curve": [{ x: 10, y: 90 }, { x: 30, y: 10 }, { x: 70, y: 90 }, { x: 90, y: 10 }],
  "Wave": [{ x: 0, y: 50 }, { x: 25, y: 10 }, { x: 50, y: 50 }, { x: 75, y: 90 }, { x: 100, y: 50 }],
  "Loop": [{ x: 20, y: 80 }, { x: 80, y: 20 }, { x: 80, y: 80 }, { x: 20, y: 20 }],
  "Arc": [{ x: 10, y: 80 }, { x: 50, y: 10 }, { x: 90, y: 80 }],
};

export function CurveShapeGenerator() {
  const [points, setPoints] = useState<Point[]>(PRESETS["Arc"]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState("#8b5cf6");
  const [dashArray, setDashArray] = useState("0");
  const [fillEnabled, setFillEnabled] = useState(false);
  const [fillColor, setFillColor] = useState("#8b5cf633");
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

  const pathData = useMemo(() => {
    if (points.length < 2) return "";
    let d = `M${points[0].x},${points[0].y} `;
    
    if (points.length === 2) {
      d += `L${points[1].x},${points[1].y}`;
    } else {
      d += `Q${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`;
      for (let i = 3; i < points.length; i++) {
        d += ` T${points[i].x},${points[i].y}`;
      }
    }
    return fillEnabled ? d + " Z" : d;
  }, [points, fillEnabled]);

  const svgCode = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path 
    d="${pathData}" 
    fill="${fillEnabled ? fillColor : 'none'}" 
    stroke="${strokeColor}" 
    stroke-width="${strokeWidth}" 
    stroke-dasharray="${dashArray === '0' ? '' : dashArray}"
    stroke-linecap="round"
  />
</svg>`;

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              onClick={() => setPoints(PRESETS[name])}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-primary/50 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                {name === "Wave" && <Waves className="w-4 h-4" />}
                {name === "Loop" && <RefreshCcw className="w-4 h-4" />}
                {name === "S-Curve" && <Activity className="w-4 h-4" />}
                {name === "Arc" && <CircleDot className="w-4 h-4" />}
              </div>
              <span className="text-[9px] font-bold text-slate-400 group-hover:text-white uppercase tracking-tighter">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stroke Width</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{strokeWidth}px</span>
        </div>
        <input 
          type="range" min={1} max={10} step={0.5}
          value={strokeWidth} onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stroke Style</label>
        <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/5">
          {[
            { label: "Solid", value: "0" },
            { label: "Dashed", value: "8 4" },
            { label: "Dotted", value: "2 4" }
          ].map((style) => (
            <button
              key={style.label}
              onClick={() => setDashArray(style.value)}
              className={cn(
                "flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                dashArray === style.value ? "bg-brand-primary text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fill Shape</label>
           <button 
             onClick={() => setFillEnabled(!fillEnabled)}
             className={`w-10 h-5 rounded-full transition-all relative ${fillEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
           >
             <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${fillEnabled ? 'left-6' : 'left-1'}`} />
           </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Stroke</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)}
                className="w-full h-8 p-0 border-none bg-transparent cursor-pointer rounded-lg overflow-hidden"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Fill</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" value={fillColor.substring(0, 7)} onChange={(e) => setFillColor(e.target.value + "33")}
                disabled={!fillEnabled}
                className="w-full h-8 p-0 border-none bg-transparent cursor-pointer rounded-lg overflow-hidden disabled:opacity-20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nodes ({points.length})</label>
          <button 
            onClick={() => setPoints([...points, { x: 50, y: 50 }])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-[9px] font-black uppercase tracking-widest hover:bg-brand-primary/10 hover:text-brand-primary transition-all"
          >
            <Plus className="w-3 h-3" /> Add Node
          </button>
        </div>
        <div className="grid grid-cols-1 gap-1 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
          {points.map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 group/node">
              <div className={cn(
                "w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold transition-colors",
                i === 0 ? "bg-emerald-500 text-white" : i === points.length - 1 ? "bg-rose-500 text-white" : "bg-white/10 text-slate-500"
              )}>
                {i === 0 ? "S" : i === points.length - 1 ? "E" : i}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-500">
                <span>X:{p.x}</span>
                <span>Y:{p.y}</span>
              </div>
              {points.length > 2 && (
                <button 
                  onClick={() => setPoints(points.filter((_, idx) => idx !== i))}
                  className="opacity-0 group-hover/node:opacity-100 p-1 rounded-md hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl"
      >
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-[0.05] pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/10" />
          ))}
        </div>

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          <path
            d={pathData}
            fill={fillEnabled ? fillColor : "none"}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray === "0" ? "" : dashArray}
            className="transition-all duration-300"
            style={{ vectorEffect: "non-scaling-stroke", strokeLinecap: "round" }}
          />
          {points.length > 2 && (
            <polyline 
              points={points.map(p => `${p.x},${p.y}`).join(" ")}
              className="fill-none stroke-white/10 stroke-[0.5]"
              style={{ vectorEffect: "non-scaling-stroke", strokeDasharray: "2 2" }}
            />
          )}
        </svg>

        {points.map((p, i) => (
          <div
            key={i}
            onMouseDown={() => handleMouseDown(i)}
            className={cn(
              "absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 cursor-move transition-all active:scale-125 z-20 flex items-center justify-center shadow-lg",
              draggingIdx === i ? "bg-white border-brand-primary scale-125" : 
              i === 0 ? "bg-emerald-500 border-white/50" : 
              i === points.length - 1 ? "bg-rose-500 border-white/50" : 
              "bg-slate-700 border-white/20"
            )}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
             <div className="w-1 h-1 rounded-full bg-white/20" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Curve Shape Generator"
      description="Design smooth Bézier curves and organic fluid shapes with advanced stroke and fill controls."
      controls={controls}
      preview={preview}
      cssCode={`.curve-shape {\n  mask-image: url("data:image/svg+xml,${encodeURIComponent(svgCode)}");\n}`}
      htmlCode={svgCode}
      onReset={() => setPoints(PRESETS["Arc"])}
    />
  );
}
