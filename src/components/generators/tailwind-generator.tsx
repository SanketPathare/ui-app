"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Wind, Layout, Type, Palette, Move, Layers, Square, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function TailwindGenerator() {
  const [padding, setPadding] = useState("p-6");
  const [rounded, setRounded] = useState("rounded-3xl");
  const [bg, setBg] = useState("bg-brand-primary");
  const [shadow, setShadow] = useState("shadow-2xl");
  const [border, setBorder] = useState("border border-white/10");
  const [display, setDisplay] = useState("flex flex-col");

  const classes = cn(padding, rounded, bg, shadow, border, display, "transition-all duration-300");

  const tailwindCode = `<div className="${classes}">
  <h3 className="text-xl font-bold">Tailwind Component</h3>
  <p className="text-sm opacity-80">Built with the utility-first generator.</p>
</div>`;

  const reset = () => {
    setPadding("p-6");
    setRounded("rounded-3xl");
    setBg("bg-brand-primary");
    setShadow("shadow-2xl");
    setBorder("border border-white/10");
    setDisplay("flex flex-col");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Spacing & Layout</label>
        <div className="grid grid-cols-3 gap-2">
          {["p-4", "p-6", "p-8", "p-10", "p-12", "p-16"].map(c => (
            <button 
              key={c}
              onClick={() => setPadding(c)}
              className={cn(
                "py-2 rounded-lg text-[10px] font-bold border transition-all",
                padding === c ? "bg-brand-primary border-brand-primary text-white" : "bg-white/5 border-white/5 text-slate-400"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Radius</label>
        <div className="grid grid-cols-3 gap-2">
          {["rounded-none", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full"].map(c => (
            <button 
              key={c}
              onClick={() => setRounded(c)}
              className={cn(
                "py-2 rounded-lg text-[10px] font-bold border transition-all",
                rounded === c ? "bg-brand-primary border-brand-primary text-white" : "bg-white/5 border-white/5 text-slate-400"
              )}
            >
              {c.replace("rounded-", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Colors</label>
        <div className="grid grid-cols-3 gap-2">
          {["bg-brand-primary", "bg-brand-secondary", "bg-brand-accent", "bg-slate-800", "bg-white", "bg-transparent"].map(c => (
            <button 
              key={c}
              onClick={() => setBg(c)}
              className={cn(
                "py-2 rounded-lg text-[10px] font-bold border transition-all truncate px-2",
                bg === c ? "bg-brand-primary border-brand-primary text-white" : "bg-white/5 border-white/5 text-slate-400"
              )}
            >
              {c.replace("bg-", "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className={cn(classes, "w-64 min-h-[160px] flex items-center justify-center text-center")}>
      <div className="space-y-2">
        <h3 className={cn("text-lg font-black uppercase tracking-widest", bg === "bg-white" ? "text-slate-950" : "text-white")}>
          Preview
        </h3>
        <p className={cn("text-[10px] font-medium opacity-60", bg === "bg-white" ? "text-slate-900" : "text-slate-100")}>
          Tailwind Composition
        </p>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Tailwind CSS Generator"
      description="Build custom Tailwind utility combinations for complex UI components."
      controls={controls}
      preview={preview}
      tailwindCode={tailwindCode}
      onReset={reset}
    />
  );
}
