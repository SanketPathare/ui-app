"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Type, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function InputGenerator() {
  const [padding, setPadding] = useState(12);
  const [borderRadius, setBorderRadius] = useState(12);
  const [borderWidth, setBorderWidth] = useState(1);
  const [fontSize, setFontSize] = useState(14);
  const [focusAccent, setFocusAccent] = useState("#8b5cf6");
  const [showIcon, setShowIcon] = useState(true);
  const [variant, setVariant] = useState<"glass" | "solid" | "underlined">("glass");

  const cssCode = `.input-wrapper {
  position: relative;
  width: 100%;
}

.custom-input {
  width: 100%;
  padding: ${padding}px ${showIcon ? padding + 24 : padding}px;
  font-size: ${fontSize}px;
  border-radius: ${borderRadius}px;
  ${variant === 'underlined' ? `
  border: none;
  border-bottom: ${borderWidth}px solid rgba(255, 255, 255, 0.1);
  background: transparent;` : `
  border: ${borderWidth}px solid rgba(255, 255, 255, 0.1);
  background: ${variant === 'glass' ? 'rgba(255, 255, 255, 0.03)' : '#0f172a'};`}
  color: white;
  transition: all 0.2s ease;
  outline: none;
}

.custom-input:focus {
  border-color: ${focusAccent};
  ${variant !== 'underlined' ? `box-shadow: 0 0 0 4px ${focusAccent}20;` : ""}
}

.input-icon {
  position: absolute;
  left: ${padding}px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
}`;

  const tailwindCode = `<div class="relative w-full">
  ${showIcon ? `<Type class="absolute left-${Math.round(padding/4)} top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />` : ""}
  <input 
    type="text" 
    placeholder="Enter text..." 
    class="w-full ${showIcon ? `pl-${Math.round((padding+20)/4)}` : `px-${Math.round(padding/4)}`} py-${Math.round(padding/4)} bg-${variant === 'solid' ? 'slate-900' : 'white/5'} border-${variant === 'underlined' ? 'b' : ''} border-white/10 rounded-${borderRadius === 0 ? 'none' : borderRadius > 20 ? 'full' : 'xl'} text-white focus:outline-none focus:ring-4 focus:ring-[${focusAccent}20] focus:border-[${focusAccent}] transition-all"
  />
</div>`;

  const htmlCode = `<div class="input-wrapper">
  <input type="text" class="custom-input" placeholder="Type something...">
</div>

<style>
.custom-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius}px;
  padding: ${padding}px;
  color: white;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
}
.custom-input:focus {
  border-color: ${focusAccent};
}
</style>`;

  const reset = () => {
    setPadding(12);
    setBorderRadius(12);
    setBorderWidth(1);
    setFontSize(14);
    setFocusAccent("#8b5cf6");
    setShowIcon(true);
    setVariant("glass");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Variant</label>
          <div className="grid grid-cols-3 gap-2">
            {(["glass", "solid", "underlined"] as const).map((v) => (
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
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Padding</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{padding}px</span>
          </div>
          <input 
            type="range"
            value={padding} 
            min={8} 
            max={24} 
            step={1} 
            onChange={(e) => setPadding(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Focus Accent</label>
          <div className="flex gap-2">
            {["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"].map((color) => (
              <button
                key={color}
                onClick={() => setFocusAccent(color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform",
                  focusAccent === color ? "scale-125 border-white" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">Show Icon</span>
            <div 
              onClick={() => setShowIcon(!showIcon)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                showIcon ? "bg-brand-primary shadow-lg shadow-brand-primary/20" : "bg-white/10"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                showIcon ? "left-6" : "left-1"
              )} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[300px] flex items-center justify-center bg-black/20 rounded-[2rem] p-12">
      <div className="relative w-full max-w-sm">
        {showIcon && (
          <Type 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
            style={{ 
              left: `${padding}px`,
              color: 'rgba(255, 255, 255, 0.4)'
            }} 
          />
        )}
        <input 
          type="text" 
          placeholder="Email address..." 
          className={cn(
            "w-full transition-all duration-300",
            variant === 'underlined' ? "bg-transparent border-b" : "border"
          )}
          style={{ 
            padding: `${padding}px`,
            paddingLeft: showIcon ? `${padding + 28}px` : `${padding}px`,
            borderRadius: variant === 'underlined' ? '0' : `${borderRadius}px`,
            fontSize: `${fontSize}px`,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backgroundColor: variant === 'solid' ? '#0f172a' : variant === 'glass' ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
            color: 'white',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = focusAccent;
            if (variant !== 'underlined') e.target.style.boxShadow = `0 0 0 4px ${focusAccent}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <div className="absolute -bottom-6 left-2 flex items-center gap-1.5 opacity-40">
           <Sparkles className="w-3 h-3 text-brand-primary" />
           <span className="text-[9px] font-black uppercase tracking-widest text-white">Focus to see effects</span>
        </div>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Input Field"
      description="Design premium input states, focus effects, and floating labels."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
