"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

const presets = [
  { name: "Pill", px: 24, py: 10, fs: 14, br: 99, fw: "800" },
  { name: "Modern", px: 20, py: 12, fs: 14, br: 12, fw: "700" },
  { name: "Glass", px: 20, py: 10, fs: 13, br: 10, fw: "600", bg: "#1e293b", border: 1 },
  { name: "Sharp", px: 18, py: 10, fs: 12, br: 0, fw: "900" },
];

export function ButtonGenerator() {
  const [text, setText] = useState("Launch Engine");
  const [paddingX, setPaddingX] = useState(24);
  const [paddingY, setPaddingY] = useState(12);
  const [fontSize, setFontSize] = useState(14);
  const [borderRadius, setBorderRadius] = useState(12);
  const [bgColor, setBgColor] = useState("#8b5cf6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [borderWidth, setBorderWidth] = useState(0);
  const [fontWeight, setFontWeight] = useState("700");

  const applyPreset = (p: any) => {
    setPaddingX(p.px);
    setPaddingY(p.py);
    setFontSize(p.fs);
    setBorderRadius(p.br);
    setFontWeight(p.fw);
    setBgColor(p.bg ?? "#8b5cf6");
    setBorderWidth(p.border ?? 0);
  };

  const cssCode = `padding: ${paddingY}px ${paddingX}px;
font-size: ${fontSize}px;
font-weight: ${fontWeight};
border-radius: ${borderRadius}px;
background-color: ${bgColor};
color: ${textColor};
border: ${borderWidth}px solid rgba(255, 255, 255, 0.1);
cursor: pointer;
transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
box-shadow: 0 10px 20px -10px ${bgColor};`;

  const tailwindCode = `px-[${paddingX}px] py-[${paddingY}px] text-[${fontSize}px] font-[${fontWeight}] rounded-[${borderRadius}px] bg-[${bgColor}] text-[${textColor}] border-[${borderWidth}px] border-[rgba(255,255,255,0.1)] shadow-[0_15px_30px_-10px_${bgColor}] transition-transform duration-200 active:scale-95`;
  const htmlCode = `<button style="${cssCode.replace(/\n/g, " ")}">\n  ${text}\n</button>`;

  const controls = (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Call to Action</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 rounded-xl card text-xs font-bold focus:ring-2 focus:ring-[var(--focus-ring)]/30 outline-none transition-all text-[var(--text-primary)]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: "Width", value: paddingX, setter: setPaddingX, min: 0, max: 60 },
          { label: "Height", value: paddingY, setter: setPaddingY, min: 0, max: 30 },
          { label: "Font Size", value: fontSize, setter: setFontSize, min: 10, max: 24 },
          { label: "Radius", value: borderRadius, setter: setBorderRadius, min: 0, max: 50 },
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
      </div>

      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Library</label>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-1 py-2 rounded-lg card text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Background</label>
          <div className="p-1.5 rounded-xl card flex items-center gap-2">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer shrink-0" />
            <span className="text-[9px] font-mono font-black text-[var(--text-secondary)] uppercase">{bgColor}</span>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Text</label>
          <div className="p-1.5 rounded-xl card flex items-center gap-2">
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer shrink-0" />
            <span className="text-[9px] font-mono font-black text-[var(--text-secondary)] uppercase">{textColor}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <button 
      style={{ 
        padding: `${paddingY}px ${paddingX}px`,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
        borderRadius: `${borderRadius}px`,
        backgroundColor: bgColor,
        color: textColor,
        border: `${borderWidth}px solid rgba(255, 255, 255, 0.1)`,
        boxShadow: `0 15px 30px -10px ${bgColor}60`,
      }}
      className="transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] hover:brightness-110 font-sans"
    >
      {text}
    </button>
  );

  return (
    <GeneratorLayout
      title="Button UI"
      description="Design high-conversion CTA components with modern typography and fluid interactions."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setText("Launch Engine");
        setPaddingX(24);
        setPaddingY(12);
        setFontSize(14);
        setBorderRadius(12);
        setBgColor("#8b5cf6");
        setTextColor("#ffffff");
        setBorderWidth(0);
        setFontWeight("700");
      }}
    />
  );
}

