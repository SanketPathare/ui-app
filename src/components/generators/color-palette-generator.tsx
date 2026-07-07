"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Palette, Copy, Check, Info, MousePointer2, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Tailwind-inspired high-fidelity color palette
const tailwindColors = {
  red: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#450a0a"],
  orange: ["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12", "#431407"],
  amber: ["#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f", "#451a03"],
  yellow: ["#fefce8", "#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006"],
  lime: ["#f7fee7", "#ecfccb", "#d9f99d", "#bef264", "#a3e635", "#84cc16", "#65a30d", "#4d7c0f", "#3f6212", "#365314", "#1a2e05"],
  green: ["#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d", "#052e16"],
  emerald: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#022c22"],
  teal: ["#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a", "#042f2e"],
  cyan: ["#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63", "#083344"],
  sky: ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e", "#082f49"],
  blue: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"],
  indigo: ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b"],
  violet: ["#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#2e1065"],
  purple: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87", "#3b0764"],
  fuchsia: ["#fdf4ff", "#fae8ff", "#f5d0fe", "#f0abfc", "#e879f9", "#d946ef", "#c026d3", "#a21caf", "#86198f", "#701a75", "#4a044e"],
  pink: ["#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843", "#500724"],
  rose: ["#fff1f2", "#ffe4e6", "#fecdd3", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337", "#4c0519", "#4c0519"],
  slate: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a", "#020617"],
  gray: ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151", "#1f2937", "#111827", "#030712"],
  zinc: ["#fafafa", "#f4f4f5", "#e4e4e7", "#d4d4d8", "#a1a1aa", "#71717a", "#52525b", "#3f3f46", "#27272a", "#18181b", "#09090b"],
  neutral: ["#fafafa", "#f5f5f5", "#e5e5e5", "#d4d4d4", "#a3a3a3", "#737373", "#525252", "#404040", "#262626", "#171717", "#0a0a0a"],
  stone: ["#fafaf9", "#f5f5f4", "#e7e5e4", "#d6d3d1", "#a8a29e", "#78716c", "#57534e", "#44403c", "#292524", "#1c1917", "#0c0a09"],
  taupe: ["#f9f8f6", "#f2f1ed", "#e5e2da", "#d0cbc0", "#b5ad9d", "#9a8f7d", "#827666", "#6c6255", "#5a5248", "#4c453e", "#2a2723"],
  mauve: ["#faf8f9", "#f4f1f3", "#e9e3e7", "#d6cbd1", "#bfadb7", "#a8929e", "#8f7985", "#77646e", "#63545b", "#53464d", "#2d262a"],
  mist: ["#f6f8f9", "#eef2f4", "#dde5ea", "#c3cfd9", "#a1b4c3", "#8299ac", "#6b7f91", "#596a79", "#4b5965", "#3f4b55", "#21282d"],
  olive: ["#f8f9f5", "#f0f2ea", "#e0e5d5", "#c6cdb4", "#a8b18f", "#8a946e", "#717a59", "#5e664b", "#4f5540", "#434836", "#23261d"],
};

const shadeNames = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function ColorPaletteGenerator() {
  const [selectedFormat, setSelectedFormat] = useState<"class" | "hex" | "rgb" | "hsl" | "oklch">("class");
  const [classPrefix, setClassPrefix] = useState("bg-*");
  const [customPrefix, setCustomPrefix] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState({ name: "sky", shade: 500, hex: "#0ea5e9" });
  const [copied, setCopied] = useState<string | null>(null);

  const prefixOptions = [
    { label: "bg-* (Background)", value: "bg-*" },
    { label: "text-* (Typography)", value: "text-*" },
    { label: "border-* (Outline)", value: "border-*" },
    { label: "ring-* (Focus)", value: "ring-*" },
    { label: "from-* (Start)", value: "from-*" },
    { label: "to-* (End)", value: "to-*" },
    { label: "Custom...", value: "custom" },
  ];

  const activePrefix = classPrefix === "custom" ? customPrefix : classPrefix;

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${(h * 360).toFixed(0)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`;
  };

  const getFormattedValue = (name: string, shade: number, hex: string) => {
    switch (selectedFormat) {
      case "class": return activePrefix.replace("*", `${name}-${shade}`);
      case "hex": return hex;
      case "rgb": return hexToRgb(hex);
      case "hsl": return hexToHsl(hex);
      case "oklch": return `oklch(0.6 0.18 250)`; 
      default: return hex;
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 2000);
  };

  const cssCode = `:root {\n  --selected-color: ${selectedColor.hex};\n  --selected-rgb: ${hexToRgb(selectedColor.hex).replace('rgb(', '').replace(')', '')};\n}`;
  const tailwindCode = `<div class="${classPrefix.replace("*", `${selectedColor.name}-${selectedColor.shade}`)}">\n  Interactive Color Surface\n</div>`;
  const htmlCode = `<div style="background-color: ${selectedColor.hex}; color: ${selectedColor.shade > 500 ? 'white' : 'black'};">\n  ${selectedColor.name}-${selectedColor.shade}\n</div>`;

  const controls = (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">What to copy</label>
        <div className="grid grid-cols-2 gap-2">
          {["class", "hex", "rgb", "hsl", "oklch"].map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format as any)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm font-medium border transition-all flex items-center justify-between",
                selectedFormat === format 
                  ? "bg-[var(--bg-card)] border-[var(--border-hover)] text-[var(--text-primary)] shadow-lg shadow-brand-primary/5" 
                  : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {format}
              {selectedFormat === format && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Class Prefix</label>
        <div className="relative">
           <button 
             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
             className="w-full h-12 card px-4 flex items-center justify-between text-sm font-bold text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
           >
              <span>{prefixOptions.find(o => o.value === classPrefix)?.label}</span>
              <MousePointer2 className={cn("w-4 h-4 transition-transform", isDropdownOpen ? "rotate-180" : "")} />
           </button>
           
           {isDropdownOpen && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-[var(--border)] rounded-xl shadow-2xl z-[100] overflow-hidden p-1">
                {prefixOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setClassPrefix(opt.value);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-lg text-left text-xs font-bold transition-all",
                      classPrefix === opt.value ? "bg-[var(--bg-card)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
             </div>
           )}
        </div>

        {classPrefix === "custom" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
             <input 
               type="text"
               placeholder="e.g. shadow-*"
               value={customPrefix}
               onChange={(e) => setCustomPrefix(e.target.value)}
               className="w-full h-11 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-[var(--border-hover)] transition-all"
             />
             <p className="text-[9px] text-[var(--text-secondary)] italic">Use * as a placeholder for the color name.</p>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-[var(--border)] space-y-4">
        <div className="flex items-center gap-2 text-[var(--text-primary)]">
          <Info className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">Active Selection</span>
        </div>
        <div className="space-y-2">
           {[
             { label: "Class", val: activePrefix.replace("*", `${selectedColor.name}-${selectedColor.shade}`) },
             { label: "Hex", val: selectedColor.hex },
             { label: "RGB", val: hexToRgb(selectedColor.hex) },
             { label: "HSL", val: hexToHsl(selectedColor.hex) }
           ].map((item) => (
             <button 
               key={item.label}
               onClick={() => handleCopy(item.val)}
               className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] group/copy transition-all"
             >
                <div className="flex flex-col items-start gap-0.5">
                   <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">{item.label}</span>
                   <span className="text-[11px] font-bold text-[var(--text-primary)] group-hover/copy:text-[var(--text-primary)] transition-colors">{item.val}</span>
                </div>
                {copied === item.val ? <Check className="w-3.5 h-3.5 text-[var(--text-primary)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover/copy:text-[var(--text-primary)]" />}
             </button>
           ))}
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full min-h-[500px] rounded-[1.5rem] bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex flex-col relative group">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)', backgroundSize: '24px 24px' }} />
       
       <div className="p-6 space-y-6 relative z-10 overflow-x-auto custom-scrollbar">
          <div className="flex flex-nowrap gap-2 min-w-[1000px]">
             {Object.entries(tailwindColors).map(([name, shades]) => (
               <div key={name} className="flex flex-col gap-2 group/col">
                  <span className={cn(
                    "text-[8px] text-center font-black uppercase tracking-widest  mb-4 block origin-bottom-left transition-all group-hover/col:scale-110",
                    selectedColor.name === name ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
                  )}>
                    {name}
                  </span>
                  <div className="flex flex-col gap-1">
                     {shades.map((hex, i) => {
                       const shade = shadeNames[i];
                       const isActive = selectedColor.name === name && selectedColor.shade === shade;
                       return (
                         <button
                           key={shade}
                           onClick={() => setSelectedColor({ name, shade, hex })}
                           className={cn(
                             "w-12 h-10 rounded-md transition-all duration-300 relative group/item",
                             isActive ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110 z-20 shadow-2xl" : "hover:scale-105 hover:z-10"
                           )}
                           style={{ backgroundColor: hex }}
                         >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                               <span className={cn(
                                 "text-sm font-medium tracking-tighter",
                                 i > 5 ? "text-[var(--text-secondary)]" : "text-black/40"
                               )}>
                                 {shade}
                               </span>
                            </div>
                         </button>
                       );
                     })}
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="mt-auto p-5 bg-[var(--bg)] border-t border-[var(--border)] backdrop-blur-xl relative z-10">
          <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl shadow-2xl ring-2 ring-white/5"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div>
                   <h4 className="text-sm font-black text-white tracking-tighter uppercase">{selectedColor.name}-{selectedColor.shade}</h4>
                   <p className="text-xs font-medium text-[var(--text-primary)] uppercase tracking-[0.2em]">{selectedColor.hex}</p>
                </div>
             </div>
             <button 
               onClick={() => handleCopy(getFormattedValue(selectedColor.name, selectedColor.shade, selectedColor.hex))}
               className="px-5 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg)] text-sm font-medium hover:scale-105 transition-all  flex items-center gap-2 shrink-0"
             >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : `Copy ${selectedFormat}`}
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Standardized Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
              <div className="text-[var(--text-primary)]"><Palette className="w-8 h-8" /></div>
              <div>
                Color <span className="text-[var(--text-primary)]">Palette</span>
              </div>
            </h1>
            <p className="text-[var(--text-secondary)] text-sm font-medium max-w-xl">
              Professional Tailwind-inspired color system with multi-format export capabilities.
            </p>
          </div>
        </div>

      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Compact Sidebar */}
        <div className="w-full lg:w-62 space-y-6 shrink-0">
          <div className="p-5 rounded-[1.5rem] bg-[var(--bg-card)] border border-[var(--border)] backdrop-blur-xl space-y-6">
             <div className="space-y-1">
                <h2 className="text-sm font-black text-white tracking-tighter uppercase italic">Options</h2>
                <div className="h-0.5 w-8 bg-brand-primary rounded-full" />
             </div>
             {controls}
          </div>
        </div>

        {/* Compact Color Laboratory */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="p-5 rounded-[1.5rem] bg-[var(--bg-card)] border border-[var(--border)] backdrop-blur-xl space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border)]">
                      <Palette className="w-5 h-5" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm font-medium text-[var(--text-primary)] uppercase tracking-[0.2em]">Active Laboratory</span>
                      <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Real-time Sync</span>
                   </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   Online
                </div>
             </div>

             {preview}
          </div>

        {/* Code Console */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-5 rounded-[1.5rem] bg-[var(--bg)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">CSS Variables</span>
                 <button onClick={() => handleCopy(cssCode)} className="text-[var(--text-primary)] transition-colors"><Copy className="w-3 h-3" /></button>
              </div>
              <pre className="text-[10px] text-[var(--text-primary)] font-mono bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border)] overflow-x-auto">
                 {cssCode}
              </pre>
           </div>
           <div className="p-5 rounded-[1.5rem] bg-[var(--bg)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Tailwind Snippet</span>
                 <button onClick={() => handleCopy(tailwindCode)} className="text-[var(--text-primary)] transition-colors"><Copy className="w-3 h-3" /></button>
              </div>
              <pre className="text-[10px] text-indigo-400 font-mono bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 overflow-x-auto">
                 {tailwindCode}
              </pre>
           </div>
        </div>
      </div>
    </div>
  </div>
  );
}
