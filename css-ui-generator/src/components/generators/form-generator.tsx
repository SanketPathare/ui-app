"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { ClipboardList, Layout, Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Field = {
  id: string;
  label: string;
  type: "text" | "email" | "password" | "select" | "textarea";
  placeholder: string;
  required: boolean;
};

export function FormGenerator() {
  const [fields, setFields] = useState<Field[]>([
    { id: "1", label: "Full Name", type: "text", placeholder: "John Doe", required: true },
    { id: "2", label: "Email", type: "email", placeholder: "john@example.com", required: true },
  ]);
  const [layout, setLayout] = useState<"stacked" | "grid">("stacked");
  const [borderRadius, setBorderRadius] = useState(16);
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [showLabels, setShowLabels] = useState(true);

  const addField = () => {
    const newField: Field = {
      id: Math.random().toString(36).substr(2, 9),
      label: "New Field",
      type: "text",
      placeholder: "Enter value...",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const cssCode = `.form-container {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius}px;
  color: white;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: ${accentColor};
  outline: none;
  box-shadow: 0 0 0 4px ${accentColor}20;
}

.form-submit {
  background: ${accentColor};
  color: white;
  padding: 14px;
  border-radius: ${borderRadius}px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-top: 12px;
}`;

  const tailwindCode = `<form class="max-w-xl w-full ${layout === 'grid' ? 'grid grid-cols-2 gap-6' : 'flex flex-col gap-6'}">
  ${fields.map(f => `
  <div class="flex flex-col gap-2 ${layout === 'grid' && f.type === 'textarea' ? 'col-span-2' : ''}">
    ${showLabels ? `<label class="text-sm font-semibold text-slate-400">${f.label}</label>` : ""}
    <${f.type === 'textarea' ? 'textarea' : 'input type="' + f.type + '"'} 
      placeholder="${f.placeholder}" 
      class="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-[${borderRadius}px] text-white focus:outline-none focus:border-[${accentColor}] focus:ring-4 focus:ring-[${accentColor}]/20 transition-all"
    >${f.type === 'textarea' ? '</textarea>' : ''}
  </div>`).join("")}
  <button type="submit" class="w-full py-4 bg-[${accentColor}] text-white rounded-[${borderRadius}px] font-bold ${layout === 'grid' ? 'col-span-2' : ''}">Submit</button>
</form>`;

  const htmlCode = `<form class="form">
  <div class="field">
    <label>Email</label>
    <input type="email" placeholder="Enter email">
  </div>
  <button type="submit">Submit</button>
</form>

<style>
.form { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
input { padding: 0.8rem; border-radius: ${borderRadius}px; border: 1px solid #ddd; }
button { background: ${accentColor}; color: white; padding: 1rem; border: none; border-radius: ${borderRadius}px; cursor: pointer; }
</style>`;

  const reset = () => {
    setFields([
      { id: "1", label: "Full Name", type: "text", placeholder: "John Doe", required: true },
      { id: "2", label: "Email", type: "email", placeholder: "john@example.com", required: true },
    ]);
    setLayout("stacked");
    setBorderRadius(16);
    setAccentColor("#8b5cf6");
    setShowLabels(true);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Layout</label>
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
             <button 
               onClick={() => setLayout("stacked")}
               className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all", layout === "stacked" ? "bg-brand-primary text-white" : "text-slate-500")}
             >
               Stacked
             </button>
             <button 
               onClick={() => setLayout("grid")}
               className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all", layout === "grid" ? "bg-brand-primary text-white" : "text-slate-500")}
             >
               Grid
             </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Border Radius</label>
            <span className="text-[10px] font-bold text-brand-primary font-mono">{borderRadius}px</span>
          </div>
          <input 
            type="range"
            value={borderRadius} 
            min={0} 
            max={32} 
            step={1} 
            onChange={(e) => setBorderRadius(parseInt(e.target.value))} 
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        <div className="pt-4 space-y-3 border-t border-white/5">
           <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Form Fields</label>
           <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.id} className="group flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                   <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        value={field.label} 
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="w-full bg-transparent text-[10px] font-bold text-white outline-none"
                      />
                      <select 
                        value={field.type} 
                        onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                        className="w-full bg-transparent text-[9px] text-slate-500 outline-none cursor-pointer"
                      >
                         <option value="text">Text</option>
                         <option value="email">Email</option>
                         <option value="password">Password</option>
                         <option value="textarea">Textarea</option>
                      </select>
                   </div>
                   <button 
                     onClick={() => removeField(field.id)}
                     className="p-1.5 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
              ))}
              <button 
                onClick={addField}
                className="w-full py-2 border border-dashed border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" /> Add Field
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-black/20 rounded-[2rem] p-12 overflow-y-auto">
      <div className={cn(
        "w-full max-w-xl",
        layout === 'grid' ? "grid grid-cols-2 gap-x-6 gap-y-4" : "flex flex-col gap-4"
      )}>
        {fields.map((field) => (
          <div 
            key={field.id} 
            className={cn(
              "flex flex-col gap-1.5",
              layout === 'grid' && field.type === 'textarea' ? "col-span-2" : ""
            )}
          >
            {showLabels && (
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                {field.label}
              </label>
            )}
            {field.type === 'textarea' ? (
              <textarea 
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm outline-none transition-all focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10"
                style={{ borderRadius: `${borderRadius}px`, height: '100px' }}
              />
            ) : (
              <input 
                type={field.type} 
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm outline-none transition-all focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10"
                style={{ borderRadius: `${borderRadius}px` }}
              />
            )}
          </div>
        ))}
        <button 
          className={cn(
            "w-full py-4 mt-4 rounded-2xl font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95",
            layout === 'grid' ? "col-span-2" : ""
          )}
          style={{ 
            backgroundColor: accentColor,
            boxShadow: `0 12px 24px ${accentColor}30`,
            borderRadius: `${borderRadius}px`
          }}
        >
          Submit Form
        </button>
      </div>
    </div>
  );

  return (
    <GeneratorLayout
      title="Form Gen"
      description="Build complex, responsive forms with customized layouts and validation states."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
