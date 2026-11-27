"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { CheckSquare, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckboxGenerator() {
  const [size, setSize] = useState(20);
  const [borderRadius, setBorderRadius] = useState(6);
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [checked, setChecked] = useState(true);
  const [type, setType] = useState<"checkbox" | "radio">("checkbox");

  const cssCode = `/* Custom ${type} Styles */
.${type}-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.custom-${type} {
  width: ${size}px;
  height: ${size}px;
  border: 2px solid ${checked ? accentColor : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${type === 'radio' ? '50%' : `${borderRadius}px`};
  background: ${checked ? accentColor : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  ${checked ? `box-shadow: 0 0 12px ${accentColor}40;` : ""}
}

.custom-${type} svg {
  width: ${size * 0.6}px;
  height: ${size * 0.6}px;
  color: white;
  opacity: ${checked ? 1 : 0};
  transform: scale(${checked ? 1 : 0.5});
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}`;

  const tailwindCode = `<label className="flex items-center gap-3 cursor-pointer group">
  <div className="w-[${size}px] h-[${size}px] flex items-center justify-center border-2 transition-all duration-300 ${type === 'radio' ? 'rounded-full' : `rounded-[${borderRadius}px]`} ${checked ? `bg-[${accentColor}] border-[${accentColor}] shadow-[0_0_12px_${accentColor}40]` : 'border-neutral-600 group-hover:border-neutral-400'}">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[${Math.round(size * 0.6)}px] h-[${Math.round(size * 0.6)}px] text-white transition-all duration-300 ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}">
      ${type === 'checkbox' ? '<polyline points="20 6 9 17 4 12" />' : '<circle cx="12" cy="12" r="6" fill="currentColor" />'}
    </svg>
  </div>
  <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Select Option</span>
</label>`;

  const htmlCode = `<label class="checkbox-wrapper">
  <input type="${type}" ${checked ? "checked" : ""}>
  <span class="checkmark"></span>
  Option Label
</label>

<style>
.checkbox-wrapper { position: relative; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
.checkbox-wrapper input { position: absolute; opacity: 0; width: 0; height: 0; }
.checkmark { 
  width: ${size}px; 
  height: ${size}px; 
  border: 2px solid ${accentColor}; 
  border-radius: ${type === 'radio' ? '50%' : borderRadius + 'px'}; 
  transition: all 0.2s;
}
.checkbox-wrapper input:checked + .checkmark {
  background: ${accentColor};
}
</style>`;

  const reset = () => {
    setSize(20);
    setBorderRadius(6);
    setAccentColor("#8b5cf6");
    setChecked(true);
    setType("checkbox");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(["checkbox", "radio"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "px-2 py-2 rounded-xl text-xs font-medium border transition-all",
                  type === t 
                    ? "bg-[var(--bg-active)] border-[var(--border-hover)] text-[var(--text-primary)] " 
                    : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Size</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{size}px</span>
          </div>
          <input 
            type="range"
            value={size} 
            min={16} 
            max={40} 
            step={2} 
            onChange={(e) => setSize(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        {type === "checkbox" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Border Radius</label>
              <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{borderRadius}px</span>
            </div>
            <input 
              type="range"
              value={borderRadius} 
              min={0} 
              max={12} 
              step={1} 
              onChange={(e) => setBorderRadius(parseInt(e.target.value))} 
              className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Accent Color</label>
          <div className="flex gap-2">
            {["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"].map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform",
                  accentColor === color ? "scale-125 border-white" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)]">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Default Checked</span>
            <div 
              onClick={() => setChecked(!checked)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                checked ? "bg-[var(--text-primary)]" : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                checked ? "left-6" : "left-1"
              )} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[300px] flex items-center justify-center bg-[var(--bg)] rounded-[12px] p-12">
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <label 
            key={i} 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => i === 1 && setChecked(!checked)}
          >
            <div 
              className="transition-all duration-300 flex items-center justify-center border-2"
              style={{ 
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: type === 'radio' ? '50%' : `${borderRadius}px`,
                backgroundColor: (i === 1 ? checked : false) ? accentColor : 'transparent',
                borderColor: (i === 1 ? checked : false) ? accentColor : 'rgba(255, 255, 255, 0.1)',
                boxShadow: (i === 1 ? checked : false) ? `0 0 16px ${accentColor}40` : 'none'
              }}
            >
              {(i === 1 ? checked : false) && (
                type === 'checkbox' 
                  ? <Check className="text-white" style={{ width: `${size*0.6}px`, height: `${size*0.6}px` }} />
                  : <div className="bg-white rounded-full" style={{ width: `${size*0.4}px`, height: `${size*0.4}px` }} />
              )}
            </div>
            <span className={cn(
              "text-sm font-bold transition-colors",
              (i === 1 ? checked : false) ? "text-white" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            )}>
              {type === 'checkbox' ? `Check Option ${i}` : `Radio Option ${i}`}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Checkbox & Radio"
      description="Create custom-branded selection controls with smooth animations."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
