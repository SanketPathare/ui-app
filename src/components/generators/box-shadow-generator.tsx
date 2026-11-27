"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";

const presets = [
  { name: "Soft", h: 0, v: 20, b: 40, s: -10, op: 0.1 },
  { name: "Deep", h: 0, v: 30, b: 60, s: -12, op: 0.25 },
  { name: "Sharp", h: 5, v: 5, b: 0, s: 0, op: 0.15 },
  { name: "Glass", h: 0, v: 8, b: 32, s: 0, op: 0.05 },
  { name: "Neon", h: 0, v: 0, b: 20, s: 2, op: 0.5, color: "#8b5cf6" },
  { name: "Inner", h: 0, v: 2, b: 4, s: 0, op: 0.1, inset: true },
];

export function BoxShadowGenerator() {
  const [hOffset, setHOffset] = useState(0);
  const [vOffset, setVOffset] = useState(20);
  const [blur, setBlur] = useState(40);
  const [spread, setSpread] = useState(-10);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(0.1);
  const [inset, setInset] = useState(false);
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [size, setSize] = useState(160);
  const [radius, setRadius] = useState(32);

  const hexToRgba = (hex: string, op: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${op})`;
  };

  const applyPreset = (p: any) => {
    setHOffset(p.h);
    setVOffset(p.v);
    setBlur(p.b);
    setSpread(p.s);
    setOpacity(p.op);
    setColor(p.color ?? "#000000");
    setInset(p.inset ?? false);
  };

  const randomize = () => {
    setHOffset(Math.floor(Math.random() * 40) - 20);
    setVOffset(Math.floor(Math.random() * 40) - 20);
    setBlur(Math.floor(Math.random() * 60));
    setSpread(Math.floor(Math.random() * 20) - 10);
    const randomHex = () => "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor(randomHex());
  };

  const rgba = hexToRgba(color, opacity);
  const displayShadowValue = `${inset ? "inset " : ""}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${rgba}`;
  const tailwindShadowValue = `${inset ? "inset_" : ""}${hOffset}px_${vOffset}px_${blur}px_${spread}px_${rgba.replace(/ /g, "")}`;
  const cssCode = `box-shadow: ${displayShadowValue};\nbackground-color: ${boxColor};\nborder-radius: ${radius}px;`;
  const tailwindCode = `shadow-[${tailwindShadowValue}] bg-[${boxColor}] rounded-[${radius}px]`;
  const htmlCode = `<div style="box-shadow: ${displayShadowValue}; background-color: ${boxColor}; border-radius: ${radius}px; width: ${size}px; height: ${size}px;"></div>`;

  const controls = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Atmosphere</label>
          <span className="text-[9px] text-[var(--text-secondary)] font-medium">Control depth and light</span>
        </div>
        <button
          onClick={randomize}
          className="p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          title="Randomize Matrix"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {[
          { label: "Horizontal", value: hOffset, setter: setHOffset, min: -100, max: 100 },
          { label: "Vertical", value: vOffset, setter: setVOffset, min: -100, max: 100 },
          { label: "Blur", value: blur, setter: setBlur, min: 0, max: 150 },
          { label: "Spread", value: spread, setter: setSpread, min: -50, max: 50 },
        ].map((item) => (
          <div key={item.label} className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--text-secondary)]">{item.label}</label>
              <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{item.value}px</span>
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
            <label className="text-sm font-medium text-[var(--text-secondary)]">Density</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity * 100}
            onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <button
          onClick={() => setInset(!inset)}
          className={cn(
            "flex items-center justify-between p-3 rounded-xl border transition-all text-sm font-medium",
            inset 
              ? "bg-[var(--bg-card)] border-[var(--border-hover)] text-[var(--text-primary)] shadow-sm" 
              : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)]"
          )}
        >
          Inset Shadow
          <div className={cn(
            "w-8 h-4 rounded-full relative transition-colors",
            inset ? "bg-[var(--text-primary)]" : "bg-[var(--bg-hover)]"
          )}>
            <div className={cn(
              "absolute top-0.5 w-3 h-3 rounded-full transition-all",
              inset ? "left-4.5 bg-[var(--bg)]" : "left-0.5 bg-[var(--text-primary)]"
            )} />
          </div>
        </button>
      </div>

      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Preview Specs</label>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Dimension</span>
              <span className="text-[9px] font-mono text-[var(--text-primary)]">{size}px</span>
            </div>
            <input
              type="range"
              min="40"
              max="300"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Rounding</span>
              <span className="text-[9px] font-mono text-[var(--text-primary)]">{radius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Library</label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2 py-2 rounded-lg card text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Shadow</label>
          <div className="flex gap-2 p-1.5 rounded-xl card">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-8 rounded-lg overflow-hidden border-none cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Background</label>
          <div className="flex gap-2 p-1.5 rounded-xl card">
            <input 
              type="color" 
              value={boxColor} 
              onChange={(e) => setBoxColor(e.target.value)}
              className="w-full h-8 rounded-lg overflow-hidden border-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="transition-all duration-500"
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        boxShadow: displayShadowValue,
        backgroundColor: boxColor,
        borderRadius: `${radius}px`
      }}
    />
  );

  return (
    <GeneratorLayout
      title="Box Shadow"
      description="Design multi-layered elevations with high-fidelity depth control."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setHOffset(0);
        setVOffset(20);
        setBlur(40);
        setSpread(-10);
        setColor("#000000");
        setOpacity(0.1);
        setInset(false);
        setBoxColor("#ffffff");
        setSize(160);
        setRadius(32);
      }}
    />
  );
}

