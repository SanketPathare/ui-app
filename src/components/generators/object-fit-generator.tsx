"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Image as ImageIcon, Maximize, Minimize, Move, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export function ObjectFitGenerator() {
  const [fit, setFit] = useState<"cover" | "contain" | "fill" | "scale-down" | "none">("cover");
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);

  const cssCode = `.media-element {\n  object-fit: ${fit};\n  object-position: ${positionX}% ${positionY}%;\n  width: 100%;\n  height: 100%;\n}`;
  const tailwindCode = `<img class="object-${fit} object-[${positionX}%_${positionY}%] w-full h-full" src="..." />`;
  const htmlCode = `<img src="..." style="object-fit: ${fit}; object-position: ${positionX}% ${positionY}%; width: 100%; height: 100%;">`;

  const reset = () => {
    setFit("cover");
    setPositionX(50);
    setPositionY(50);
  };

  const FITS = [
    { id: "cover", name: "Cover", desc: "Fill & Crop", icon: <Maximize className="w-4 h-4" /> },
    { id: "contain", name: "Contain", desc: "Letterbox", icon: <Minimize className="w-4 h-4" /> },
    { id: "fill", name: "Fill", desc: "Stretch", icon: <Square className="w-4 h-4" /> },
    { id: "scale-down", name: "Scale Down", desc: "Smallest", icon: <Move className="w-4 h-4" /> },
    { id: "none", name: "None", desc: "Original", icon: <ImageIcon className="w-4 h-4" /> },
  ];

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Fit Strategy</label>
        <div className="grid grid-cols-1 gap-2">
          {FITS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFit(f.id as any)}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                fit === f.id 
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/10" 
                  : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                 <div className={cn("p-2 rounded-lg transition-colors", fit === f.id ? "bg-emerald-500 text-white" : "bg-white/5 group-hover:bg-white/10")}>
                    {f.icon}
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">{f.name}</p>
                    <p className="text-[9px] font-bold opacity-60">{f.desc}</p>
                 </div>
              </div>
              {fit === f.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t border-white/5 pt-6">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Object Position</label>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
               <span>Horizontal</span>
               <span className="text-emerald-500">{positionX}%</span>
            </div>
            <input type="range" min="0" max="100" value={positionX} onChange={(e) => setPositionX(parseInt(e.target.value))} className="w-full accent-emerald-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
               <span>Vertical</span>
               <span className="text-emerald-500">{positionY}%</span>
            </div>
            <input type="range" min="0" max="100" value={positionY} onChange={(e) => setPositionY(parseInt(e.target.value))} className="w-full accent-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-96 rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex flex-col relative">
       <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20" />
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
          </div>
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Media Container (4:3)</span>
          <div className="w-10" />
       </div>
       
       <div className="flex-1 p-8">
          <div className="w-full h-full border-2 border-dashed border-white/5 rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
             <img 
               src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" 
               alt="Object Fit Test"
               className="w-full h-full transition-all duration-500"
               style={{ 
                 objectFit: fit,
                 objectPosition: `${positionX}% ${positionY}%`
               }}
             />
          </div>
       </div>

       <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest">
          {fit} / {positionX}% {positionY}%
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Object-Fit Lab"
      description="Precisely control how your media scales and aligns within its parent container."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
