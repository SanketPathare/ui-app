"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Maximize, Smartphone, Tablet, Monitor, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export function AspectRatioGenerator() {
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [preset, setPreset] = useState("16/9");

  const PRESETS = [
    { name: "16:9", value: "16/9", w: 16, h: 9 },
    { name: "4:3", value: "4/3", w: 4, h: 3 },
    { name: "1:1", value: "1/1", w: 1, h: 1 },
    { name: "21:9", value: "21/9", w: 21, h: 9 },
    { name: "9:16", value: "9/16", w: 9, h: 16 },
  ];

  const cssCode = `.aspect-box {\n  aspect-ratio: ${ratioW} / ${ratioH};\n  width: 100%;\n  object-fit: cover;\n}`;
  const tailwindCode = `<div class="aspect-[${ratioW}/${ratioH}] w-full"></div>`;
  const htmlCode = `<div style="aspect-ratio: ${ratioW} / ${ratioH}; width: 100%; background: #333;"></div>`;

  const reset = () => {
    setRatioW(16);
    setRatioH(9);
    setPreset("16/9");
  };

  const handlePreset = (p: any) => {
    setPreset(p.value);
    setRatioW(p.w);
    setRatioH(p.h);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Popular Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePreset(p)}
              className={cn(
                "py-2 rounded-xl border text-[10px] font-black transition-all",
                preset === p.value 
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/10" 
                  : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Width Ratio</label>
          <input 
            type="number" value={ratioW} 
            onChange={(e) => {
              setRatioW(parseFloat(e.target.value));
              setPreset("custom");
            }}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Height Ratio</label>
          <input 
            type="number" value={ratioH} 
            onChange={(e) => {
              setRatioH(parseFloat(e.target.value));
              setPreset("custom");
            }}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white"
          />
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-80 rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex items-center justify-center p-12 relative">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
       
       <div 
         className="w-full max-w-[400px] max-h-[240px] bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-500 border border-white/10 overflow-hidden group"
         style={{ aspectRatio: `${ratioW} / ${ratioH}` }}
       >
          <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-500">
             <Maximize className="w-8 h-8 text-white/40" />
             <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{ratioW}:{ratioH}</span>
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Aspect Ratio Engine"
      description="Define precise proportions for your UI elements and media containers."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
