"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Zap, Sparkles, Activity, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlowGenerator() {
  const [glowColor, setGlowColor] = useState("#8b5cf6");
  const [glowIntensity, setGlowIntensity] = useState(30);
  const [spread, setSpread] = useState(60);
  const [isAnimated, setIsAnimated] = useState(true);

  const cssCode = `.glow-effect {
  box-shadow: 0 0 ${glowIntensity}px ${spread}px ${glowColor}33;
  ${isAnimated ? 'animation: glow-pulse 2s infinite ease-in-out;' : ''}
}

@keyframes glow-pulse {
  0%, 100% { filter: drop-shadow(0 0 ${glowIntensity / 2}px ${glowColor}); }
  50% { filter: drop-shadow(0 0 ${glowIntensity}px ${glowColor}); }
}`;

  const tailwindCode = `<div className="shadow-[0_0_${glowIntensity}px_${spread}px_${glowColor}33] ${isAnimated ? 'animate-pulse' : ''}">
  {/* Content */}
</div>`;

  const htmlCode = `<div style="width: 128px; height: 128px; border-radius: 12px; background: #18181b; display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 ${glowIntensity}px ${spread}px ${glowColor}33; ${isAnimated ? 'animation: glow-pulse 2s infinite ease-in-out;' : ''}">
  Glow Box
</div>

<style>
  @keyframes glow-pulse {
    0%, 100% { filter: drop-shadow(0 0 ${glowIntensity / 2}px ${glowColor}); }
    50% { filter: drop-shadow(0 0 ${glowIntensity}px ${glowColor}); }
  }
</style>`;

  const reset = () => {
    setGlowColor("#8b5cf6");
    setGlowIntensity(30);
    setSpread(60);
    setIsAnimated(true);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Glow Color</label>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
           <input type="color" value={glowColor} onChange={(e) => setGlowColor(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
           <input type="text" value={glowColor} onChange={(e) => setGlowColor(e.target.value)} className="bg-transparent border-none text-xs font-mono text-[var(--text-primary)] w-full uppercase" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">
           Intensity <span>{glowIntensity}px</span>
        </label>
        <input 
          type="range" min="0" max="100" value={glowIntensity} 
          onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
          className="w-full accent-[var(--text-primary)]"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">
           Spread <span>{spread}px</span>
        </label>
        <input 
          type="range" min="0" max="150" value={spread} 
          onChange={(e) => setSpread(parseInt(e.target.value))}
          className="w-full accent-[var(--text-primary)]"
        />
      </div>

      <button 
        onClick={() => setIsAnimated(!isAnimated)}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
          isAnimated ? "bg-[var(--bg-card)] border-[var(--border-hover)] text-[var(--text-primary)]" : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)]"
        )}
      >
        <span className="text-sm font-medium">Pulse Animation</span>
        <Activity className={cn("w-4 h-4", isAnimated ? "animate-bounce" : "")} />
      </button>
    </div>
  );

  const preview = (
    <div className="relative group">
       <div 
         className={cn(
           "w-32 h-32 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border-hover)] flex items-center justify-center transition-all duration-500",
           isAnimated ? "animate-glow-pulse" : ""
         )}
         style={{ 
           boxShadow: `0 0 ${glowIntensity}px ${spread / 2}px ${glowColor}33`,
           filter: `drop-shadow(0 0 ${glowIntensity / 2}px ${glowColor})`
         }}
       >
          <Zap className="w-10 h-10 text-[var(--text-primary)]" />
       </div>
       <style jsx>{`
          @keyframes glow-pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          .animate-glow-pulse {
            animation: glow-pulse 2s infinite ease-in-out;
          }
       `}</style>
    </div>
  );

  return (
    <GeneratorLayout
      title="Glow Effect"
      description="Create atmospheric neon glows, ambient backlights, and pulsing aura effects for your UI elements."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
