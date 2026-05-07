"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Layout, Maximize2, Smartphone, Monitor, Braces } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContainerQueryGenerator() {
  const [containerWidth, setContainerWidth] = useState(600);
  const [breakpoint, setBreakpoint] = useState(450);

  const cssCode = `.parent {\n  container-type: inline-size;\n  container-name: card;\n  width: ${containerWidth}px;\n}\n\n@container card (width > ${breakpoint}px) {\n  .child {\n    display: flex;\n    gap: 2rem;\n    background: var(--brand-accent);\n  }\n}`;
  const tailwindCode = `<div class="@container/card w-[${containerWidth}px]">\n  <div class="block @[${breakpoint}px]/card:flex">...</div>\n</div>`;
  const htmlCode = `<div style="container-type: inline-size; width: ${containerWidth}px;">\n  <style>\n    @container (min-width: ${breakpoint}px) {\n      .child { background: indigo; }\n    }\n  </style>\n  <div class="child text-white p-6">Content</div>\n</div>`;

  const reset = () => {
    setContainerWidth(600);
    setBreakpoint(450);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Simulate Container Width <span>{containerWidth}px</span>
        </label>
        <input 
          type="range" min="300" max="800" value={containerWidth} 
          onChange={(e) => setContainerWidth(parseInt(e.target.value))}
          className="w-full accent-violet-500"
        />
        <div className="flex gap-2">
           <button onClick={() => setContainerWidth(320)} className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Mobile</button>
           <button onClick={() => setContainerWidth(500)} className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Tablet</button>
           <button onClick={() => setContainerWidth(750)} className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Desktop</button>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/5 pt-6">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Query Breakpoint <span>{breakpoint}px</span>
        </label>
        <input 
          type="range" min="350" max="600" value={breakpoint} 
          onChange={(e) => setBreakpoint(parseInt(e.target.value))}
          className="w-full accent-violet-500"
        />
        <p className="text-[9px] text-slate-500 font-medium leading-relaxed italic">
          The child component will change layout when its parent exceeds this width.
        </p>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-96 rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex flex-col relative">
       <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Container Root</span>
          </div>
          <span className="text-[9px] font-bold text-slate-600">{containerWidth}px Wide</span>
       </div>
       
       <div className="flex-1 flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          <div 
            className="transition-all duration-500 p-1 rounded-[2.5rem] bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/5"
            style={{ 
              width: `${containerWidth}px`,
              containerType: 'inline-size',
              containerName: 'demo'
            }}
          >
             <div 
               className={cn(
                 "transition-all duration-700 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 shadow-2xl overflow-hidden group",
                 containerWidth > breakpoint ? "bg-gradient-to-br from-violet-500 to-fuchsia-600" : "bg-white/5 backdrop-blur-xl"
               )}
             >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700",
                  containerWidth > breakpoint ? "bg-white/20 scale-110" : "bg-white/5"
                )}>
                   {containerWidth > breakpoint ? <Monitor className="w-6 h-6 text-white" /> : <Smartphone className="w-6 h-6 text-slate-400" />}
                </div>
                
                <div className="space-y-1">
                   <p className={cn(
                     "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-700",
                     containerWidth > breakpoint ? "text-white" : "text-slate-500"
                   )}>
                      {containerWidth > breakpoint ? "Wide Mode" : "Compact Mode"}
                   </p>
                   <p className={cn(
                     "text-[9px] font-bold transition-colors duration-700",
                     containerWidth > breakpoint ? "text-white/60" : "text-slate-600"
                   )}>
                      Responds to Parent Width
                   </p>
                </div>

                {containerWidth > breakpoint && (
                  <div className="pt-4 flex gap-2 animate-in fade-in zoom-in duration-500">
                     <div className="px-3 py-1 rounded-full bg-white/10 text-[8px] font-black text-white uppercase">Container-Aware</div>
                     <div className="px-3 py-1 rounded-full bg-white/10 text-[8px] font-black text-white uppercase">Query Active</div>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Container Query Lab"
      description="Design truly component-driven layouts that respond to their environment rather than the screen."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
