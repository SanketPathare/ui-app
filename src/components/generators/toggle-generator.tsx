"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { ToggleLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToggleGenerator() {
  const [size, setSize] = useState(24);
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [isOn, setIsOn] = useState(true);
  const [roundness, setRoundness] = useState(24);
  const [showGlow, setShowGlow] = useState(true);

  const cssCode = `.toggle-container {
  width: ${size * 2}px;
  height: ${size}px;
  background: ${isOn ? accentColor : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${roundness}px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  ${isOn && showGlow ? `box-shadow: 0 0 20px ${accentColor}40;` : ""}
}

.toggle-knob {
  width: ${size - 4}px;
  height: ${size - 4}px;
  background: white;
  border-radius: ${roundness - 2}px;
  position: absolute;
  top: 2px;
  left: ${isOn ? size + 2 : 2}px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}`;

  const tailwindCode = `<div 
  class="w-[${size * 2}px] h-[${size}px] ${isOn ? `bg-[${accentColor}]` : 'bg-[var(--bg-hover)]'} rounded-[${roundness}px] relative cursor-pointer transition-all duration-300 ${isOn && showGlow ? `shadow-[0_0_20px_${accentColor}40]` : ""}"
  onclick="this.classList.toggle('bg-[${accentColor}]')"
>
  <div class="absolute top-[2px] ${isOn ? `left-[${size + 2}px]` : 'left-[2px]'} w-[${size - 4}px] h-[${size - 4}px] bg-white rounded-[${roundness - 2}px] transition-all duration-300 shadow-lg"></div>
</div>`;

  const htmlCode = `<div class="toggle ${isOn ? 'on' : ''}" onclick="this.classList.toggle('on')">
  <div class="knob"></div>
</div>

<style>
.toggle {
  width: ${size * 2}px;
  height: ${size}px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${roundness}px;
  position: relative;
  cursor: pointer;
  transition: 0.3s;
}
.toggle.on {
  background: ${accentColor};
  ${showGlow ? `box-shadow: 0 0 20px ${accentColor}60;` : ""}
}
.knob {
  width: ${size - 4}px;
  height: ${size - 4}px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: 0.3s;
}
.on .knob {
  left: ${size + 2}px;
}
</style>`;

  const reset = () => {
    setSize(24);
    setAccentColor("#8b5cf6");
    setIsOn(true);
    setRoundness(24);
    setShowGlow(true);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Toggle Size</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{size}px</span>
          </div>
          <input 
            type="range"
            value={size} 
            min={16} 
            max={48} 
            step={2} 
            onChange={(e) => setSize(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Roundness</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{roundness}px</span>
          </div>
          <input 
            type="range"
            value={roundness} 
            min={0} 
            max={24} 
            step={1} 
            onChange={(e) => setRoundness(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

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

        <div className="pt-4 space-y-4 border-t border-[var(--border)]">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Toggle State</span>
            <div 
              onClick={() => setIsOn(!isOn)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                isOn ? "bg-[var(--text-primary)]" : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                isOn ? "left-6" : "left-1"
              )} />
            </div>
          </label>

          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Outer Glow</span>
            <div 
              onClick={() => setShowGlow(!showGlow)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                showGlow ? "bg-[var(--text-primary)]" : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                showGlow ? "left-6" : "left-1"
              )} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[300px] flex flex-col items-center justify-center bg-[var(--bg)] rounded-[12px] gap-8">
      <div 
        onClick={() => setIsOn(!isOn)}
        className="relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ 
          width: `${size * 2}px`,
          height: `${size}px`,
          backgroundColor: isOn ? accentColor : 'rgba(255, 255, 255, 0.1)',
          borderRadius: `${roundness}px`,
          boxShadow: isOn && showGlow ? `0 0 30px ${accentColor}60` : 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <div 
          className="absolute top-[2px] w-[calc(100%/2-4px)] h-[calc(100%-4px)] bg-white shadow-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ 
            left: isOn ? `calc(50% + 2px)` : '2px',
            borderRadius: `${Math.max(0, roundness - 2)}px`,
          }}
        />
      </div>
      
      <div className="flex items-center gap-2 opacity-40">
         <Sparkles className="w-3 h-3 text-[var(--text-primary)]" />
         <span className="text-xs font-medium text-white">Click to toggle animation</span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Toggle Switch"
      description="Design interactive iOS-style toggle switches with custom themes."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
