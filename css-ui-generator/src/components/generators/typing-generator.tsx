"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Type as TypeIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function TypingGenerator() {
  const [speed, setSpeed] = useState(3.5);
  const [fontSize, setFontSize] = useState(32);
  const [cursorColor, setCursorColor] = useState("#8b5cf6");
  const [text, setText] = useState("Hello Creative World!");
  const [infinite, setInfinite] = useState(true);

  const cssCode = `.typing-demo {
  width: ${text.length}ch;
  animation: typing ${speed}s steps(${text.length}), blink .5s step-end infinite alternate;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid ${cursorColor};
  font-family: monospace;
  font-size: ${fontSize}px;
  ${infinite ? "animation-iteration-count: infinite;" : ""}
}

@keyframes typing {
  from { width: 0 }
}
    
@keyframes blink {
  50% { border-color: transparent }
}`;

  const tailwindCode = `<div class="font-mono text-[${fontSize}px] border-r-4 border-[${cursorColor}] w-[${text.length}ch] overflow-hidden whitespace-nowrap animate-typing">
  ${text}
</div>`;

  const htmlCode = `<div class="typing-demo">${text}</div>

<style>
.typing-demo {
  width: ${text.length}ch;
  animation: typing ${speed}s steps(${text.length}), blink .5s step-end infinite alternate;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid ${cursorColor};
  font-family: monospace;
}

@keyframes typing { from { width: 0 } }
@keyframes blink { 50% { border-color: transparent } }
</style>`;

  const reset = () => {
    setSpeed(3.5);
    setFontSize(32);
    setCursorColor("#8b5cf6");
    setText("Hello Creative World!");
    setInfinite(true);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Content</label>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Typing Speed (s)</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{speed}s</span>
          </div>
          <input 
            type="range"
            value={speed} 
            min={1} 
            max={10} 
            step={0.1} 
            onChange={(e) => setSpeed(parseFloat(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Font Size</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{fontSize}px</span>
          </div>
          <input 
            type="range"
            value={fontSize} 
            min={16} 
            max={64} 
            step={2} 
            onChange={(e) => setFontSize(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Cursor Color</label>
          <div className="flex gap-2">
            {["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"].map((color) => (
              <button
                key={color}
                onClick={() => setCursorColor(color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform",
                  cursorColor === color ? "scale-125 border-white" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">Infinite Loop</span>
            <div 
              onClick={() => setInfinite(!infinite)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                infinite ? "bg-brand-primary shadow-lg shadow-brand-primary/20" : "bg-white/10"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                infinite ? "left-6" : "left-1"
              )} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[300px] flex items-center justify-center bg-black/20 rounded-[2rem] p-12 overflow-hidden">
       <div 
         key={text + speed + infinite} // Force animation restart on change
         className="font-mono font-black text-white whitespace-nowrap overflow-hidden border-r-4 transition-all duration-300"
         style={{ 
            fontSize: `${fontSize}px`,
            width: `${text.length}ch`,
            borderColor: cursorColor,
            animation: `typing ${speed}s steps(${text.length}), blink .5s step-end infinite alternate`,
            animationIterationCount: infinite ? 'infinite' : '1'
         }}
       >
         {text}
       </div>
       
       <style>{`
         @keyframes typing {
           from { width: 0 }
         }
         @keyframes blink {
           50% { border-color: transparent }
         }
       `}</style>

       <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
          <Sparkles className="w-3 h-3 text-brand-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white">Dynamic steps animation</span>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Typing"
      description="Create realistic typing and typewriter animations for text content."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
