"use client";

import { useState } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Plus, Minus, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function GridGenerator() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [columnGap, setColumnGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);

  const gridItems = Array.from({ length: columns * rows });

  const cssCode = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${rowGap}px ${columnGap}px;
  width: 100%;
  height: 400px;
}

.grid-item {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 12px;
  color: #8b5cf6;
}`;

  const tailwindCode = `<div class="grid grid-cols-${columns} grid-rows-${rows} gap-[${rowGap}px_${columnGap}px] w-full h-[400px]">
  ${gridItems.map((_, i) => `<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg flex items-center justify-center font-mono text-xs text-[var(--text-primary)]">${i + 1}</div>`).join("\n  ")}
</div>`;

  const htmlCode = `<div class="grid-container">
  ${gridItems.map((_, i) => `<div class="grid-item">${i + 1}</div>`).join("\n  ")}
</div>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${rowGap}px ${columnGap}px;
}
.grid-item {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
}
</style>`;

  const reset = () => {
    setColumns(3);
    setRows(3);
    setColumnGap(16);
    setRowGap(16);
  };

  const controls = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Columns</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{columns}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setColumns(Math.max(1, columns - 1))}
              className="p-1.5 rounded-lg card hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Minus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </button>
            <input 
              type="range"
              value={columns} 
              min={1} 
              max={12} 
              step={1} 
              onChange={(e) => setColumns(parseInt(e.target.value))} 
              className="flex-1 h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
            />
            <button 
              onClick={() => setColumns(Math.min(12, columns + 1))}
              className="p-1.5 rounded-lg card hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Rows</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{rows}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setRows(Math.max(1, rows - 1))}
              className="p-1.5 rounded-lg card hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Minus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </button>
            <input 
              type="range"
              value={rows} 
              min={1} 
              max={12} 
              step={1} 
              onChange={(e) => setRows(parseInt(e.target.value))} 
              className="flex-1 h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
            />
            <button 
              onClick={() => setRows(Math.min(12, rows + 1))}
              className="p-1.5 rounded-lg card hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-[var(--border)]">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Column Gap</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{columnGap}px</span>
          </div>
          <input 
            type="range"
            value={columnGap} 
            min={0} 
            max={100} 
            step={1} 
            onChange={(e) => setColumnGap(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Row Gap</label>
            <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{rowGap}px</span>
          </div>
          <input 
            type="range"
            value={rowGap} 
            min={0} 
            max={100} 
            step={1} 
            onChange={(e) => setRowGap(parseInt(e.target.value))} 
            className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
          />
        </div>
      </div>
    </div>
  );

  const preview = (
    <div 
      className="grid w-full h-[350px] md:h-[400px]"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: `${rowGap}px ${columnGap}px`,
      }}
    >
      {gridItems.map((_, i) => (
        <div 
          key={i}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl flex items-center justify-center font-mono text-[10px] text-[var(--text-primary)] shadow-inner"
        >
          {i + 1}
        </div>
      ))}
    </div>
  );

  return (
    <GeneratorLayout
      title="CSS Grid"
      description="Design complex two-dimensional layouts with ease and precision."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
