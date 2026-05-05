"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

const presets = [
  { name: "Focus", w: 3, o: 4, color: "#8b5cf6", style: "solid" },
  { name: "Dash", w: 2, o: 2, color: "#cbd5e1", style: "dashed" },
  { name: "Thick", w: 8, o: 0, color: "#ec4899", style: "solid" },
  { name: "Gap", w: 2, o: 10, color: "#06b6d4", style: "double" },
];

export function OutlineGenerator() {
  const [width, setWidth] = useState(4);
  const [offset, setOffset] = useState(4);
  const [color, setColor] = useState("#8b5cf6");
  const [style, setStyle] = useState("solid");
  const [radius, setRadius] = useState(16);

  const applyPreset = (p: any) => {
    setWidth(p.w);
    setOffset(p.o);
    setColor(p.color);
    setStyle(p.style);
  };

  const cssCode = `outline: ${width}px ${style} ${color};\noutline-offset: ${offset}px;\nborder-radius: ${radius}px;`;
  const tailwindCode = `outline-[${width}px] outline-${style} outline-[${color}] outline-offset-[${offset}px] rounded-[${radius}px]`;
  const htmlCode = `<div style="${cssCode.replace(/\n/g, " ")} width: 200px; height: 200px; background: rgba(0,0,0,0.05);"></div>`;

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Width</label>
            <span className="text-[10px] font-black text-brand-primary font-mono">{width}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Offset</label>
            <span className="text-[10px] font-black text-brand-primary font-mono">{offset}px</span>
          </div>
          <input
            type="range"
            min="-20"
            max="40"
            value={offset}
            onChange={(e) => setOffset(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Rounding</label>
            <span className="text-[10px] font-black text-brand-primary font-mono">{radius}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Style</label>
        <div className="grid grid-cols-2 gap-2">
          {["solid", "dashed", "dotted", "double"].map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={cn(
                "px-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all",
                style === s 
                  ? "bg-brand-primary text-white shadow-lg" 
                  : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-brand-primary border border-slate-200 dark:border-white/5"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[9px] font-black uppercase tracking-tighter text-slate-500 hover:text-brand-primary hover:border-brand-primary transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-white/5">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 block">Outline Color</label>
        <div className="flex gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-8 rounded-lg overflow-hidden border-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="w-40 h-40 md:w-56 md:h-56 bg-slate-100 dark:bg-white/10 transition-all duration-300"
      style={{ 
        outline: `${width}px ${style} ${color}`,
        outlineOffset: `${offset}px`,
        borderRadius: `${radius}px`
      }}
    />
  );

  return (
    <GeneratorLayout
      title="Outline Engine"
      description="Design precise focus states and decorative boundaries with independent offset control."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setWidth(4);
        setOffset(4);
        setColor("#8b5cf6");
        setStyle("solid");
        setRadius(16);
      }}
    />
  );
}
