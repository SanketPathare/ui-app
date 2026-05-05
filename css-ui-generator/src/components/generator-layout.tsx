"use client";

import { ReactNode } from "react";
import { Copy, Check, RefreshCcw, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GeneratorLayoutProps {
  title: string;
  description: string;
  controls: ReactNode;
  preview: ReactNode;
  cssCode: string;
  tailwindCode?: string;
  htmlCode?: string;
  onReset?: () => void;
}

export function GeneratorLayout({
  title,
  description,
  controls,
  preview,
  cssCode,
  tailwindCode,
  htmlCode,
  onReset
}: GeneratorLayoutProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"css" | "tailwind" | "html">("css");

  const copyToClipboard = () => {
    let codeToCopy = "";
    if (activeTab === "css") codeToCopy = cssCode;
    else if (activeTab === "tailwind") codeToCopy = tailwindCode || "";
    else codeToCopy = htmlCode || "";
    
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
          <Link 
            href="/"
            className=" mb-6 inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
          </Link>
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            
            <h1 className="text-3xl font-display font-black tracking-tight text-white leading-none">
              {title}
            </h1>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </div>
        
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-white/5 bg-white/5 hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#020617] rounded-[2rem] border border-white/5 shadow-none overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <h2 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <div className="w-1 h-3 bg-brand-primary rounded-full" />
                Parameters
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {controls}
            </div>
          </div>

          <div className="bg-[#020617] rounded-[2rem] border border-white/5 shadow-none overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <h2 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <div className="w-1 h-3 bg-brand-secondary rounded-full" />
                Engine Specs
              </h2>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                   <span className="text-slate-400">Core Property</span>
                   <span className="text-brand-primary">{title}</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                   <span className="text-slate-400">Browser Support</span>
                   <span className="text-emerald-500">98.4%</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                   <span className="text-slate-400">Spec Status</span>
                   <span className="text-amber-500">Stable</span>
                 </div>
               </div>
               <div className="pt-4 border-t border-white/5">
                 <a 
                   href={`https://developer.mozilla.org/en-US/docs/Web/CSS/${title.toLowerCase().replace(/ /g, "-")}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-[9px] font-black text-brand-primary hover:text-brand-accent uppercase tracking-widest transition-colors flex items-center gap-1.5"
                 >
                   MDN Documentation Reference
                   <div className="w-3 h-3 rounded-full bg-brand-primary/10 flex items-center justify-center">
                     ↗
                   </div>
                 </a>
               </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative aspect-square md:aspect-video lg:aspect-auto lg:h-[450px] rounded-[2.5rem] border border-white/5 bg-[#020617] shadow-brand-primary/5 group overflow-hidden">
            <div className="absolute inset-0 preview-checkerboard opacity-[0.07]" />
            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-brand-primary/5 blur-[100px] pointer-events-none" />
            
            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
               <div className="overflow-visible flex items-center justify-center">
                 <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                   {preview}
                 </div>
               </div>
            </div>
            
            <div className="absolute top-4 left-4">
               <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                 <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                 Render Output
               </div>
            </div>
          </div>

          <div className="bg-[#020617] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 p-1 rounded-lg bg-black/20 border border-white/5">
                  <button
                    onClick={() => setActiveTab("css")}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all",
                      activeTab === "css" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    CSS
                  </button>
                  {tailwindCode && (
                    <button
                      onClick={() => setActiveTab("tailwind")}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all",
                        activeTab === "tailwind" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Tailwind
                    </button>
                  )}
                  {htmlCode && (
                    <button
                      onClick={() => setActiveTab("html")}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all",
                        activeTab === "html" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      HTML
                    </button>
                  )}
                </div>
                <div className="h-3 w-px bg-slate-700 mx-1.5" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {activeTab === "css" ? "Source.css" : activeTab === "tailwind" ? "Utility.tw" : "Structure.html"}
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className={cn(
                  "group flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                  copied 
                    ? "bg-emerald-500 text-white" 
                    : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
                {copied ? "Copied" : "Copy Code"}
              </button>
            </div>
            <div className="p-6 relative z-10 min-h-[100px]">
              <pre className="text-xs font-mono text-indigo-200/90 overflow-x-auto selection:bg-brand-primary/40 leading-relaxed whitespace-pre-wrap">
                <code className="block py-1">
                  {activeTab === "css" ? cssCode : activeTab === "tailwind" ? tailwindCode : htmlCode}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

