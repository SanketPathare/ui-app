"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

const presets = [
  { name: "Frost", blur: 16, op: 0.1, sat: 180, edge: 0.2 },
  { name: "Clear", blur: 4, op: 0.05, sat: 100, edge: 0.1 },
  { name: "Heavy", blur: 32, op: 0.3, sat: 120, edge: 0.4 },
  { name: "Neon", blur: 12, op: 0.1, sat: 200, edge: 0.5, color: "#8b5cf6" },
];

export function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(0.1);
  const [saturation, setSaturation] = useState(180);
  const [borderColor, setBorderColor] = useState(0.2);
  const [color, setColor] = useState("#ffffff");

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  const applyPreset = (p: any) => {
    setBlur(p.blur);
    setOpacity(p.op);
    setSaturation(p.sat);
    setBorderColor(p.edge);
    if (p.color) setColor(p.color);
  };

  const rgb = hexToRgb(color);
  
  const cssCode = `background: rgba(${rgb}, ${opacity});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: 1px solid rgba(${rgb}, ${borderColor});
border-radius: 24px;`;

  const tailwindCode = `bg-[rgba(${rgb.replace(/ /g, "")},${opacity})] backdrop-blur-[${blur}px] backdrop-saturate-[${saturation}%] border-[1px] border-[rgba(${rgb.replace(/ /g, "")},${borderColor})] rounded-[24px]`;
  const htmlCode = `<div style="${cssCode.replace(/\n/g, " ")} width: 100%; height: 200px;"></div>`;

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        {[
          { label: "Blur Diffusion", value: blur, setter: setBlur, min: 0, max: 40, unit: "px" },
          { label: "Transparency", value: Math.round(opacity * 100), setter: (v: number) => setOpacity(v / 100), min: 0, max: 100, unit: "%" },
          { label: "Saturation", value: saturation, setter: setSaturation, min: 0, max: 200, unit: "%" },
          { label: "Edge Strength", value: Math.round(borderColor * 100), setter: (v: number) => setBorderColor(v / 100), min: 0, max: 100, unit: "%" },
        ].map((item) => (
          <div key={item.label} className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{item.label}</label>
              <span className="text-[10px] font-black text-brand-primary font-mono">{item.value}{item.unit}</span>
            </div>
            <input
              type="range"
              min={item.min}
              max={item.max}
              value={item.value}
              onChange={(e) => item.setter(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-white/10">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Visual Presets</label>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-tighter text-slate-500 hover:text-brand-primary hover:border-brand-primary transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 space-y-3">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Glass Tint</label>
        <div className="flex gap-3">
          {["#ffffff", "#000000", "#8b5cf6", "#06b6d4"].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-8 h-8 rounded-lg border-2 transition-all",
                color === c ? "border-brand-primary scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="w-8 h-8 rounded-lg border border-white/10 relative overflow-hidden">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 w-full h-full scale-150 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background shapes for glass effect */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-primary rounded-full filter blur-[40px] opacity-40 animate-float" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-brand-secondary rounded-full filter blur-[30px] opacity-30 animate-float" style={{ animationDelay: '2s' }} />
      
      <div 
        className="w-48 h-32 md:w-64 md:h-40 lg:w-80 lg:h-48 transition-all duration-500 z-10 shadow-2xl"
        style={{ 
          background: `rgba(${rgb}, ${opacity})`,
          backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
          border: `1px solid rgba(${rgb}, ${borderColor})`,
          borderRadius: '24px'
        }}
      />
    </div>
  );

  return (
    <GeneratorLayout
      title="Glass UI"
      description="The definitive frosted glass effect with high-definition filter controls."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setBlur(16);
        setOpacity(0.1);
        setSaturation(180);
        setBorderColor(0.2);
        setColor("#ffffff");
      }}
    />
  );
}

