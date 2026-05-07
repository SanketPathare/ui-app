"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SpinnerGenerator() {
  const [size, setSize] = useState(48);
  const [thickness, setThickness] = useState(4);
  const [speed, setSpeed] = useState(1);
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [type, setType] = useState<"classic" | "dots" | "dual" | "ring">("classic");

  const cssCode = `.spinner {
  width: ${size}px;
  height: ${size}px;
  border: ${thickness}px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${accentColor};
  border-radius: 50%;
  animation: spin ${speed}s linear infinite;
  ${type === 'dual' ? `border-bottom-color: ${accentColor};` : ""}
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

${type === 'dots' ? `
.dots { display: flex; gap: 8px; }
.dot {
  width: ${size/4}px;
  height: ${size/4}px;
  background: ${accentColor};
  border-radius: 50%;
  animation: bounce ${speed}s infinite alternate;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  to { transform: translateY(-20px); opacity: 0.5; }
}` : ""}`;

  const tailwindCode = `<div class="w-${size/4} h-${size/4} border-${thickness} border-white/10 border-t-[${accentColor}] rounded-full animate-spin ${type === 'dual' ? `border-b-[${accentColor}]` : ""}"></div>`;

  const htmlCode = `<div class="spinner"></div>

<style>
.spinner {
  width: ${size}px;
  height: ${size}px;
  border: ${thickness}px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${accentColor};
  border-radius: 50%;
  animation: spin ${speed}s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>`;

  const reset = () => {
    setSize(48);
    setThickness(4);
    setSpeed(1);
    setAccentColor("#8b5cf6");
    setType("classic");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Spinner Type</label>
          <div className="grid grid-cols-2 gap-2">
            {["classic", "dots", "dual", "ring"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t as any)}
                className={cn(
                  "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                  type === t 
                    ? "bg-brand-primary/20 border-brand-primary/50 text-brand-primary shadow-lg shadow-brand-primary/10" 
                    : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Size</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{size}px</span>
          </div>
          <input 
            type="range"
            value={size} 
            min={24} 
            max={120} 
            step={2} 
            onChange={(e) => setSize(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Thickness</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{thickness}px</span>
          </div>
          <input 
            type="range"
            value={thickness} 
            min={1} 
            max={12} 
            step={1} 
            onChange={(e) => setThickness(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Speed (s/rot)</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{speed}s</span>
          </div>
          <input 
            type="range"
            value={speed} 
            min={0.2} 
            max={3} 
            step={0.1} 
            onChange={(e) => setSpeed(parseFloat(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Accent Color</label>
          <div className="flex gap-2">
            {["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"].map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform",
                  accentColor === color ? "scale-125 border-white" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[300px] flex items-center justify-center rounded-[2rem] p-12">
       {type === 'dots' ? (
         <div className="flex gap-3">
            {[1,2,3].map(i => (
              <div 
                key={i}
                className="rounded-full animate-bounce"
                style={{ 
                  width: `${size/4}px`, 
                  height: `${size/4}px`, 
                  backgroundColor: accentColor,
                  animationDuration: `${speed}s`,
                  animationDelay: `${i * 0.15}s`,
                  boxShadow: `0 0 20px ${accentColor}40`
                }}
              />
            ))}
         </div>
       ) : (
         <div 
           className="rounded-full border-white/10 animate-spin"
           style={{ 
             width: `${size}px`, 
             height: `${size}px`, 
             borderWidth: `${thickness}px`,
             borderStyle: 'solid',
             borderTopColor: accentColor,
             borderBottomColor: type === 'dual' ? accentColor : 'rgba(255,255,255,0.1)',
             animationDuration: `${speed}s`,
             boxShadow: type === 'ring' ? `0 0 30px ${accentColor}20` : 'none'
           }}
         />
       )}
       
       <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
          <RefreshCw className="w-3 h-3 text-brand-primary animate-spin" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white">Live Render</span>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Spinners"
      description="Build modern loading indicators and animated SVG spinners."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
