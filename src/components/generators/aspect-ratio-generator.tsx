"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Maximize, Smartphone, Tablet, Monitor, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export function AspectRatioGenerator() {
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [preset, setPreset] = useState("16/9");
  const [contentType, setContentType] = useState<"image" | "video" | "skeleton">("image");
  const [objectFit, setObjectFit] = useState<"cover" | "contain" | "fill">("cover");
  const [useLegacy, setUseLegacy] = useState(false);

  const PRESETS = [
    { name: "16:9", value: "16/9", w: 16, h: 9 },
    { name: "4:3", value: "4/3", w: 4, h: 3 },
    { name: "1:1", value: "1/1", w: 1, h: 1 },
    { name: "21:9", value: "21/9", w: 21, h: 9 },
    { name: "9:16", value: "9/16", w: 9, h: 16 },
  ];

  const paddingValue = ((ratioH / ratioW) * 100).toFixed(2);
  
  const cssCode = useLegacy 
    ? `.aspect-container {\n  position: relative;\n  width: 100%;\n  padding-top: ${paddingValue}%;\n}\n.aspect-content {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: ${objectFit};\n}`
    : `.aspect-box {\n  aspect-ratio: ${ratioW} / ${ratioH};\n  width: 100%;\n  object-fit: ${objectFit};\n}`;

  const tailwindCode = useLegacy
    ? `<div class="relative w-full pt-[${paddingValue}%]">\n  <div class="absolute inset-0 w-full h-full object-${objectFit}">...</div>\n</div>`
    : `<div class="aspect-[${ratioW}/${ratioH}] w-full object-${objectFit}"></div>`;

  const htmlCode = useLegacy
    ? `<div style="position: relative; width: 100%; padding-top: ${paddingValue}%;">\n  <div style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: ${objectFit}; background: #333;"></div>\n</div>`
    : `<div style="aspect-ratio: ${ratioW} / ${ratioH}; width: 100%; object-fit: ${objectFit}; background: #333;"></div>`;

  const jsCode = `// Dynamic Aspect Ratio Application\nconst setAspectRatio = (element) => {\n  element.style.aspectRatio = "${ratioW} / ${ratioH}";\n  element.style.objectFit = "${objectFit}";\n  element.style.width = "100%";\n};`;

  const reset = () => {
    setRatioW(16);
    setRatioH(9);
    setPreset("16/9");
    setContentType("image");
    setObjectFit("cover");
    setUseLegacy(false);
  };

  const handlePreset = (p: any) => {
    setPreset(p.value);
    setRatioW(p.w);
    setRatioH(p.h);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Popular Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePreset(p)}
              className={cn(
                "py-2 rounded-xl border text-sm font-medium transition-all",
                preset === p.value 
                  ? "bg-[var(--text-primary)]/10 border-[var(--border-hover)] text-[var(--text-primary)] shadow-lg shadow-amber-500/10" 
                  : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border)]"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Width Ratio</label>
          <input 
            type="number" value={ratioW} 
            onChange={(e) => {
              setRatioW(parseFloat(e.target.value) || 1);
              setPreset("custom");
            }}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--border-hover)]/50 outline-none"
          />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Height Ratio</label>
          <input 
            type="number" value={ratioH} 
            onChange={(e) => {
              setRatioH(parseFloat(e.target.value) || 1);
              setPreset("custom");
            }}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--border-hover)]/50 outline-none"
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-[var(--border)] pt-6">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Preview Content</label>
        <div className="flex p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
           {[
             { id: "image", label: "Photo" },
             { id: "video", label: "Cinema" },
             { id: "skeleton", label: "UI Shell" }
           ].map(t => (
             <button
               key={t.id}
               onClick={() => setContentType(t.id as any)}
               className={cn(
                 "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all",
                 contentType === t.id ? "bg-[var(--text-primary)] text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
               )}
             >
               {t.label}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Object Fit Strategy</label>
        <div className="flex p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
           {["cover", "contain", "fill"].map(f => (
             <button
               key={f}
               onClick={() => setObjectFit(f as any)}
               className={cn(
                 "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all",
                 objectFit === f ? "bg-[var(--text-primary)]/20 text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
               )}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border)] group cursor-pointer" onClick={() => setUseLegacy(!useLegacy)}>
         <div className="space-y-1">
            <p className="text-sm font-medium text-white uppercase tracking-widest">Legacy Support</p>
            <p className="text-[9px] font-bold text-[var(--text-secondary)]">Use padding-top hack for older browsers</p>
         </div>
         <div className={cn(
           "w-10 h-5 rounded-full relative transition-all",
           useLegacy ? "bg-[var(--text-primary)] " : "bg-[var(--bg-hover)]"
         )}>
            <div className={cn(
              "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
              useLegacy ? "left-6" : "left-1"
            )} />
         </div>
      </div>
    </div>
  );

  const preview = (
    <div className=" my-10 w-full h-[500px] rounded-[12px] bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex flex-col relative group">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
       
       <div className="p-6 border-b border-[var(--border)] bg-[var(--bg)] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-pulse" />
             <span className="text-sm font-medium text-[var(--text-primary)] uppercase tracking-widest">Viewport Simulation</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] uppercase">
             {useLegacy ? "Legacy Padding Mode" : "Native CSS Engine"}
          </div>
       </div>

       <div className="flex-1 flex items-center justify-center p-12 overflow-auto">
          <div 
            className={cn(
              "relative w-full max-w-[600px] shadow-2xl transition-all duration-700 rounded-[8px] overflow-hidden group/box",
              useLegacy ? "bg-[var(--bg-card)]" : "bg-transparent"
            )}
            style={!useLegacy ? { aspectRatio: `${ratioW} / ${ratioH}` } : { width: '100%', paddingTop: `${paddingValue}%` }}
          >
             <div className={cn(
               "transition-all duration-500 w-full h-full",
               useLegacy ? "absolute inset-0" : ""
             )}>
                {contentType === "image" && (
                   <img 
                     src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" 
                     className="w-full h-full transition-all duration-700"
                     style={{ objectFit }}
                   />
                )}
                {contentType === "video" && (
                   <div className="w-full h-full bg-black flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="w-16 h-16 rounded-full bg-[var(--bg-hover)] backdrop-blur-xl border border-[var(--border-hover)] flex items-center justify-center">
                         <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                         <div className="w-1/3 h-full bg-[var(--text-primary)]" />
                      </div>
                   </div>
                )}
                {contentType === "skeleton" && (
                   <div className="w-full h-full bg-[var(--bg-card)] p-8 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] animate-pulse" />
                         <div className="flex-1 space-y-2">
                            <div className="h-3 w-1/3 bg-[var(--bg-hover)] rounded-full animate-pulse" />
                            <div className="h-2 w-1/4 bg-[var(--bg-card)] rounded-full animate-pulse" />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="h-2 w-full bg-[var(--bg-card)] rounded-full animate-pulse" />
                         <div className="h-2 w-5/6 bg-[var(--bg-card)] rounded-full animate-pulse" />
                         <div className="h-2 w-4/6 bg-[var(--bg-card)] rounded-full animate-pulse" />
                      </div>
                   </div>
                )}
             </div>

             <div className="absolute inset-0 border border-[var(--border)] rounded-[8px] pointer-events-none group-hover/box:border-[var(--border-hover)]/50 transition-colors" />
             
             {/* Info Badge */}
             <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-[var(--border)] flex items-center gap-3 opacity-0 group-hover/box:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5">
                   <Box className="w-3 h-3 text-[var(--text-primary)]" />
                   <span className="text-sm font-medium text-white">{ratioW}:{ratioH}</span>
                </div>
                <div className="w-px h-3 bg-[var(--bg-active)]" />
                <span className="text-sm font-medium text-[var(--text-tertiary)] lowercase">{objectFit}</span>
             </div>
          </div>
       </div>

       <div className="p-6 bg-[var(--bg)] border-t border-[var(--border)] flex justify-center gap-8">
          <div className="flex flex-col items-center gap-1">
             <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Width Ratio</span>
             <span className="text-sm font-black text-white">{ratioW}</span>
          </div>
          <div className="w-px h-8 bg-[var(--bg-card)]" />
          <div className="flex flex-col items-center gap-1">
             <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Height Ratio</span>
             <span className="text-sm font-black text-white">{ratioH}</span>
          </div>
          <div className="w-px h-8 bg-[var(--bg-card)]" />
          <div className="flex flex-col items-center gap-1">
             <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Legacy Padding</span>
             <span className="text-sm font-black text-[var(--text-primary)]">{paddingValue}%</span>
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Aspect Ratio Engine"
      description="Define precise proportions for your UI elements and media containers."
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
