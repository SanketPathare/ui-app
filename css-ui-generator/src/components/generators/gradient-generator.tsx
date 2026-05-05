"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { HexColorPicker } from "react-colorful";
import { Trash2, Plus, MoveHorizontal, RotateCcw, Palette as PaletteIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const presets = [
  { name: "Twilight", colors: [{ id: 1, color: "#4f46e5", stop: 0 }, { id: 2, color: "#7c3aed", stop: 50 }, { id: 3, color: "#db2777", stop: 100 }] },
  { name: "Ocean", colors: [{ id: 1, color: "#0891b2", stop: 0 }, { id: 2, color: "#06b6d4", stop: 100 }] },
  { name: "Sunset", colors: [{ id: 1, color: "#ea580c", stop: 0 }, { id: 2, color: "#d946ef", stop: 100 }] },
  { name: "Emerald", colors: [{ id: 1, color: "#059669", stop: 0 }, { id: 2, color: "#10b981", stop: 100 }] },
  { name: "Borealis", colors: [{ id: 1, color: "#1e1b4b", stop: 0 }, { id: 2, color: "#10b981", stop: 50 }, { id: 3, color: "#3b82f6", stop: 100 }] },
  { name: "Midnight", colors: [{ id: 1, color: "#0f172a", stop: 0 }, { id: 2, color: "#334155", stop: 100 }] },
];

export function GradientGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [colors, setColors] = useState([
    { id: 1, color: "#8b5cf6", stop: 0 },
    { id: 2, color: "#ec4899", stop: 100 },
  ]);
  const [activeId, setActiveId] = useState<number | null>(1);

  const addColor = () => {
    if (colors.length >= 5) return;
    const newId = colors.length > 0 ? Math.max(...colors.map((c) => c.id)) + 1 : 1;
    setColors([...colors, { id: newId, color: "#06b6d4", stop: 50 }]);
    setActiveId(newId);
  };

  const removeColor = (id: number) => {
    if (colors.length <= 2) return;
    setColors(colors.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(colors[0].id);
  };

  const updateColor = (id: number, updates: any) => {
    setColors(colors.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const applyPreset = (presetColors: any[]) => {
    setColors(presetColors.map((c, i) => ({ ...c, id: i + 1 })));
    setActiveId(1);
  };

  const sortedColors = [...colors].sort((a, b) => a.stop - b.stop);
  const colorString = sortedColors
    .map((c) => `${c.color} ${c.stop}%`)
    .join(", ");
  
  const cssValue = type === "linear" 
    ? `linear-gradient(${angle}deg, ${colorString})`
    : `radial-gradient(circle, ${colorString})`;

  const cssCode = `background: ${cssValue};`;
  const tailwindCode = `bg-[${cssValue}]`;
  const htmlCode = `<div style="background: ${cssValue}; width: 100%; height: 200px; border-radius: 24px;"></div>`;

  const activeColor = colors.find((c) => c.id === activeId);

  const controls = (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Engine Mode</label>
        <div className="flex gap-2 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
          {(["linear", "radial"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                type === t 
                  ? "bg-white dark:bg-brand-primary text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {type === "linear" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Angle</label>
            <span className="text-[10px] font-black text-brand-primary font-mono">{angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Color Matrix</label>
            <span className="text-[9px] text-slate-400 font-medium">Add up to 5 control points</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newColors = [...colors].reverse().map((c, i) => ({ ...c, stop: 100 - c.stop }));
                setColors(newColors);
              }}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-brand-primary transition-all"
              title="Reverse Order"
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const randomHex = () => "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                setColors(colors.map(c => ({ ...c, color: randomHex() })));
              }}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-brand-primary transition-all"
              title="Randomize Matrix"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={addColor}
              disabled={colors.length >= 5}
              className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {colors.map((c, index) => (
            <div key={c.id} className="group flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 transition-all hover:border-brand-primary/20">
              <button
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "w-10 h-10 rounded-lg border-2 transition-all shrink-0 shadow-sm",
                  activeId === c.id ? "border-brand-primary scale-105" : "border-transparent"
                )}
                style={{ backgroundColor: c.color }}
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Stop {index + 1}</span>
                  <span className="text-[9px] font-mono font-bold text-brand-primary">{c.stop}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={c.stop}
                  onChange={(e) => updateColor(c.id, { stop: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
              {/* Hide delete icons for the first two colors */}
              {colors.length > 2 && index >= 2 && (
                <button
                  onClick={() => removeColor(c.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.colors)}
              className="px-2 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[9px] font-black uppercase tracking-tighter text-slate-500 hover:text-brand-primary hover:border-brand-primary transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {activeColor && (
        <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
          <div className="flex justify-between items-center">
             <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Hex Code</label>
             <span className="text-[10px] font-mono font-black text-brand-primary uppercase">
               {activeColor.color}
             </span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner">
            <HexColorPicker
              color={activeColor.color}
              onChange={(color) => updateColor(activeColor.id, { color })}
              className="!w-full !h-32"
            />
          </div>
        </div>
      )}
    </div>
  );

  const preview = (
    <div 
      className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-[2.5rem] shadow-2xl transition-all duration-500"
      style={{ background: cssValue }}
    />
  );

  return (
    <GeneratorLayout
      title="Gradients"
      description="Design multi-point linear and radial gradients with mathematical precision."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setColors([
          { id: 1, color: "#8b5cf6", stop: 0 },
          { id: 2, color: "#ec4899", stop: 100 },
        ]);
        setAngle(135);
        setType("linear");
      }}
    />
  );
}

