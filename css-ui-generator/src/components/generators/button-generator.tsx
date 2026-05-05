"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

const presets = [
  { name: "Pill", px: 24, py: 10, fs: 14, br: 99, fw: "800" },
  { name: "Modern", px: 20, py: 12, fs: 14, br: 12, fw: "700" },
  { name: "Glass", px: 20, py: 10, fs: 13, br: 10, fw: "600", bg: "#ffffff10", border: 1 },
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
    if (p.bg) setBgColor(p.bg);
    if (p.border !== undefined) setBorderWidth(p.border);
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
  const htmlCode = `<button style="${cssCode.replace(/\n/g, " ")}">\n  Button Text\n</button>`;

  const controls = (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Call to Action</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all text-white"
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
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{item.label}</label>
              <span className="text-[10px] font-black text-brand-primary font-mono">{item.value}px</span>
            </div>
            <input
              type="range"
              min={item.min}
              max={item.max}
              value={item.value}
              onChange={(e) => item.setter(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-white/10">
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Library</label>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-tighter text-slate-500 hover:text-brand-primary hover:border-brand-primary transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Background</label>
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer shrink-0" />
            <span className="text-[9px] font-mono font-black text-slate-500 uppercase">{bgColor}</span>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Text</label>
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer shrink-0" />
            <span className="text-[9px] font-mono font-black text-slate-500 uppercase">{textColor}</span>
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
        setPaddingX(24);
        setPaddingY(12);
        setFontSize(14);
        setBorderRadius(12);
        setBgColor("#8b5cf6");
        setTextColor("#ffffff");
        setFontWeight("700");
      }}
    />
  );
}

