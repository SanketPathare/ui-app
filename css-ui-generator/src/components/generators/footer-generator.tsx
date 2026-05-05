"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Layout, Mail, Globe, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FooterGenerator() {
  const [columns, setColumns] = useState(4);
  const [paddingY, setPaddingY] = useState(64);
  const [showSocials, setShowSocials] = useState(true);
  const [showNewsletter, setShowNewsletter] = useState(true);
  const [theme, setTheme] = useState<"dark" | "black">("dark");

  const cssCode = `.footer {
  padding: ${paddingY}px 24px;
  background: ${theme === "dark" ? "#0f172a" : "#020617"};
  color: white;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: 48px;
  max-width: 1280px;
  margin: 0 auto;
}

.footer-column h4 {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
}

.footer-link {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 12px;
}

.social-links {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}`;

  const tailwindCode = `<footer class="bg-${theme === "dark" ? "slate-900" : "slate-950"} border-t border-white/10 py-[${paddingY}px] px-6">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-12">
      <!-- Logo & Desc -->
      <div class="space-y-6">
        <h3 class="font-black text-xl tracking-tight">BRAND</h3>
        <p class="text-sm text-white/60 leading-relaxed max-w-xs">Building the next generation of the web with high-fidelity UI components.</p>
        ${showSocials ? `<div class="flex gap-4">
          <a href="#" class="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><Globe class="w-4 h-4"/></a>
          <a href="#" class="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><Mail class="w-4 h-4"/></a>
        </div>` : ""}
      </div>
      
      <!-- Columns -->
      ${Array.from({ length: columns - 1 }).map((_, i) => `
      <div>
        <h4 class="text-xs font-black uppercase tracking-widest mb-6 text-white">Resources</h4>
        <ul class="space-y-3">
          <li><a href="#" class="text-sm text-white/60 hover:text-white transition-colors">Documentation</a></li>
          <li><a href="#" class="text-sm text-white/60 hover:text-white transition-colors">Components</a></li>
        </ul>
      </div>`).join("")}
    </div>
  </div>
</footer>`;

  const htmlCode = `<footer class="footer">
  <div class="footer-grid">
    <div class="footer-column">
      <h4>Company</h4>
      <a href="#" class="footer-link">About Us</a>
      <a href="#" class="footer-link">Careers</a>
    </div>
    <!-- More columns -->
  </div>
</footer>`;

  const reset = () => {
    setColumns(4);
    setPaddingY(64);
    setShowSocials(true);
    setShowNewsletter(true);
    setTheme("dark");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Columns</label>
            <span className="text-[10px] font-bold text-slate-300 font-mono">{columns}</span>
          </div>
          <input 
            type="range"
            value={columns} 
            min={1} 
            max={6} 
            step={1} 
            onChange={(e) => setColumns(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-slate-400"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Padding Y</label>
            <span className="text-[10px] font-bold text-slate-300 font-mono">{paddingY}px</span>
          </div>
          <input 
            type="range"
            value={paddingY} 
            min={32} 
            max={160} 
            step={8} 
            onChange={(e) => setPaddingY(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-slate-400"
          />
        </div>

        <div className="pt-4 space-y-4 border-t border-white/5">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">Social Icons</span>
            <div 
              onClick={() => setShowSocials(!showSocials)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                showSocials ? "bg-slate-400 shadow-lg shadow-slate-400/20" : "bg-white/10"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                showSocials ? "left-6" : "left-1"
              )} />
            </div>
          </label>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Theme</span>
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
               <button 
                 onClick={() => setTheme("dark")}
                 className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all", theme === "dark" ? "bg-slate-700 text-white" : "text-slate-500")}
               >
                 Slate
               </button>
               <button 
                 onClick={() => setTheme("black")}
                 className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all", theme === "black" ? "bg-slate-700 text-white" : "text-slate-500")}
               >
                 Deep
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[350px] bg-black/20 rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-center">
      <footer 
        className={cn(
          "w-full max-w-5xl rounded-2xl border border-white/10 transition-all duration-500 overflow-hidden",
          theme === "dark" ? "bg-slate-900" : "bg-slate-950"
        )}
        style={{ padding: `${paddingY / 2}px 24px` }}
      >
        <div 
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          <div className="space-y-4">
            <div className="h-4 w-20 bg-white/20 rounded-full" />
            <div className="space-y-1.5">
               <div className="h-1.5 w-full bg-white/5 rounded-full" />
               <div className="h-1.5 w-2/3 bg-white/5 rounded-full" />
            </div>
            {showSocials && (
               <div className="flex gap-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-lg bg-white/5" />)}
               </div>
            )}
          </div>
          {Array.from({ length: columns - 1 }).map((_, i) => (
            <div key={i} className="space-y-4">
               <div className="h-3 w-12 bg-white/10 rounded-full" />
               <div className="space-y-2">
                  {[1,2,3].map(j => <div key={j} className="h-1.5 w-full bg-white/5 rounded-full" />)}
               </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );

  return (
    <GeneratorLayout
      title="Footer Builder"
      description="Create information-rich footers with multi-column layouts."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
