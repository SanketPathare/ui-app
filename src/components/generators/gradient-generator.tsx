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
  const tailwindCode = `bg-[${cssValue.replace(/,\s+/g, ",").replace(/\s+/g, "_")}]`;
  const htmlCode = `<div style="background: ${cssValue}; width: 100%; height: 200px; border-radius: 24px;"></div>`;

  const activeColor = colors.find((c) => c.id === activeId);

  const controls = (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Engine Mode</label>
        <div className="flex gap-2 p-1 rounded-xl card">
          {(["linear", "radial"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                type === t 
                  ? "bg-[var(--text-primary)] text-[var(--bg)]" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
            <label className="text-sm font-medium text-[var(--text-secondary)]">Angle</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Color Matrix</label>
            <span className="text-[9px] text-[var(--text-secondary)] font-medium">Add up to 5 control points</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newColors = [...colors].reverse().map((c, i) => ({ ...c, stop: 100 - c.stop }));
                setColors(newColors);
              }}
              className="p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              title="Reverse Order"
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const randomHex = () => "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                setColors(colors.map(c => ({ ...c, color: randomHex() })));
              }}
              className="p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              title="Randomize Matrix"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={addColor}
              disabled={colors.length >= 5}
              className="p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {colors.map((c, index) => (
            <div key={c.id} className="group flex items-center gap-3 p-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] transition-all hover:border-[var(--border)]">
              <button
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "w-10 h-10 rounded-lg border-2 transition-all shrink-0 shadow-sm",
                  activeId === c.id ? "border-[var(--border-hover)] scale-105" : "border-transparent"
                )}
                style={{ backgroundColor: c.color }}
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-tighter">Stop {index + 1}</span>
                  <span className="text-[9px] font-mono font-bold text-[var(--text-primary)]">{c.stop}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={c.stop}
                  onChange={(e) => updateColor(c.id, { stop: parseInt(e.target.value) })}
                  className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
                />
              </div>
              {/* Hide delete icons for the first two colors */}
              {colors.length > 2 && index >= 2 && (
                <button
                  onClick={() => removeColor(c.id)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.colors)}
              className="px-2 py-2 rounded-lg card text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {activeColor && (
        <div className="pt-6 border-t border-[var(--border)] dark:border-[var(--border)] space-y-4">
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium text-[var(--text-secondary)]">Hex Code</label>
             <span className="text-[10px] font-mono font-black text-[var(--text-primary)] uppercase">
               {activeColor.color}
             </span>
          </div>
          <div className="rounded-[8px] overflow-hidden border border-[var(--border)] shadow-inner">
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
      className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-[12px] shadow-2xl transition-all duration-500"
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
        setActiveId(1);
        setAngle(135);
        setType("linear");
      }}
    />
  );
}

