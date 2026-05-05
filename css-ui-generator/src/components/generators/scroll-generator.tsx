"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { ArrowDownCircle, Sparkles, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollGenerator() {
  const [duration, setDuration] = useState(0.8);
  const [delay, setDelay] = useState(0);
  const [distance, setDistance] = useState(50);
  const [opacity, setOpacity] = useState(0);
  const [effect, setEffect] = useState<"fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in">("fade-up");

  const cssCode = `.animate-on-scroll {
  opacity: 0;
  transform: ${effect === 'fade-up' ? `translateY(${distance}px)` : 
               effect === 'fade-down' ? `translateY(-${distance}px)` :
               effect === 'fade-left' ? `translateX(${distance}px)` :
               effect === 'fade-right' ? `translateX(-${distance}px)` :
               'scale(0.8)'};
  transition: all ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: ${effect === 'zoom-in' ? 'scale(1)' : 'translate(0)'};
}`;

  const tailwindCode = `<div class="reveal opacity-0 ${effect === 'fade-up' ? 'translate-y-12' : effect === 'zoom-in' ? 'scale-90' : ''} transition-all duration-700">
  Scroll to Reveal
</div>`;

  const htmlCode = `<div class="reveal">Content to reveal</div>

<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>

<style>
.reveal { opacity: 0; transform: translateY(30px); transition: 0.8s; }
.reveal.visible { opacity: 1; transform: translateY(0); }
</style>`;

  const reset = () => {
    setDuration(0.8);
    setDelay(0);
    setDistance(50);
    setOpacity(0);
    setEffect("fade-up");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Reveal Effect</label>
          <div className="grid grid-cols-2 gap-2">
            {["fade-up", "fade-down", "fade-left", "fade-right", "zoom-in"].map((eff) => (
              <button
                key={eff}
                onClick={() => setEffect(eff as any)}
                className={cn(
                  "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                  effect === eff 
                    ? "bg-brand-primary/20 border-brand-primary/50 text-brand-primary shadow-lg shadow-brand-primary/10" 
                    : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                )}
              >
                {eff}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Duration (s)</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{duration}s</span>
          </div>
          <input 
            type="range"
            value={duration} 
            min={0.1} 
            max={2} 
            step={0.1} 
            onChange={(e) => setDuration(parseFloat(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Entry Distance</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{distance}px</span>
          </div>
          <input 
            type="range"
            value={distance} 
            min={0} 
            max={200} 
            step={10} 
            onChange={(e) => setDistance(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[400px] flex flex-col items-center bg-black/20 rounded-[2rem] p-4 relative overflow-hidden">
      <div className="flex-1 w-full overflow-y-auto scrollbar-hide flex flex-col items-center gap-24 py-32">
         <div className="text-center space-y-4 opacity-20">
            <ArrowDownCircle className="w-12 h-12 mx-auto animate-bounce" />
            <p className="text-[10px] font-black uppercase tracking-widest">Scroll Down to Reveal</p>
         </div>

         {/* Animating Element */}
         <div 
           className="reveal-demo w-64 h-48 rounded-3xl bg-brand-primary/10 border border-brand-primary/30 flex flex-col items-center justify-center p-8 shadow-2xl shadow-brand-primary/5 transition-all"
           style={{ 
             opacity: 1, // Visible in preview for demo
             transform: 'translate(0) scale(1)',
             transitionDuration: `${duration}s`,
             transitionDelay: `${delay}s`
           }}
         >
            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center mb-4">
               <Layout className="w-6 h-6 text-white" />
            </div>
            <div className="h-2 w-32 bg-white/20 rounded-full mb-2" />
            <div className="h-1.5 w-24 bg-white/10 rounded-full" />
         </div>

         <div className="h-64" /> {/* Spacer */}
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30">
         <Sparkles className="w-3 h-3 text-brand-primary" />
         <span className="text-[9px] font-black uppercase tracking-widest text-white">Scroll-trigger Simulation</span>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Scroll Anim"
      description="Design scroll-triggered animations and entry effects."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
