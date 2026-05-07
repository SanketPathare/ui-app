"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Scissors, Square, Circle, Layout, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function MaskGenerator() {
  const [maskType, setMaskType] = useState<"linear" | "radial" | "inset">("radial");
  const [percentage, setPercentage] = useState(50);
  const [blur, setBlur] = useState(10);

  const getMaskImage = () => {
    if (maskType === "linear") {
      return `linear-gradient(to bottom, black ${percentage}%, transparent ${percentage + blur}%)`;
    }
    if (maskType === "radial") {
      return `radial-gradient(circle, black ${percentage}%, transparent ${percentage + blur}%)`;
    }
    return `inset(${percentage / 4}% round 24px)`;
  };

  const maskImage = getMaskImage();
  const cssCode = `.masked-element {\n  ${maskType === "inset" ? `clip-path: ${maskImage};` : `mask-image: ${maskImage};\n  -webkit-mask-image: ${maskImage};`}\n}`;
  const tailwindCode = `<div class="${maskType === "inset" ? `clip-path-[${maskImage}]` : `mask-[${maskImage}]`}">...</div>`;
  const htmlCode = `<div style="${maskType === "inset" ? `clip-path: ${maskImage}` : `mask-image: ${maskImage}; -webkit-mask-image: ${maskImage}`}; width: 300px; height: 300px; background: url(...)"></div>`;

  const reset = () => {
    setMaskType("radial");
    setPercentage(50);
    setBlur(10);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Mask Archetype</label>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => setMaskType("linear")}
            className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border text-[9px] font-black uppercase transition-all", maskType === "linear" ? "bg-purple-500/10 border-purple-500 text-purple-500" : "bg-white/5 border-white/5 text-slate-500")}
          >
            <Layout className="w-4 h-4" />
            Linear
          </button>
          <button 
            onClick={() => setMaskType("radial")}
            className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border text-[9px] font-black uppercase transition-all", maskType === "radial" ? "bg-purple-500/10 border-purple-500 text-purple-500" : "bg-white/5 border-white/5 text-slate-500")}
          >
            <Circle className="w-4 h-4" />
            Radial
          </button>
          <button 
            onClick={() => setMaskType("inset")}
            className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border text-[9px] font-black uppercase transition-all", maskType === "inset" ? "bg-purple-500/10 border-purple-500 text-purple-500" : "bg-white/5 border-white/5 text-slate-500")}
          >
            <Square className="w-4 h-4" />
            Inset
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           {maskType === "inset" ? "Shrink Amount" : "Mask Size"} <span>{percentage}%</span>
        </label>
        <input 
          type="range" min="0" max="100" value={percentage} 
          onChange={(e) => setPercentage(parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      {maskType !== "inset" && (
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
             Feather Intensity <span>{blur}%</span>
          </label>
          <input 
            type="range" min="0" max="50" value={blur} 
            onChange={(e) => setBlur(parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      )}
    </div>
  );

  const preview = (
    <div className="w-full h-80 rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex items-center justify-center relative p-12">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
       
       <div className="relative w-full h-full max-w-[300px] max-h-[300px] group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl" />
          <div 
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center rounded-3xl transition-all duration-500 shadow-2xl"
            style={maskType === "inset" ? { clipPath: maskImage } : { 
              maskImage: maskImage,
              WebkitMaskImage: maskImage
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <Scissors className="w-12 h-12 text-white/20 animate-pulse" />
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Masking Engine"
      description="Create advanced clipping paths and non-destructive image masking effects."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
