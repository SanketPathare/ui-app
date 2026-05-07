"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Box, RotateCw, Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BorderAnimGenerator() {
  const [speed, setSpeed] = useState(3);
  const [color1, setColor1] = useState("#8b5cf6");
  const [color2, setColor2] = useState("#ec4899");
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderRadius, setBorderRadius] = useState(24);

  const cssCode = `.animated-border {
  position: relative;
  border-radius: ${borderRadius}px;
  background: #020617;
  padding: ${borderWidth}px;
  overflow: hidden;
}

.animated-border::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(transparent, transparent, transparent, ${color1}, ${color2});
  animation: rotate ${speed}s linear infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}`;

  const tailwindCode = `<div className="relative p-[${borderWidth}px] overflow-hidden rounded-[${borderRadius}px] bg-slate-950">
  <div className="absolute inset-[-100%] animate-[spin_${speed}s_linear_infinite] bg-[conic-gradient(transparent,transparent,transparent,${color1},${color2})]" />
  <div className="relative z-10 bg-slate-950 rounded-[${borderRadius-1}px] p-6 text-white">
    {/* Card Content */}
    <h3 className="text-lg font-bold">Animated Border</h3>
  </div>
</div>`;

  const htmlCode = `<div class="animated-border-container" style="
  position: relative;
  width: 300px;
  height: 200px;
  border-radius: ${borderRadius}px;
  background: #020617;
  padding: ${borderWidth}px;
  overflow: hidden;
">
  <div style="
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(transparent, transparent, transparent, ${color1}, ${color2});
    animation: border-rotate ${speed}s linear infinite;
  "></div>
  <div style="
    position: relative;
    z-index: 10;
    background: #020617;
    border-radius: ${borderRadius - 1}px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  ">
    Card Content
  </div>
</div>

<style>
  @keyframes border-rotate {
    100% { transform: rotate(360deg); }
  }
</style>`;

  const reset = () => {
    setSpeed(3);
    setColor1("#8b5cf6");
    setColor2("#ec4899");
    setBorderWidth(2);
    setBorderRadius(24);
  };

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Accent 1</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Accent 2</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Rotation Speed <span>{speed}s</span>
        </label>
        <input 
          type="range" min="1" max="10" step="0.5" value={speed} 
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Border Width <span>{borderWidth}px</span>
        </label>
        <input 
          type="range" min="1" max="10" value={borderWidth} 
          onChange={(e) => setBorderWidth(parseInt(e.target.value))}
          className="w-full accent-brand-primary"
        />
      </div>
    </div>
  );

  const preview = (
    <div 
      className="relative p-[2px] overflow-hidden group"
      style={{ 
        borderRadius: `${borderRadius}px`,
        padding: `${borderWidth}px`
      }}
    >
       <div 
         className="absolute inset-[-200%] transition-transform"
         style={{ 
           background: `conic-gradient(transparent, transparent, transparent, ${color1}, ${color2})`,
           animation: `rotate ${speed}s linear infinite`
         }}
       />
       <div 
         className="relative z-10 bg-[#020617] px-12 py-10 flex flex-col items-center justify-center gap-4 border border-white/5"
         style={{ borderRadius: `${borderRadius - 1}px` }}
       >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-primary">
             <RotateCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="text-center">
             <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Border</h3>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Conic Gradient Logic</p>
          </div>
       </div>
       <style jsx>{`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: rotate 10s linear infinite;
          }
       `}</style>
    </div>
  );

  return (
    <GeneratorLayout
      title="Border Animation"
      description="Design dynamic racing borders and glowing animated frames using advanced conic-gradient logic."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
