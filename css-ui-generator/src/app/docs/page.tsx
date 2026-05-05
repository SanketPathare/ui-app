import { Shell } from "@/components/shell";
import { 
  Palette, 
  Box, 
  Square, 
  MousePointer2, 
  Layers, 
  Type, 
  Frame, 
  Ghost, 
  RotateCw, 
  Settings2, 
  Grid,
  BookOpen,
  Code2,
  Zap,
  ShieldCheck
} from "lucide-react";

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    content: "UI Engine is a high-performance suite of CSS generators designed for modern web developers. Each tool is built to provide production-ready code in multiple formats including standard CSS, Tailwind utility classes, and raw HTML structures."
  },
  {
    id: "gradient",
    title: "Gradient Engine",
    icon: Palette,
    features: [
      "Multi-stop linear and radial gradients",
      "Precision stop positioning (0-100%)",
      "Tailwind arbitrary value output",
      "Procedural randomization engine"
    ]
  },
  {
    id: "shadow",
    title: "Box Shadow Lab",
    icon: Box,
    features: [
      "Layered elevation design",
      "Inset (inner) shadow support",
      "Real-time preview scaling and rounding",
      "Atmospheric randomization"
    ]
  },
  {
    id: "patterns",
    title: "Pattern Engine",
    icon: Grid,
    features: [
      "15 Procedural CSS patterns",
      "Density and thickness controls",
      "Rotation and angle support",
      "Pure CSS - no external assets required"
    ]
  },
  {
    id: "glass",
    title: "Glassmorphism",
    icon: Layers,
    features: [
      "Backdrop filter blur effects",
      "Alpha channel transparency control",
      "Saturation and lighting refinement",
      "Responsive frosted glass previews"
    ]
  },
  {
    id: "transform",
    title: "Transform Lab",
    icon: RotateCw,
    features: [
      "2D Matrix transformations",
      "Rotation, scaling, and skewing",
      "Precise translation offsets",
      "Interactive 3D-tilt presets"
    ]
  }
];

export const metadata = {
  title: "Documentation | UI Engine",
  description: "Learn how to use the UI Engine suite of CSS generators to build high-fidelity interfaces.",
};

export default function DocsPage() {
  return (
    <Shell>
      <div className="max-w-4xl mx-auto py-12 space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            Engineering Docs
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Master the <span className="text-brand-primary">Engine</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            Technical documentation and feature breakdown for the UI Engine suite. 
            Learn how to leverage our procedural generators for your next project.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Tri-Format Code</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Export every design as Standard CSS, Tailwind Utility, or Structural HTML.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Zero Latency</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Real-time procedural previews with zero configuration or build steps.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Production Ready</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Verified cross-browser compatibility and optimized property strings.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {docSections.map((section) => (
            <div key={section.id} id={section.id} className="group relative p-8 md:p-12 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 transition-all hover:border-brand-primary/30">
              <div className="absolute top-8 right-8 text-brand-primary/20 group-hover:text-brand-primary/40 transition-colors">
                <section.icon className="w-12 h-12" />
              </div>
              
              <div className="space-y-6 max-w-xl">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs">
                    {section.id.charAt(0).toUpperCase()}
                  </span>
                  {section.title}
                </h2>
                
                {section.content && (
                  <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {section.content}
                  </p>
                )}

                {section.features && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <div className="w-1 h-1 rounded-full bg-brand-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center py-8">
          <p className="text-sm text-slate-500 dark:text-slate-600 font-medium">
            UI Engine v2.0 • Build with high-fidelity precision.
          </p>
        </div>
      </div>
    </Shell>
  );
}
