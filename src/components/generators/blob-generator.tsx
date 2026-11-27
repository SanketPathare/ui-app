"use client";

import { useState, useEffect, useCallback } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlobGenerator() {
  const [size, setSize] = useState(300);
  const [color, setColor] = useState("#6366f1");
  const [radius, setRadius] = useState("30% 70% 70% 30% / 30% 30% 70% 70%");

  const generateBlob = useCallback(() => {
    const r = () => Math.floor(Math.random() * 100);
    const r1 = r();
    const r2 = r();
    const r3 = r();
    const r4 = r();
    const r5 = r();
    const r6 = r();
    const r7 = r();
    const r8 = r();
    
    setRadius(`${r1}% ${100-r1}% ${r2}% ${100-r2}% / ${r3}% ${r4}% ${100-r4}% ${100-r3}%`);
  }, []);

  useEffect(() => {
    generateBlob();
  }, [generateBlob]);

  const cssCode = `width: ${size}px;
height: ${size}px;
background-color: ${color};
border-radius: ${radius};`;

  const tailwindCode = `<div className="w-[${size}px] h-[${size}px] bg-[${color}] rounded-[${radius.replace(/\s+/g, "_")}]"></div>`;

  const htmlCode = `<div class="blob-shape"></div>

<style>
.blob-shape {
  width: ${size}px;
  height: ${size}px;
  background-color: ${color};
  border-radius: ${radius};
}
</style>`;

  const reset = () => {
    setSize(300);
    setColor("#6366f1");
    generateBlob();
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Color</label>
          <div className="flex items-center gap-2">
             <div 
               className="w-4 h-4 rounded-full border border-[var(--border)]" 
               style={{ backgroundColor: color }}
             />
             <input 
               type="color" 
               value={color} 
               onChange={(e) => setColor(e.target.value)}
               className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
             />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Size</label>
          <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{size}px</span>
        </div>
        <input 
          type="range"
          value={size} 
          min={100} 
          max={500} 
          step={1} 
          onChange={(e) => setSize(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="space-y-4 pt-4">
        <button
          onClick={generateBlob}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all active:scale-95 "
        >
          <RefreshCcw className="w-4 h-4" />
          Regenerate Shape
        </button>
      </div>

      <div className="p-4 rounded-[8px] card space-y-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Current Radius</label>
        <div className="text-[10px] font-mono text-[var(--text-tertiary)] dark:text-[var(--text-primary)] break-all leading-relaxed">
          {radius}
        </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="transition-all duration-700 ease-in-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: radius,
        boxShadow: `0 20px 40px ${color}33`,
      }}
    />
  );

  return (
    <GeneratorLayout
      title="Blob Shape"
      description="Generate organic, fluid SVG-like shapes using the border-radius property."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
