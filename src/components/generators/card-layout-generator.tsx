"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Grid, Layout, Image as ImageIcon, Heart, Share2, ArrowRight, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function CardLayoutGenerator() {
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState(24);
  const [borderRadius, setBorderRadius] = useState(24);
  const [padding, setPadding] = useState(24);
  const [hoverEffect, setHoverEffect] = useState(true);
  const [showImage, setShowImage] = useState(true);

  const reactCode = `import React from 'react';
import { Heart, Share2, ArrowRight, Star } from 'lucide-react';

export const CardGrid = () => {
  const cards = [1, 2, 3]; // Example data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-[${gap}px] w-full">
      {cards.map((item) => (
        <div 
          key={item}
          className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/5 p-[${padding}px] rounded-[${borderRadius}px] transition-all duration-500 ${hoverEffect ? "hover:-translate-y-2 hover:border-pink-500/30 hover:shadow-[0_20px_50px_rgba(236,72,153,0.1)]" : ""}"
        >
          {${showImage} && (
            <div className="relative aspect-video mb-6 overflow-hidden rounded-[${Math.max(0, borderRadius - 8)}px] bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" 
                alt="Card visual"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:text-pink-500 transition-colors">
                  <Heart size={14} />
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-md bg-pink-500/10 text-pink-500 text-[10px] font-bold uppercase tracking-wider">
                Featured
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={10} fill="currentColor" />
                <span className="text-[10px] font-bold">4.9</span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-white group-hover:text-pink-500 transition-colors line-clamp-1">
              Premium Card Component
            </h3>
            
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
              A highly optimized, glassmorphic card architecture designed for modern high-performance interfaces.
            </p>
            
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Price</span>
                <span className="text-white font-black">$99.00</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95">
                Buy Now
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};`;

  const cssCode = `.card-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${gap}px;
  width: 100%;
}

@media (min-width: 768px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(${columns}, 1fr); }
}

.card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius}px;
  padding: ${padding}px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

${hoverEffect ? `.card:hover {
  transform: translateY(-8px);
  border-color: rgba(236, 72, 153, 0.3);
  box-shadow: 0 20px 50px rgba(236, 72, 153, 0.1);
}` : ""}

.card-image {
  aspect-ratio: 16/9;
  background: #1e293b;
  border-radius: ${Math.max(0, borderRadius - 8)}px;
  margin-bottom: 24px;
  overflow: hidden;
}

.card-title {
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-desc {
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.6;
}`;

  const htmlCode = `<div class="card-grid">
  <!-- Card 1 -->
  <div class="card">
    ${showImage ? `<div class="card-image">
      <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800" style="width:100%; height:100%; object-fit:cover; opacity:0.8;" />
    </div>` : ""}
    <h3 class="card-title">Premium Card Component</h3>
    <p class="card-desc">A highly optimized, glassmorphic card architecture designed for modern high-performance interfaces.</p>
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
      <span style="color: white; font-weight: 900;">$99.00</span>
      <button style="background: #ec4899; color: white; border: none; padding: 8px 16px; border-radius: 12px; font-weight: 700; cursor: pointer;">Action</button>
    </div>
  </div>
</div>

<style>
.card-grid { display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${gap}px; }
.card { background: #0f172a; border-radius: ${borderRadius}px; padding: ${padding}px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; }
.card:hover { transform: translateY(-5px); border-color: #ec4899; }
.card-image { aspect-ratio: 16/9; background: #1e293b; border-radius: ${Math.max(0, borderRadius - 8)}px; margin-bottom: 1rem; overflow: hidden; }
.card-title { color: white; font-weight: 700; margin-bottom: 0.5rem; }
.card-desc { color: #94a3b8; font-size: 0.875rem; }
</style>`;

  const reset = () => {
    setColumns(3);
    setGap(24);
    setBorderRadius(24);
    setPadding(24);
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

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Internal Padding</label>
            <span className="text-[10px] font-bold text-pink-500 font-mono">{padding}px</span>
          </div>
          <input 
            type="range"
            value={padding} 
            min={12} 
            max={40} 
            step={1} 
            onChange={(e) => setPadding(parseInt(e.target.value))} 
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
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
       <div 
         className="grid w-full"
         style={{ 
           gridTemplateColumns: `repeat(${columns}, 1fr)`,
           gap: `${gap}px`
         }}
       >
         {Array.from({ length: columns }).map((_, i) => (
           <div 
             key={i}
             className={cn(
               "bg-slate-900/50 backdrop-blur-xl border border-white/5 flex flex-col transition-all duration-500 group/card",
               hoverEffect ? "hover:-translate-y-2 hover:border-pink-500/30 hover:shadow-[0_20px_50px_rgba(236,72,153,0.1)]" : ""
             )}
             style={{ 
               borderRadius: `${borderRadius}px`,
               padding: `${padding}px`
             }}
           >
             {showImage && (
               <div 
                 className="w-full aspect-video bg-slate-800 border border-white/5 flex items-center justify-center mb-6 overflow-hidden relative group"
                 style={{ borderRadius: `${Math.max(0, borderRadius - 8)}px` }}
               >
                 <img 
                   src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" 
                   alt="Preview"
                   className="w-full h-full object-cover opacity-60 group-hover/card:scale-110 group-hover/card:opacity-80 transition-all duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
               </div>
             )}
             
             <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                   <div className="h-4 w-20 bg-pink-500/10 border border-pink-500/20 rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-black uppercase text-pink-500 tracking-widest">Premium</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                      <span className="text-[9px] font-bold text-white/50">4.9</span>
                   </div>
                </div>
                <h3 className="text-sm font-black text-white group-hover/card:text-pink-500 transition-colors">Digital Architecture</h3>
                <div className="space-y-1.5">
                   <div className="h-1.5 w-full bg-white/10 rounded-full" />
                   <div className="h-1.5 w-2/3 bg-white/5 rounded-full" />
                </div>
             </div>
             
             <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Entry Fee</span>
                   <span className="text-xs font-black text-white">$99.00</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-hover/card:scale-110 transition-transform">
                   <ArrowRight className="w-4 h-4" />
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
      description="Design high-performance, glassmorphic card architectures for modern digital experiences."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={reactCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
