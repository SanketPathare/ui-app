"use client";

import { useState, useEffect } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { 
  Square, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Maximize, 
  Minimize,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

export function NeumorphismGenerator() {
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(40);
  const [distance, setDistance] = useState(20);
  const [intensity, setIntensity] = useState(0.15);
  const [blur, setBlur] = useState(40);
  const [color, setColor] = useState("#e0e0e0");
  const [shape, setShape] = useState<"flat" | "concave" | "convex" | "pressed">("flat");

  // Helper to darken/lighten hex color
  const colorLuminance = (hex: string, lum: number) => {
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    let rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }
    return rgb;
  };

  const lightColor = colorLuminance(color, intensity);
  const darkColor = colorLuminance(color, -intensity);

  const getBoxShadow = () => {
    if (shape === "pressed") {
      return `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
    }
    return `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  };

  const getBackground = () => {
    if (shape === "concave") {
      return `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
    } else if (shape === "convex") {
      return `linear-gradient(145deg, ${lightColor}, ${darkColor})`;
    }
    return color;
  };

  const cssCode = `width: ${size}px;
height: ${size}px;
border-radius: ${radius}px;
background: ${getBackground()};
box-shadow: ${getBoxShadow()};`;

  const tailwindCode = `<!-- Note: Neumorphism often requires custom values -->
<div class="w-[${size}px] h-[${size}px] rounded-[${radius}px] bg-[${color}] shadow-[${getBoxShadow()}]"></div>`;

  const htmlCode = `<div class="neumorphic-element"></div>

<style>
.neumorphic-element {
  width: ${size}px;
  height: ${size}px;
  border-radius: ${radius}px;
  background: ${getBackground()};
  box-shadow: ${getBoxShadow()};
}
</style>`;

  const reset = () => {
    setSize(200);
    setRadius(40);
    setDistance(20);
    setIntensity(0.15);
    setBlur(40);
    setColor("#e0e0e0");
    setShape("flat");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Base Color</label>
          <div className="flex items-center gap-2">
             <div 
               className="w-4 h-4 rounded-full border border-slate-200" 
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
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Size</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{size}px</span>
        </div>
        <input 
          type="range"
          value={size} 
          min={50} 
          max={400} 
          step={1} 
          onChange={(e) => setSize(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Radius</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{radius}px</span>
        </div>
        <input 
          type="range"
          value={radius} 
          min={0} 
          max={200} 
          step={1} 
          onChange={(e) => setRadius(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Distance</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{distance}px</span>
        </div>
        <input 
          type="range"
          value={distance} 
          min={1} 
          max={50} 
          step={1} 
          onChange={(e) => setDistance(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Blur</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{blur}px</span>
        </div>
        <input 
          type="range"
          value={blur} 
          min={0} 
          max={100} 
          step={1} 
          onChange={(e) => setBlur(parseInt(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Intensity</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{(intensity * 100).toFixed(0)}%</span>
        </div>
        <input 
          type="range"
          value={intensity * 100} 
          min={5} 
          max={50} 
          step={1} 
          onChange={(e) => setIntensity(parseInt(e.target.value) / 100)} 
          className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Shape</label>
        <div className="grid grid-cols-2 gap-2">
          {(["flat", "concave", "convex", "pressed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setShape(s)}
              className={cn(
                "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
                shape === s 
                  ? "bg-brand-primary border-brand-primary text-white" 
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-brand-primary/30"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="flex items-center justify-center p-20 transition-all duration-300"
      style={{ backgroundColor: color }}
    >
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${radius}px`,
          background: getBackground(),
          boxShadow: getBoxShadow(),
          transition: "all 0.3s ease"
        }}
      />
    </div>
  );

  return (
    <GeneratorLayout
      title="Neumorphism"
      description="Create soft UI elements with realistic highlights and shadows for a tactile feel."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
