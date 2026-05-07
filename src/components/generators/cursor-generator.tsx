"use client";

import { useState, useEffect, useRef } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { MousePointer2, Target, Move, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function CursorGenerator() {
  const [size, setSize] = useState(40);
  const [color, setColor] = useState("#8b5cf6");
  const [blur, setBlur] = useState(20);
  const [opacity, setOpacity] = useState(0.5);
  const [preset, setPreset] = useState<"blob" | "ring" | "cyber" | "spotlight">("blob");
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  const cssCode = `.custom-cursor {
  position: fixed;
  width: ${size}px;
  height: ${size}px;
  background: ${color};
  filter: blur(${blur}px);
  opacity: ${opacity};
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s;
  z-index: 9999;
}`;

  const tailwindCode = `// React Component
const CustomCursor = ({ pos }) => (
  <div 
    className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 ease-out z-[9999]"
    style={{ 
      left: pos.x,
      top: pos.y,
      width: '${size}px', 
      height: '${size}px', 
      backgroundColor: '${color}', 
      filter: 'blur(${blur}px)', 
      opacity: ${opacity} 
    }} 
  />
);`;

  const htmlCode = `<div id="custom-cursor" style="
  position: fixed;
  width: ${size}px;
  height: ${size}px;
  background: ${color};
  filter: blur(${blur}px);
  opacity: ${opacity};
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9999;
  transition: width 0.2s, height 0.2s;
"></div>

<script>
  const cursor = document.getElementById('custom-cursor');
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
</script>`;

  const reset = () => {
    setSize(40);
    setColor("#8b5cf6");
    setBlur(20);
    setOpacity(0.5);
    setPreset("blob");
  };

  const PRESETS = [
    { id: "blob", name: "Neural Blob", icon: <Sparkles className="w-4 h-4" /> },
    { id: "ring", name: "Modern Ring", icon: <Target className="w-4 h-4" /> },
    { id: "cyber", name: "Cyber Trail", icon: <Move className="w-4 h-4" /> },
    { id: "spotlight", name: "Spotlight", icon: <MousePointer2 className="w-4 h-4" /> },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Cursor Preset</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id as any)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-bold uppercase transition-all",
                preset === p.id 
                  ? "bg-brand-primary/10 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/10" 
                  : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
              )}
            >
              {p.icon}
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Cursor Color</label>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
           <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
           <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="bg-transparent border-none text-xs font-mono text-white w-full uppercase" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
             Size <span>{size}px</span>
          </label>
          <input 
            type="range" min="10" max="150" value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full accent-brand-primary"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
             Blur <span>{blur}px</span>
          </label>
          <input 
            type="range" min="0" max="80" value={blur} 
            onChange={(e) => setBlur(parseInt(e.target.value))}
            className="w-full accent-brand-primary"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Opacity <span>{Math.round(opacity * 100)}%</span>
        </label>
        <input 
          type="range" min="0.1" max="1" step="0.1" value={opacity} 
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full accent-brand-primary"
        />
      </div>
    </div>
  );

  const preview = (
    <div 
      ref={previewRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="w-full h-80 rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden relative cursor-none flex items-center justify-center group select-none"
    >
       <div className="grid grid-cols-2 gap-4 relative z-10 w-full px-12">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="h-20 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all hover:bg-white/5 hover:border-brand-primary/20 hover:scale-[1.02] group/target"
              onMouseEnter={() => setIsHovering(true)}
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover/target:text-brand-primary transition-colors">Target Area</span>
            </div>
          ))}
       </div>

       <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Interactive Canvas</p>
       </div>
       
       {/* Custom Follower */}
       <div 
         className={cn(
           "absolute pointer-events-none transition-all duration-300 ease-out",
           preset === "ring" ? "border-2" : "rounded-full"
         )}
         style={{ 
           left: cursorPos.x,
           top: cursorPos.y,
           width: `${isHovering ? size * 1.5 : size}px`,
           height: `${isHovering ? size * 1.5 : size}px`,
           backgroundColor: preset === "ring" ? "transparent" : color,
           borderColor: color,
           filter: `blur(${blur}px)`,
           opacity: opacity,
           borderRadius: preset === "cyber" ? "4px" : "50%",
           transform: `translate(-50%, -50%) rotate(${preset === "cyber" ? "45deg" : "0deg"})`,
           boxShadow: preset === "spotlight" ? `0 0 0 2000px rgba(0,0,0,0.8)` : 'none'
         }}
       />

       {/* Precision Dot */}
       {preset !== "spotlight" && (
         <div 
           className="absolute pointer-events-none w-1 h-1 bg-white rounded-full z-20"
           style={{ 
             left: cursorPos.x,
             top: cursorPos.y,
             transform: 'translate(-50%, -50%)'
           }}
         />
       )}

       {/* Outer Ring */}
       {(preset === "ring" || preset === "blob") && (
         <div 
           className="absolute pointer-events-none transition-all duration-500 ease-out border border-white/10 rounded-full"
           style={{ 
             left: cursorPos.x,
             top: cursorPos.y,
             width: `${(isHovering ? size * 2 : size + 20)}px`,
             height: `${(isHovering ? size * 2 : size + 20)}px`,
             transform: 'translate(-50%, -50%)'
           }}
         />
       )}
    </div>
  );

  return (
    <GeneratorLayout
      title="Cursor Effect"
      description="Design immersive custom mouse followers, cursor rings, and ambient glow interactions."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
