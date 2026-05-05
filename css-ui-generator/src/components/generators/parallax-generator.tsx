"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Layers, Sparkles, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ParallaxGenerator() {
  const [intensity, setIntensity] = useState(20);
  const [perspective, setPerspective] = useState(1000);
  const [duration, setDuration] = useState(0.2);
  const [showGlow, setShowGlow] = useState(true);
  const [accentColor, setAccentColor] = useState("#8b5cf6");

  const cssCode = `.parallax-wrapper {
  perspective: ${perspective}px;
}

.parallax-card {
  transform-style: preserve-3d;
  transition: transform ${duration}s ease-out;
  position: relative;
}

/* JavaScript required for mouse tracking */
.parallax-card:hover {
  /* Dynamic transform: rotateX(nY) rotateY(nX) */
}

.parallax-layer {
  transform: translateZ(50px);
  position: absolute;
}`;

  const tailwindCode = `<div class="group [perspective:1000px]">
  <div class="relative transition-all duration-200 [transform-style:preserve-3d] group-hover:[transform:rotateX(10deg)_rotateY(10deg)]">
    <!-- Card Content -->
    <div class="absolute inset-0 [transform:translateZ(50px)]">Floating Layer</div>
  </div>
</div>`;

  const htmlCode = `<div class="container">
  <div class="parallax-card">
    <div class="layer">Layer 1</div>
    <div class="layer front">Layer 2</div>
  </div>
</div>

<style>
.container { perspective: 1000px; }
.parallax-card { transform-style: preserve-3d; transition: 0.2s; }
.layer { position: absolute; }
.front { transform: translateZ(50px); }
</style>`;

  const reset = () => {
    setIntensity(20);
    setPerspective(1000);
    setDuration(0.2);
    setShowGlow(true);
    setAccentColor("#8b5cf6");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Tilt Intensity</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{intensity}</span>
          </div>
          <input 
            type="range"
            value={intensity} 
            min={5} 
            max={50} 
            step={1} 
            onChange={(e) => setIntensity(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Perspective</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{perspective}px</span>
          </div>
          <input 
            type="range"
            value={perspective} 
            min={500} 
            max={2000} 
            step={100} 
            onChange={(e) => setPerspective(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Accent Color</label>
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

        <div className="pt-4 border-t border-white/5">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">Depth Glow</span>
            <div 
              onClick={() => setShowGlow(!showGlow)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                showGlow ? "bg-brand-primary shadow-lg shadow-brand-primary/20" : "bg-white/10"
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

  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;
    setRotation({ 
      x: -yPercent * intensity, 
      y: xPercent * intensity 
    });
  };

  const preview = (
    <div className="w-full h-[450px] flex items-center justify-center bg-black/20 rounded-[2rem] p-12 overflow-hidden [perspective:1000px]">
       <div 
         className="w-80 h-96 relative group cursor-pointer [transform-style:preserve-3d] transition-all ease-out"
         style={{ 
            perspective: `${perspective}px`,
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transitionDuration: `${duration}s`
         }}
         onMouseMove={handleMouseMove}
         onMouseLeave={() => setRotation({ x: 0, y: 0 })}
       >
          {/* Base Layer */}
          <div className="absolute inset-0 bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
             {/* Decorative grid */}
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>

          {/* Middle Layer (Floating Icon) */}
          <div 
            className="absolute inset-0 flex items-center justify-center [transform:translateZ(60px)] pointer-events-none"
          >
             <div className="w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
                <Layers className="w-10 h-10 text-white opacity-40" />
             </div>
          </div>

          {/* Top Layer (Title) */}
          <div className="absolute bottom-12 left-0 w-full px-8 [transform:translateZ(100px)] pointer-events-none">
             <div className="space-y-2">
                <div className="h-4 w-24 bg-white/20 rounded-full" style={{ backgroundColor: accentColor + '40' }} />
                <div className="h-2 w-full bg-white/5 rounded-full" />
                <div className="h-2 w-2/3 bg-white/5 rounded-full" />
             </div>
          </div>

          {/* Dynamic Glow */}
          {showGlow && (
            <div 
              className="absolute inset-0 pointer-events-none blur-[60px] opacity-20"
              style={{ 
                 background: `radial-gradient(circle at ${50 + rotation.y}% ${50 - rotation.x}%, ${accentColor}, transparent)`,
                 transform: 'translateZ(-20px)'
              }}
            />
          )}
       </div>

       <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
          <MousePointer2 className="w-3 h-3 text-brand-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white">Interactive 3D Space</span>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Parallax"
      description="Create immersive 3D parallax effects and depth layers."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
