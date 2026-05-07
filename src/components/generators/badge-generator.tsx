"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Tag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BadgeGenerator() {
  const [paddingX, setPaddingX] = useState(12);
  const [paddingY, setPaddingY] = useState(4);
  const [borderRadius, setBorderRadius] = useState(24);
  const [fontSize, setFontSize] = useState(11);
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [variant, setVariant] = useState<"glass" | "solid" | "outline" | "ghost">("glass");
  const [text, setText] = useState("New Feature");

  const cssCode = `.badge {
  display: inline-flex;
  align-items: center;
  padding: ${paddingY}px ${paddingX}px;
  font-size: ${fontSize}px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: ${borderRadius}px;
  ${variant === 'solid' ? `
  background: ${accentColor};
  color: white;` : variant === 'outline' ? `
  border: 1px solid ${accentColor};
  color: ${accentColor};
  background: transparent;` : variant === 'ghost' ? `
  background: ${accentColor}10;
  color: ${accentColor};` : `
  background: ${accentColor}15;
  backdrop-filter: blur(8px);
  border: 1px solid ${accentColor}30;
  color: ${accentColor};`}
}`;

  const tailwindCode = `<span class="inline-flex items-center px-[${paddingX}px] py-[${paddingY}px] text-[${fontSize}px] font-black uppercase tracking-widest rounded-[${borderRadius}px] ${variant === 'solid' ? `bg-[${accentColor}] text-white` : variant === 'outline' ? `border border-[${accentColor}] text-[${accentColor}]` : variant === 'ghost' ? `bg-[${accentColor}]/10 text-[${accentColor}]` : `bg-[${accentColor}]/10 backdrop-blur-md border border-[${accentColor}]/20 text-[${accentColor}]`}">
  ${text}
</span>`;

  const htmlCode = `<span class="badge">${text}</span>

<style>
.badge {
  display: inline-flex;
  padding: ${paddingY}px ${paddingX}px;
  font-size: ${fontSize}px;
  border-radius: ${borderRadius}px;
  font-weight: bold;
  ${variant === 'solid' ? `background: ${accentColor}; color: white;` : `border: 1px solid ${accentColor}; color: ${accentColor};`}
}
</style>`;

  const reset = () => {
    setPaddingX(12);
    setPaddingY(4);
    setBorderRadius(24);
    setFontSize(11);
    setAccentColor("#8b5cf6");
    setVariant("glass");
    setText("New Feature");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Badge Text</label>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Variant</label>
          <div className="grid grid-cols-2 gap-2">
            {(["glass", "solid", "outline", "ghost"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={cn(
                  "px-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                  variant === v 
                    ? "bg-brand-primary/20 border-brand-primary/50 text-brand-primary shadow-lg shadow-brand-primary/10" 
                    : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Border Radius</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{borderRadius}px</span>
          </div>
          <input 
            type="range"
            value={borderRadius} 
            min={0} 
            max={32} 
            step={1} 
            onChange={(e) => setBorderRadius(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Accent Color</label>
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
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[300px] flex items-center justify-center bg-black/20 rounded-[2rem] p-12">
      <span 
        className="transition-all duration-300 font-display font-black uppercase tracking-widest flex items-center gap-1.5"
        style={{ 
          padding: `${paddingY}px ${paddingX}px`,
          fontSize: `${fontSize}px`,
          borderRadius: `${borderRadius}px`,
          backgroundColor: variant === 'solid' ? accentColor : variant === 'outline' ? 'transparent' : variant === 'ghost' ? `${accentColor}15` : `${accentColor}15`,
          backdropFilter: variant === 'glass' ? 'blur(8px)' : 'none',
          border: variant === 'outline' ? `1px solid ${accentColor}` : variant === 'glass' ? `1px solid ${accentColor}40` : '1px solid transparent',
          color: variant === 'solid' ? 'white' : accentColor,
          boxShadow: variant === 'solid' ? `0 8px 16px ${accentColor}30` : 'none'
        }}
      >
        <Sparkles className="w-3 h-3" />
        {text}
      </span>
    </div>
  );

  return (
    <GeneratorLayout
      title="Badge Lab"
      description="Create status indicators, tags, and pill components with glass effects."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
