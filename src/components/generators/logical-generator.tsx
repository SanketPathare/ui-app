"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Navigation, ArrowRightLeft, AlignLeft, AlignRight, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogicalGenerator() {
  const [paddingInline, setPaddingInline] = useState(32);
  const [paddingBlock, setPaddingBlock] = useState(24);
  const [marginInline, setMarginInline] = useState(0);
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [inset, setInset] = useState(0);

  const cssCode = `.logical-box {\n  padding-inline: ${paddingInline}px;\n  padding-block: ${paddingBlock}px;\n  margin-inline: ${marginInline}px;\n  inset-block-start: ${inset}px;\n  border-inline-start: 4px solid #0ea5e9;\n  direction: ${direction};\n}`;
  const tailwindCode = `<div class="pi-[${paddingInline}px] pb-[${paddingBlock}px] mi-[${marginInline}px] is-[${inset}px] border-is-4 border-sky-500 dir-${direction}">...</div>`;
  const htmlCode = `<div dir="${direction}" style="padding-inline: ${paddingInline}px; padding-block: ${paddingBlock}px; margin-inline: ${marginInline}px; border-inline-start: 4px solid #0ea5e9;">\n  Multi-directional Logic\n</div>`;
  const jsCode = `// Dynamic Logical Styling\nconst applyDirection = (element, dir) => {\n  element.dir = dir;\n  element.style.paddingInline = "${paddingInline}px";\n  element.style.paddingBlock = "${paddingBlock}px";\n  element.style.borderInlineStart = "4px solid #0ea5e9";\n};`;

  const reset = () => {
    setPaddingInline(32);
    setPaddingBlock(24);
    setMarginInline(0);
    setDirection("ltr");
    setInset(0);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Writing Direction</label>
        <div className="flex p-1 rounded-xl bg-white/5 border border-white/5">
          <button 
            onClick={() => setDirection("ltr")}
            className={cn("flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", direction === "ltr" ? "bg-sky-500/20 text-sky-400" : "text-slate-500 hover:text-slate-300")}
          >
            Left-to-Right
          </button>
          <button 
            onClick={() => setDirection("rtl")}
            className={cn("flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", direction === "rtl" ? "bg-sky-500/20 text-sky-400" : "text-slate-500 hover:text-slate-300")}
          >
            Right-to-Left
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
             Inline Pad <span>{paddingInline}px</span>
          </label>
          <input 
            type="range" min="0" max="64" value={paddingInline} 
            onChange={(e) => setPaddingInline(parseInt(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
             Block Pad <span>{paddingBlock}px</span>
          </label>
          <input 
            type="range" min="0" max="64" value={paddingBlock} 
            onChange={(e) => setPaddingBlock(parseInt(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Margin Inline <span>{marginInline}px</span>
        </label>
        <input 
          type="range" min="0" max="100" value={marginInline} 
          onChange={(e) => setMarginInline(parseInt(e.target.value))}
          className="w-full accent-sky-500"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Relative Inset <span>{inset}px</span>
        </label>
        <input 
          type="range" min="-50" max="50" value={inset} 
          onChange={(e) => setInset(parseInt(e.target.value))}
          className="w-full accent-sky-500"
        />
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[500px] rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex flex-col relative group">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
       
       <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Multi-Directional Simulator</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[9px] font-black text-sky-500 uppercase">
             {direction === "ltr" ? "LTR Mode" : "RTL Mode"}
          </div>
       </div>

       <div className="flex-1 flex items-center justify-center p-12 overflow-auto">
          <div 
            dir={direction}
            className="w-full max-w-[450px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl transition-all duration-700 flex flex-col relative"
            style={{ 
              paddingInline: `${paddingInline}px`,
              paddingBlock: `${paddingBlock}px`,
              marginInline: `${marginInline}px`,
              top: `${inset}px`,
              borderInlineStart: `6px solid #0ea5e9`
            }}
          >
             {/* Coordinate Badges */}
             <div className={cn(
               "absolute top-[-10px] bg-sky-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg transition-all duration-700",
               direction === "ltr" ? "left-4" : "right-4"
             )}>
                Logical Start
             </div>

             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 border border-sky-500/20">
                   <Navigation className={cn("w-6 h-6 transition-transform duration-700", direction === "rtl" ? "rotate-180" : "rotate-90")} />
                </div>
                <div className="space-y-0.5">
                   <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Dynamic Flow</h4>
                   <p className="text-[9px] font-bold text-sky-500/50 uppercase tracking-widest italic">Coordinate Agnostic</p>
                </div>
             </div>

             <p className="text-[11px] text-slate-300 font-medium leading-relaxed mb-6">
                {direction === "ltr" 
                  ? "Standard Left-to-Right layout. Using logical properties like padding-inline ensures that the design intent is preserved across all writing systems without manual CSS overrides."
                  : "Right-to-Left (RTL) simulation. Notice how the blue border and padding automatically shifted to the right side because we used logical 'start' properties instead of fixed 'left' properties."}
             </p>

             <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-black text-sky-500 uppercase tracking-widest">
                   <ArrowRightLeft className="w-3.5 h-3.5" />
                   Adaptive Logic Active
                </div>
                <div className="flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-white/10" />
                   <div className="w-2 h-2 rounded-full bg-sky-500/40" />
                   <div className="w-2 h-2 rounded-full bg-sky-500" />
                </div>
             </div>
          </div>
       </div>

       <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center gap-12">
          <div className="flex flex-col items-center gap-1">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inline Pad</span>
             <span className="text-sm font-black text-white">{paddingInline}px</span>
          </div>
          <div className="w-px h-10 bg-white/5" />
          <div className="flex flex-col items-center gap-1">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Writing Mode</span>
             <span className="text-sm font-black text-sky-500 uppercase">Horizontal</span>
          </div>
          <div className="w-px h-10 bg-white/5" />
          <div className="flex flex-col items-center gap-1">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Start</span>
             <span className="text-sm font-black text-white uppercase">{direction === "ltr" ? "Left" : "Right"}</span>
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Logical Property Lab"
      description="Build future-proof, multi-directional layouts using standard logical coordinates."
      icon={<Navigation className="w-8 h-8" />}
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
