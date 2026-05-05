"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Play, Pause, RefreshCcw, Sparkles, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

const presets = [
  {
    name: "Northern Lights",
    colors: ["#10b981", "#3b82f6", "#8b5cf6", "#06b6d4"],
    speed: 20,
    blur: 40,
    saturate: 150
  },
  {
    name: "Solar Flare",
    colors: ["#f59e0b", "#ef4444", "#ec4899", "#fbbf24"],
    speed: 15,
    blur: 50,
    saturate: 180
  },
  {
    name: "Midnight Ocean",
    colors: ["#1e3a8a", "#1e40af", "#3b82f6", "#0ea5e9"],
    speed: 25,
    blur: 60,
    saturate: 120
  },
  {
    name: "Cyberpunk",
    colors: ["#ff00ff", "#00ffff", "#8b5cf6", "#3b82f6"],
    speed: 12,
    blur: 35,
    saturate: 200
  }
];

export function AuroraGenerator() {
  const [colors, setColors] = useState(presets[0].colors);
  const [speed, setSpeed] = useState(presets[0].speed);
  const [blur, setBlur] = useState(presets[0].blur);
  const [saturate, setSaturate] = useState(presets[0].saturate);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasGrain, setHasGrain] = useState(true);
  const [hasGlass, setHasGlass] = useState(true);

  const setColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const applyPreset = (p: typeof presets[0]) => {
    setColors(p.colors);
    setSpeed(p.speed);
    setBlur(p.blur);
    setSaturate(p.saturate);
  };

  const cssCode = `@keyframes aurora {
  from { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  to { background-position: 0% 50%; }
}

.aurora-container {
  position: relative;
  overflow: hidden;
  background: #000;
}

.aurora-bg {
  position: absolute;
  inset: -50%;
  background-image: 
    radial-gradient(circle at 100% 100%, ${colors[0]}, transparent),
    radial-gradient(circle at 0% 0%, ${colors[1]}, transparent),
    radial-gradient(circle at 100% 0%, ${colors[2]}, transparent),
    radial-gradient(circle at 0% 100%, ${colors[3]}, transparent);
  background-size: 200% 200%;
  animation: aurora ${speed}s ease infinite;
  filter: blur(${blur}px) saturate(${saturate}%);
  opacity: 0.8;
}

${hasGrain ? `.aurora-grain {
  position: absolute;
  inset: 0;
  opacity: 0.2;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}` : ""}`;

  const tailwindCode = `<div class="relative overflow-hidden bg-black h-[400px]">
  <div class="absolute -inset-[50%] opacity-80 blur-[${blur}px] saturate-[${saturate}%] animate-aurora bg-[radial-gradient(circle_at_100%_100%,${colors[0]},transparent),radial-gradient(circle_at_0%_0%,${colors[1]},transparent),radial-gradient(circle_at_100%_0%,${colors[2]},transparent),radial-gradient(circle_at_0%_100%,${colors[3]},transparent)] bg-[length:200%_200%]"></div>
  ${hasGrain ? '<div class="absolute inset-0 opacity-20 bg-[url(\'data:image/svg+xml...\')]"></div>' : ''}
</div>`;

  const htmlCode = `<div class="aurora-container">
  <div class="aurora-bg"></div>
  ${hasGrain ? '<div class="aurora-grain"></div>' : ''}
</div>`;

  const reset = () => {
    applyPreset(presets[0]);
    setIsPlaying(true);
    setHasGrain(true);
    setHasGlass(true);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-brand-primary hover:border-brand-primary transition-all"
            >
              <Sparkles className="w-3 h-3" /> {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
        {colors.map((c, i) => (
          <div key={i} className="space-y-1.5">
            <input 
              type="color" 
              value={c} 
              onChange={(e) => setColor(i, e.target.value)} 
              className="w-full h-10 p-1 bg-transparent border border-slate-200 dark:border-white/5 rounded-lg cursor-pointer" 
            />
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
        {[
          { label: "Animation Speed", value: speed, setter: setSpeed, min: 5, max: 60, unit: "s", reverse: true },
          { label: "Blur Intensity", value: blur, setter: setBlur, min: 0, max: 100, unit: "px" },
          { label: "Color Saturation", value: saturate, setter: setSaturate, min: 0, max: 300, unit: "%" },
        ].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">{item.label}</label>
              <span className="text-[10px] font-bold text-brand-primary font-mono">{item.value}{item.unit}</span>
            </div>
            <input 
              type="range"
              value={item.reverse ? (65 - item.value) : item.value} 
              min={item.min} 
              max={item.max} 
              step={1} 
              onChange={(e) => item.setter(item.reverse ? (65 - parseInt(e.target.value)) : parseInt(e.target.value))} 
              className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
        <button
          onClick={() => setHasGrain(!hasGrain)}
          className={cn(
            "flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
            hasGrain 
              ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" 
              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500"
          )}
        >
          <Grid className="w-3.5 h-3.5" /> Grain
        </button>
        <button
          onClick={() => setHasGlass(!hasGlass)}
          className={cn(
            "flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
            hasGlass 
              ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" 
              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500"
          )}
        >
          <Play className="w-3.5 h-3.5" /> Glass
        </button>
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
    <div className="w-full h-[350px] md:w-[600px] md:h-[400px] rounded-[3rem] relative overflow-hidden shadow-2xl border border-white/10 group bg-black">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes aurora-preview {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
      <div 
        className="absolute inset-[-50%] transition-all duration-1000 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 100%, ${colors[0]}, transparent),
            radial-gradient(circle at 0% 0%, ${colors[1]}, transparent),
            radial-gradient(circle at 100% 0%, ${colors[2]}, transparent),
            radial-gradient(circle at 0% 100%, ${colors[3]}, transparent)
          `,
          backgroundSize: "200% 200%",
          animation: `aurora-preview ${speed}s ease infinite`,
          animationPlayState: isPlaying ? "running" : "paused",
          filter: `blur(${blur}px) saturate(${saturate}%)`,
        }}
      />
      
      {hasGrain && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      )}

      {hasGlass && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="w-full h-full rounded-[2rem] bg-white/5 backdrop-blur-[40px] border border-white/20 flex items-center justify-center text-white/40 font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl">
            Glass Interaction
          </div>
        </div>
      )}
      
      <div className="absolute top-6 left-6 flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
         <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Aurora Engine</span>
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
