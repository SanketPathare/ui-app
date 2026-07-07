"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Terminal, ArrowRight, Zap, Code, Copy, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function CssToTailwind() {
  const [input, setInput] = useState(".card {\n  background: #111827;\n  padding: 2rem;\n  border-radius: 1rem;\n  display: flex;\n}");
  const [output, setOutput] = useState("bg-gray-900 p-8 rounded-[8px] flex");

  const handleConvert = () => {
    // Placeholder
    setOutput("bg-gray-900 p-8 rounded-[8px] flex");
  };

  const reset = () => {
    setInput("");
    setOutput("");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Traditional CSS</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your CSS classes here..."
          className="w-full h-48 card p-4 text-[11px] font-mono text-[var(--text-primary)] focus:ring-1 focus:ring-brand-primary outline-none transition-all"
        />
      </div>

      <button 
        onClick={handleConvert}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] bg-[var(--text-primary)] text-[var(--bg)] text-xs font-black uppercase tracking-widest hover:opacity-80 transition-all active:scale-95"
      >
        <Zap className="w-4 h-4" />
        Translate to Utilities
      </button>

      <div className="p-4 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border)]">
        <div className="flex items-center gap-2 text-[var(--text-primary)] mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">Compiler Note</span>
        </div>
        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed font-medium">
          Converts hex colors to arbitrary values e.g. <code className="text-[var(--text-primary)]">bg-[#hex]</code> and maps standard spacing to the 4n scale.
        </p>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full max-w-md space-y-4">
       <div className="p-10 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--bg-card)] blur-3xl" />
          <div className="relative z-10 px-6 py-3 rounded-xl card text-[11px] font-mono text-[var(--text-primary)] animate-pulse">
            {output || "Classes will appear here..."}
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="CSS to Tailwind"
      description="Translate traditional CSS properties into equivalent Tailwind utilities."
      controls={controls}
      preview={preview}
      tailwindCode={output}
      onReset={reset}
    />
  );
}
