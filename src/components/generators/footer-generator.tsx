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

  const tailwindCode = `<footer class="bg-${theme === "dark" ? "slate-900" : "slate-950"} border-t border-[var(--border)] py-[${paddingY}px] px-6">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-12">
      <!-- Logo & Desc -->
      <div class="space-y-6">
        <h3 class="font-black text-xl tracking-tight">BRAND</h3>
        <p class="text-sm text-[var(--text-tertiary)] leading-relaxed max-w-xs">Building the next generation of the web with high-fidelity UI components.</p>
        ${showSocials ? `<div class="flex gap-4">
          <a href="#" class="p-2 bg-[var(--bg-card)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors"><Globe class="w-4 h-4"/></a>
          <a href="#" class="p-2 bg-[var(--bg-card)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors"><Mail class="w-4 h-4"/></a>
        </div>` : ""}
      </div>
      
      <!-- Columns -->
      ${Array.from({ length: columns - 1 }).map((_, i) => `
      <div>
        <h4 class="text-xs font-black uppercase tracking-widest mb-6 text-white">Resources</h4>
        <ul class="space-y-3">
          <li><a href="#" class="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Documentation</a></li>
          <li><a href="#" class="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Components</a></li>
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
            <label className="text-sm font-medium text-[var(--text-secondary)]">Columns</label>
            <span className="text-[10px] font-bold text-[var(--text-primary)] font-mono">{columns}</span>
          </div>
          <input 
            type="range"
            value={columns} 
            min={1} 
            max={6} 
            step={1} 
            onChange={(e) => setColumns(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-slate-400"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Padding Y</label>
            <span className="text-[10px] font-bold text-[var(--text-primary)] font-mono">{paddingY}px</span>
          </div>
          <input 
            type="range"
            value={paddingY} 
            min={32} 
            max={160} 
            step={8} 
            onChange={(e) => setPaddingY(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-slate-400"
          />
        </div>

        <div className="pt-4 space-y-4 border-t border-[var(--border)]">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Social Icons</span>
            <div 
              onClick={() => setShowSocials(!showSocials)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                showSocials ? "bg-slate-400 shadow-lg shadow-slate-400/20" : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                showSocials ? "left-6" : "left-1"
              )} />
            </div>
          </label>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Theme</span>
            <div className="flex bg-[var(--bg-card)] rounded-lg p-1 border border-[var(--border)]">
               <button 
                 onClick={() => setTheme("dark")}
                 className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all", theme === "dark" ? "bg-[var(--bg-active)] text-white" : "text-[var(--text-secondary)]")}
               >
                 Slate
               </button>
               <button 
                 onClick={() => setTheme("black")}
                 className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all", theme === "black" ? "bg-[var(--bg-active)] text-white" : "text-[var(--text-secondary)]")}
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
    <div className="w-full h-[350px] bg-[var(--bg)] rounded-[12px] p-6 relative overflow-hidden flex items-center justify-center">
      <footer 
        className={cn(
          "w-full max-w-5xl rounded-[8px] border border-[var(--border)] transition-all duration-500 overflow-hidden",
          theme === "dark" ? "bg-[var(--bg-card)]" : "bg-[var(--bg)]"
        )}
        style={{ padding: `${paddingY / 2}px 24px` }}
      >
        <div 
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          <div className="space-y-4">
            <div className="h-4 w-20 bg-[var(--bg-active)] rounded-full" />
            <div className="space-y-1.5">
               <div className="h-1.5 w-full bg-[var(--bg-card)] rounded-full" />
               <div className="h-1.5 w-2/3 bg-[var(--bg-card)] rounded-full" />
            </div>
            {showSocials && (
               <div className="flex gap-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-lg bg-[var(--bg-card)]" />)}
               </div>
            )}
          </div>
          {Array.from({ length: columns - 1 }).map((_, i) => (
            <div key={i} className="space-y-4">
               <div className="h-3 w-12 bg-[var(--bg-hover)] rounded-full" />
               <div className="space-y-2">
                  {[1,2,3].map(j => <div key={j} className="h-1.5 w-full bg-[var(--bg-card)] rounded-full" />)}
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
