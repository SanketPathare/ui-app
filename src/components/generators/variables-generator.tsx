"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Braces, Plus, Trash2, Zap, Palette, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface CSSVar {
  name: string;
  value: string;
}

export function VariablesGenerator() {
  const [vars, setVars] = useState<CSSVar[]>([
    { name: "brand-primary", value: "#8b5cf6" },
    { name: "brand-accent", value: "#ec4899" },
    { name: "main-radius", value: "24px" },
    { name: "card-blur", value: "12px" },
  ]);

  const cssCode = `:root {\n${vars.map(v => `  --${v.name}: ${v.value};`).join('\n')}\n}\n\n.my-element {\n  background: var(--${vars[0]?.name || 'primary'});\n  border-radius: var(--${vars.find(v => v.name.includes('radius'))?.name || 'radius'});\n}`;
  const tailwindCode = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: 'var(--${vars[0]?.name})',\n      }\n    }\n  }\n}`;
  const htmlCode = `<div style="${vars.map(v => `--${v.name}: ${v.value}`).join('; ')}"></div>`;
  const jsCode = `// Dynamically update tokens\nconst setToken = (name, value) => {\n  document.documentElement.style.setProperty(\`--\${name}\`, value);\n};`;

  const reset = () => {
    setVars([
      { name: "brand-primary", value: "#8b5cf6" },
      { name: "brand-accent", value: "#ec4899" },
      { name: "main-radius", value: "24px" },
      { name: "card-blur", value: "12px" },
    ]);
  };

  const addVar = () => {
    setVars([...vars, { name: "new-variable", value: "0px" }]);
  };

  const updateVar = (index: number, field: keyof CSSVar, value: string) => {
    const newVars = [...vars];
    newVars[index][field] = value;
    setVars(newVars);
  };

  const removeVar = (index: number) => {
    setVars(vars.filter((_, i) => i !== index));
  };

  const controls = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Global Tokens</label>
        <button 
          onClick={addVar}
          className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {vars.map((v, i) => (
          <div key={i} className="group relative flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all animate-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex-1 space-y-1">
              <input 
                type="text" 
                value={v.name} 
                onChange={(e) => updateVar(i, "name", e.target.value)}
                className="w-full bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-400 focus:text-white transition-colors"
                placeholder="Name"
              />
              <input 
                type="text" 
                value={v.value} 
                onChange={(e) => updateVar(i, "value", e.target.value)}
                className="w-full bg-transparent border-none text-xs font-mono text-brand-primary focus:text-brand-accent transition-colors"
                placeholder="Value"
              />
            </div>
            <button 
              onClick={() => removeVar(i)}
              className="p-2 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-80 rounded-[2.5rem] bg-[#020617] border border-white/5 overflow-hidden flex items-center justify-center p-12 relative">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
       
       <div 
         className="w-72 h-48 rounded-[var(--radius,2rem)] flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-2xl transition-all duration-500 overflow-hidden relative group"
         style={{ 
           background: `var(--${vars.find(v => v.name.includes('brand'))?.name || 'brand-primary'}, #8b5cf6)`,
           borderRadius: vars.find(v => v.name.includes('radius'))?.value || '2rem',
           backdropFilter: `blur(${vars.find(v => v.name.includes('blur'))?.value || '0px'})`,
           '--brand-primary': vars.find(v => v.name === 'brand-primary')?.value,
           '--brand-accent': vars.find(v => v.name === 'brand-accent')?.value,
           '--main-radius': vars.find(v => v.name === 'main-radius')?.value,
           '--card-blur': vars.find(v => v.name === 'card-blur')?.value,
         } as any}
       >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Braces className="w-12 h-12 text-white/30" />
          <div className="space-y-1">
             <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Variable System</p>
             <p className="text-[9px] font-bold text-white/60">{vars.length} Tokens Defined</p>
          </div>
       </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Variable Tokenizer"
      description="Design and manage custom CSS properties for dynamic theming and global design tokens."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      jsCode={jsCode}
      onReset={reset}
    />
  );
}
