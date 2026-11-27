import { Shell } from "@/components/shell";
import Link from "next/link";
import { Zap, Layers, ShieldCheck, Code2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About | UI Engine",
  description:
    "Learn about UI Engine, a fast, privacy-first suite of 50+ CSS generators and developer tools built for modern web workflows.",
};

const highlights = [
  {
    icon: Zap,
    title: "Built for Speed",
    description:
      "Every generator runs instantaneously in the browser with zero server round-trips, giving you immediate visual feedback as you tweak controls.",
  },
  {
    icon: Code2,
    title: "Clean, Copy-Ready Output",
    description:
      "Export production-ready CSS, Tailwind CSS utilities, or HTML snippets with a single click—no bloated dependencies or proprietary wrappers.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-First Architecture",
    description:
      "All design tools and desktop WebAssembly compilers execute locally on your device. Your code and styles never leave your browser.",
  },
  {
    icon: Layers,
    title: "50+ Unified Tools",
    description:
      "From gradients, shadows, and glassmorphism to CSS Grid, Flexbox, and keyframe animations, everything lives in one consistent workspace.",
  },
];

export default function AboutPage() {
  return (
    <Shell>
      <div className="max-w-3xl mx-auto space-y-10 sm:space-y-12">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            About UI Engine
          </h1>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed">
            UI Engine is a modern collection of interactive CSS generators,
            layout builders, and browser-based developer tools designed to help
            engineers and designers ship polished interfaces faster.
          </p>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Why UI Engine?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Writing complex multi-layer box shadows, mesh gradients, SVG clip
            paths, and responsive grid templates by hand slows down iteration.
            UI Engine brings visual precision to everyday CSS tasks—letting you
            experiment with parameters in real time and copy clean,
            standards-compliant code straight into your codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlights.map((item) => (
            <div key={item.title} className="card p-5 space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-hover)]">
                <item.icon className="w-4 h-4 text-[var(--text-primary)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Explore the Suite
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Browse all CSS generators or read the documentation to get started.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/gradient"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--text-primary)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
