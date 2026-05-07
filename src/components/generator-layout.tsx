"use client";

import { ReactNode } from "react";
import { Copy, Check, RefreshCcw, ArrowLeft, Sun, Moon, Terminal, Code, Eye } from "lucide-react";
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
  jsCode?: string;
  icon?: ReactNode;
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
  jsCode,
  icon,
  onReset
}: GeneratorLayoutProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"react" | "css" | "html" | "js">("react");
  const [previewMode, setPreviewMode] = useState<"dark" | "light">("dark");

  const copyToClipboard = () => {
    let codeToCopy = "";
    if (activeTab === "css") codeToCopy = cssCode;
    else if (activeTab === "react") codeToCopy = tailwindCode || "";
    else if (activeTab === "html") codeToCopy = htmlCode || "";
    else codeToCopy = jsCode || "";

    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-brand-primary uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
              {icon && <div className="text-brand-primary">{icon}</div>}
              <div>
                {title.split(' ')[0]} <span className="text-brand-primary">{title.split(' ').slice(1).join(' ')}</span>
              </div>
            </h1>
            <p className="text-slate-400 text-sm font-medium max-w-xl">
              {description}
            </p>
          </div>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset Engine
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Zone */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-[#020617] border border-white/5 space-y-8 shadow-2xl">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <div className="w-1 h-3 bg-brand-primary rounded-full" />
                Configuration
              </label>
              <div className="space-y-6">
                {controls}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-brand-primary/5 border border-brand-primary/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Engine Specs</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Optimized for modern browser engines and high-performance UI rendering.
              </p>
            </div>
          </div>
        </div>

        {/* Main Workspace Zone */}
        <div className="lg:col-span-8 space-y-10">
          {/* Simulation Lab */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-xl shadow-brand-primary/5">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">Simulation Lab</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">High-Fidelity Preview</p>
                </div>
              </div>

              <div className="flex p-1 rounded-xl bg-white/5 border border-white/5">
                <button
                  onClick={() => setPreviewMode("light")}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    previewMode === "light" ? "bg-white text-slate-900 shadow-lg" : "text-slate-500 hover:text-slate-400"
                  )}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewMode("dark")}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    previewMode === "dark" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-400"
                  )}
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className={cn(
              "rounded-[3rem] border transition-all duration-500 flex items-center justify-center shadow-3xl min-h-[500px] relative overflow-hidden group",
              previewMode === "dark" ? "bg-[#020617] border-white/5" : "bg-slate-50 border-slate-200"
            )}>
              <div className={cn(
                "absolute inset-0 preview-checkerboard transition-opacity",
                previewMode === "dark" ? "opacity-[0.03]" : "opacity-[0.05]"
              )} />
              <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                {preview}
              </div>
            </div>
          </div>

          {/* Production Console */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/5">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">Production Console</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Copy-Paste Ready Exports</p>
                </div>
              </div>
              <button
                onClick={copyToClipboard}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl",
                  copied ? "bg-emerald-500 text-white" : "bg-brand-primary text-white hover:bg-brand-accent"
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Export Code'}
              </button>
            </div>

            <div className="rounded-[2.5rem] bg-[#030712] border border-white/5 overflow-hidden shadow-3xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between px-8 py-4 bg-white/[0.02] border-b border-white/5 relative z-10">
                <div className="flex gap-4">
                  {tailwindCode && (
                    <button
                      onClick={() => setActiveTab("react")}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        activeTab === "react" ? "text-brand-primary" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      React / Tailwind
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab("css")}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors",
                      activeTab === "css" ? "text-brand-primary" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    CSS
                  </button>
                  {htmlCode && (
                    <button
                      onClick={() => setActiveTab("html")}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        activeTab === "html" ? "text-brand-primary" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      HTML5
                    </button>
                  )}
                  {jsCode && (
                    <button
                      onClick={() => setActiveTab("js")}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        activeTab === "js" ? "text-brand-primary" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      JavaScript
                    </button>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                  {activeTab.toUpperCase()}
                </span>
              </div>
              <div className="p-8 font-mono text-[11px] leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto text-indigo-200/90 relative z-10">
                <pre className="whitespace-pre-wrap">
                  {activeTab === "react" ? tailwindCode : activeTab === "css" ? cssCode : activeTab === "html" ? htmlCode : jsCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
