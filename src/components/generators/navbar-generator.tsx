"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Navigation, Layout, Search, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavbarGenerator() {
  const [height, setHeight] = useState(64);
  const [bgOpacity, setBgOpacity] = useState(70);
  const [blur, setBlur] = useState(16);
  const [sticky, setSticky] = useState(true);
  const [borderBottom, setBorderBottom] = useState(true);
  const [accentColor, setAccentColor] = useState("#8b5cf6");

  const cssCode = `.navbar {
  height: ${height}px;
  background: rgba(15, 23, 42, ${bgOpacity / 100});
  backdrop-filter: blur(${blur}px);
  display: flex;
  align-items: center;
  padding: 0 24px;
  ${sticky ? "position: sticky; top: 0; z-index: 50;" : "position: relative;"}
  ${borderBottom ? "border-bottom: 1px solid rgba(255, 255, 255, 0.1);" : ""}
}

.nav-logo {
  font-weight: 800;
  font-size: 1.25rem;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 32px;
  margin-left: 48px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: ${accentColor};
}`;

  const tailwindCode = `<nav class="h-[${height}px] bg-[var(--bg-card)]/${bgOpacity} backdrop-blur-[${blur}px] flex items-center px-6 ${sticky ? "sticky top-0 z-50" : "relative"} ${borderBottom ? "border-b border-[var(--border)]" : ""}">
  <div class="flex items-center justify-between w-full max-w-7xl mx-auto">
    <div class="flex items-center gap-8">
      <a href="#" class="font-black text-xl text-white tracking-tight">BRAND</a>
      <div class="hidden md:flex items-center gap-6">
        <a href="#" class="text-sm font-medium text-white/70 hover:text-[var(--text-primary)] transition-colors">Products</a>
        <a href="#" class="text-sm font-medium text-white/70 hover:text-[var(--text-primary)] transition-colors">Resources</a>
        <a href="#" class="text-sm font-medium text-white/70 hover:text-[var(--text-primary)] transition-colors">Pricing</a>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <button class="p-2 text-white/70 hover:text-[var(--text-primary)]"><Search class="w-5 h-5"/></button>
      <button class="px-4 py-2 bg-[${accentColor}] text-white rounded-lg text-sm font-bold">Get Started</button>
    </div>
  </div>
</nav>`;

  const htmlCode = `<nav class="navbar">
  <div class="navbar-content">
    <a href="#" class="nav-logo">BRAND</a>
    <div class="nav-links">
      <a href="#" class="nav-link">Home</a>
      <a href="#" class="nav-link">Features</a>
      <a href="#" class="nav-link">About</a>
    </div>
  </div>
</nav>

<style>
.navbar {
  height: ${height}px;
  background: rgba(15, 23, 42, ${bgOpacity / 100});
  backdrop-filter: blur(${blur}px);
  display: flex;
  align-items: center;
  justify-content: center;
  ${sticky ? "position: sticky; top: 0;" : ""}
  ${borderBottom ? "border-bottom: 1px solid rgba(255, 255, 255, 0.1);" : ""}
}
.navbar-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-logo { font-weight: 800; color: white; text-decoration: none; }
.nav-links { display: flex; gap: 2rem; }
.nav-link { color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 14px; }
.nav-link:hover { color: ${accentColor}; }
</style>`;

  const reset = () => {
    setHeight(64);
    setBgOpacity(70);
    setBlur(16);
    setSticky(true);
    setBorderBottom(true);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Height</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{height}px</span>
          </div>
          <input 
            type="range"
            value={height} 
            min={40} 
            max={120} 
            step={1} 
            onChange={(e) => setHeight(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">BG Opacity</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{bgOpacity}%</span>
          </div>
          <input 
            type="range"
            value={bgOpacity} 
            min={0} 
            max={100} 
            step={1} 
            onChange={(e) => setBgOpacity(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Blur Amount</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{blur}px</span>
          </div>
          <input 
            type="range"
            value={blur} 
            min={0} 
            max={40} 
            step={1} 
            onChange={(e) => setBlur(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="pt-4 space-y-4 border-t border-[var(--border)]">
          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Sticky Header</span>
            <div 
              onClick={() => setSticky(!sticky)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                sticky ? "bg-[var(--text-primary)]" : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                sticky ? "left-6" : "left-1"
              )} />
            </div>
          </label>

          <label className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Bottom Border</span>
            <div 
              onClick={() => setBorderBottom(!borderBottom)}
              className={cn(
                "w-10 h-5 rounded-full relative transition-all duration-300",
                borderBottom ? "bg-[var(--text-primary)]" : "bg-[var(--bg-hover)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                borderBottom ? "left-6" : "left-1"
              )} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[300px] flex items-start justify-center bg-[var(--bg)]/40 rounded-[12px] p-4 relative overflow-hidden border border-[var(--border)]">
      <div 
        className={cn(
          "w-full transition-all duration-500",
          borderBottom ? "border-b border-[var(--border)]" : ""
        )}
        style={{ 
          height: `${height}px`,
          backgroundColor: `rgba(15, 23, 42, ${bgOpacity / 100})`,
          backdropFilter: `blur(${blur}px)`,
        }}
      >
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-active)] border border-[var(--border-hover)] flex items-center justify-center font-black text-[var(--text-primary)] text-xs">B</div>
              <div className="hidden md:flex gap-4">
                 {[1,2,3].map(i => <div key={i} className="h-1.5 w-12 rounded-full bg-[var(--bg-hover)]" />)}
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--bg-card)]" />
              <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-active)] border border-[var(--border-hover)] h-6 w-16" />
           </div>
        </div>
      </div>
      
      {/* Scroll indicator for sticky demo */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 space-y-4 w-2/3 opacity-20">
         {[1,2,3,4,5].map(i => (
           <div key={i} className="h-4 bg-[var(--bg-card)] rounded-full w-full" />
         ))}
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Navbar Engine"
      description="Design modern, responsive navigation bars with glassmorphism."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
