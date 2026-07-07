import { Shell } from "@/components/shell";
import {
  Palette, Box, Square, Layers, RotateCw, Grid,
  BookOpen, Code2, Zap, ShieldCheck
} from "lucide-react";

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    content: "UI Engine is a collection of CSS generators designed for modern web developers. Each tool provides production-ready code in multiple formats including standard CSS, Tailwind utility classes, and raw HTML structures."
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
  description: "Learn how to use the UI Engine suite of CSS generators.",
};

export default function DocsPage() {
  return (
    <Shell>
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            Documentation
          </h1>
          <p className="text-base text-[var(--text-secondary)] max-w-lg leading-relaxed">
            Technical documentation and feature overview for the UI Engine suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="card p-4 space-y-2">
            <Code2 className="w-4 h-4 text-[var(--text-secondary)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">Tri-Format Code</h3>
            <p className="text-sm text-[var(--text-secondary)]">Export as CSS, Tailwind, or HTML.</p>
          </div>
          <div className="card p-4 space-y-2">
            <Zap className="w-4 h-4 text-[var(--text-secondary)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">Real-Time Preview</h3>
            <p className="text-sm text-[var(--text-secondary)]">Instant visual feedback as you adjust.</p>
          </div>
          <div className="card p-4 space-y-2">
            <ShieldCheck className="w-4 h-4 text-[var(--text-secondary)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">Production Ready</h3>
            <p className="text-sm text-[var(--text-secondary)]">Cross-browser compatible output.</p>
          </div>
        </div>

        <div className="space-y-4">
          {docSections.map((section) => (
            <div key={section.id} id={section.id} className="card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4 text-[var(--text-secondary)]" />
                <h2 className="text-base font-semibold text-[var(--text-primary)]">{section.title}</h2>
              </div>

              {section.content && (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {section.content}
                </p>
              )}

              {section.features && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {section.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-[var(--text-secondary)]">
            UI Engine &mdash; CSS design tools for developers.
          </p>
        </div>
      </div>
    </Shell>
  );
}
