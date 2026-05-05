"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";

export function FilterGenerator() {
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [saturate, setSaturate] = useState(100);

  const filterValue = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) invert(${invert}%) sepia(${sepia}%) saturate(${saturate}%)`;
  const cssCode = `filter: ${filterValue};`;
  const tailwindCode = `blur-[${blur}px] brightness-[${brightness}%] contrast-[${contrast}%] grayscale-[${grayscale}%] hue-rotate-[${hueRotate}deg] invert-[${invert}%] sepia-[${sepia}%] saturate-[${saturate}%]`;
  const htmlCode = `<img src="image.jpg" style="filter: ${filterValue}; width: 300px; height: 300px; object-fit: cover; border-radius: 24px;">`;

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {[
          { label: "Blur", value: blur, setter: setBlur, min: 0, max: 20, unit: "px" },
          { label: "Brightness", value: brightness, setter: setBrightness, min: 0, max: 200, unit: "%" },
          { label: "Contrast", value: contrast, setter: setContrast, min: 0, max: 200, unit: "%" },
          { label: "Saturate", value: saturate, setter: setSaturate, min: 0, max: 200, unit: "%" },
          { label: "Grayscale", value: grayscale, setter: setGrayscale, min: 0, max: 100, unit: "%" },
          { label: "Sepia", value: sepia, setter: setSepia, min: 0, max: 100, unit: "%" },
          { label: "Invert", value: invert, setter: setInvert, min: 0, max: 100, unit: "%" },
          { label: "Hue Rotate", value: hueRotate, setter: setHueRotate, min: 0, max: 360, unit: "deg" },
        ].map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.label}</label>
              <span className="text-[9px] font-black text-brand-primary font-mono">{item.value}{item.unit}</span>
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

      <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
        {[
          { name: "Old Photo", bl: 0, br: 90, c: 110, s: 0, gr: 0, se: 100, i: 0, h: 0 },
          { name: "Noir", bl: 0, br: 100, c: 150, s: 0, gr: 100, se: 0, i: 0, h: 0 },
          { name: "Acid", bl: 0, br: 100, c: 200, s: 200, gr: 0, se: 0, i: 0, h: 180 },
          { name: "Ghost", bl: 5, br: 120, c: 80, s: 50, gr: 0, se: 0, i: 100, h: 0 },
        ].map((p) => (
          <button
            key={p.name}
            onClick={() => {
              setBlur(p.bl);
              setBrightness(p.br);
              setContrast(p.c);
              setSaturate(p.s);
              setGrayscale(p.gr);
              setSepia(p.se);
              setInvert(p.i);
              setHueRotate(p.h);
            }}
            className="px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-tighter text-slate-500 hover:text-brand-primary transition-all"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );

  const preview = (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <div 
        className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300"
        style={{ filter: filterValue }}
      >
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" 
          alt="Filter Preview" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Filter Core"
      description="Apply high-performance visual effects including blurring, color shifts, and cinematic grading."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setBlur(0);
        setBrightness(100);
        setContrast(100);
        setGrayscale(0);
        setHueRotate(0);
        setInvert(0);
        setSepia(0);
        setSaturate(100);
      }}
    />
  );
}
