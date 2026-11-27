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

  const tailwindCode = `<>
  <style>{\`@keyframes typing { from { width: 0 } } @keyframes blink { 50% { border-color: transparent } }\`}</style>
  <div
    className="font-mono text-[${fontSize}px] border-r-4 border-[${cursorColor}] w-[${text.length}ch] overflow-hidden whitespace-nowrap"
    style={{ animation: "typing ${speed}s steps(${text.length}) ${infinite ? "infinite" : "1"}, blink 0.5s step-end infinite alternate" }}
  >
    ${text}
  </div>
</>`;

  const htmlCode = `<div class="typing-demo">${text}</div>

<style>
.typing-demo {
  width: ${text.length}ch;
  font-size: ${fontSize}px;
  animation: typing ${speed}s steps(${text.length}) ${infinite ? "infinite" : "1"}, blink .5s step-end infinite alternate;
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
          <label className="text-sm font-medium text-[var(--text-secondary)]">Content</label>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[11px] font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]/30 transition-all"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Typing Speed (s)</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{speed}s</span>
          </div>
          <input 
            type="range"
            value={speed} 
            min={1} 
            max={10} 
            step={0.1} 
            onChange={(e) => setSpeed(parseFloat(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Font Size</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{fontSize}px</span>
          </div>
          <input 
            type="range"
            value={fontSize} 
            min={16} 
            max={64} 
            step={2} 
            onChange={(e) => setFontSize(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Cursor Color</label>
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

        <div className="pt-4 border-t border-[var(--border)]">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Infinite Loop</span>
            <div 
              onClick={() => setInfinite(!infinite)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                infinite ? "bg-[var(--text-primary)]" : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full transition-all duration-300",
                infinite ? "left-6 bg-[var(--bg)]" : "left-1 bg-[var(--text-primary)]"
              )} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const preview = (
    <>
    <div className="w-full h-[300px] flex items-center justify-center rounded-[12px] p-12 overflow-hidden">
       <div 
         key={text + speed + infinite} // Force animation restart on change
         className="font-mono font-black text-[var(--text-primary)] whitespace-nowrap overflow-hidden border-r-4 transition-all duration-300"
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

    </div>
     
    </>
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
