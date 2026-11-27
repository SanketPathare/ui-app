"use client";

import { useState, useEffect } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Type, Smartphone, Tablet, Monitor, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClampGenerator() {
  const [minSize, setMinSize] = useState(16);
  const [maxSize, setMaxSize] = useState(48);
  const [minViewport, setMinViewport] = useState(320);
  const [maxViewport, setMaxViewport] = useState(1280);
  const [outputUnit, setOutputUnit] = useState<"px" | "rem">("rem");
  const [clampValue, setClampValue] = useState("");
  const [simulatedWidth, setSimulatedWidth] = useState(768);
  const [currentSize, setCurrentSize] = useState(16);

  useEffect(() => {
    if (maxViewport === minViewport) return;

    // Convert inputs to REM for calculation (internal logic stays consistent)
    const minValRem = minSize / 16;
    const maxValRem = maxSize / 16;
    const minVWRem = minViewport / 16;
    const maxVWRem = maxViewport / 16;

    const slope = (maxValRem - minValRem) / (maxVWRem - minVWRem);
    const yAxisIntersection = -minVWRem * slope + minValRem;

    let clamp;
    const intersectionFixed = yAxisIntersection.toFixed(4);
    const slopeFixed = (slope * 100).toFixed(4);

    if (outputUnit === "rem") {
      // Compressed string for Tailwind compatibility (no spaces)
      clamp = `clamp(${minValRem.toFixed(3)}rem,${intersectionFixed}rem+${slopeFixed}vw,${maxValRem.toFixed(3)}rem)`;
    } else {
      clamp = `clamp(${minSize}px,${(yAxisIntersection * 16).toFixed(2)}px+${slopeFixed}vw,${maxSize}px)`;
    }
    
    // Clean up '+ -' to just '-'
    clamp = clamp.replace(/\+\-/g, '-');
    
    setClampValue(clamp);

    // Calculate current simulated size
    const currentPreferredRem = yAxisIntersection + (slope * (simulatedWidth / 16));
    const finalSizeRem = Math.max(minValRem, Math.min(maxValRem, currentPreferredRem));
    setCurrentSize(finalSizeRem * 16);
  }, [minSize, maxSize, minViewport, maxViewport, outputUnit, simulatedWidth]);

  const cssCode = `.responsive-text {\n  font-size: ${clampValue};\n}`;
  const tailwindCode = `<p className="text-[${clampValue}]">Responsive Text</p>`;
  const htmlCode = `<p style="font-size: ${clampValue}">Fluid Typography</p>`;
  const jsCode = `// Fluid Typography Calculation\nconst getFluidSize = (width) => {\n  const minSize = ${minSize};\n  const maxSize = ${maxSize};\n  const minViewport = ${minViewport};\n  const maxViewport = ${maxViewport};\n  \n  const slope = (maxSize - minSize) / (maxViewport - minViewport);\n  const intersection = minSize - slope * minViewport;\n  \n  const size = intersection + slope * width;\n  return Math.min(maxSize, Math.max(minSize, size));\n};`;

  const reset = () => {
    setMinSize(16);
    setMaxSize(48);
    setMinViewport(320);
    setMaxViewport(1280);
    setOutputUnit("rem");
    setSimulatedWidth(768);
  };

  const PRESETS = [
    { name: "Body", min: 16, max: 18 },
    { name: "H2", min: 24, max: 48 },
    { name: "H1", min: 32, max: 80 },
  ];

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Typography Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map(p => (
            <button 
              key={p.name}
              onClick={() => { setMinSize(p.min); setMaxSize(p.max); }}
              className="py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm font-medium hover:border-[var(--border-hover)]/50 transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">Min Size (px)</label>
          <input 
            type="number" value={minSize} 
            onChange={(e) => setMinSize(parseFloat(e.target.value) || 0)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--border-hover)]/50 outline-none"
          />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">Max Size (px)</label>
          <input 
            type="number" value={maxSize} 
            onChange={(e) => setMaxSize(parseFloat(e.target.value) || 0)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--border-hover)]/50 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Min Viewport (px)</label>
          <input 
            type="number" value={minViewport} 
            onChange={(e) => setMinViewport(parseFloat(e.target.value) || 0)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--border-hover)]/50 outline-none"
          />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Max Viewport (px)</label>
          <input 
            type="number" value={maxViewport} 
            onChange={(e) => setMaxViewport(parseFloat(e.target.value) || 0)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--border-hover)]/50 outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Output Unit</label>
        <div className="flex p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <button 
            onClick={() => setOutputUnit("px")}
            className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all", outputUnit === "px" ? "bg-[var(--text-primary)] text-[var(--bg)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
          >
            Pixels (px)
          </button>
          <button 
            onClick={() => setOutputUnit("rem")}
            className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all", outputUnit === "rem" ? "bg-[var(--text-primary)] text-[var(--bg)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
          >
            Relative (rem)
          </button>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-full  rounded-[12px] bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex flex-col p-8 relative group">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
       
       <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10">
          <div className="space-y-2 text-center">
             <p className="text-sm font-medium text-[var(--text-primary)] uppercase tracking-widest">Live Simulation</p>
             <h4 className="text-sm font-bold text-[var(--text-secondary)]">{simulatedWidth}px Viewport</h4>
          </div>

          <div className="w-full max-w-xl mx-auto space-y-8">
            <p style={{ fontSize: `${currentSize}px` }} className="font-black text-[var(--text-primary)] leading-tight text-center break-words transition-all duration-300 ease-out">
              Fluid Typography Scaling
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full flex items-center h-4">
                <div className="w-full h-1.5 bg-[var(--bg-card)] rounded-full relative overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-[var(--text-primary)]/50 transition-all duration-300"
                    style={{ width: `${((simulatedWidth - 320) / (1920 - 320)) * 100}%` }}
                  />
                </div>
                <input 
                  type="range" min="320" max="1920" value={simulatedWidth} 
                  onChange={(e) => setSimulatedWidth(parseInt(e.target.value))}
                  className="w-full h-4 opacity-0 absolute inset-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between w-full text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-widest">
                <span>320px</span>
                <span>Current: {currentSize.toFixed(1)}px</span>
                <span>1920px</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
             {[
               { icon: <Smartphone />, label: "Mobile", width: 375 },
               { icon: <Tablet />, label: "Tablet", width: 768 },
               { icon: <Monitor />, label: "Desktop", width: 1280 },
               { icon: <Maximize2 className="w-4 h-4" />, label: "Wide", width: 1920 },
             ].map((device) => (
               <button 
                 key={device.label}
                 onClick={() => setSimulatedWidth(device.width)}
                 className={cn(
                   "flex flex-col items-center gap-2 p-4 rounded-[8px] border transition-all",
                   simulatedWidth === device.width ? "bg-[var(--bg-card)] border-[var(--border-hover)] text-[var(--text-primary)]" : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border)]"
                 )}
               >
                 <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
                    {device.icon}
                 </div>
                 <span className="text-xs font-medium">{device.label}</span>
               </button>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="CSS Clamp Lab"
      description="Calculate mathematically perfect fluid typography that scales with the viewport."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      jsCode={jsCode}
      onReset={reset}
    />
  );
}
