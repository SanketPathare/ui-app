"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlexboxGenerator() {
  const [itemCount, setItemCount] = useState(3);
  const [flexDirection, setFlexDirection] = useState<"row" | "row-reverse" | "column" | "column-reverse">("row");
  const [justifyContent, setJustifyContent] = useState("center");
  const [alignItems, setAlignItems] = useState("center");
  const [gap, setGap] = useState(16);
  const [flexWrap, setFlexWrap] = useState("wrap");

  const items = Array.from({ length: itemCount });

  const cssCode = `.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
  width: 100%;
  min-height: 400px;
}

.flex-item {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 8px;
  padding: 20px 40px;
  color: #06b6d4;
  font-family: monospace;
}`;

  const tailwindCode = `<div class="flex flex-${flexDirection} justify-${justifyContent.replace("flex-", "")} items-${alignItems.replace("flex-", "")} flex-${flexWrap} gap-[${gap}px] w-full min-h-[400px]">
  ${items.map((_, i) => `<div class="bg-brand-secondary/10 border border-brand-secondary/20 rounded-lg p-6 text-brand-secondary font-mono">${i + 1}</div>`).join("\n  ")}
</div>`;

  const htmlCode = `<div class="flex-container">
  ${items.map((_, i) => `<div class="flex-item">${i + 1}</div>`).join("\n  ")}
</div>

<style>
.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}
.flex-item {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 8px;
  padding: 20px 40px;
  color: #06b6d4;
}
</style>`;

  const reset = () => {
    setItemCount(3);
    setFlexDirection("row");
    setJustifyContent("center");
    setAlignItems("center");
    setGap(16);
    setFlexWrap("wrap");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Items</label>
            <span className="text-[10px] font-bold text-brand-secondary font-mono">{itemCount}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setItemCount(Math.max(1, itemCount - 1))}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Minus className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <input 
              type="range"
              value={itemCount} 
              min={1} 
              max={20} 
              step={1} 
              onChange={(e) => setItemCount(parseInt(e.target.value))} 
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-secondary"
            />
            <button 
              onClick={() => setItemCount(Math.min(20, itemCount + 1))}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Direction</label>
          <div className="grid grid-cols-2 gap-2">
            {["row", "row-reverse", "column", "column-reverse"].map((dir) => (
              <button
                key={dir}
                onClick={() => setFlexDirection(dir as any)}
                className={cn(
                  "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                  flexDirection === dir 
                    ? "bg-brand-secondary/20 border-brand-secondary/50 text-brand-secondary shadow-lg shadow-brand-secondary/10" 
                    : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                )}
              >
                {dir.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Justify Content</label>
          <select 
            value={justifyContent} 
            onChange={(e) => setJustifyContent(e.target.value)}
            className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 transition-all"
          >
            {["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Align Items</label>
          <select 
            value={alignItems} 
            onChange={(e) => setAlignItems(e.target.value)}
            className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 transition-all"
          >
            {["flex-start", "flex-end", "center", "baseline", "stretch"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Gap</label>
            <span className="text-[10px] font-bold text-brand-secondary font-mono">{gap}px</span>
          </div>
          <input 
            type="range"
            value={gap} 
            min={0} 
            max={100} 
            step={1} 
            onChange={(e) => setGap(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-secondary"
          />
        </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="flex w-full min-h-[300px] border border-dashed border-white/10 rounded-2xl p-4 transition-all duration-500"
      style={{
        flexDirection,
        justifyContent,
        alignItems,
        flexWrap: flexWrap as any,
        gap: `${gap}px`,
      }}
    >
      {items.map((_, i) => (
        <div 
          key={i}
          className="bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl px-6 py-4 flex items-center justify-center font-mono text-xs text-brand-secondary shadow-lg shadow-brand-secondary/5 group-hover:scale-105 transition-all"
        >
          {i + 1}
        </div>
      ))}
    </div>
  );

  return (
    <GeneratorLayout
      title="Flexbox Lab"
      description="Master one-dimensional layouts with flexible alignment and spacing."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
