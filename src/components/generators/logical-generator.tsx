"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Navigation, ArrowRightLeft, AlignLeft, AlignRight, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogicalGenerator() {
  const [paddingInline, setPaddingInline] = useState(32);
  const [paddingBlock, setPaddingBlock] = useState(24);
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  const cssCode = `.logical-box {\n  padding-inline: ${paddingInline}px;\n  padding-block: ${paddingBlock}px;\n  margin-inline-start: auto;\n  border-inline-start: 4px solid var(--brand-primary);\n  writing-mode: horizontal-tb;\n  direction: ${direction};\n}`;
  const tailwindCode = `<div class="pi-[${paddingInline}px] pb-[${paddingBlock}px] ms-auto ps-start-4 dir-${direction}">...</div>`;
  const htmlCode = `<div dir="${direction}" style="padding-inline: ${paddingInline}px; padding-block: ${paddingBlock}px; border-inline-start: 4px solid skyblue;">\n  Responsive Logical Layout\n</div>`;

  const reset = () => {
    setPaddingInline(32);
    setPaddingBlock(24);
    setDirection("ltr");
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

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Inline Padding <span>{paddingInline}px</span>
        </label>
        <input 
          type="range" min="0" max="100" value={paddingInline} 
          onChange={(e) => setPaddingInline(parseInt(e.target.value))}
          className="w-full accent-sky-500"
        />
        <p className="text-[9px] text-slate-500 italic">Affects Left/Right based on text direction.</p>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Block Padding <span>{paddingBlock}px</span>
        </label>
        <input 
          type="range" min="0" max="100" value={paddingBlock} 
          onChange={(e) => setPaddingBlock(parseInt(e.target.value))}
          className="w-full accent-sky-500"
        />
        <p className="text-[9px] text-slate-500 italic">Affects Top/Bottom in horizontal writing modes.</p>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-80 rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex items-center justify-center p-12 relative">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
       
       <div 
         dir={direction}
         className="w-full max-w-[400px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-500 flex flex-col"
         style={{ 
           paddingInline: `${paddingInline}px`,
           paddingBlock: `${paddingBlock}px`,
           borderInlineStart: `4px solid #0ea5e9`
         }}
       >
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                <Navigation className={cn("w-5 h-5 transition-transform duration-500", direction === "rtl" ? "rotate-180" : "rotate-90")} />
             </div>
             <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Logical Block</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
             {direction === "ltr" 
               ? "This layout uses logical properties like padding-inline and border-inline-start. These automatically flip when switching to RTL modes."
               : "يستخدم هذا التخطيط الخصائص المنطقية مثل padding-inline و border-inline-start. تنقلب هذه تلقائيًا عند التبديل إلى أوضاع RTL."}
          </p>
          <div className="mt-6 flex items-center gap-2 text-[9px] font-bold text-sky-500 uppercase tracking-tighter">
             <ArrowRightLeft className="w-3 h-3" />
             Adaptive Flow Active
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Logical Property Lab"
      description="Build future-proof, multi-directional layouts using standard logical coordinates."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
