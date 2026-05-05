"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Play, Pause, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuroraGenerator() {
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#8b5cf6");
  const [color3, setColor3] = useState("#10b981");
  const [color4, setColor4] = useState("#f59e0b");
  const [speed, setSpeed] = useState(20);
  const [isPlaying, setIsPlaying] = useState(true);

  const cssCode = `@keyframes aurora {
  from { background-position: 50% 50%, 50% 50%; }
  to { background-position: 350% 50%, 350% 50%; }
}

.aurora-bg {
  background-image: 
    radial-gradient(circle at 100% 100%, ${color1}, transparent),
    radial-gradient(circle at 0% 0%, ${color2}, transparent),
    radial-gradient(circle at 100% 0%, ${color3}, transparent),
    radial-gradient(circle at 0% 100%, ${color4}, transparent);
  background-size: 200% 200%;
  animation: aurora ${speed}s linear infinite;
  filter: blur(40px) saturate(150%);
}`;

  const tailwindCode = `<div class="bg-gradient-to-br from-[${color1}] via-[${color2}] to-[${color3}] animate-aurora"></div>`;
  const htmlCode = `<div class="aurora-bg"></div>`;

  const reset = () => {
    setColor1("#3b82f6");
    setColor2("#8b5cf6");
    setColor3("#10b981");
    setColor4("#f59e0b");
    setSpeed(20);
    setIsPlaying(true);
  };

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Color 1</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-slate-200 dark:border-white/5 rounded-lg cursor-pointer" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Color 2</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-slate-200 dark:border-white/5 rounded-lg cursor-pointer" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Color 3</label>
          <input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-slate-200 dark:border-white/5 rounded-lg cursor-pointer" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Color 4</label>
          <input type="color" value={color4} onChange={(e) => setColor4(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-slate-200 dark:border-white/5 rounded-lg cursor-pointer" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Animation Speed</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{speed}s</span>
        </div>
        <input 
          type="range"
          value={60 - speed} 
          min={1} 
          max={55} 
          step={1} 
          onChange={(e) => setSpeed(60 - parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg",
            isPlaying 
              ? "bg-slate-900 dark:bg-white/5 text-white" 
              : "bg-brand-primary text-white"
          )}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? "Pause" : "Resume"}
        </button>
        <button
          onClick={reset}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-brand-primary transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[350px] md:w-[600px] md:h-[400px] rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-white/10 group">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes aurora-preview {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 100%, ${color1}, transparent),
            radial-gradient(circle at 0% 0%, ${color2}, transparent),
            radial-gradient(circle at 100% 0%, ${color3}, transparent),
            radial-gradient(circle at 0% 100%, ${color4}, transparent)
          `,
          backgroundSize: "200% 200%",
          animation: `aurora-preview ${speed}s ease infinite`,
          animationPlayState: isPlaying ? "running" : "paused",
          filter: "blur(40px) saturate(150%)",
          transform: "scale(1.2)"
        }}
      />
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[20px]" />
      
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">
            Aurora Engine Active
         </div>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Aurora Background"
      description="Create mesmerizing, animated aurora borealis effects using layered mesh gradients."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
