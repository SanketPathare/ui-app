"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";

const patternTypes = [
  { id: "dots", name: "Dots" },
  { id: "grid", name: "Grid" },
  { id: "stripes", name: "Stripes" },
  { id: "checker", name: "Checker" },
  { id: "crosshatch", name: "Cross" },
  { id: "zigzag", name: "Zigzag" },
  { id: "bricks", name: "Bricks" },
  { id: "polka", name: "Polka" },
  { id: "diamonds", name: "Diamond" },
  { id: "arrows", name: "Arrows" },
  { id: "waves", name: "Waves" },
  { id: "honeycomb", name: "Honey" },
  { id: "graph", name: "Graph" },
  { id: "blueprint", name: "Print" },
  { id: "circuit", name: "Circuit" },
  { id: "triangles", name: "Triangles" },
  { id: "diagonal-grid", name: "Diagonal" },
  { id: "paper", name: "Paper" },
];

export function PatternGenerator() {
  const [type, setType] = useState("dots");
  const [size, setSize] = useState(24);
  const [color, setColor] = useState("#8b5cf6");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(0.2);
  const [thickness, setThickness] = useState(2);
  const [angle, setAngle] = useState(45);
  const [previewSize, setPreviewSize] = useState(300);

  const hexToRgba = (hex: string, op: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${op})`;
  };

  const getPatternStyles = () => {
    const rgba = hexToRgba(color, opacity);
    
    switch (type) {
      case "dots":
        return {
          backgroundImage: `radial-gradient(${rgba} ${thickness}px, transparent ${thickness}px)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundColor: bgColor,
        };
      case "grid":
        return {
          backgroundImage: `linear-gradient(${rgba} ${thickness}px, transparent ${thickness}px), linear-gradient(90deg, ${rgba} ${thickness}px, transparent ${thickness}px)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundColor: bgColor,
        };
      case "stripes":
        return {
          backgroundImage: `linear-gradient(${angle}deg, ${rgba} 25%, transparent 25%, transparent 50%, ${rgba} 50%, ${rgba} 75%, transparent 75%, transparent)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundColor: bgColor,
        };
      case "checker":
        return {
          backgroundImage: `linear-gradient(45deg, ${rgba} 25%, transparent 25%), linear-gradient(-45deg, ${rgba} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${rgba} 75%), linear-gradient(-45deg, transparent 75%, ${rgba} 75%)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: `0 0, 0 ${size/2}px, ${size/2}px -${size/2}px, -${size/2}px 0px`,
          backgroundColor: bgColor,
        };
      case "crosshatch":
        return {
          backgroundImage: `linear-gradient(${angle}deg, ${rgba} 1px, transparent 1px), linear-gradient(${angle + 90}deg, ${rgba} 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundColor: bgColor,
        };
      case "zigzag":
        return {
          backgroundImage: `linear-gradient(135deg, ${rgba} 25%, transparent 25%), linear-gradient(225deg, ${rgba} 25%, transparent 25%), linear-gradient(45deg, ${rgba} 25%, transparent 25%), linear-gradient(315deg, ${rgba} 25%, transparent 25%)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundColor: bgColor,
        };
      case "bricks":
        return {
          backgroundImage: `linear-gradient(30deg, ${rgba} 12%, transparent 12.5%, transparent 87%, ${rgba} 87.5%, ${rgba}), linear-gradient(150deg, ${rgba} 12%, transparent 12.5%, transparent 87%, ${rgba} 87.5%, ${rgba}), linear-gradient(30deg, ${rgba} 12%, transparent 12.5%, transparent 87%, ${rgba} 87.5%, ${rgba}), linear-gradient(150deg, ${rgba} 12%, transparent 12.5%, transparent 87%, ${rgba} 87.5%, ${rgba}), linear-gradient(60deg, ${rgba} 25%, transparent 25.5%, transparent 75%, ${rgba} 75%, ${rgba}), linear-gradient(60deg, ${rgba} 25%, transparent 25.5%, transparent 75%, ${rgba} 75%, ${rgba})`,
          backgroundSize: `${size * 2}px ${size * 3.5}px`,
          backgroundPosition: `0 0, 0 0, ${size}px ${size * 1.75}px, ${size}px ${size * 1.75}px, 0 0, ${size}px ${size * 1.75}px`,
          backgroundColor: bgColor,
        };
      case "polka":
        return {
          backgroundImage: `radial-gradient(${rgba} ${thickness}px, transparent ${thickness}px), radial-gradient(${rgba} ${thickness}px, transparent ${thickness}px)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: `0 0, ${size/2}px ${size/2}px`,
          backgroundColor: bgColor,
        };
      case "diamonds":
        return {
          backgroundImage: `linear-gradient(45deg, ${rgba} 25%, transparent 25%), linear-gradient(-45deg, ${rgba} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${rgba} 75%), linear-gradient(-45deg, transparent 75%, ${rgba} 75%)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundColor: bgColor,
        };
      case "arrows":
        return {
          backgroundImage: `linear-gradient(45deg, ${rgba} 25%, transparent 25%), linear-gradient(-45deg, ${rgba} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${rgba} 75%), linear-gradient(-45deg, transparent 75%, ${rgba} 75%)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: `0 0, 0 ${size/2}px, ${size/2}px -${size/2}px, -${size/2}px 0px`,
          backgroundColor: bgColor,
        };
      case "waves":
        return {
          backgroundImage: `radial-gradient(circle at 100% 50%, transparent 20%, ${rgba} 21%, ${rgba} 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, ${rgba} 21%, ${rgba} 34%, transparent 35%, transparent)`,
          backgroundSize: `${size}px ${size * 2}px`,
          backgroundColor: bgColor,
        };
      case "honeycomb":
        return {
          backgroundImage: `radial-gradient(circle at 50% 50%, ${rgba} ${thickness}px, transparent ${thickness + 1}px), radial-gradient(circle at 0% 0%, ${rgba} ${thickness}px, transparent ${thickness + 1}px), radial-gradient(circle at 100% 0%, ${rgba} ${thickness}px, transparent ${thickness + 1}px), radial-gradient(circle at 100% 100%, ${rgba} ${thickness}px, transparent ${thickness + 1}px), radial-gradient(circle at 0% 100%, ${rgba} ${thickness}px, transparent ${thickness + 1}px)`,
          backgroundSize: `${size}px ${size * 1.732}px`,
          backgroundColor: bgColor,
        };
      case "graph":
        return {
          backgroundImage: `linear-gradient(${rgba} 1px, transparent 1px), linear-gradient(90deg, ${rgba} 1px, transparent 1px), linear-gradient(${rgba} 0.5px, transparent 0.5px), linear-gradient(90deg, ${rgba} 0.5px, transparent 0.5px)`,
          backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size/5}px ${size/5}px, ${size/5}px ${size/5}px`,
          backgroundColor: bgColor,
        };
      case "blueprint":
        return {
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundColor: "#0047ab",
        };
      case "circuit":
        return {
          backgroundImage: `radial-gradient(${rgba} 2px, transparent 2px), linear-gradient(${rgba} 1px, transparent 1px), linear-gradient(90deg, ${rgba} 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px`,
          backgroundPosition: `0 0, ${size/2}px 0, 0 ${size/2}px`,
          backgroundColor: bgColor,
        };
      case "triangles":
        return {
          backgroundImage: `linear-gradient(45deg, ${rgba} 25%, transparent 25%), linear-gradient(-45deg, ${rgba} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${rgba} 75%), linear-gradient(-45deg, transparent 75%, ${rgba} 75%)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundColor: bgColor,
        };
      case "diagonal-grid":
        return {
          backgroundImage: `linear-gradient(${angle}deg, ${rgba} 1px, transparent 1px), linear-gradient(${angle + 90}deg, ${rgba} 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundColor: bgColor,
        };
      case "paper":
        return {
          backgroundImage: `linear-gradient(#f1f1f1 1px, transparent 1px), linear-gradient(90deg, #f1f1f1 1px, transparent 1px)`,
          backgroundSize: `20px 20px`,
          backgroundColor: "#ffffff",
        };
      default:
        return {};
    }
  };

  const styles: any = getPatternStyles();
  const effectiveBg = styles.backgroundColor || bgColor;
  const cssCode = `background-color: ${effectiveBg};\nbackground-image: ${styles.backgroundImage};\nbackground-size: ${styles.backgroundSize};${styles.backgroundPosition ? `\nbackground-position: ${styles.backgroundPosition};` : ""}`;
  
  const twBgImage = styles.backgroundImage?.replace(/,\s+/g, ",").replace(/\s+/g, "_") || "";
  const twBgSize = styles.backgroundSize?.replace(/,\s+/g, ",").replace(/\s+/g, "_") || `${size}px_${size}px`;
  const twBgPos = styles.backgroundPosition ? ` [background-position:${styles.backgroundPosition.replace(/,\s+/g, ",").replace(/\s+/g, "_")}]` : "";
  const tailwindCode = `bg-[${effectiveBg}] [background-image:${twBgImage}] [background-size:${twBgSize}]${twBgPos}`;
  const htmlCode = `<div style="background-color: ${effectiveBg}; background-image: ${styles.backgroundImage}; background-size: ${styles.backgroundSize};${styles.backgroundPosition ? ` background-position: ${styles.backgroundPosition};` : ""} width: 100%; height: 400px; border-radius: 24px;"></div>`;

  const controls = (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Pattern Engine</label>
        <div className="grid grid-cols-3 gap-2">
          {patternTypes.map((p) => (
            <button
              key={p.id}
              onClick={() => setType(p.id)}
              className={cn(
                "px-2 py-2 rounded-lg text-xs font-medium transition-all",
                type === p.id 
                  ? "bg-[var(--text-primary)] text-[var(--bg)] shadow-lg border-[var(--border-hover)]" 
                  : "card text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 pt-4 border-t border-[var(--border)]">
        {[
          { label: "Density", value: size, setter: setSize, min: 4, max: 200, unit: "px" },
          { label: "Thickness", value: thickness, setter: setThickness, min: 1, max: 20, unit: "px" },
          { label: "Rotation", value: angle, setter: setAngle, min: 0, max: 360, unit: "deg" },
        ].map((item) => (
          <div key={item.label} className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--text-secondary)]">{item.label}</label>
              <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{item.value}{item.unit}</span>
            </div>
            <input
              type="range"
              min={item.min}
              max={item.max}
              value={item.value}
              onChange={(e) => item.setter(parseInt(e.target.value))}
              className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
            />
          </div>
        ))}

        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Intensity</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity * 100}
            onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
            className="w-full h-1 bg-slate-200 dark:bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Preview Scale</label>
        <input
          type="range"
          min="100"
          max="500"
          value={previewSize}
          onChange={(e) => setPreviewSize(parseInt(e.target.value))}
          className="w-full h-1 bg-slate-200 dark:bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
        />
      </div>

      <div className="pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Foreground</label>
          <div className="flex gap-2 p-1.5 rounded-xl card">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-8 rounded-lg overflow-hidden border-none cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-3 relative group">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Background</label>
          <div className="flex gap-2 p-1.5 rounded-xl card">
            <input 
              type="color" 
              value={bgColor} 
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-8 rounded-lg overflow-hidden border-none cursor-pointer"
            />
          </div>
          <button 
            onClick={() => { const temp = color; setColor(bgColor); setBgColor(temp); }}
            className="absolute -top-1 right-0 p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-all active:scale-90"
            title="Swap Colors"
          >
            <RefreshCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="rounded-[12px] shadow-2xl transition-all duration-300"
      style={{
        ...styles,
        width: `${previewSize}px`,
        height: `${previewSize}px`,
      }}
    />
  );

  return (
    <GeneratorLayout
      title="Patterns"
      description="Generate mathematical background patterns and textures using procedural CSS gradients."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setType("dots");
        setSize(24);
        setColor("#8b5cf6");
        setBgColor("#ffffff");
        setOpacity(0.2);
        setThickness(2);
        setAngle(45);
        setPreviewSize(300);
      }}
    />
  );
}
