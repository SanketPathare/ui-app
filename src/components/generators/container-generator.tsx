"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Maximize, Layout, Smartphone, Tablet, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContainerGenerator() {
  const [maxWidth, setMaxWidth] = useState(1280);
  const [paddingX, setPaddingX] = useState(24);
  const [paddingY, setPaddingY] = useState(48);
  const [centered, setCentered] = useState(true);
  const [glassEffect, setGlassEffect] = useState(false);

  const cssCode = `.container {
  max-width: ${maxWidth}px;
  padding: ${paddingY}px ${paddingX}px;
  ${centered ? "margin: 0 auto;" : "margin: 0;"}
  width: 100%;
  ${glassEffect ? `
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;` : ""}
}`;

  const tailwindCode = `<div class="max-w-[${maxWidth}px] px-[${paddingX}px] py-[${paddingY}px] w-full ${centered ? "mx-auto" : ""} ${glassEffect ? "bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-[12px]" : ""}">
  <!-- Content -->
</div>`;

  const htmlCode = `<div class="container">
  <div class="content-placeholder"></div>
</div>

<style>
.container {
  max-width: ${maxWidth}px;
  padding: ${paddingY}px ${paddingX}px;
  ${centered ? "margin: 0 auto;" : ""}
  width: 100%;
  box-sizing: border-box;
}
${glassEffect ? `
.container {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2rem;
}` : ""}
.content-placeholder {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
  border: 2px dashed rgba(239, 68, 68, 0.2);
  border-radius: 1rem;
  height: 200px;
}
</style>`;

  const reset = () => {
    setMaxWidth(1280);
    setPaddingX(24);
    setPaddingY(48);
    setCentered(true);
    setGlassEffect(false);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Max Width</label>
            <span className="text-[10px] font-bold text-[var(--text-primary)] font-mono">{maxWidth}px</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-2">
             {[640, 768, 1024, 1280].map(w => (
               <button 
                 key={w}
                 onClick={() => setMaxWidth(w)}
                 className={cn(
                   "py-1 rounded-lg text-xs font-medium border transition-all",
                   maxWidth === w ? "bg-[var(--bg-active)] border-[var(--border-hover)] text-[var(--text-primary)]" : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)]"
                 )}
               >
                 {w === 640 ? "SM" : w === 768 ? "MD" : w === 1024 ? "LG" : "XL"}
               </button>
             ))}
          </div>
          <input 
            type="range"
            value={maxWidth} 
            min={320} 
            max={2560} 
            step={10} 
            onChange={(e) => setMaxWidth(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Horizontal Padding</label>
            <span className="text-[10px] font-bold text-[var(--text-primary)] font-mono">{paddingX}px</span>
          </div>
          <input 
            type="range"
            value={paddingX} 
            min={0} 
            max={120} 
            step={4} 
            onChange={(e) => setPaddingX(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Vertical Padding</label>
            <span className="text-[10px] font-bold text-[var(--text-primary)] font-mono">{paddingY}px</span>
          </div>
          <input 
            type="range"
            value={paddingY} 
            min={0} 
            max={200} 
            step={4} 
            onChange={(e) => setPaddingY(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="pt-4 space-y-4 border-t border-[var(--border)]">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Center Container</span>
            <div 
              onClick={() => setCentered(!centered)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                centered ? "bg-[var(--text-primary)] " : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                centered ? "left-6" : "left-1"
              )} />
            </div>
          </label>

          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Glass Aesthetic</span>
            <div 
              onClick={() => setGlassEffect(!glassEffect)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                glassEffect ? "bg-[var(--text-primary)] " : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                glassEffect ? "left-6" : "left-1"
              )} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[400px] flex items-center justify-center bg-[var(--bg)] rounded-[12px] p-4 relative overflow-hidden">
      {/* Background Grid for context */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div 
        className={cn(
          "h-full w-full border-2 border-dashed border-[var(--border-hover)]/20 transition-all duration-500",
          centered ? "mx-auto" : "ml-0"
        )}
        style={{ 
          maxWidth: `${maxWidth}px`,
          padding: `${paddingY}px ${paddingX}px`,
        }}
      >
        <div className={cn(
          "w-full h-full flex items-center justify-center relative overflow-hidden",
          glassEffect ? "bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-[12px]" : "bg-[var(--bg-card)] rounded-xl"
        )}>
          <div className="text-center space-y-2 relative z-10">
            <Layout className="w-8 h-8 text-[var(--text-primary)]/40 mx-auto" />
            <p className="text-sm font-medium text-[var(--text-primary)]/60">
              Container Viewport
            </p>
            <p className="text-[9px] font-bold text-[var(--text-secondary)]">
              {maxWidth}px × Auto
            </p>
          </div>
          
          {/* Padding visualization */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
             <div className="absolute top-0 left-0 w-full bg-orange-400" style={{ height: paddingY }} />
             <div className="absolute bottom-0 left-0 w-full bg-orange-400" style={{ height: paddingY }} />
             <div className="absolute top-0 left-0 h-full bg-orange-400" style={{ width: paddingX }} />
             <div className="absolute top-0 right-0 h-full bg-orange-400" style={{ width: paddingX }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Container Lab"
      description="Create responsive wrappers and fluid layout constraints."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
