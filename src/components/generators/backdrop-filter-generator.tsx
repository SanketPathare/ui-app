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
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [tintColor, setTintColor] = useState("#ffffff");
  const [tintOpacity, setTintOpacity] = useState(0.05);
  const [bgType, setBgType] = useState<"blobs" | "grid" | "image">("blobs");

  const filterString = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) invert(${invert}%)`;

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const glassBg = hexToRgba(tintColor, tintOpacity);

  const cssCode = `.glass-effect {\n  backdrop-filter: ${filterString};\n  -webkit-backdrop-filter: ${filterString};\n  background: ${glassBg};\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}`;
  const tailwindCode = `<div class="backdrop-blur-[${blur}px] backdrop-brightness-[${brightness}%] backdrop-contrast-[${contrast}%] bg-[${glassBg}]"></div>`;
  const htmlCode = `<div style="backdrop-filter: ${filterString}; -webkit-backdrop-filter: ${filterString}; background: ${glassBg}; border: 1px solid rgba(255,255,255,0.1); width: 100%; height: 100%;"></div>`;
  const jsCode = `const applyGlassEffect = (element) => {\n  element.style.backdropFilter = "${filterString}";\n  element.style.webkitBackdropFilter = "${filterString}";\n  element.style.background = "${glassBg}";\n  element.style.border = "1px solid rgba(255, 255, 255, 0.1)";\n};`;

  const reset = () => {
    setBlur(12);
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setGrayscale(0);
    setHueRotate(0);
    setInvert(0);
    setTintColor("#ffffff");
    setTintOpacity(0.05);
  };

  const ARCHETYPES = [
    { name: "Arctic", blur: 20, bright: 110, sat: 100, tint: "#ffffff", op: 0.1 },
    { name: "Cyber", blur: 10, bright: 150, sat: 200, tint: "#0ea5e9", op: 0.05 },
    { name: "Noir", blur: 15, bright: 50, sat: 0, tint: "#000000", op: 0.4 },
    { name: "Muted", blur: 5, bright: 100, sat: 50, tint: "#ffffff", op: 0.02 },
  ];

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Glass Archetypes</label>
        <div className="grid grid-cols-4 gap-2">
           {ARCHETYPES.map(a => (
             <button
               key={a.name}
               onClick={() => {
                 setBlur(a.blur); setBrightness(a.bright); setSaturate(a.sat); setTintColor(a.tint); setTintOpacity(a.op);
               }}
               className="py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-blue-500/50 transition-all"
             >
               {a.name}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Blur Intensity <span>{blur}px</span>
        </label>
        <input 
          type="range" min="0" max="60" value={blur} 
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
             Hue Rotate <span>{hueRotate}°</span>
          </label>
          <input 
            type="range" min="0" max="360" value={hueRotate} 
            onChange={(e) => setHueRotate(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
             Invert <span>{invert}%</span>
          </label>
          <input 
            type="range" min="0" max="100" value={invert} 
            onChange={(e) => setInvert(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-white/5 pt-6">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Glass Tint & Opacity</label>
        <div className="flex gap-4">
           <input 
             type="color" value={tintColor} 
             onChange={(e) => setTintColor(e.target.value)}
             className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
           />
           <div className="flex-1 space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                 <span>Opacity</span>
                 <span>{(tintOpacity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={tintOpacity} 
                onChange={(e) => setTintOpacity(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
           </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className=" my-10 w-full h-[500px] rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex flex-col relative group">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
       
       <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Environment Simulator</span>
          </div>
          <div className="flex p-1 rounded-lg bg-white/5 border border-white/5">
             {["blobs", "grid", "image"].map(t => (
               <button
                 key={t}
                 onClick={() => setBgType(t as any)}
                 className={cn(
                   "px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all",
                   bgType === t ? "bg-blue-500 text-white shadow-lg" : "text-slate-500 hover:text-white"
                 )}
               >
                 {t}
               </button>
             ))}
          </div>
       </div>

       <div className="flex-1 relative flex items-center justify-center p-12">
          {/* Simulation Backgrounds */}
          <div className="absolute inset-0 overflow-hidden">
             {bgType === "blobs" && (
                <div className="w-full h-full p-8 flex items-center justify-center">
                   <div className="w-60 h-60 bg-pink-500 rounded-full blur-[80px] animate-pulse opacity-60" />
                   <div className="w-60 h-60 bg-blue-500 rounded-full blur-[80px] animate-pulse delay-700 -ml-20 opacity-60" />
                   <div className="w-40 h-40 bg-amber-500 rounded-full blur-[60px] animate-pulse delay-1000 -mt-20 opacity-60" />
                </div>
             )}
             {bgType === "grid" && (
                <div className="w-full h-full opacity-20" 
                     style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             )}
             {bgType === "image" && (
                <img 
                  src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-60"
                />
             )}
          </div>

          <div 
            className="w-full max-w-[450px] aspect-video relative z-10 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center space-y-4 transition-all duration-500 overflow-hidden"
            style={{ 
              backdropFilter: filterString,
              WebkitBackdropFilter: filterString,
              background: glassBg
            }}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
             <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto shadow-xl">
                   <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                   <p className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Glassmorphism</p>
                   <p className="text-[10px] font-bold text-white/50 tracking-widest">{filterString.slice(0, 40)}...</p>
                </div>
             </div>
          </div>
       </div>

       <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-center gap-6">
          <div className="flex items-center gap-2">
             <Sparkles className="w-3 h-3 text-blue-500" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Webkit Support Active</span>
          </div>
          <div className="flex items-center gap-2">
             <Droplets className="w-3 h-3 text-blue-500" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hardware Accelerated</span>
          </div>
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
      jsCode={jsCode}
      onReset={reset}
    />
  );
}
