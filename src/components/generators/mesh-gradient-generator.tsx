"use client";

import { useState, useMemo } from "react";
import { GeneratorLayout } from "@/components/generator-layout";
import { Plus, Trash2, RefreshCcw, Sparkles, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeshPoint {
  id: string;
  color: string;
  x: number;
  y: number;
  size: number;
}

const presets = [
  {
    name: "Cosmic",
    base: "#0a0015",
    blur: 40,
    points: [
      { id: "p1", color: "#4f46e5", x: 20, y: 15, size: 60 },
      { id: "p2", color: "#9333ea", x: 80, y: 20, size: 70 },
      { id: "p3", color: "#db2777", x: 50, y: 80, size: 55 },
      { id: "p4", color: "#2563eb", x: 75, y: 55, size: 50 },
    ],
  },
  {
    name: "Sunset",
    base: "#1a0a00",
    blur: 50,
    points: [
      { id: "p1", color: "#f97316", x: 10, y: 85, size: 65 },
      { id: "p2", color: "#fbbf24", x: 55, y: 65, size: 60 },
      { id: "p3", color: "#ec4899", x: 90, y: 75, size: 55 },
      { id: "p4", color: "#f43f5e", x: 35, y: 30, size: 50 },
    ],
  },
  {
    name: "Ocean",
    base: "#001020",
    blur: 45,
    points: [
      { id: "p1", color: "#0ea5e9", x: 25, y: 30, size: 60 },
      { id: "p2", color: "#2dd4bf", x: 80, y: 45, size: 70 },
      { id: "p3", color: "#3b82f6", x: 40, y: 75, size: 55 },
      { id: "p4", color: "#6366f1", x: 65, y: 60, size: 50 },
    ],
  },
  {
    name: "Aurora",
    base: "#020e1f",
    blur: 55,
    points: [
      { id: "p1", color: "#10b981", x: 20, y: 40, size: 65 },
      { id: "p2", color: "#3b82f6", x: 80, y: 25, size: 60 },
      { id: "p3", color: "#8b5cf6", x: 45, y: 70, size: 55 },
      { id: "p4", color: "#06b6d4", x: 70, y: 85, size: 50 },
    ],
  },
  {
    name: "Neon",
    base: "#050505",
    blur: 35,
    points: [
      { id: "p1", color: "#f0abfc", x: 15, y: 25, size: 55 },
      { id: "p2", color: "#67e8f9", x: 85, y: 30, size: 60 },
      { id: "p3", color: "#a3e635", x: 50, y: 75, size: 50 },
    ],
  },
  {
    name: "Lava",
    base: "#110000",
    blur: 60,
    points: [
      { id: "p1", color: "#ef4444", x: 30, y: 20, size: 70 },
      { id: "p2", color: "#f97316", x: 70, y: 40, size: 60 },
      { id: "p3", color: "#eab308", x: 45, y: 80, size: 55 },
      { id: "p4", color: "#dc2626", x: 85, y: 70, size: 45 },
    ],
  },
];

export function MeshGradientGenerator() {
  const [points, setPoints] = useState<MeshPoint[]>(presets[0].points);
  const [baseColor, setBaseColor] = useState(presets[0].base);
  const [blur, setBlur] = useState(40);
  const [grain, setGrain] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [activePreset, setActivePreset] = useState("Cosmic");

  const updatePoint = (id: string, updates: Partial<MeshPoint>) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    setActivePreset("");
  };

  const addPoint = () => {
    if (points.length >= 8) return;
    const hue = Math.floor(Math.random() * 360);
    const newPoint: MeshPoint = {
      id: "p" + Date.now(),
      color: `hsl(${hue}, 80%, 55%)`,
      x: Math.floor(Math.random() * 80 + 10),
      y: Math.floor(Math.random() * 80 + 10),
      size: Math.floor(40 + Math.random() * 30),
    };
    setPoints((prev) => [...prev, newPoint]);
    setActivePreset("");
  };

  const removePoint = (id: string) => {
    if (points.length <= 2) return;
    setPoints((prev) => prev.filter((p) => p.id !== id));
    setActivePreset("");
  };

  const applyPreset = (p: (typeof presets)[0]) => {
    setPoints(p.points.map((pt) => ({ ...pt })));
    setBaseColor(p.base);
    setBlur(p.blur);
    setActivePreset(p.name);
  };

  const shufflePositions = () => {
    setPoints((prev) =>
      prev.map((p) => ({
        ...p,
        x: Math.floor(Math.random() * 80 + 10),
        y: Math.floor(Math.random() * 80 + 10),
      }))
    );
    setActivePreset("");
  };

  const shuffleColors = () => {
    setPoints((prev) =>
      prev.map((p) => {
        const hue = Math.floor(Math.random() * 360);
        return { ...p, color: `hsl(${hue}, 75%, 55%)` };
      })
    );
    setActivePreset("");
  };

  // Build the radial gradient layers
  const gradientLayers = useMemo(() => {
    return points.map(
      (p) => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.size}%)`
    );
  }, [points]);

  const bgImageCSS = gradientLayers.join(",\n    ");

  const cssCode = `.mesh-gradient {
  background-color: ${baseColor};
  background-image:
    ${bgImageCSS};
  filter: blur(${blur}px);
}

.mesh-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 400px;
}

/* Scale up the gradient layer to hide blur edge artifacts */
.mesh-container .mesh-gradient {
  position: absolute;
  inset: -${Math.max(blur, 20)}px;
}${grain > 0 ? `

/* Grain texture overlay */
.mesh-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: ${(grain / 100).toFixed(2)};
  mix-blend-mode: overlay;
  pointer-events: none;
}` : ""}${animate ? `

/* Smooth hue rotation animation */
@keyframes meshShift {
  0%, 100% { filter: blur(${blur}px) hue-rotate(0deg); }
  50% { filter: blur(${blur}px) hue-rotate(40deg); }
}
.mesh-gradient {
  animation: meshShift 8s ease-in-out infinite;
}` : ""}`;

  const htmlCode = `<div class="mesh-container">
  <div class="mesh-gradient"></div>
</div>

<style>
.mesh-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 400px;
}
.mesh-gradient {
  position: absolute;
  inset: -${Math.max(blur, 20)}px;
  background-color: ${baseColor};
  background-image:
    ${bgImageCSS};
  filter: blur(${blur}px);
}
</style>`;

  const tailwindCode = `<!-- Mesh gradients require inline styles for the radial layers -->
<div class="relative overflow-hidden w-full h-[400px]">
  <div
    class="absolute"
    style="
      inset: -${Math.max(blur, 20)}px;
      background-color: ${baseColor};
      background-image: ${gradientLayers.join(", ")};
      filter: blur(${blur}px);
    "
  ></div>
</div>`;

  const reset = () => {
    applyPreset(presets[0]);
    setGrain(0);
    setAnimate(false);
  };

  // ─── Controls ────────────────────────────────────────────
  const controls = (
    <div className="space-y-6">
      {/* Presets */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium uppercase tracking-wider transition-all",
                activePreset === p.name
                  ? "bg-[var(--bg-card)] border-[var(--border-hover)] text-[var(--text-primary)]"
                  : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]"
              )}
            >
              <Sparkles className="w-3 h-3" /> {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Global Controls */}
      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Base Color</label>
          <input
            type="color"
            value={baseColor}
            onChange={(e) => { setBaseColor(e.target.value); setActivePreset(""); }}
            className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
          />
        </div>

        {[
          { label: "Blur", value: blur, setter: setBlur, min: 0, max: 120, unit: "px" },
          { label: "Grain", value: grain, setter: setGrain, min: 0, max: 80, unit: "%" },
        ].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[var(--text-secondary)]">{item.label}</label>
              <span className="text-sm font-medium text-[var(--text-primary)] font-mono">{item.value}{item.unit}</span>
            </div>
            <input
              type="range"
              value={item.value}
              min={item.min}
              max={item.max}
              step={1}
              onChange={(e) => item.setter(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
            />
          </div>
        ))}

        <div className="flex items-center justify-between pt-1">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Animate</label>
          <button
            onClick={() => setAnimate(!animate)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              animate ? "bg-[var(--text-primary)] text-[var(--bg)]" : "bg-[var(--bg-card)] text-[var(--text-secondary)]"
            )}
          >
            {animate ? "On" : "Off"}
          </button>
        </div>
      </div>

      {/* Points */}
      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Points ({points.length}/8)</label>
          <button
            onClick={addPoint}
            disabled={points.length >= 8}
            className="p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--text-primary)] transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
          {points.map((point, index) => (
            <div key={point.id} className="p-3 rounded-xl card space-y-3 relative group">
              <button
                onClick={() => removePoint(point.id)}
                className="absolute top-2 right-2 p-1 text-[var(--text-secondary)] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={point.color}
                  onChange={(e) => updatePoint(point.id, { color: e.target.value })}
                  className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer rounded"
                />
                <span className="text-sm font-medium text-[var(--text-secondary)] uppercase">Point {index + 1}</span>
              </div>

              {[
                { label: "X", key: "x" as const, val: point.x, max: 100 },
                { label: "Y", key: "y" as const, val: point.y, max: 100 },
                { label: "Size", key: "size" as const, val: point.size, max: 150 },
              ].map((ctrl) => (
                <div key={ctrl.label} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-[var(--text-secondary)] uppercase">
                    <span>{ctrl.label}</span>
                    <span className="font-mono">{ctrl.val}%</span>
                  </div>
                  <input
                    type="range"
                    value={ctrl.val}
                    min={ctrl.key === "size" ? 10 : 0}
                    max={ctrl.max}
                    step={1}
                    onChange={(e) => updatePoint(point.id, { [ctrl.key]: parseInt(e.target.value) })}
                    className="w-full h-1 bg-[var(--bg-hover)] rounded-full appearance-none cursor-pointer accent-[var(--text-primary)]"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Shuffle Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={shufflePositions}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[var(--bg-card)] dark:bg-[var(--bg-card)] text-white dark:text-[var(--text-primary)] text-sm font-medium hover:opacity-80 transition-all active:scale-95 border border-transparent dark:border-[var(--border)]"
        >
          <Shuffle className="w-3.5 h-3.5" /> Position
        </button>
        <button
          onClick={shuffleColors}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg)] text-sm font-medium hover:opacity-80 transition-all active:scale-95"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Colors
        </button>
      </div>
    </div>
  );

  // ─── Preview ─────────────────────────────────────────────
  // Uses an SVG approach for the mesh to guarantee rendering inside any container
  const svgCircles = points.map((p, i) => (
    <circle
      key={p.id}
      cx={`${p.x}%`}
      cy={`${p.y}%`}
      r={`${p.size}%`}
      fill={p.color}
      opacity="0.8"
    />
  ));

  const preview = (
    <div className="w-64 h-64 md:w-80 md:h-72 rounded-[12px] overflow-hidden relative shadow-2xl border border-[var(--border)]">
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full transition-all duration-500"
        style={{
          filter: `blur(${blur}px)`,
          animation: animate ? "meshHue 8s ease-in-out infinite" : "none",
        }}
      >
        <rect width="400" height="400" fill={baseColor} />
        {svgCircles}
      </svg>

      {/* Grain overlay */}
      {grain > 0 && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
          style={{
            opacity: grain / 100,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      )}

      {animate && (
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes meshHue {
            0%, 100% { filter: blur(${blur}px) hue-rotate(0deg); }
            50% { filter: blur(${blur}px) hue-rotate(40deg); }
          }
        `}} />
      )}
    </div>
  );

  return (
    <GeneratorLayout
      title="Mesh Gradient"
      description="Create fluid, multi-layered radial gradients with blur, grain, and animation controls."
      controls={controls}
      preview={preview}
      cssCode={cssCode}
      tailwindCode={tailwindCode}
      htmlCode={htmlCode}
      onReset={reset}
    />
  );
}
