"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

const presets = [
  { name: "Pill", tl: 999, tr: 999, br: 999, bl: 999 },
  { name: "Organic", tl: 60, tr: 30, br: 60, bl: 30 },
  { name: "Sharp", tl: 0, tr: 0, br: 0, bl: 0 },
  { name: "Card", tl: 24, tr: 24, br: 24, bl: 24 },
  { name: "Leaf", tl: 100, tr: 0, br: 100, bl: 0 },
];

export function BorderRadiusGenerator() {
  const [topLeft, setTopLeft] = useState(32);
  const [topRight, setTopRight] = useState(32);
  const [bottomRight, setBottomRight] = useState(32);
  const [bottomLeft, setBottomLeft] = useState(32);
  const [all, setAll] = useState(true);

  const updateAll = (val: number) => {
    setTopLeft(val);
    setTopRight(val);
    setBottomRight(val);
    setBottomLeft(val);
  };

  const applyPreset = (p: any) => {
    setTopLeft(p.tl);
    setTopRight(p.tr);
    setBottomRight(p.br);
    setBottomLeft(p.bl);
  };

  const borderRadius = `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  const cssCode = `border-radius: ${borderRadius};`;
  const tailwindCode = `rounded-[${borderRadius.replace(/ /g, "_")}]`;
  const htmlCode = `<div style="border-radius: ${borderRadius}; width: 200px; height: 200px; background: #10b981;"></div>`;

  const controls = (
    <div className="space-y-6">
      <button
        onClick={() => setAll(!all)}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest",
          all 
            ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-sm" 
            : "bg-white/5 border-white/10 text-slate-500"
        )}
      >
        Sync Corners
        <div className={cn(
          "w-8 h-4 rounded-full relative transition-colors",
          all ? "bg-brand-primary" : "bg-white/10"
        )}>
          <div className={cn(
            "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
            all ? "left-4.5" : "left-0.5"
          )} />
        </div>
      </button>

      <div className="space-y-5">
        {all ? (
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Uniform Radius</label>
              <span className="text-[10px] font-black text-brand-primary font-mono">{topLeft}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={topLeft}
              onChange={(e) => updateAll(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Top Left", value: topLeft, setter: setTopLeft },
              { label: "Top Right", value: topRight, setter: setTopRight },
              { label: "Bottom Right", value: bottomRight, setter: setBottomRight },
              { label: "Bottom Left", value: bottomLeft, setter: setBottomLeft },
            ].map((item) => (
              <div key={item.label} className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{item.label}</label>
                  <span className="text-[10px] font-black text-brand-primary font-mono">{item.value}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={item.value}
                  onChange={(e) => item.setter(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Geometry Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-tighter text-slate-500 hover:text-brand-primary hover:border-brand-primary transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_40px_80px_-15px_rgba(139,92,246,0.2)] transition-all duration-500"
      style={{ borderRadius }}
    />
  );

  return (
    <GeneratorLayout
      title="Border Radius"
      description="Craft organic shapes and modern UI primitives with variable corner rounding."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setTopLeft(32);
        setTopRight(32);
        setBottomRight(32);
        setBottomLeft(32);
        setAll(true);
      }}
    />
  );
}

