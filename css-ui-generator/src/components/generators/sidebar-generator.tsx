"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { PanelLeft, Layout, Settings, Home, Users, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarGenerator() {
  const [width, setWidth] = useState(260);
  const [collapsedWidth, setCollapsedWidth] = useState(80);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState<"left" | "right">("left");
  const [theme, setTheme] = useState<"glass" | "solid">("glass");

  const cssCode = `.sidebar {
  width: ${isCollapsed ? collapsedWidth : width}px;
  height: 100vh;
  position: fixed;
  ${position}: 0;
  top: 0;
  transition: width 0.3s ease;
  ${theme === "glass" ? `
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-${position === "left" ? "right" : "left"}: 1px solid rgba(255, 255, 255, 0.1);` : `
  background: #0f172a;`}
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  gap: 16px;
}

.nav-item span {
  display: ${isCollapsed ? "none" : "block"};
}`;

  const tailwindCode = `<aside class="h-screen fixed ${position}-0 top-0 transition-all duration-300 ${isCollapsed ? `w-[${collapsedWidth}px]` : `w-[${width}px]`} ${theme === "glass" ? "bg-slate-900/80 backdrop-blur-xl border-r border-white/10" : "bg-slate-900"}">
  <div class="flex flex-col h-full p-4">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0">B</div>
      <span class="font-bold text-white ${isCollapsed ? "hidden" : "block"}">BRAND</span>
    </div>
    <nav class="space-y-2">
      <a href="#" class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
        <Home class="w-5 h-5 text-white/70 group-hover:text-white" />
        <span class="text-sm font-medium text-white/70 group-hover:text-white ${isCollapsed ? "hidden" : "block"}">Dashboard</span>
      </a>
      <!-- Add more items -->
    </nav>
  </div>
</aside>`;

  const htmlCode = `<aside class="sidebar ${isCollapsed ? "collapsed" : ""}">
  <div class="sidebar-header">LOGO</div>
  <nav>
    <a href="#" class="nav-item"><i>Icon</i> <span>Dashboard</span></a>
    <a href="#" class="nav-item"><i>Icon</i> <span>Users</span></a>
  </nav>
</aside>

<style>
.sidebar {
  width: ${width}px;
  height: 100vh;
  background: #0f172a;
  transition: width 0.3s;
}
.sidebar.collapsed { width: ${collapsedWidth}px; }
.nav-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; color: white; }
.collapsed .nav-item span { display: none; }
</style>`;

  const reset = () => {
    setWidth(260);
    setCollapsedWidth(80);
    setIsCollapsed(false);
    setPosition("left");
    setTheme("glass");
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Expanded Width</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{width}px</span>
          </div>
          <input 
            type="range"
            value={width} 
            min={200} 
            max={400} 
            step={1} 
            onChange={(e) => setWidth(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Collapsed Width</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{collapsedWidth}px</span>
          </div>
          <input 
            type="range"
            value={collapsedWidth} 
            min={40} 
            max={120} 
            step={1} 
            onChange={(e) => setCollapsedWidth(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="pt-4 space-y-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Current State</span>
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
               <button 
                 onClick={() => setIsCollapsed(false)}
                 className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all", !isCollapsed ? "bg-brand-primary text-white" : "text-slate-500")}
               >
                 Open
               </button>
               <button 
                 onClick={() => setIsCollapsed(true)}
                 className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all", isCollapsed ? "bg-brand-primary text-white" : "text-slate-500")}
               >
                 Closed
               </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Position</span>
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
               <button 
                 onClick={() => setPosition("left")}
                 className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all", position === "left" ? "bg-brand-primary text-white" : "text-slate-500")}
               >
                 Left
               </button>
               <button 
                 onClick={() => setPosition("right")}
                 className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all", position === "right" ? "bg-brand-primary text-white" : "text-slate-500")}
               >
                 Right
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[400px] bg-slate-950/40 rounded-[2rem] relative overflow-hidden border border-white/5 p-4 flex items-center justify-center">
      <div 
        className={cn(
          "absolute h-full transition-all duration-500 border-white/10 flex flex-col p-4",
          position === "left" ? "left-0 border-r" : "right-0 border-l",
          theme === "glass" ? "bg-slate-900/80 backdrop-blur-xl" : "bg-slate-900"
        )}
        style={{ width: `${isCollapsed ? collapsedWidth : width}px` }}
      >
        <div className="flex items-center gap-3 mb-8 px-2">
           <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-black text-white shrink-0">S</div>
           {!isCollapsed && <div className="h-2 w-20 bg-white/20 rounded-full" />}
        </div>
        <div className="space-y-4 px-2">
           {[Home, Users, BarChart, Settings].map((Icon, i) => (
             <div key={i} className="flex items-center gap-4 opacity-50">
                <Icon className="w-5 h-5 text-white shrink-0" />
                {!isCollapsed && <div className="h-1.5 w-full bg-white/10 rounded-full" />}
             </div>
           ))}
        </div>
      </div>
      
      {/* Content Placeholder */}
      <div className="text-center opacity-20 pointer-events-none">
         <PanelLeft className="w-12 h-12 text-white mx-auto mb-4" />
         <p className="text-[10px] font-black uppercase tracking-[0.2em]">Application Layout</p>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Sidebar Pro"
      description="Build functional application sidebars with collapsibility."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
