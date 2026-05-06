"use client";

import { useState, useEffect, useRef } from "react";
import {
  Code,
  Eye,
  RefreshCcw,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  ArrowLeft,
  Cpu,
  FileCode,
  Layers,
  Zap,
  Terminal,
  Maximize2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HtmlCompiler() {
  const [html, setHtml] = useState('<!-- Create something amazing -->\n<div class="card">\n  <h1>UI Compiler</h1>\n  <p>Edit HTML, CSS, and JS to see live changes.</p>\n  <button id="sparkle">Sparkle!</button>\n</div>');
  const [css, setCss] = useState('body {\n  background: #020617;\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  padding: 3rem;\n  border-radius: 2rem;\n  text-align: center;\n  color: white;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);\n}\n\nh1 {\n  margin: 0 0 1rem;\n  font-size: 3rem;\n  font-weight: 900;\n  background: linear-gradient(to right, #8b5cf6, #ec4899);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\np {\n  color: #94a3b8;\n  margin-bottom: 2rem;\n}\n\nbutton {\n  background: #8b5cf6;\n  color: white;\n  border: none;\n  padding: 0.75rem 2rem;\n  border-radius: 1rem;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);\n}');
  const [js, setJs] = useState('document.getElementById("sparkle").addEventListener("click", () => {\n  alert("✨ UI Engine is Awesome! ✨");\n});');

  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const combined = `
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}<\/script>
          </body>
        </html>
      `;
      setSrcDoc(combined);
    }, 500);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const handleCopy = () => {
    const code = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JS\n${js}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    if (confirm("Reset all editors to default?")) {
      setHtml('<!-- Create something amazing -->\n<div class="card">\n  <h1>UI Compiler</h1>\n  <p>Edit HTML, CSS, and JS to see live changes.</p>\n  <button id="sparkle">Sparkle!</button>\n</div>');
      setCss('body {\n  background: #020617;\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  padding: 3rem;\n  border-radius: 2rem;\n  text-align: center;\n  color: white;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);\n}\n\nh1 {\n  margin: 0 0 1rem;\n  font-size: 3rem;\n  font-weight: 900;\n  background: linear-gradient(to right, #8b5cf6, #ec4899);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\np {\n  color: #94a3b8;\n  margin-bottom: 2rem;\n}\n\nbutton {\n  background: #8b5cf6;\n  color: white;\n  border: none;\n  padding: 0.75rem 2rem;\n  border-radius: 1rem;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);\n}');
      setJs('document.getElementById("sparkle").addEventListener("click", () => {\n  alert("✨ UI Engine is Awesome! ✨");\n});');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-brand-primary uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              Online <span className="text-brand-primary">Compiler</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium max-w-xl">
              A high-performance live editing environment for rapid HTML5 prototyping and real-time visualization.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl",
              copied ? "bg-emerald-500 text-white" : "bg-brand-primary text-white hover:bg-brand-accent"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Export Bundle'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Section */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden shadow-2xl flex flex-col h-[650px]">
            {/* Tabs */}
            <div className="flex items-center justify-between px-8 py-4 bg-white/[0.02] border-b border-white/5">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("html")}
                  className={cn(
                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === "html" ? "text-brand-primary" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  HTML5
                </button>
                <button
                  onClick={() => setActiveTab("css")}
                  className={cn(
                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === "css" ? "text-brand-primary" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  CSS
                </button>
                <button
                  onClick={() => setActiveTab("js")}
                  className={cn(
                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === "js" ? "text-brand-primary" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <Zap className="w-3.5 h-3.5" />
                  JS Core
                </button>
              </div>
              <div className="flex gap-1.5 opacity-50">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              </div>
            </div>

            {/* Code Areas */}
            <div className="flex-1 relative group">
              {activeTab === "html" && (
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="absolute inset-0 w-full h-full bg-transparent p-8 font-mono text-[11px] leading-relaxed text-indigo-100/90 outline-none resize-none custom-scrollbar"
                  spellCheck="false"
                />
              )}
              {activeTab === "css" && (
                <textarea
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  className="absolute inset-0 w-full h-full bg-transparent p-8 font-mono text-[11px] leading-relaxed text-indigo-100/90 outline-none resize-none custom-scrollbar"
                  spellCheck="false"
                />
              )}
              {activeTab === "js" && (
                <textarea
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  className="absolute inset-0 w-full h-full bg-transparent p-8 font-mono text-[11px] leading-relaxed text-indigo-100/90 outline-none resize-none custom-scrollbar"
                  spellCheck="false"
                />
              )}
            </div>

            {/* Stats Footer */}
            <div className="px-8 py-3 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              <div className="flex items-center gap-4">
                <span>UTF-8</span>
                <span>Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                Live Sync Active
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-brand-primary/5 border border-brand-primary/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Edge Rendering</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Low-latency execution environment optimized for modern web standards and rapid UI iteration.
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-6 space-y-6">
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
                <button onClick={() => setViewport("desktop")} className={cn("p-2 rounded-lg transition-all", viewport === "desktop" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}><Monitor className="w-4 h-4" /></button>
                <button onClick={() => setViewport("tablet")} className={cn("p-2 rounded-lg transition-all", viewport === "tablet" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}><Tablet className="w-4 h-4" /></button>
                <button onClick={() => setViewport("mobile")} className={cn("p-2 rounded-lg transition-all", viewport === "mobile" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}><Smartphone className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="h-[650px] rounded-[3rem] bg-[#020617] border border-white/5 shadow-2xl relative overflow-hidden flex items-center justify-center transition-all group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-brand-primary)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />

              <div className={cn(
                "relative z-10 h-full transition-all duration-500 bg-white shadow-2xl overflow-hidden flex flex-col",
                viewport === "desktop" ? "w-full" : viewport === "tablet" ? "w-[450px] h-[600px] rounded-3xl" : "w-[320px] h-[550px] rounded-3xl"
              )}>
                {/* Browser Frame */}
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 border-b border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 bg-white rounded-lg h-6 flex items-center px-3 gap-2 border border-slate-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">localhost:3000/preview</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded bg-slate-200" />
                  </div>
                </div>

                <iframe
                  ref={iframeRef}
                  srcDoc={srcDoc}
                  title="Compiler Preview"
                  className="flex-1 w-full border-none"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
