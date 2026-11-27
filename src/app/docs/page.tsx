import { Shell } from "@/components/shell";
import Link from "next/link";
import {
  Palette,
  Box,
  Layers,
  Grid,
  BookOpen,
  Code2,
  Zap,
  ShieldCheck,
  Terminal,
  Keyboard,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    content:
      "UI Engine is a browser-based suite of 50+ CSS generators and interactive developer tools. Adjust sliders, color stops, and layout parameters in real time, preview the result in both dark and light modes, and copy production-ready CSS, Tailwind CSS utility classes, or HTML directly into your project—with zero sign-up or installation required.",
    features: [
      "Real-time visual preview with instant dark/light mode toggle",
      "One-click export for CSS, Tailwind CSS, and HTML",
      "Built-in presets to jumpstart common UI patterns",
      "100% client-side execution with no data sent to servers",
    ],
  },
  {
    id: "visual-fx",
    title: "Visual FX & Styling",
    icon: Layers,
    content:
      "Craft modern surface effects, depth, and textures without memorizing complex CSS syntax. Fine-tune multi-layered shadows, frosted-glass blur and saturation, soft neumorphic lighting, procedural SVG/CSS patterns, and organic clip-paths.",
    features: [
      "Box Shadow & Text Shadow with multi-layer elevation",
      "Glassmorphism with backdrop-filter blur and saturation",
      "Neumorphism with automatic highlight and shadow calculation",
      "15+ procedural CSS background patterns and noise textures",
    ],
  },
  {
    id: "layout",
    title: "Layout & Responsive Systems",
    icon: Grid,
    content:
      "Design predictable, responsive page architectures visually. Configure CSS Grid tracks and gaps, Flexbox alignment and wrapping, fluid container widths, and responsive breakpoint previews before writing a single line of boilerplate.",
    features: [
      "CSS Grid generator with dynamic rows, columns, and gaps",
      "Flexbox Lab for direction, justify, align, and wrap controls",
      "Responsive Card, Navbar, Sidebar, and Footer builders",
      "Fluid CSS Clamp typography calculator without media queries",
    ],
  },
  {
    id: "colors",
    title: "Color & Gradient Engines",
    icon: Palette,
    content:
      "Build multi-stop linear, radial, and mesh gradients, animated aurora backgrounds, gradient borders, and accessible color palettes. Every color tool outputs clean hex/RGBA values alongside Tailwind arbitrary class equivalents.",
    features: [
      "Multi-stop linear and radial Gradient Generator",
      "Mesh Gradient and animated Aurora FX builders",
      "Gradient Text and animated Border effects",
      "Color Palette generator with multi-format export",
    ],
  },
  {
    id: "compilers",
    title: "Browser Compilers (Desktop Only)",
    icon: Terminal,
    content:
      "Run HTML/CSS/JS, React, Python, Java, C, C++, C#, and R directly inside your desktop browser using WebAssembly and sandboxed runtimes. Because compilers require full keyboard shortcuts, multi-pane editors, and desktop browser memory, compiler routes are restricted to desktop and laptop screens.",
    features: [
      "HTML/CSS/JS & React Sandbox with live preview",
      "Python (Pyodide), C/C++ (Wasm), and R (WebR) runtimes",
      "Java (CheerpJ) and C# (Blazor WebAssembly) support",
      "Automatic desktop-screen check on mobile viewports",
    ],
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts & Navigation",
    icon: Keyboard,
    content:
      "Navigate across all 50+ generators and documentation sections quickly using built-in keyboard shortcuts from anywhere in the app.",
    features: [
      "Ctrl+K / Cmd+K — Open global quick search for tools & docs",
      "Ctrl+L / Cmd+L — Open the full categorized Tool Library",
      "Arrow Up / Down + Enter — Navigate and open search results",
      "Esc — Close any open search modal or library drawer",
    ],
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    icon: HelpCircle,
    content:
      "Everything you need to know about browser support, code licensing, and privacy when using UI Engine.",
    features: [
      "Free to use: Generated CSS, HTML, and Tailwind code is royalty-free for personal and commercial projects.",
      "Browser support: Outputs standard CSS3 and Tailwind v3/v4 compatible utilities for Chrome, Firefox, Safari, and Edge.",
      "Privacy-first: All generators and WebAssembly compilers run locally in your browser.",
      "Mobile support: All CSS design tools and generators are mobile-responsive; compilers require a desktop browser.",
    ],
  },
];

export const metadata = {
  title: "Documentation | UI Engine",
  description:
    "Comprehensive guide to UI Engine's CSS generators, Tailwind exporters, keyboard shortcuts, and browser compilers.",
};

export default function DocsPage() {
  return (
    <Shell>
      <div className="max-w-3xl mx-auto space-y-10 sm:space-y-12">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            Documentation
          </h1>
          <p className="text-base text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Complete guide to UI Engine&apos;s CSS generators, Tailwind CSS
            exporters, keyboard shortcuts, and desktop browser compilers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="card p-4 space-y-2">
            <Code2 className="w-4 h-4 text-[var(--text-secondary)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              Tri-Format Code
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Export clean CSS, Tailwind utilities, or ready-to-use HTML.
            </p>
          </div>
          <div className="card p-4 space-y-2">
            <Zap className="w-4 h-4 text-[var(--text-secondary)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              Real-Time Preview
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Instant visual feedback in both dark and light themes.
            </p>
          </div>
          <div className="card p-4 space-y-2">
            <ShieldCheck className="w-4 h-4 text-[var(--text-secondary)]" />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              Production Ready
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Cross-browser compatible output with zero dependencies.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {docSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="card p-5 space-y-4 scroll-mt-20"
            >
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  {section.title}
                </h2>
              </div>

              {section.content && (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {section.content}
                </p>
              )}

              {section.features && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {section.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] shrink-0 mt-1.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Ready to start designing?
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Jump straight into the Gradient Generator or browse all 50+ tools.
            </p>
          </div>
          <Link
            href="/gradient"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--text-primary)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity shrink-0"
          >
            Open Gradient Tool
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Shell>
  );
}
