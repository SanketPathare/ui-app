"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Layers, Sparkles, Droplets, Sun, Contrast } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackdropFilterGenerator() {
  const [blur, setBlur] = useState(12);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [grayscale, setGrayscale] = useState(0);

  const filterString = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%)`;

  const cssCode = `.glass-effect {\n  backdrop-filter: ${filterString};\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}`;
  const tailwindCode = `<div class="backdrop-blur-[${blur}px] backdrop-brightness-[${brightness}%] backdrop-contrast-[${contrast}%] bg-white/5 border border-white/10"></div>`;
  const htmlCode = `<div style="backdrop-filter: ${filterString}; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); width: 200px; height: 200px; border-radius: 20px;"></div>`;

  const reset = () => {
    setBlur(12);
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setGrayscale(0);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Blur Intensity <span>{blur}px</span>
        </label>
        <input 
          type="range" min="0" max="40" value={blur} 
          onChange={(e) => setBlur(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
             Brightness <span>{brightness}%</span>
          </label>
          <input 
            type="range" min="0" max="200" value={brightness} 
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
             Contrast <span>{contrast}%</span>
          </label>
          <input 
            type="range" min="0" max="200" value={contrast} 
            onChange={(e) => setContrast(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Saturation <span>{saturate}%</span>
        </label>
        <input 
          type="range" min="0" max="200" value={saturate} 
          onChange={(e) => setSaturate(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Grayscale <span>{grayscale}%</span>
        </label>
        <input 
          type="range" min="0" max="100" value={grayscale} 
          onChange={(e) => setGrayscale(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-80 rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex items-center justify-center relative group">
       {/* Background with colorful elements to see the effect */}
       <div className="absolute inset-0 p-8 flex items-center justify-center">
          <div className="w-40 h-40 bg-pink-500 rounded-full blur-[60px] animate-pulse" />
          <div className="w-40 h-40 bg-blue-500 rounded-full blur-[60px] animate-pulse delay-700 -ml-20" />
          <div className="w-32 h-32 bg-amber-500 rounded-full blur-[50px] animate-pulse delay-1000 -mt-20" />
       </div>

       <div 
         className="w-72 h-48 relative z-10 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center space-y-4 transition-all duration-500 overflow-hidden"
         style={{ 
           backdropFilter: filterString,
           WebkitBackdropFilter: filterString,
           background: 'rgba(255, 255, 255, 0.03)'
         }}
       >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
          <Layers className="w-10 h-10 text-white/40 mb-2" />
          <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Frosted Glass</p>
          <p className="text-[9px] font-bold text-slate-400">Backdrop-Filter Active</p>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Backdrop Lab"
      description="Design premium frosted glass effects and background-aware visual filters."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
