"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";

const presets = [
  { name: "Glow", h: 0, v: 0, b: 10, color: "#8b5cf6", op: 0.8 },
  { name: "Retro", h: 4, v: 4, b: 0, color: "#ec4899", op: 1 },
  { name: "Deep", h: 0, v: 5, b: 5, color: "#000000", op: 0.3 },
  { name: "Clean", h: 1, v: 1, b: 2, color: "#000000", op: 0.15 },
];

export function TextShadowGenerator() {
  const [hOffset, setHOffset] = useState(2);
  const [vOffset, setVOffset] = useState(2);
  const [blur, setBlur] = useState(4);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(0.2);
  const [fontSize, setFontSize] = useState(64);
  const [text, setText] = useState("Elevate");

  const hexToRgba = (hex: string, op: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${op})`;
  };

  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (p: any) => {
    setHOffset(p.h);
    setVOffset(p.v);
    setBlur(p.b);
    setOpacity(p.op);
    setColor(p.color);
    setActivePreset(p.name);
  };

  const rgba = hexToRgba(color, opacity);
  const shadowValue = `${hOffset}px ${vOffset}px ${blur}px ${rgba}`;
  const cssCode = `text-shadow: ${shadowValue};`;
  const tailwindCode = `text-shadow-[${hOffset}px_${vOffset}px_${blur}px_${rgba.replace(/ /g, "")}]`;
  const htmlCode = `<div style="text-shadow: ${shadowValue}; font-size: ${fontSize}px; font-weight: 900; color: inherit;">\n  ${text}\n</div>`;

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Typography</label>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setActivePreset(null);
          }}
          className="w-full p-3 rounded-xl card text-sm font-bold focus:border-[var(--border-hover)] outline-none transition-all"
          placeholder="Enter text..."
        />
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Size</span>
            <span className="text-[9px] font-mono text-[var(--text-primary)]">{fontSize}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="120"
            value={fontSize}
            onChange={(e) => {
              setFontSize(parseInt(e.target.value));
              setActivePreset(null);
            }}
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 pt-4 border-t border-[var(--border)]">
        {[
          { label: "Horizontal", value: hOffset, setter: setHOffset, min: -50, max: 50 },
          { label: "Vertical", value: vOffset, setter: setVOffset, min: -50, max: 50 },
          { label: "Blur", value: blur, setter: setBlur, min: 0, max: 50 },
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
              onChange={(e) => {
                item.setter(parseInt(e.target.value));
                setActivePreset(null);
              }}
              className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
            />
          </div>
        ))}
        
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Opacity</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity * 100}
            onChange={(e) => {
              setOpacity(parseInt(e.target.value) / 100);
              setActivePreset(null);
            }}
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={cn(
                "px-2 py-2 rounded-lg text-xs font-medium transition-all",
                activePreset === p.name 
                  ? "bg-[var(--text-primary)] text-[var(--bg)] shadow-lg border-[var(--border-hover)]" 
                  : "card text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">Color</label>
        <div className="flex gap-2 p-1.5 rounded-xl card">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => {
              setColor(e.target.value);
              setActivePreset(null);
            }}
            className="w-full h-8 rounded-lg overflow-hidden border-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="font-sans font-bold tracking-tighter transition-all duration-500 text-center px-4 text-[var(--text-primary)]"
      style={{ 
        fontSize: `${fontSize}px`,
        textShadow: shadowValue,
      }}
    >
      {text}
    </div>
  );

  return (
    <GeneratorLayout
      title="Text Shadow"
      description="Add depth and cinematic character to your typography with layered shadows."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setHOffset(2);
        setVOffset(2);
        setBlur(4);
        setColor("#000000");
        setOpacity(0.2);
        setFontSize(64);
        setText("Elevate");
        setActivePreset(null);
      }}
    />
  );
}
