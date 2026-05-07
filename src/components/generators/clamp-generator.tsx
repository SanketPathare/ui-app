"use client";

import { useState, useEffect } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Type, Smartphone, Tablet, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClampGenerator() {
  const [minSize, setMinSize] = useState(16);
  const [maxSize, setMaxSize] = useState(48);
  const [minViewport, setMinViewport] = useState(320);
  const [maxViewport, setMaxViewport] = useState(1280);
  const [unit, setUnit] = useState<"px" | "rem">("px");
  const [clampValue, setClampValue] = useState("");

  useEffect(() => {
    const minVal = unit === "rem" ? minSize : minSize / 16;
    const maxVal = unit === "rem" ? maxSize : maxSize / 16;
    const minVW = minViewport / 16;
    const maxVW = maxViewport / 16;

    const slope = (maxVal - minVal) / (maxVW - minVW);
    const yAxisIntersection = -minVW * slope + minVal;

    const preferredValue = `${yAxisIntersection.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw`;
    const clamp = `clamp(${minVal}rem, ${preferredValue}, ${maxVal}rem)`;
    setClampValue(clamp);
  }, [minSize, maxSize, minViewport, maxViewport, unit]);

  const cssCode = `.responsive-text {\n  font-size: ${clampValue};\n}`;
  const tailwindCode = `<p class="text-[${clampValue}]">Responsive Text</p>`;
  const htmlCode = `<p style="font-size: ${clampValue}">Fluid Typography</p>`;

  const reset = () => {
    setMinSize(16);
    setMaxSize(48);
    setMinViewport(320);
    setMaxViewport(1280);
    setUnit("px");
  };

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">Min Size ({unit})</label>
          <input 
            type="number" value={minSize} 
            onChange={(e) => setMinSize(parseFloat(e.target.value))}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">Max Size ({unit})</label>
          <input 
            type="number" value={maxSize} 
            onChange={(e) => setMaxSize(parseFloat(e.target.value))}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Min Viewport (px)</label>
          <input 
            type="number" value={minViewport} 
            onChange={(e) => setMinViewport(parseFloat(e.target.value))}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Max Viewport (px)</label>
          <input 
            type="number" value={maxViewport} 
            onChange={(e) => setMaxViewport(parseFloat(e.target.value))}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Unit Type</label>
        <div className="flex p-1 rounded-xl bg-white/5 border border-white/5">
          <button 
            onClick={() => setUnit("px")}
            className={cn("flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", unit === "px" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}
          >
            Pixels (px)
          </button>
          <button 
            onClick={() => setUnit("rem")}
            className={cn("flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", unit === "rem" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}
          >
            Relative (rem)
          </button>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-80 rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-8 relative">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
       
       <div className="text-center space-y-6">
          <p style={{ fontSize: clampValue }} className="font-black text-white leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Fluid Typography
          </p>
          <div className="flex gap-4 justify-center">
             <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 flex items-center gap-2">
                <Smartphone className="w-3 h-3 text-slate-500" />
                <span className="text-[9px] font-black text-slate-400">MIN: {minSize}{unit}</span>
             </div>
             <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 flex items-center gap-2">
                <Monitor className="w-3 h-3 text-slate-500" />
                <span className="text-[9px] font-black text-slate-400">MAX: {maxSize}{unit}</span>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="CSS Clamp Lab"
      description="Calculate mathematically perfect fluid typography that scales with the viewport."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
