"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Play, RotateCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnimationGenerator() {
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [timing, setTiming] = useState("ease-in-out");
  const [iteration, setIteration] = useState("infinite");
  const [direction, setDirection] = useState("alternate");
  const [effect, setEffect] = useState("float");

  const cssCode = `.animate-${effect} {
  animation: ${effect} ${duration}s ${timing} ${delay}s ${iteration} ${direction};
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}`;

  const tailwindCode = `<div class="animate-[${effect}_${duration}s_${timing}_${delay}s_${iteration}_${direction}] bg-brand-primary w-24 h-24 rounded-2xl shadow-xl shadow-brand-primary/20"></div>`;

  const htmlCode = `<div class="animated-box"></div>

<style>
.animated-box {
  width: 100px;
  height: 100px;
  background: #8b5cf6;
  border-radius: 16px;
  animation: ${effect} ${duration}s ${timing} ${delay}s ${iteration} ${direction};
}

@keyframes ${effect} {
  /* Keyframes for ${effect} */
}
</style>`;

  const reset = () => {
    setDuration(1);
    setDelay(0);
    setTiming("ease-in-out");
    setIteration("infinite");
    setDirection("alternate");
    setEffect("float");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Effect</label>
          <div className="grid grid-cols-2 gap-2">
            {["float", "pulse", "spin", "bounce"].map((eff) => (
              <button
                key={eff}
                onClick={() => setEffect(eff)}
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
            max={5} 
            step={0.1} 
            onChange={(e) => setDuration(parseFloat(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Timing Function</label>
          <select 
            value={timing} 
            onChange={(e) => setTiming(e.target.value)}
            className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
          >
            {["linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-4">
           <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Iteration</span>
              <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                 {["1", "infinite"].map(v => (
                   <button 
                     key={v}
                     onClick={() => setIteration(v)}
                     className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all", iteration === v ? "bg-brand-primary text-white" : "text-slate-500")}
                   >
                     {v}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[300px] flex items-center justify-center rounded-[2rem] p-12">
      <div 
        className="w-24 h-24 rounded-3xl bg-brand-primary relative flex items-center justify-center overflow-hidden group shadow-2xl"
        style={{ 
          animationName: effect,
          animationDuration: `${duration}s`,
          animationTimingFunction: timing,
          animationDelay: `${delay}s`,
          animationIterationCount: iteration,
          animationDirection: direction,
          boxShadow: `0 20px 40px -12px #8b5cf660`
        }}
      >
         <Play className="w-8 h-8 text-white fill-white" />
         {/* Internal Glow */}
         <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
         <RotateCw className="w-3 h-3 text-brand-primary animate-spin" />
         <span className="text-[9px] font-black uppercase tracking-widest text-white">Previewing Motion</span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Animations"
      description="Create complex CSS animations with timing functions and delays."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
