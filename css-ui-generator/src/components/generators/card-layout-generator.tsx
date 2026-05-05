"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Grid, Layout, Image as ImageIcon, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CardLayoutGenerator() {
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState(24);
  const [borderRadius, setBorderRadius] = useState(24);
  const [padding, setPadding] = useState(20);
  const [hoverEffect, setHoverEffect] = useState(true);
  const [showImage, setShowImage] = useState(true);

  const cssCode = `.card-grid {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: ${gap}px;
  width: 100%;
}

.card {
  background: #1e293b;
  border-radius: ${borderRadius}px;
  padding: ${padding}px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

${hoverEffect ? `.card:hover {
  transform: translateY(-8px);
  border-color: rgba(236, 72, 153, 0.5);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}` : ""}

.card-image {
  width: 100%;
  aspect-ratio: 16/9;
  background: #334155;
  border-radius: ${borderRadius - 8}px;
  margin-bottom: 16px;
}`;

  const tailwindCode = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-[${gap}px]">
  <!-- Card Item -->
  <div class="bg-slate-800 p-[${padding}px] rounded-[${borderRadius}px] border border-white/10 ${hoverEffect ? "hover:-translate-y-2 hover:border-pink-500/50 hover:shadow-2xl transition-all duration-300" : ""}">
    ${showImage ? `<div class="aspect-video bg-slate-700 rounded-[${borderRadius - 8}px] mb-4"></div>` : ""}
    <h3 class="text-white font-bold mb-2">Card Title</h3>
    <p class="text-white/60 text-sm mb-4">A premium card component with modern interactions.</p>
    <div class="flex items-center justify-between">
      <span class="text-pink-500 font-bold">$99</span>
      <button class="px-4 py-2 bg-pink-500 text-white rounded-lg text-xs font-bold">Action</button>
    </div>
  </div>
</div>`;

  const htmlCode = `<div class="card-grid">
  <div class="card">
    <div class="card-image"></div>
    <h3>Card Title</h3>
    <p>Card description text goes here.</p>
  </div>
</div>

<style>
.card-grid { display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${gap}px; }
.card { background: #1e293b; border-radius: ${borderRadius}px; padding: ${padding}px; border: 1px solid rgba(255,255,255,0.1); }
.card-image { aspect-ratio: 16/9; background: #334155; border-radius: 8px; margin-bottom: 1rem; }
</style>`;

  const reset = () => {
    setColumns(3);
    setGap(24);
    setBorderRadius(24);
    setPadding(20);
    setHoverEffect(true);
    setShowImage(true);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Grid Columns</label>
            <span className="text-[10px] font-bold text-pink-500 font-mono">{columns}</span>
          </div>
          <input 
            type="range"
            value={columns} 
            min={1} 
            max={4} 
            step={1} 
            onChange={(e) => setColumns(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Border Radius</label>
            <span className="text-[10px] font-bold text-pink-500 font-mono">{borderRadius}px</span>
          </div>
          <input 
            type="range"
            value={borderRadius} 
            min={0} 
            max={48} 
            step={1} 
            onChange={(e) => setBorderRadius(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        <div className="pt-4 space-y-4 border-t border-white/5">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">Hover Animation</span>
            <div 
              onClick={() => setHoverEffect(!hoverEffect)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                hoverEffect ? "bg-pink-500 shadow-lg shadow-pink-500/20" : "bg-white/10"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                hoverEffect ? "left-6" : "left-1"
              )} />
            </div>
          </label>

          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">Show Visual Content</span>
            <div 
              onClick={() => setShowImage(!showImage)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                showImage ? "bg-pink-500 shadow-lg shadow-pink-500/20" : "bg-white/10"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                showImage ? "left-6" : "left-1"
              )} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[400px] bg-black/20 rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-center">
       <div 
         className="grid w-full h-full max-w-5xl content-center"
         style={{ 
           gridTemplateColumns: `repeat(${columns}, 1fr)`,
           gap: `${gap}px`
         }}
       >
         {Array.from({ length: columns }).map((_, i) => (
           <div 
             key={i}
             className={cn(
               "bg-slate-900 border border-white/5 flex flex-col transition-all duration-500 group/card",
               hoverEffect ? "hover:-translate-y-2 hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/5" : ""
             )}
             style={{ 
               borderRadius: `${borderRadius}px`,
               padding: `${padding}px`
             }}
           >
             {showImage && (
               <div 
                 className="w-full aspect-video bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4 overflow-hidden"
                 style={{ borderRadius: `${Math.max(0, borderRadius - 8)}px` }}
               >
                 <ImageIcon className="w-6 h-6 text-white/10 group-hover/card:scale-110 transition-transform duration-500" />
               </div>
             )}
             <div className="space-y-2 mb-6">
                <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                <div className="space-y-1">
                   <div className="h-1.5 w-full bg-white/5 rounded-full" />
                   <div className="h-1.5 w-1/2 bg-white/5 rounded-full" />
                </div>
             </div>
             <div className="mt-auto flex items-center justify-between">
                <div className="h-4 w-12 bg-pink-500/20 rounded-lg" />
                <div className="flex gap-2">
                   <Heart className="w-3.5 h-3.5 text-white/20" />
                   <Share2 className="w-3.5 h-3.5 text-white/20" />
                </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Card Layouts"
      description="Design responsive grid-based card architectures for content."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
