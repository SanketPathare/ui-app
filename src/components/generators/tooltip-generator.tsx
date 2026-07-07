"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function TooltipGenerator() {
  const [padding, setPadding] = useState(12);
  const [borderRadius, setBorderRadius] = useState(12);
  const [position, setPosition] = useState<"top" | "bottom" | "left" | "right">("top");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [showArrow, setShowArrow] = useState(true);
  const [animation, setAnimation] = useState<"fade" | "scale" | "slide">("scale");

  const cssCode = `.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  ${position === 'top' ? 'bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-10px); margin-bottom: 8px;' : 
    position === 'bottom' ? 'top: 100%; left: 50%; transform: translateX(-50%) translateY(10px); margin-top: 8px;' :
    position === 'left' ? 'right: 100%; top: 50%; transform: translateY(-50%) translateX(-10px); margin-right: 8px;' :
    'left: 100%; top: 50%; transform: translateY(-50%) translateX(10px); margin-left: 8px;'}
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${padding}px;
  border-radius: ${borderRadius}px;
  color: white;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 100;
}

.tooltip-container:hover .tooltip {
  opacity: 1;
  ${position === 'top' || position === 'bottom' ? 'transform: translateX(-50%) translateY(0);' : 'transform: translateY(-50%) translateX(0);'}
}

${showArrow ? `
.tooltip::after {
  content: "";
  position: absolute;
  border: 6px solid transparent;
  ${position === 'top' ? 'top: 100%; left: 50%; transform: translateX(-50%); border-top-color: rgba(15, 23, 42, 0.9);' :
    position === 'bottom' ? 'bottom: 100%; left: 50%; transform: translateX(-50%); border-bottom-color: rgba(15, 23, 42, 0.9);' :
    position === 'left' ? 'left: 100%; top: 50%; transform: translateY(-50%); border-left-color: rgba(15, 23, 42, 0.9);' :
    'right: 100%; top: 50%; transform: translateY(-50%); border-right-color: rgba(15, 23, 42, 0.9);'}
}` : ""}`;

  const tailwindCode = `<div class="group relative inline-block">
  <button class="px-4 py-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border)] text-white">Hover me</button>
  
  <div class="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-3' : position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-3' : position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-3' : 'left-full top-1/2 -translate-y-1/2 ml-3'}">
    <div class="bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border)] p-[${padding}px] rounded-[${borderRadius}px] text-xs text-white whitespace-nowrap shadow-2xl">
      Tooltips provide context
      ${showArrow ? `<div class="absolute w-2 h-2 bg-[var(--bg-card)] border-[var(--border)] ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 rotate-45 border-r border-b' : position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 rotate-45 border-l border-t' : position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 rotate-45 border-r border-t' : 'right-full top-1/2 -translate-y-1/2 -mr-1 rotate-45 border-l border-b'}"></div>` : ""}
    </div>
  </div>
</div>`;

  const htmlCode = `<div class="tooltip-wrapper">
  Hover over me
  <span class="tooltip-text">Simple tooltip text</span>
</div>

<style>
.tooltip-wrapper { position: relative; cursor: pointer; }
.tooltip-text { 
  visibility: hidden; 
  background: #0f172a; 
  color: #fff; 
  text-align: center; 
  padding: 8px; 
  border-radius: 6px; 
  position: absolute; 
  z-index: 1; 
  bottom: 125%; 
  left: 50%; 
  transform: translateX(-50%); 
}
.tooltip-wrapper:hover .tooltip-text { visibility: visible; }
</style>`;

  const reset = () => {
    setPadding(12);
    setBorderRadius(12);
    setPosition("top");
    setAccentColor("#8b5cf6");
    setShowArrow(true);
    setAnimation("scale");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Position</label>
          <div className="grid grid-cols-4 gap-2">
            {(["top", "bottom", "left", "right"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPosition(p)}
                className={cn(
                  "px-2 py-2 rounded-xl text-xs font-medium border transition-all",
                  position === p 
                    ? "bg-[var(--bg-active)] border-[var(--border-hover)] text-[var(--text-primary)] " 
                    : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Border Radius</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{borderRadius}px</span>
          </div>
          <input 
            type="range"
            value={borderRadius} 
            min={0} 
            max={24} 
            step={1} 
            onChange={(e) => setBorderRadius(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Accent Color</label>
          <div className="flex gap-2">
            {["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"].map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform",
                  accentColor === color ? "scale-125 border-white" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 space-y-4 border-t border-[var(--border)]">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Show Arrow</span>
            <div 
              onClick={() => setShowArrow(!showArrow)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                showArrow ? "bg-[var(--text-primary)]" : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                showArrow ? "left-6" : "left-1"
              )} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[400px] flex items-center justify-center bg-[var(--bg)] rounded-[12px] p-12">
      <div className="relative group">
         <button className="px-8 py-3 rounded-[8px] card text-white font-bold hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-all group/btn">
            Hover for Tooltip
         </button>
         
         <div 
           className={cn(
             "absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none",
             position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-4 group-hover:mb-2' :
             position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-4 group-hover:mt-2' :
             position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-4 group-hover:mr-2' :
             'left-full top-1/2 -translate-y-1/2 ml-4 group-hover:ml-2'
           )}
         >
           <div 
             className="relative shadow-2xl"
             style={{ 
               background: 'rgba(15, 23, 42, 0.95)',
               backdropFilter: 'blur(12px)',
               border: '1px solid rgba(255, 255, 255, 0.1)',
               padding: `${padding}px`,
               borderRadius: `${borderRadius}px`,
               color: 'white',
               fontSize: '11px',
               fontWeight: '600',
               whiteSpace: 'nowrap'
             }}
           >
             <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5" style={{ color: accentColor }} />
                Premium Tooltip Component
             </div>
             {showArrow && (
               <div 
                 className="absolute w-2.5 h-2.5 rotate-45 border-[var(--border)]"
                 style={{ 
                    background: 'rgba(15, 23, 42, 0.95)',
                    ... (position === 'top' ? { bottom: '-5.5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderRightWidth: '1px', borderBottomWidth: '1px' } :
                         position === 'bottom' ? { top: '-5.5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderLeftWidth: '1px', borderTopWidth: '1px' } :
                         position === 'left' ? { right: '-5.5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderRightWidth: '1px', borderTopWidth: '1px' } :
                         { left: '-5.5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderLeftWidth: '1px', borderBottomWidth: '1px' })
                 }}
               />
             )}
           </div>
         </div>
      </div>
      
      <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
         <Sparkles className="w-3 h-3 text-[var(--text-primary)]" />
         <span className="text-xs font-medium text-white">Interactive Preview</span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Tooltip Pro"
      description="Design elegant informational tooltips with smart positioning."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
