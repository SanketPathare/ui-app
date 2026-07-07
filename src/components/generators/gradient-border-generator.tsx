"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

export function GradientBorderGenerator() {
  const [borderWidth, setBorderWidth] = useState(4);
  const [borderRadius, setBorderRadius] = useState(24);
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [angle, setAngle] = useState(45);
  const [bgColor, setBgColor] = useState("#ffffff");

  const cssCode = `.gradient-border {
  position: relative;
  background: ${bgColor};
  border-radius: ${borderRadius}px;
  padding: 2rem;
}

.gradient-border::before {
  content: "";
  position: absolute;
  inset: -${borderWidth}px;
  z-index: -1;
  background: linear-gradient(${angle}deg, ${color1}, ${color2});
  border-radius: ${borderRadius + borderWidth}px;
}`;

  const tailwindCode = `<div class="relative p-8 bg-[${bgColor}] rounded-[${borderRadius}px] before:content-[''] before:absolute before:-inset-[${borderWidth}px] before:-z-10 before:bg-gradient-to-r before:from-[${color1}] before:to-[${color2}] before:rounded-[${borderRadius + borderWidth}px]">
  Content
</div>`;

  const htmlCode = `<div class="gradient-border">
  Content
</div>`;

  const reset = () => {
    setBorderWidth(4);
    setBorderRadius(24);
    setColor1("#6366f1");
    setColor2("#ec4899");
    setAngle(45);
    setBgColor("#ffffff");
  };

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Color 1</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-[var(--border)] rounded-lg cursor-pointer" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Color 2</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10 p-1 bg-transparent border border-[var(--border)] rounded-lg cursor-pointer" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Border Width</label>
          <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{borderWidth}px</span>
        </div>
        <input 
          type="range"
          value={borderWidth} 
          min={1} 
          max={20} 
          step={1} 
          onChange={(e) => setBorderWidth(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Border Radius</label>
          <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{borderRadius}px</span>
        </div>
        <input 
          type="range"
          value={borderRadius} 
          min={0} 
          max={100} 
          step={1} 
          onChange={(e) => setBorderRadius(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Gradient Angle</label>
          <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{angle}°</span>
        </div>
        <input 
          type="range"
          value={angle} 
          min={0} 
          max={360} 
          step={1} 
          onChange={(e) => setAngle(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Inner Background</label>
          <input 
            type="color" 
            value={bgColor} 
            onChange={(e) => setBgColor(e.target.value)}
            className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="p-20">
      <div 
        className="relative min-w-[200px] min-h-[150px] flex items-center justify-center p-8 transition-all duration-300"
        style={{
          backgroundColor: bgColor,
          borderRadius: `${borderRadius}px`,
        }}
      >
        <div 
          className="absolute transition-all duration-300"
          style={{
            inset: `-${borderWidth}px`,
            zIndex: -1,
            background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
            borderRadius: `${borderRadius + borderWidth}px`,
          }}
        />
        <span className="text-sm font-bold text-[var(--text-secondary)] dark:text-[var(--text-secondary)] uppercase tracking-widest">
          Gradient Border
        </span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Gradient Border"
      description="Create elegant components with multi-color gradient borders using pseudo-elements."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
