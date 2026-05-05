"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { 
  Image as ImageIcon, 
  Star, 
  Zap, 
  Heart, 
  Shield, 
  Search, 
  Settings, 
  Bell, 
  Mail, 
  User, 
  Layers,
  Palette,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = [
  { name: "Star", icon: Star },
  { name: "Zap", icon: Zap },
  { name: "Heart", icon: Heart },
  { name: "Shield", icon: Shield },
  { name: "Bell", icon: Bell },
  { name: "Mail", icon: Mail },
  { name: "User", icon: User },
  { name: "Settings", icon: Settings },
];

export function IconGenerator() {
  const [selectedIcon, setSelectedIcon] = useState("Star");
  const [size, setSize] = useState(80);
  const [borderRadius, setBorderRadius] = useState(24);
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(10);
  const [color, setColor] = useState("#8b5cf6");
  const [glow, setGlow] = useState(true);

  const IconComponent = ICONS.find(i => i.name === selectedIcon)?.icon || Star;

  const cssCode = `.icon-container {
  width: ${size * 1.5}px;
  height: ${size * 1.5}px;
  background: rgba(255, 255, 255, ${opacity / 100});
  backdrop-filter: blur(${blur}px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${glow ? `box-shadow: 0 0 40px ${color}33;` : ""}
}

.icon {
  color: ${color};
  filter: drop-shadow(0 0 10px ${color}66);
}`;

  const tailwindCode = `<div class="w-[${size * 1.5}px] h-[${size * 1.5}px] bg-white/[${opacity / 100}] backdrop-blur-[${blur}px] border border-white/10 rounded-[${borderRadius}px] flex items-center justify-center ${glow ? `shadow-[0_0_40px_${color}33]` : ""}">
  <${selectedIcon} class="w-[${size}px] h-[${size}px] text-[${color}] drop-shadow-[0_0_10px_${color}66]" />
</div>`;

  const reset = () => {
    setSelectedIcon("Star");
    setSize(80);
    setBorderRadius(24);
    setBlur(12);
    setOpacity(10);
    setColor("#8b5cf6");
    setGlow(true);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Pick Icon</label>
        <div className="grid grid-cols-4 gap-2">
          {ICONS.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedIcon(item.name)}
              className={cn(
                "aspect-square rounded-xl flex items-center justify-center transition-all border",
                selectedIcon === item.name 
                  ? "bg-brand-primary/10 border-brand-primary text-brand-primary" 
                  : "bg-white/5 border-white/5 text-slate-500 hover:text-slate-300"
              )}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Scale</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{size}px</span>
        </div>
        <input 
          type="range" min={40} max={160} step={1}
          value={size} onChange={(e) => setSize(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Radius</label>
          <span className="text-[10px] font-bold text-brand-primary font-mono">{borderRadius}px</span>
        </div>
        <input 
          type="range" min={0} max={60} step={1}
          value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Glassmorphism</label>
        <div className="grid grid-cols-1 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] font-bold text-slate-400">Blur</span>
              <span className="text-[10px] font-mono text-brand-primary">{blur}px</span>
            </div>
            <input 
              type="range" min={0} max={40} step={1}
              value={blur} onChange={(e) => setBlur(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] font-bold text-slate-400">Opacity</span>
              <span className="text-[10px] font-mono text-brand-primary">{opacity}%</span>
            </div>
            <input 
              type="range" min={0} max={100} step={1}
              value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
         <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Brand Color</label>
            <input 
              type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
            />
         </div>
         <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Outer Glow</label>
            <button 
              onClick={() => setGlow(!glow)}
              className={`w-10 h-5 rounded-full transition-all relative ${glow ? 'bg-brand-primary' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${glow ? 'left-6' : 'left-1'}`} />
            </button>
         </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="flex items-center justify-center transition-all duration-500 group"
      style={{
        width: `${size * 2}px`,
        height: `${size * 2}px`,
        background: `radial-gradient(circle at center, ${color}11, transparent)`,
      }}
    >
      <div 
        className="flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:scale-105"
        style={{
          width: `${size * 1.5}px`,
          height: `${size * 1.5}px`,
          backgroundColor: `rgba(255, 255, 255, ${opacity / 100})`,
          backdropFilter: `blur(${blur}px)`,
          borderRadius: `${borderRadius}px`,
          boxShadow: glow ? `0 20px 50px ${color}33, 0 0 30px ${color}11 inset` : "none",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <IconComponent 
          className="transition-all duration-500 drop-shadow-xl"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            color: color,
            filter: `drop-shadow(0 0 10px ${color}66)`,
          }}
        />
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Icon Lab"
      description="Design premium glassmorphic and stylized icon containers for your modern UI applications."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      onReset={reset}
    />
  );
}
