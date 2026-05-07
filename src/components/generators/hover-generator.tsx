"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { MousePointer2, Sparkles, MoveUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HoverGenerator() {
  const [duration, setDuration] = useState(0.3);
  const [scale, setScale] = useState(1.05);
  const [rotate, setRotate] = useState(0);
  const [yOffset, setYOffset] = useState(-8);
  const [shadowOpacity, setShadowOpacity] = useState(20);
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [effect, setEffect] = useState<"lift" | "glow" | "border" | "fill">("lift");

  const cssCode = `.hover-card {
  transition: all ${duration}s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
}

.hover-card:hover {
  ${effect === 'lift' ? `
  transform: translateY(${yOffset}px) scale(${scale}) rotate(${rotate}deg);
  box-shadow: 0 20px 40px ${accentColor}${shadowOpacity};
  border-color: ${accentColor}40;` : 
  effect === 'glow' ? `
  box-shadow: 0 0 30px ${accentColor}60;
  border-color: ${accentColor};
  background: ${accentColor}10;` :
  effect === 'border' ? `
  border-color: ${accentColor};
  box-shadow: inset 0 0 0 2px ${accentColor};` :
  `background: ${accentColor};
  color: white;`}
}`;

  const tailwindCode = `<div class="transition-all duration-${duration*1000} ease-out ${effect === 'lift' ? `hover:-translate-y-[${Math.abs(yOffset)}px] hover:scale-[${scale}]` : ""} hover:shadow-2xl hover:shadow-[${accentColor}]/${shadowOpacity} p-8 bg-white/5 border border-white/10 rounded-2xl">
  Hover Content
</div>`;

  const htmlCode = `<div class="card">Hover me</div>

<style>
.card {
  padding: 2rem;
  background: #1e293b;
  border-radius: 12px;
  transition: ${duration}s;
  cursor: pointer;
}
.card:hover {
  transform: translateY(${yOffset}px);
  box-shadow: 0 10px 20px ${accentColor}40;
}
</style>`;

  const reset = () => {
    setDuration(0.3);
    setScale(1.05);
    setRotate(0);
    setYOffset(-8);
    setShadowOpacity(20);
    setAccentColor("#8b5cf6");
    setEffect("lift");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Interaction Type</label>
          <div className="grid grid-cols-2 gap-2">
            {["lift", "glow", "border", "fill"].map((eff) => (
              <button
                key={eff}
                onClick={() => setEffect(eff as any)}
                className={cn(
                  "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                  effect === eff 
                    ? "bg-brand-primary/20 border-brand-primary/50 text-brand-primary shadow-lg shadow-brand-primary/10" 
                    : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                )}
              >
                {eff}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Duration (s)</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{duration}s</span>
          </div>
          <input 
            type="range"
            value={duration} 
            min={0.1} 
            max={1} 
            step={0.05} 
            onChange={(e) => setDuration(parseFloat(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        {effect === 'lift' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Scale Factor</label>
                <span className="text-[10px] font-bold text-brand-primary font-mono">{scale}x</span>
              </div>
              <input 
                type="range"
                value={scale} 
                min={0.8} 
                max={1.5} 
                step={0.01} 
                onChange={(e) => setScale(parseFloat(e.target.value))} 
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Y Offset (px)</label>
                <span className="text-[10px] font-bold text-brand-primary font-mono">{yOffset}px</span>
              </div>
              <input 
                type="range"
                value={yOffset} 
                min={-50} 
                max={50} 
                step={1} 
                onChange={(e) => setYOffset(parseInt(e.target.value))} 
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
              />
            </div>
          </>
        )}

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
    <div className="w-full h-[400px] flex items-center justify-center rounded-[2rem] p-12 overflow-hidden">
      <div 
        className="group relative cursor-pointer"
      >
        <div 
          className="w-64 h-48 rounded-3xl flex flex-col items-center justify-center p-8 transition-all ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
          style={{ 
            transitionDuration: `${duration}s`,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transform: 'translateY(0) scale(1) rotate(0deg)'
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            if (effect === 'lift') {
              el.style.transform = `translateY(${yOffset}px) scale(${scale}) rotate(${rotate}deg)`;
              el.style.boxShadow = `0 25px 50px -12px ${accentColor}${shadowOpacity}`;
              el.style.borderColor = `${accentColor}40`;
            } else if (effect === 'glow') {
              el.style.boxShadow = `0 0 30px ${accentColor}60`;
              el.style.borderColor = accentColor;
              el.style.background = `${accentColor}10`;
            } else if (effect === 'border') {
              el.style.borderColor = accentColor;
              el.style.boxShadow = `inset 0 0 0 2px ${accentColor}`;
            } else {
              el.style.background = accentColor;
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            el.style.boxShadow = 'none';
            el.style.background = 'rgba(255, 255, 255, 0.03)';
            el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 transition-all group-hover:scale-110">
             <MousePointer2 className="w-6 h-6 text-white/40" />
          </div>
          <p className="text-sm font-black text-white/60 tracking-widest uppercase">Hover Me</p>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <MoveUpRight className="w-4 h-4 text-white/20" />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
         <Sparkles className="w-3 h-3 text-brand-primary" />
         <span className="text-[9px] font-black uppercase tracking-widest text-white">Focus for transition states</span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Hover Lab"
      description="Design premium hover effects, transitions, and button interactions."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
