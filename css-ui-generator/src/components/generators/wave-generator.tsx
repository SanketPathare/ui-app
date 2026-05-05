"use client";

import { useState, useCallback, useEffect } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { RefreshCcw, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function WaveGenerator() {
  const [wavesCount, setWavesCount] = useState(3);
  const [height, setHeight] = useState(100);
  const [color, setColor] = useState("#6366f1");
  const [opacity, setOpacity] = useState(1);
  const [isTop, setIsTop] = useState(false);
  const [seed, setSeed] = useState(1);

  const generateWavePath = useCallback(() => {
    const width = 1440;
    const segments = wavesCount + 1;
    const segmentWidth = width / segments;
    let path = `M 0 ${height} `;

    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      // Using a simple sine-like wave with randomness based on seed
      const y = height - (Math.sin(i + seed) * (height * 0.5) + (height * 0.5));
      
      const cp1x = x - segmentWidth / 2;
      const cp1y = y;
      const cp2x = x - segmentWidth / 2;
      const cp2y = height;
      
      if (i > 0) {
        path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y} `;
      }
    }

    path += `L ${width} ${isTop ? 0 : 320} L 0 ${isTop ? 0 : 320} Z`;
    return path;
  }, [wavesCount, height, isTop, seed]);

  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(generateWavePath());
  }, [generateWavePath]);

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
  <path fill="${color}" fill-opacity="${opacity}" d="${path}"></path>
</svg>`;

  const cssCode = `.wave-container {
  position: relative;
  width: 100%;
  height: ${height}px;
  background: ${color};
  /* Use the SVG as a mask or background */
}`;

  const reset = () => {
    setWavesCount(3);
    setHeight(100);
    setColor("#6366f1");
    setOpacity(1);
    setIsTop(false);
    setSeed(1);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Wave Color</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Waves Count</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{wavesCount}</span>
        </div>
        <input 
          type="range"
          value={wavesCount} 
          min={1} 
          max={10} 
          step={1} 
          onChange={(e) => setWavesCount(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Height</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{height}px</span>
        </div>
        <input 
          type="range"
          value={height} 
          min={20} 
          max={300} 
          step={1} 
          onChange={(e) => setHeight(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Opacity</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{Math.round(opacity * 100)}%</span>
        </div>
        <input 
          type="range"
          value={opacity * 100} 
          min={0} 
          max={100} 
          step={1} 
          onChange={(e) => setOpacity(parseInt(e.target.value) / 100)} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsTop(true)}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
              isTop 
                ? "bg-brand-primary border-brand-primary text-white" 
                : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-brand-primary/30"
            )}
          >
            <ArrowUp className="w-3 h-3" /> Top
          </button>
          <button
            onClick={() => setIsTop(false)}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
              !isTop 
                ? "bg-brand-primary border-brand-primary text-white" 
                : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-brand-primary/30"
            )}
          >
            <ArrowDown className="w-3 h-3" /> Bottom
          </button>
        </div>
      </div>

      <button
        onClick={() => setSeed(Math.random() * 100)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg"
      >
        <RefreshCcw className="w-4 h-4" />
        Randomize Wave
      </button>
    </div>
  );

  const preview = (
    <div className="w-full max-w-4xl aspect-[1440/320] bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-white/10">
      <svg 
        viewBox="0 0 1440 320" 
        className={cn(
          "absolute left-0 w-full transition-all duration-500",
          isTop ? "top-0" : "bottom-0"
        )}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fill={color} 
          fillOpacity={opacity} 
          d={path}
          className="transition-all duration-500"
        />
      </svg>
    </div>
  );

  return (
    <GeneratorLayout
      title="SVG Wave"
      description="Design smooth, organic SVG waves for section separators and header backgrounds."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      htmlCode={svgCode}
      onReset={reset}
    />
  );
}
