"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Monitor, Smartphone, Tablet, Laptop, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BreakpointGenerator() {
  const [sm, setSm] = useState(640);
  const [md, setMd] = useState(768);
  const [lg, setLg] = useState(1024);
  const [xl, setXl] = useState(1280);
  const [xxl, setXxl] = useState(1536);
  const [currentView, setCurrentView] = useState<"sm" | "md" | "lg" | "xl" | "xxl">("md");

  const cssCode = `/* Responsive Breakpoints (Custom) */
@media (min-width: ${sm}px) {
  /* Small devices */
}
@media (min-width: ${md}px) {
  /* Medium devices */
}
@media (min-width: ${lg}px) {
  /* Large devices */
}
@media (min-width: ${xl}px) {
  /* Extra large devices */
}
@media (min-width: ${xxl}px) {
  /* XXL devices */
}`;

  const tailwindCode = `// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '${sm}px',
      'md': '${md}px',
      'lg': '${lg}px',
      'xl': '${xl}px',
      '2xl': '${xxl}px',
    },
  },
}`;

  const htmlCode = `<div class="responsive-box">
  Resize the viewport to test breakpoints.
</div>

<style>
.responsive-box { background: #334155; padding: 20px; color: white; transition: all 0.3s; }

@media (min-width: ${sm}px) { .responsive-box { background: #06b6d4; } }
@media (min-width: ${md}px) { .responsive-box { background: #8b5cf6; } }
@media (min-width: ${lg}px) { .responsive-box { background: #ec4899; } }
</style>`;

  const reset = () => {
    setSm(640);
    setMd(768);
    setLg(1024);
    setXl(1280);
    setXxl(1536);
  };

  const getWidth = () => {
    switch(currentView) {
      case "sm": return sm;
      case "md": return md;
      case "lg": return lg;
      case "xl": return xl;
      case "xxl": return xxl;
    }
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { label: "SM", val: sm, set: setSm, icon: Smartphone },
          { label: "MD", val: md, set: setMd, icon: Tablet },
          { label: "LG", val: lg, set: setLg, icon: Laptop },
          { label: "XL", val: xl, set: setXl, icon: Monitor },
          { label: "2XL", val: xxl, set: setXxl, icon: Maximize2 },
        ].map((bp) => (
          <div key={bp.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <bp.icon className="w-3 h-3 text-[var(--text-secondary)]" />
                <label className="text-sm font-medium text-[var(--text-secondary)]">{bp.label}</label>
              </div>
              <span className="text-[10px] font-bold text-[var(--text-primary)] font-mono">{bp.val}px</span>
            </div>
            <input 
              type="range"
              value={bp.val} 
              min={320} 
              max={2000} 
              step={8} 
              onChange={(e) => bp.set(parseInt(e.target.value))} 
              className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[400px] bg-[var(--bg)] rounded-[12px] p-8 flex flex-col items-center justify-center space-y-8 overflow-hidden relative">
      <div className="flex gap-2 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border)]">
         {(["sm", "md", "lg", "xl", "xxl"] as const).map(v => (
           <button 
             key={v}
             onClick={() => setCurrentView(v)}
             className={cn(
               "px-4 py-1.5 rounded-lg text-sm font-medium uppercase transition-all",
               currentView === v ? "bg-[var(--text-primary)] text-white shadow-lg shadow-cyan-500/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
             )}
           >
             {v}
           </button>
         ))}
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center border-t border-[var(--border)] pt-8">
        <div 
          className="h-full border-2 border-dashed border-[var(--border)] rounded-[8px] transition-all duration-500 flex flex-col items-center justify-center p-6 relative overflow-hidden"
          style={{ width: `${Math.min(getWidth(), 800)}px` }}
        >
          {/* Scaling info - since real px values might exceed preview area, we cap visual width at 800 but show real label */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] uppercase tracking-widest">
             {currentView.toUpperCase()} Viewport: {getWidth()}px
          </div>
          
          <div className="w-full space-y-4">
             <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map(i => <div key={i} className="aspect-square bg-[var(--bg-card)] border border-[var(--border)] rounded-xl animate-pulse" />)}
             </div>
             <div className="h-4 w-full bg-[var(--bg-card)] rounded-full" />
             <div className="h-4 w-2/3 bg-[var(--bg-card)] rounded-full" />
          </div>
        </div>
      </div>
      
      <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest text-center">
        Visualization scaled to fit preview. Actual breakpoints used in code.
      </p>
    </div>
  );

  return (
    <GeneratorLayout
      title="Breakpoints"
      description="Visualize and configure responsive design viewport constraints."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
