"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { RotateCw, Sparkles, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type KeyframeStep = {
  id: string;
  percentage: number;
  transform: string;
  opacity: number;
};

export function KeyframesGenerator() {
  const [steps, setSteps] = useState<KeyframeStep[]>([
    { id: "1", percentage: 0, transform: "scale(1) rotate(0deg)", opacity: 1 },
    { id: "2", percentage: 50, transform: "scale(1.5) rotate(180deg)", opacity: 0.5 },
    { id: "3", percentage: 100, transform: "scale(1) rotate(360deg)", opacity: 1 },
  ]);
  const [duration, setDuration] = useState(2);
  const [iteration, setIteration] = useState("infinite");

  const addStep = () => {
    const newStep: KeyframeStep = {
      id: Math.random().toString(36).substr(2, 9),
      percentage: 75,
      transform: "scale(1.2)",
      opacity: 1,
    };
    setSteps([...steps, newStep].sort((a, b) => a.percentage - b.percentage));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: string, updates: Partial<KeyframeStep>) => {
    setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s).sort((a, b) => a.percentage - b.percentage));
  };

  const cssCode = `@keyframes custom-animation {
  ${steps.map(s => `${s.percentage}% { transform: ${s.transform}; opacity: ${s.opacity}; }`).join("\n  ")}
}

.animated-element {
  animation: custom-animation ${duration}s linear ${iteration};
}`;

  const tailwindCode = `<>
  <style>{\`@keyframes custom-animation {\n  ${steps.map(s => `${s.percentage}% { transform: ${s.transform}; opacity: ${s.opacity}; }`).join("\n  ")}\n}\`}</style>
  <div
    className="w-24 h-24 rounded-xl bg-violet-500"
    style={{ animation: "custom-animation ${duration}s linear ${iteration}" }}
  />
</>`;

  const htmlCode = `<div class="box"></div>

<style>
.box {
  width: 100px;
  height: 100px;
  background: #8b5cf6;
  border-radius: 12px;
  animation: myAnim ${duration}s linear ${iteration};
}

@keyframes myAnim {
  ${steps.map(s => `${s.percentage}% { transform: ${s.transform}; opacity: ${s.opacity}; }`).join("\n  ")}
}
</style>`;

  const reset = () => {
    setSteps([
      { id: "1", percentage: 0, transform: "scale(1) rotate(0deg)", opacity: 1 },
      { id: "2", percentage: 50, transform: "scale(1.5) rotate(180deg)", opacity: 0.5 },
      { id: "3", percentage: 100, transform: "scale(1) rotate(360deg)", opacity: 1 },
    ]);
    setDuration(2);
    setIteration("infinite");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Duration (s)</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{duration}s</span>
          </div>
          <input 
            type="range"
            value={duration} 
            min={0.1} 
            max={10} 
            step={0.1} 
            onChange={(e) => setDuration(parseFloat(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="pt-4 space-y-3 border-t border-[var(--border)]">
           <label className="text-sm font-medium text-[var(--text-secondary)]">Keyframe Steps</label>
           <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.id} className="p-3 card space-y-3 group">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{step.percentage}%</span>
                         <input 
                           type="range" 
                           value={step.percentage} 
                           onChange={(e) => updateStep(step.id, { percentage: parseInt(e.target.value) })}
                           className="w-24 h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
                         />
                      </div>
                      <button 
                        onClick={() => removeStep(step.id)}
                        className="p-1 text-[var(--text-tertiary)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                   </div>
                   <div className="space-y-2">
                      <input 
                        type="text" 
                        value={step.transform} 
                        onChange={(e) => updateStep(step.id, { transform: e.target.value })}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-2 py-1 text-[9px] font-mono text-[var(--text-primary)] outline-none"
                      />
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Opacity</span>
                         <input 
                           type="range" 
                           value={step.opacity * 100} 
                           min={0} max={100}
                           onChange={(e) => updateStep(step.id, { opacity: parseInt(e.target.value)/100 })}
                           className="flex-1 h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
                         />
                      </div>
                   </div>
                </div>
              ))}
              <button 
                onClick={addStep}
                className="w-full py-2 border border-dashed border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" /> Add Step
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[400px] flex items-center justify-center rounded-[12px] p-12 overflow-hidden">
      <div 
        className="w-24 h-24 rounded-[12px] bg-violet-500 relative flex items-center justify-center shadow-2xl"
        style={{ 
          animation: `custom-anim-${duration}-${steps.length} ${duration}s linear infinite`
        }}
      >
         <RotateCw className="w-8 h-8 text-white" />
      </div>
      
      <style>{`
        @keyframes custom-anim-${duration}-${steps.length} {
          ${steps.map(s => `${s.percentage}% { transform: ${s.transform}; opacity: ${s.opacity}; }`).join("\n")}
        }
      `}</style>

      <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
         <Sparkles className="w-3 h-3 text-[var(--text-primary)]" />
         <span className="text-xs font-medium text-white">Timeline Sequence Preview</span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Keyframes"
      description="Design multi-step CSS keyframe animations with visual timeline."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
