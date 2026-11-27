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

  const keyframeMap: Record<string, string> = {
    float: `@keyframes float {\n  0%, 100% { transform: translateY(0px); }\n  50% { transform: translateY(-20px); }\n}`,
    pulse: `@keyframes pulse {\n  0%, 100% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(1.1); opacity: 0.7; }\n}`,
    spin: `@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}`,
    bounce: `@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-30px); }\n}`,
  };

  const tailwindCode = `<>
  <style>{\`${keyframeMap[effect] || ""}\`}</style>
  <div
    className="w-24 h-24 rounded-[8px] bg-violet-500"
    style={{ animation: "${effect} ${duration}s ${timing} ${delay}s ${iteration} ${direction}" }}
  />
</>`;

  const htmlCode = `<div class="animated-box"></div>

<style>
.animated-box {
  width: 100px;
  height: 100px;
  background: #8b5cf6;
  border-radius: 16px;
  animation: ${effect} ${duration}s ${timing} ${delay}s ${iteration} ${direction};
}

${keyframeMap[effect] || ""}
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
          <label className="text-sm font-medium text-[var(--text-secondary)]">Effect</label>
          <div className="grid grid-cols-2 gap-2">
            {["float", "pulse", "spin", "bounce"].map((eff) => (
              <button
                key={eff}
                onClick={() => setEffect(eff)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                  effect === eff 
                    ? "bg-[var(--bg-active)] border-[var(--border-hover)] text-[var(--text-primary)] " 
                    : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {eff}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Duration (s)</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{duration}s</span>
          </div>
          <input 
            type="range"
            value={duration} 
            min={0.1} 
            max={5} 
            step={0.1} 
            onChange={(e) => setDuration(parseFloat(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Timing Function</label>
          <select 
            value={timing} 
            onChange={(e) => setTiming(e.target.value)}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[11px] font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/30 transition-all"
          >
            {["linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-[var(--border)] space-y-4">
           <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Iteration</span>
              <div className="flex bg-[var(--bg-card)] rounded-lg p-1 border border-[var(--border)]">
                 {["1", "infinite"].map(v => (
                   <button 
                     key={v}
                     onClick={() => setIteration(v)}
                     className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all", iteration === v ? "bg-[var(--text-primary)] text-[var(--bg)]" : "text-[var(--text-secondary)]")}
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
    <div className="w-full h-[300px] flex items-center justify-center rounded-[12px] p-12">
      <div 
        className="w-24 h-24 rounded-[12px] bg-violet-500 relative flex items-center justify-center overflow-hidden group shadow-2xl"
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
         <div className="absolute inset-0 bg-[var(--bg-active)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
         <RotateCw className="w-3 h-3 text-[var(--text-primary)] animate-spin" />
         <span className="text-xs font-medium text-white">Previewing Motion</span>
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
