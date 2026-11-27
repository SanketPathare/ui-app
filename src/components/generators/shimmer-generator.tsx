"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Activity, Sparkles, Layout, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShimmerGenerator() {
  const [speed, setSpeed] = useState(2);
  const [baseColor, setBaseColor] = useState("#1e293b");
  const [highlightColor, setHighlightColor] = useState("#334155");
  const [angle, setAngle] = useState(90);

  const cssCode = `.shimmer {
  background: linear-gradient(${angle}deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%);
  background-size: 200% 100%;
  animation: shimmer ${speed}s infinite linear;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`;

  const tailwindCode = `<>
  <style>{\`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }\`}</style>
  <div
    className="h-32 w-full rounded-xl"
    style={{
      background: "linear-gradient(${angle}deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer ${speed}s infinite linear",
    }}
  />
</>`;

  const htmlCode = `<div class="skeleton-box" style="
  width: 100%;
  height: 200px;
  background: linear-gradient(${angle}deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%);
  background-size: 200% 100%;
  animation: shimmer-animation ${speed}s infinite linear;
  border-radius: 12px;
"></div>

<style>
  @keyframes shimmer-animation {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>`;

  const reset = () => {
    setSpeed(2);
    setBaseColor("#1e293b");
    setHighlightColor("#334155");
    setAngle(90);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">
           Shimmer Speed <span>{speed}s</span>
        </label>
        <input 
          type="range" min="0.5" max="5" step="0.1" value={speed} 
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full accent-[var(--text-primary)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Base Color</label>
          <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Highlight</label>
          <input type="color" value={highlightColor} onChange={(e) => setHighlightColor(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">
           Gradient Angle <span>{angle}°</span>
        </label>
        <input 
          type="range" min="0" max="360" value={angle} 
          onChange={(e) => setAngle(parseInt(e.target.value))}
          className="w-full accent-[var(--text-primary)]"
        />
      </div>
    </div>
  );

  const preview = (
    <div className="w-64 space-y-4">
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden relative">
             <div 
               className="absolute inset-0"
               style={{ 
                 background: `linear-gradient(${angle}deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%)`,
                 backgroundSize: '400% 100%',
                 animation: `shimmer ${speed}s infinite linear`
               }}
             />
          </div>
          <div className="flex-1 space-y-2">
             <div 
               className="h-3 w-3/4 rounded-full overflow-hidden relative"
               style={{ backgroundColor: baseColor }}
             >
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: `linear-gradient(${angle}deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%)`,
                    backgroundSize: '400% 100%',
                    animation: `shimmer ${speed}s infinite linear`
                  }}
                />
             </div>
             <div 
               className="h-2 w-1/2 rounded-full overflow-hidden relative"
               style={{ backgroundColor: baseColor }}
             >
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: `linear-gradient(${angle}deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%)`,
                    backgroundSize: '400% 100%',
                    animation: `shimmer ${speed}s infinite linear`
                  }}
                />
             </div>
          </div>
       </div>
       <div 
         className="h-32 w-full rounded-[8px] overflow-hidden relative"
         style={{ backgroundColor: baseColor }}
       >
          <div 
            className="absolute inset-0"
            style={{ 
              background: `linear-gradient(${angle}deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%)`,
              backgroundSize: '400% 100%',
              animation: `shimmer ${speed}s infinite linear`
            }}
          />
       </div>
       <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
       `}</style>
    </div>
  );

  return (
    <GeneratorLayout
      title="Shimmer Effect"
      description="Create professional skeletal loading states and glossy shimmer animations for your UI components."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
