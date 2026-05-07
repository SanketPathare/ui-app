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
  };

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
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Cursor Color</label>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
           <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
           <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="bg-transparent border-none text-xs font-mono text-white w-full uppercase" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Cursor Size <span>{size}px</span>
        </label>
        <input 
          type="range" min="10" max="200" value={size} 
          onChange={(e) => setSize(parseInt(e.target.value))}
          className="w-full accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
           Blur Intensity <span>{blur}px</span>
        </label>
        <input 
          type="range" min="0" max="100" value={blur} 
          onChange={(e) => setBlur(parseInt(e.target.value))}
          className="w-full accent-brand-primary"
        />
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
      className="w-full h-80 rounded-[2.5rem] bg-slate-900 border border-white/5 overflow-hidden relative cursor-none flex items-center justify-center group"
    >
       <div className="text-center space-y-3 opacity-30 group-hover:opacity-100 transition-opacity">
          <MousePointer2 className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hover to Test Cursor</p>
       </div>
       
       {/* Custom Follower */}
       <div 
         className="absolute pointer-events-none transition-all duration-75 ease-out rounded-full"
         style={{ 
           left: cursorPos.x,
           top: cursorPos.y,
           width: `${size}px`,
           height: `${size}px`,
           backgroundColor: color,
           filter: `blur(${blur}px)`,
           opacity: opacity,
           transform: 'translate(-50%, -50%)'
         }}
       />

       {/* Outer Ring */}
       <div 
         className="absolute pointer-events-none transition-all duration-300 ease-out border border-white/20 rounded-full"
         style={{ 
           left: cursorPos.x,
           top: cursorPos.y,
           width: `${size + 20}px`,
           height: `${size + 20}px`,
           transform: 'translate(-50%, -50%)'
         }}
       />
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
