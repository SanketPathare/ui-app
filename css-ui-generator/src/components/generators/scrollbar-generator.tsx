"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

export function ScrollbarGenerator() {
  const [width, setWidth] = useState(12);
  const [thumbColor, setThumbColor] = useState("#6366f1");
  const [trackColor, setTrackColor] = useState("#f1f5f9");
  const [borderRadius, setBorderRadius] = useState(10);
  const [thumbHoverColor, setThumbHoverColor] = useState("#4f46e5");

  const cssCode = `/* Firefox */
* {
  scrollbar-width: auto;
  scrollbar-color: ${thumbColor} ${trackColor};
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: ${width}px;
}

*::-webkit-scrollbar-track {
  background: ${trackColor};
}

*::-webkit-scrollbar-thumb {
  background-color: ${thumbColor};
  border-radius: ${borderRadius}px;
  border: 3px solid ${trackColor};
}

*::-webkit-scrollbar-thumb:hover {
  background-color: ${thumbHoverColor};
}`;

  const tailwindCode = `/* Note: Tailwind doesn't have native scrollbar utilities by default. 
   You typically use a plugin like 'tailwind-scrollbar' or add custom CSS. */`;
  
  const htmlCode = `<div class="custom-scrollbar-example">
  <p>Scroll me to see the effect!</p>
  <div style="height: 1000px;"></div>
</div>

<style>
.custom-scrollbar-example {
  height: 200px;
  overflow-y: scroll;
}
.custom-scrollbar-example::-webkit-scrollbar {
  width: ${width}px;
}
.custom-scrollbar-example::-webkit-scrollbar-track {
  background: ${trackColor};
}
.custom-scrollbar-example::-webkit-scrollbar-thumb {
  background-color: ${thumbColor};
  border-radius: ${borderRadius}px;
  border: ${width/4}px solid ${trackColor};
}
</style>`;

  const reset = () => {
    setWidth(12);
    setThumbColor("#6366f1");
    setTrackColor("#f1f5f9");
    setBorderRadius(10);
    setThumbHoverColor("#4f46e5");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Scrollbar Width</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{width}px</span>
        </div>
        <input 
          type="range"
          value={width} 
          min={4} 
          max={30} 
          step={1} 
          onChange={(e) => setWidth(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Corner Radius</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{borderRadius}px</span>
        </div>
        <input 
          type="range"
          value={borderRadius} 
          min={0} 
          max={20} 
          step={1} 
          onChange={(e) => setBorderRadius(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Thumb Color</label>
          <input type="color" value={thumbColor} onChange={(e) => setThumbColor(e.target.value)} className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Hover Color</label>
          <input type="color" value={thumbHoverColor} onChange={(e) => setThumbHoverColor(e.target.value)} className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Track Color</label>
          <input type="color" value={trackColor} onChange={(e) => setTrackColor(e.target.value)} className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer" />
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div 
        className="w-full h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-y-scroll relative shadow-xl"
        id="scrollbar-preview"
      >
        <style>{`
          #scrollbar-preview::-webkit-scrollbar {
            width: ${width}px;
          }
          #scrollbar-preview::-webkit-scrollbar-track {
            background: ${trackColor};
          }
          #scrollbar-preview::-webkit-scrollbar-thumb {
            background-color: ${thumbColor};
            border-radius: ${borderRadius}px;
            border: ${width/4}px solid ${trackColor};
          }
          #scrollbar-preview::-webkit-scrollbar-thumb:hover {
            background-color: ${thumbHoverColor};
          }
        `}</style>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scroll Interface</h3>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Scrollbar"
      description="Design custom scrollbars for webkit browsers with full color and width control."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
