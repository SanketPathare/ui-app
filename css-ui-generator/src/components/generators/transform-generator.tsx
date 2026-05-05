"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";

export function TransformGenerator() {
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const transformValue = `rotate(${rotate}deg) scale(${scale}) skew(${skewX}deg, ${skewY}deg) translate(${translateX}px, ${translateY}px)`;
  const cssCode = `transform: ${transformValue};`;
  const tailwindCode = `rotate-[${rotate}deg] scale-[${scale}] skew-x-[${skewX}deg] skew-y-[${skewY}deg] translate-x-[${translateX}px] translate-y-[${translateY}px]`;
  const htmlCode = `<div style="transform: ${transformValue}; width: 200px; height: 200px; background: #8b5cf6; border-radius: 24px;"></div>`;

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        {[
          { label: "Rotate", value: rotate, setter: setRotate, min: -180, max: 180, unit: "deg" },
          { label: "Scale", value: scale, setter: setScale, min: 0.1, max: 2, step: 0.1, unit: "x" },
          { label: "Skew X", value: skewX, setter: setSkewX, min: -45, max: 45, unit: "deg" },
          { label: "Skew Y", value: skewY, setter: setSkewY, min: -45, max: 45, unit: "deg" },
          { label: "Translate X", value: translateX, setter: setTranslateX, min: -100, max: 100, unit: "px" },
          { label: "Translate Y", value: translateY, setter: setTranslateY, min: -100, max: 100, unit: "px" },
        ].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{item.label}</label>
              <span className="text-[10px] font-black text-brand-primary font-mono">{item.value}{item.unit}</span>
            </div>
            <input
              type="range"
              min={item.min}
              max={item.max}
              step={item.step || 1}
              value={item.value}
              onChange={(e) => item.setter(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2">
        {[
          { name: "3D Tilt", r: 15, s: 1.1, sx: 10, sy: 0 },
          { name: "Skew", r: 0, s: 1, sx: 20, sy: 0 },
          { name: "Pop", r: 0, s: 1.5, sx: 0, sy: 0 },
          { name: "Flip", r: 180, s: 1, sx: 0, sy: 0 },
        ].map((p) => (
          <button
            key={p.name}
            onClick={() => {
              setRotate(p.r);
              setScale(p.s);
              setSkewX(p.sx);
              setSkewY(p.sy);
            }}
            className="px-2 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[9px] font-black uppercase tracking-tighter text-slate-500 hover:text-brand-primary transition-all"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );

  const preview = (
    <div 
      className="w-40 h-40 md:w-56 md:h-56 bg-brand-primary rounded-3xl shadow-2xl flex items-center justify-center transition-all duration-300"
      style={{ transform: transformValue }}
    >
      <div className="w-12 h-12 bg-white/20 rounded-lg border-2 border-white/40 flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Transform Lab"
      description="Rotate, scale, and skew elements with high-performance 2D transformations."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={() => {
        setRotate(0);
        setScale(1);
        setSkewX(0);
        setSkewY(0);
        setTranslateX(0);
        setTranslateY(0);
      }}
    />
  );
}
