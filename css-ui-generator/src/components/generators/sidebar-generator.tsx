"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { PanelLeft, Layout, Settings, Home, Users, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarGenerator() {
  const [width, setWidth] = useState(240);
  const [collapsedWidth, setCollapsedWidth] = useState(70);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState<"left" | "right">("left");
  const [itemRadius, setItemRadius] = useState(12);
  const [itemGap, setItemGap] = useState(6);
  const [activeColor, setActiveColor] = useState("#8b5cf6");
  const [showSearch, setShowSearch] = useState(true);
  const [showProfile, setShowProfile] = useState(true);

  const cssCode = `.sidebar {
  width: ${isCollapsed ? collapsedWidth : width}px;
  height: 100vh;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(16px);
  border-${position === "left" ? "right" : "left"}: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  margin: 0 ${itemGap}px;
  border-radius: ${itemRadius}px;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s;
}

.nav-item.active {
  background: ${activeColor};
  color: white;
  box-shadow: 0 4px 12px ${activeColor}44;
}

.nav-item span {
  display: ${isCollapsed ? "none" : "block"};
  font-size: 14px;
  font-weight: 500;
}`;

  const tailwindCode = `<aside class="h-screen sticky top-0 flex flex-col transition-all duration-500 ${isCollapsed ? `w-[${collapsedWidth}px]` : `w-[${width}px]`} bg-slate-900/80 backdrop-blur-2xl border-r border-white/10">
  <div class="flex items-center gap-3 mb-8 px-4 py-6">
    <div class="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center font-black text-white shadow-lg shadow-brand-primary/20 ring-1 ring-white/20">S</div>
    ${!isCollapsed ? '<span class="text-sm font-black text-white uppercase tracking-widest">Brand</span>' : ''}
  </div>

  <nav class="flex-1 px-2 space-y-1">
    <a href="#" class="flex items-center gap-4 px-3 py-2.5 rounded-[${itemRadius}px] bg-[${activeColor}] text-white shadow-lg shadow-[${activeColor}33]">
      <Home class="w-5 h-5 shrink-0" />
      ${!isCollapsed ? '<span class="text-xs font-bold uppercase tracking-wider">Dashboard</span>' : ''}
    </a>
    <a href="#" class="flex items-center gap-4 px-3 py-2.5 rounded-[${itemRadius}px] text-slate-500 hover:text-slate-300 transition-colors">
      <Users class="w-5 h-5 shrink-0" />
      ${!isCollapsed ? '<span class="text-xs font-bold uppercase tracking-wider">Community</span>' : ''}
    </a>
  </nav>

  ${showProfile ? `
  <div class="px-4 py-6 border-t border-white/10">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary ring-2 ring-white/10 shadow-xl" />
      ${!isCollapsed ? '<div class="h-2 w-20 bg-white rounded-full" />' : ''}
    </div>
  </div>` : ''}
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
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Sidebar Width</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{width}px</span>
          </div>
          <input 
            type="range"
            value={width} 
            min={160} 
            max={320} 
            onChange={(e) => setWidth(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Item Radius</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{itemRadius}px</span>
          </div>
          <input 
            type="range"
            value={itemRadius} 
            min={0} 
            max={24} 
            onChange={(e) => setItemRadius(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="pt-4 grid grid-cols-2 gap-4 border-t border-white/10">
          <div className="space-y-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Tint</span>
             <div className="flex gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
                <input 
                  type="color" 
                  value={activeColor} 
                  onChange={(e) => setActiveColor(e.target.value)}
                  className="w-full h-8 rounded-lg overflow-hidden border-none cursor-pointer"
                />
             </div>
          </div>
          <div className="space-y-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Layout</span>
             <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 h-11 items-center">
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className={cn("flex-1 h-full rounded-md text-[9px] font-black uppercase transition-all", isCollapsed ? "bg-brand-primary text-white" : "text-slate-500")}
                >
                  {isCollapsed ? "Compact" : "Full"}
                </button>
             </div>
          </div>
        </div>

        <div className="pt-4 space-y-3 border-t border-white/10">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Display Modules</span>
           <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className={cn("px-3 py-2.5 rounded-xl text-[9px] font-black uppercase border transition-all", showSearch ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" : "bg-white/5 border-white/10 text-slate-500")}
              >
                Search Bar
              </button>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className={cn("px-3 py-2.5 rounded-xl text-[9px] font-black uppercase border transition-all", showProfile ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" : "bg-white/5 border-white/10 text-slate-500")}
              >
                User Profile
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-[340px] bg-slate-950 rounded-[2.5rem] relative overflow-hidden border border-white/10 flex items-center justify-center p-4">
      <div 
        className={cn(
          "absolute h-full transition-all duration-500 border-white/10 flex flex-col py-4",
          position === "left" ? "left-0 border-r" : "right-0 border-l",
          "bg-slate-900/80 backdrop-blur-2xl"
        )}
        style={{ width: `${isCollapsed ? collapsedWidth : width}px` }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-6 px-4">
           <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-brand-primary/20 ring-1 ring-white/20 text-xs">S</div>
           {!isCollapsed && <span className="text-[11px] font-black text-white uppercase tracking-widest">Logo</span>}
        </div>

        {/* Search simulation */}
        {showSearch && (
          <div className="px-3 mb-5">
            <div className="h-8 rounded-lg bg-white/5 border border-white/10 flex items-center px-2.5 gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-white/20" />
              {!isCollapsed && <div className="h-1 w-12 bg-white/10 rounded-full" />}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 space-y-0.5 px-2">
           {[
             { Icon: Home, label: "Home", active: true },
             { Icon: Users, label: "Users" },
             { Icon: BarChart, label: "Stats" },
             { Icon: Settings, label: "Setup" }
           ].map((item, i) => (
             <div 
               key={i} 
               className={cn(
                 "flex items-center gap-3 px-3 py-2 transition-all group cursor-pointer",
                 item.active ? "text-white" : "text-slate-500 hover:text-slate-300"
               )}
               style={{ 
                 borderRadius: `${itemRadius}px`,
                 backgroundColor: item.active ? activeColor : "transparent",
                 boxShadow: item.active ? `0 4px 10px ${activeColor}22` : "none"
               }}
             >
                <item.Icon className={cn("w-4 h-4 shrink-0 transition-transform", !item.active && "group-hover:scale-110")} />
                {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>}
             </div>
           ))}
        </div>

        {/* User Profile */}
        {showProfile && (
          <div className="px-3 pt-4 border-t border-white/10 mt-auto">
            <div className="flex items-center gap-2.5">
               <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary shrink-0 ring-2 ring-white/10 shadow-xl" />
               {!isCollapsed && (
                 <div className="space-y-0.5">
                   <div className="h-1.5 w-14 bg-white rounded-full" />
                   <div className="h-1 w-8 bg-white/20 rounded-full" />
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
      
      {/* Page Content Simulation */}
      <div className={cn(
        "flex-1 h-full p-6 flex flex-col justify-center items-center opacity-10 transition-all",
        isCollapsed ? (position === "left" ? "pl-20" : "pr-20") : (position === "left" ? "pl-56" : "pr-56")
      )}>
         <PanelLeft className="w-12 h-12 text-white mb-4" />
         <div className="space-y-2 w-32">
           <div className="h-1.5 w-full bg-white rounded-full" />
           <div className="h-1.5 w-2/3 bg-white/60 rounded-full mx-auto" />
         </div>
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
