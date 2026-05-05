"use client";

import { useState, useCallback, useEffect } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { RefreshCcw, ArrowDown, ArrowUp, Zap, ZapOff, Layers as LayersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function WaveGenerator() {
  const [wavesCount, setWavesCount] = useState(4);
  const [height, setHeight] = useState(120);
  const [color, setColor] = useState("#6366f1");
  const [color2, setColor2] = useState("#a855f7");
  const [opacity, setOpacity] = useState(1);
  const [isTop, setIsTop] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [hasSecondLayer, setHasSecondLayer] = useState(true);
  const [seed, setSeed] = useState(1);
  const [complexity, setComplexity] = useState(0.5); // 0 to 1

  const generateWavePath = useCallback((offset = 0) => {
    const width = 1440;
    const canvasHeight = 320;
    const segments = wavesCount;
    const segmentWidth = width / segments;
    
    // Start point
    let startY = isTop ? 0 : canvasHeight;
    let waveY = isTop ? height : canvasHeight - height;
    
    let path = `M 0 ${waveY} `;

    for (let i = 1; i <= segments; i++) {
      const x = i * segmentWidth;
      
      // Calculate Y with some pseudo-randomness based on seed and offset
      const waveAmplitude = height * complexity;
      const freq = (i + seed + offset) * 1.5;
      const yOffset = Math.sin(freq) * waveAmplitude;
      const y = waveY + yOffset;
      
      const prevX = (i - 1) * segmentWidth;
      // Control points for smooth curves
      const cp1x = prevX + segmentWidth / 2;
      const cp1y = waveY + Math.sin(freq - 0.5) * waveAmplitude;
      const cp2x = prevX + segmentWidth / 2;
      const cp2y = y;
      
      path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y} `;
    }

    // Close the path
    if (isTop) {
      path += `L ${width} 0 L 0 0 Z`;
    } else {
      path += `L ${width} ${canvasHeight} L 0 ${canvasHeight} Z`;
    }
    
    return path;
  }, [wavesCount, height, isTop, seed, complexity]);

  const [path1, setPath1] = useState("");
  const [path2, setPath2] = useState("");

  useEffect(() => {
    setPath1(generateWavePath(0));
    setPath2(generateWavePath(10));
  }, [generateWavePath]);

  const gradientId = "wave-gradient";
  
  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${color}" />
      <stop offset="100%" stop-color="${color2}" />
    </linearGradient>
  </defs>
  ${hasSecondLayer ? `<path fill="url(#${gradientId})" fill-opacity="${opacity * 0.3}" d="${path2}">
    ${isAnimated ? `<animate attributeName="d" dur="5s" repeatCount="indefinite" values="${path2};${path1};${path2}" />` : ""}
  </path>` : ""}
  <path fill="url(#${gradientId})" fill-opacity="${opacity}" d="${path1}">
    ${isAnimated ? `<animate attributeName="d" dur="8s" repeatCount="indefinite" values="${path1};${path2};${path1}" />` : ""}
  </path>
</svg>`;

  const cssCode = `.wave-container {
  aspect-ratio: 1440/320;
  width: 100%;
  background: transparent;
}
${isAnimated ? `@keyframes wave-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.wave-path {
  animation: wave-float 10s ease-in-out infinite;
}` : ""}`;

  const reset = () => {
    setWavesCount(4);
    setHeight(120);
    setColor("#6366f1");
    setColor2("#a855f7");
    setOpacity(1);
    setIsTop(false);
    setIsAnimated(false);
    setHasSecondLayer(true);
    setSeed(1);
    setComplexity(0.5);
  };

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-slate-200 dark:border-white/5 rounded-lg cursor-pointer" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secondary Color</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-slate-200 dark:border-white/5 rounded-lg cursor-pointer" />
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
          min={2} 
          max={12} 
          step={1} 
          onChange={(e) => setWavesCount(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Amplitude (Height)</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{height}px</span>
        </div>
        <input 
          type="range"
          value={height} 
          min={20} 
          max={250} 
          step={1} 
          onChange={(e) => setHeight(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Complexity</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{Math.round(complexity * 100)}%</span>
        </div>
        <input 
          type="range"
          value={complexity * 100} 
          min={0} 
          max={100} 
          step={1} 
          onChange={(e) => setComplexity(parseInt(e.target.value) / 100)} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setHasSecondLayer(!hasSecondLayer)}
          className={cn(
            "flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
            hasSecondLayer 
              ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" 
              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500"
          )}
        >
          <LayersIcon className="w-3.5 h-3.5" /> Layers
        </button>
        <button
          onClick={() => setIsAnimated(!isAnimated)}
          className={cn(
            "flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
            isAnimated 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500"
          )}
        >
          {isAnimated ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />} Anim
        </button>
      </div>

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
    <div className="w-full max-w-4xl aspect-[1440/320] bg-white dark:bg-[#020617] rounded-[2rem] overflow-hidden relative border border-slate-200 dark:border-white/10 shadow-inner">
      <svg 
        viewBox="0 0 1440 320" 
        className="absolute inset-0 w-full h-full transition-all duration-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="preview-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        
        {hasSecondLayer && (
          <path 
            fill="url(#preview-gradient)" 
            fillOpacity={opacity * 0.3} 
            d={path2}
            className="transition-all duration-700 ease-in-out"
          >
            {isAnimated && (
              <animate 
                attributeName="d" 
                dur="10s" 
                repeatCount="indefinite" 
                values={`${path2};${path1};${path2}`} 
              />
            )}
          </path>
        )}
        
        <path 
          fill="url(#preview-gradient)" 
          fillOpacity={opacity} 
          d={path1}
          className="transition-all duration-700 ease-in-out"
        >
          {isAnimated && (
            <animate 
              attributeName="d" 
              dur="12s" 
              repeatCount="indefinite" 
              values={`${path1};${path2};${path1}`} 
            />
          )}
        </path>
      </svg>
    </div>
  );

  return (
    <GeneratorLayout
      title="SVG Wave"
      description="Design smooth, organic multi-layered SVG waves with gradients and motion."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      htmlCode={svgCode}
      onReset={reset}
    />
  );
}
