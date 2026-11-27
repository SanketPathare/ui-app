"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { 
  Type, 
  Palette, 
  Layout, 
  Settings2, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [
  { name: "Hyper", colors: ["#8b5cf6", "#ec4899"], angle: 90 },
  { name: "Oceanic", colors: ["#06b6d4", "#3b82f6"], angle: 45 },
  { name: "Sunset", colors: ["#f59e0b", "#ef4444"], angle: 180 },
  { name: "Emerald", colors: ["#10b981", "#3b82f6"], angle: 135 },
];

export function GradientTextGenerator() {
  const [text, setText] = useState("Gradient Typography");
  const [colors, setColors] = useState(["#8b5cf6", "#ec4899"]);
  const [angle, setAngle] = useState(90);
  const [fontSize, setFontSize] = useState(84);
  const [fontWeight, setFontWeight] = useState("900");
  const [letterSpacing, setLetterSpacing] = useState(-2);
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeColor, setStrokeColor] = useState("#ffffff");

  const gradientString = `linear-gradient(${angle}deg, ${colors.join(", ")})`;

  const cssCode = `background: ${gradientString};
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
font-size: ${fontSize}px;
font-weight: ${fontWeight};
letter-spacing: ${letterSpacing}px;
${strokeWidth > 0 ? `-webkit-text-stroke: ${strokeWidth}px ${strokeColor};` : ""}`;

  const tailwindCode = `<h1 className="[background-image:${gradientString.replace(/,\s+/g, ",").replace(/\s+/g, "_")}] bg-clip-text text-transparent text-[${fontSize}px] [font-weight:${fontWeight}] tracking-[${letterSpacing}px]">
  ${text}
</h1>`;

  const htmlCode = `<h1 style="
  background: ${gradientString};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  letter-spacing: ${letterSpacing}px;
">
  ${text}
</h1>`;

  const reset = () => {
    setText("Gradient Typography");
    setColors(["#8b5cf6", "#ec4899"]);
    setAngle(90);
    setFontSize(84);
    setFontWeight("900");
    setLetterSpacing(-2);
    setStrokeWidth(0);
  };

  const addColor = () => {
    if (colors.length < 3) {
      setColors([...colors, "#ffffff"]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, val: string) => {
    const newColors = [...colors];
    newColors[index] = val;
    setColors(newColors);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Preview Text</label>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] p-4 text-[11px] font-mono text-[var(--text-primary)] focus:ring-1 focus:ring-brand-primary outline-none transition-all"
          rows={2}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <label className="text-sm font-medium text-[var(--text-secondary)]">Color Palette</label>
           {colors.length < 3 && (
             <button onClick={addColor} className="text-xs font-medium text-[var(--text-primary)] uppercase hover:text-[var(--text-primary)] transition-colors">+ Add Stop</button>
           )}
        </div>
        <div className="space-y-2">
           {colors.map((color, i) => (
             <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] group">
                <input type="color" value={color} onChange={(e) => updateColor(i, e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" />
                <input type="text" value={color} onChange={(e) => updateColor(i, e.target.value)} className="flex-1 bg-transparent border-none text-[10px] font-mono text-[var(--text-primary)] uppercase outline-none" />
                {colors.length > 2 && (
                  <button onClick={() => removeColor(i)} className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity">
                     <RotateCcw className="w-3 h-3 rotate-45" />
                  </button>
                )}
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">Angle <span>{angle}°</span></label>
            <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full accent-[var(--text-primary)]" />
         </div>
         <div className="space-y-4">
            <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">Size <span>{fontSize}px</span></label>
            <input type="range" min="12" max="150" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-[var(--text-primary)]" />
         </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Typography Presets</label>
        <div className="grid grid-cols-2 gap-2">
           {PRESETS.map(p => (
             <button 
               key={p.name}
               onClick={() => { setColors(p.colors); setAngle(p.angle); }}
               className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-hover)] transition-all text-left"
             >
                <div className="w-4 h-4 rounded-full" style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }} />
                <span className="text-xs font-medium text-[var(--text-secondary)]">{p.name}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
         <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">Letter Spacing <span>{letterSpacing}px</span></label>
         <input type="range" min="-10" max="20" value={letterSpacing} onChange={(e) => setLetterSpacing(parseInt(e.target.value))} className="w-full accent-emerald-500" />
      </div>
    </div>
  );

  const preview = (
    <div className="flex items-center justify-center w-full min-h-[300px] p-8">
       <span 
         className="leading-tight transition-all duration-500 text-center break-words max-w-full"
         style={{ 
           display: "inline",
           backgroundImage: gradientString,
           WebkitBackgroundClip: "text",
           backgroundClip: "text",
           WebkitTextFillColor: "transparent",
           color: "transparent",
           fontSize: `${fontSize}px`,
           fontWeight: fontWeight,
           letterSpacing: `${letterSpacing}px`,
           WebkitTextStroke: strokeWidth > 0 ? `${strokeWidth}px ${strokeColor}` : "none"
         }}
       >
         {text}
       </span>
    </div>
  );

  return (
    <GeneratorLayout
      title="Gradient Text"
      description="Design stunning high-fidelity typography with multi-color linear gradients and advanced letter-spacing."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
