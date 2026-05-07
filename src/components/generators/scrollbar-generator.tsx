"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Rows, Layout, Maximize, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollbarGenerator() {
  const [thumbColor, setThumbColor] = useState("#8b5cf6");
  const [trackColor, setTrackColor] = useState("#1e293b");
  const [width, setWidth] = useState(8);
  const [radius, setRadius] = useState(10);

  const cssCode = `/* Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: ${width}px;
}

::-webkit-scrollbar-track {
  background: ${trackColor};
}

::-webkit-scrollbar-thumb {
  background: ${thumbColor};
  border-radius: ${radius}px;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: ${thumbColor} ${trackColor};
}`;

  const tailwindCode = `// Add to your globals.css
@layer base {
  ::-webkit-scrollbar {
    @apply w-[${width}px];
  }
  ::-webkit-scrollbar-track {
    @apply bg-[${trackColor}];
  }
  ::-webkit-scrollbar-thumb {
    @apply bg-[${thumbColor}] rounded-[${radius}px];
  }
}`;

  const htmlCode = `<div class="custom-scroll-container" style="
  height: 300px;
  overflow-y: scroll;
">
  <!-- Content -->
  <div style="height: 1000px; background: linear-gradient(to bottom, #0f172a, #1e293b);"></div>
</div>

<style>
  .custom-scroll-container::-webkit-scrollbar {
    width: ${width}px;
  }
  .custom-scroll-container::-webkit-scrollbar-track {
    background: ${trackColor};
  }
  .custom-scroll-container::-webkit-scrollbar-thumb {
    background: ${thumbColor};
    border-radius: ${radius}px;
  }
  
  /* Firefox support */
  .custom-scroll-container {
    scrollbar-width: thin;
    scrollbar-color: ${thumbColor} ${trackColor};
  }
</style>`;

  const reset = () => {
    setThumbColor("#8b5cf6");
    setTrackColor("#1e293b");
    setWidth(8);
    setRadius(10);
  };

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Thumb Color</label>
          <input type="color" value={thumbColor} onChange={(e) => setThumbColor(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Track Color</label>
          <input type="color" value={trackColor} onChange={(e) => setTrackColor(e.target.value)} className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Scrollbar Width <span>{width}px</span>
        </label>
        <input 
          type="range" min="2" max="20" value={width} 
          onChange={(e) => setWidth(parseInt(e.target.value))}
          className="w-full accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Thumb Radius <span>{radius}px</span>
        </label>
        <input 
          type="range" min="0" max="20" value={radius} 
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-full accent-brand-primary"
        />
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-64 rounded-3xl bg-slate-950 border border-white/5 overflow-hidden flex">
       <div className="flex-1 p-8 space-y-4 overflow-y-auto custom-preview-scrollbar">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Scrollable Content</h3>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-500 leading-relaxed font-medium">
               Designing a custom scrollbar ensures that every pixel of your application remains consistent with your brand's design system. This preview demonstrates how the track and thumb colors interact in real-time.
            </div>
          ))}
       </div>
       <style jsx>{`
          .custom-preview-scrollbar::-webkit-scrollbar {
            width: ${width}px;
          }
          .custom-preview-scrollbar::-webkit-scrollbar-track {
            background: ${trackColor};
          }
          .custom-preview-scrollbar::-webkit-scrollbar-thumb {
            background: ${thumbColor};
            border-radius: ${radius}px;
          }
       `}</style>
    </div>
  );

  return (
    <GeneratorLayout
      title="Custom Scrollbar"
      description="Design unique cross-browser scrollbar styles that perfectly match your platform's design aesthetic."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
