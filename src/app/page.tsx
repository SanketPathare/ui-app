"use client";

import { Shell } from "@/components/shell";
import Link from "next/link";
import {
  Palette, Box, Square, MousePointer2, Layers,
  ArrowRight, Sparkles, Type, Frame, Ghost, RotateCw,
  Settings2, Grid, Layout, Columns, Maximize, PanelLeft,
  Navigation, Monitor, CheckSquare, ToggleLeft, Tag, Info,
  ClipboardList, Play, Loader2, Scissors, Hexagon, Spline,
  Image, Activity, Zap, Code, Terminal, Cpu,
  ChevronRight
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const tools = [
  { title: "Gradient Generator", description: "Multi-point linear and radial gradients.", href: "/gradient", icon: Palette },
  { title: "Box Shadow", description: "Multi-layered elevation styles.", href: "/box-shadow", icon: Box },
  { title: "Border Radius", description: "Organic shapes and rounded components.", href: "/border-radius", icon: Square },
  { title: "Button Styles", description: "CTA components with hover interactions.", href: "/button", icon: MousePointer2 },
  { title: "Glassmorphism", description: "Frosted glass effect with filters.", href: "/glassmorphism", icon: Layers },
  { title: "Text Shadow", description: "Layered shadows for typography.", href: "/text-shadow", icon: Type },
  { title: "Outline Engine", description: "Focus states and decorative outlines.", href: "/outline", icon: Frame },
  { title: "Opacity Control", description: "Transparency and alpha transitions.", href: "/opacity", icon: Ghost },
  { title: "Transform Lab", description: "Rotate, scale, and skew elements.", href: "/transform", icon: RotateCw },
  { title: "Filter Core", description: "Blur, brightness, and color shifts.", href: "/filter", icon: Settings2 },
  { title: "Patterns", description: "Mathematical background patterns.", href: "/pattern", icon: Grid },
  { title: "Neumorphism", description: "Soft UI with highlights and shadows.", href: "/neumorphism", icon: Layers },
  { title: "Blob Shape", description: "Organic SVG-like shapes.", href: "/blob", icon: Sparkles },
  { title: "Mesh Gradient", description: "Fluid gradients by layering points.", href: "/mesh-gradient", icon: Palette },
  { title: "Noise Texture", description: "Procedural grain textures.", href: "/noise", icon: Grid },
  { title: "Aurora", description: "Animated aurora borealis effects.", href: "/aurora", icon: Palette },
  { title: "Gradient Border", description: "Multi-color gradient borders.", href: "/gradient-border", icon: Square },
  { title: "CSS Grid", description: "Two-dimensional layouts.", href: "/grid", icon: Grid },
  { title: "Flexbox Lab", description: "One-dimensional layouts.", href: "/flexbox", icon: Columns },
  { title: "Container Lab", description: "Responsive wrappers.", href: "/container", icon: Maximize },
  { title: "Navbar Engine", description: "Responsive navigation bars.", href: "/navigation", icon: Navigation },
  { title: "Sidebar Pro", description: "Collapsible application sidebars.", href: "/sidebar", icon: PanelLeft },
  { title: "Footer Builder", description: "Multi-column footers.", href: "/footer", icon: Layout },
  { title: "Card Layouts", description: "Responsive card grid architectures.", href: "/cards", icon: Grid },
  { title: "Breakpoints", description: "Responsive viewport constraints.", href: "/breakpoints", icon: Monitor },
  { title: "Form Gen", description: "Complex forms with validation.", href: "/forms", icon: ClipboardList },
  { title: "Input Field", description: "Input states and floating labels.", href: "/inputs", icon: Type },
  { title: "Checkbox & Radio", description: "Custom selection controls.", href: "/checkbox", icon: CheckSquare },
  { title: "Toggle Switch", description: "iOS-style toggle switches.", href: "/toggle", icon: ToggleLeft },
  { title: "Badge Lab", description: "Status indicators and tags.", href: "/badge", icon: Tag },
  { title: "Tooltip Pro", description: "Informational tooltips.", href: "/tooltip", icon: Info },
  { title: "Animations", description: "CSS animations with timing functions.", href: "/animations", icon: Play },
  { title: "Keyframes", description: "Multi-step keyframe animations.", href: "/keyframes", icon: RotateCw },
  { title: "Hover Lab", description: "Hover effects and transitions.", href: "/hover", icon: MousePointer2 },
  { title: "Spinners", description: "Loading indicators.", href: "/spinners", icon: Loader2 },
  { title: "Typing", description: "Typewriter text animations.", href: "/typing", icon: Type },
  { title: "Parallax", description: "3D parallax depth layers.", href: "/parallax", icon: Layers },
  { title: "SVG Shapes", description: "Organic and geometric SVG shapes.", href: "/svg-shape", icon: Zap },
  { title: "Clip-path", description: "Custom CSS clipping paths.", href: "/clip-path", icon: Scissors },
  { title: "SVG Divider", description: "Section dividers and waves.", href: "/svg-divider", icon: Spline },
  { title: "Polygon Gen", description: "Multi-sided geometric shapes.", href: "/polygon", icon: Hexagon },
  { title: "Curve Shape", description: "Smooth Bezier curves.", href: "/curve-shape", icon: Activity },
  { title: "HTML to TW", description: "HTML to Tailwind conversion.", href: "/html-to-tw", icon: Code },
  { title: "CSS to TW", description: "CSS to Tailwind translation.", href: "/css-to-tw", icon: Terminal },
  { title: "Gradient Text", description: "Multi-color text gradients.", href: "/fx-gradient-text", icon: Type },
  { title: "Glow Effect", description: "Neon and ambient glow styles.", href: "/fx-glow", icon: Zap },
  { title: "Border Animation", description: "Animated gradient borders.", href: "/fx-border-anim", icon: Box },
  { title: "Color Palette", description: "Color system with multi-format export.", href: "/color-palette", icon: Palette },
  { title: "Shimmer Effect", description: "Skeletal loading animations.", href: "/fx-shimmer", icon: Activity },
  { title: "Cursor Effect", description: "Custom cursor interactions.", href: "/fx-cursor", icon: MousePointer2 },
  { title: "CSS Clamp", description: "Fluid typography without media queries.", href: "/fx-clamp", icon: Type },
  { title: "Aspect Ratio", description: "Element proportion control.", href: "/fx-aspect", icon: Maximize },
  { title: "Object Fit", description: "Image/video alignment.", href: "/fx-object-fit", icon: Image },
];

const compilers = [
  { title: "HTML Compiler", description: "Real-time HTML, CSS, and JS editor with live preview.", href: "/html-compiler", icon: Terminal },
  { title: "React Sandbox", description: "Online React JS compiler with terminal, npm packages, and live preview.", href: "/react-compiler", icon: Cpu },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
  }
};

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Subtle radial gradients for background depth */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08] dark:opacity-[0.12] blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03] dark:opacity-[0.04] blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 80%)"
        }}
      />

      {/* Grid lines container */}
      <div className="absolute inset-0 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
        <div className="relative w-full h-full border-x border-dashed border-[var(--border)]">
          {/* Horizontal lines */}
          <div className="absolute top-[20%] left-0 w-full h-px border-t border-dashed border-[var(--border)]" />
          <div className="absolute bottom-[20%] left-0 w-full h-px border-t border-dashed border-[var(--border)]" />

          {/* Top-Left Intersection Circle Detail */}
          <div className="absolute left-0 top-[20%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
            <div className="w-12 h-12 rounded-full border border-dashed border-[var(--border-hover)] bg-[var(--bg)]/80 backdrop-blur-sm animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-2 h-2 rounded-full bg-[var(--bg)] border border-[var(--border-active)]" />
            {/* Crosshair lines inside circle */}
            <div className="absolute w-6 h-px bg-[var(--border-active)]" />
            <div className="absolute h-6 w-px bg-[var(--border-active)]" />
          </div>

          {/* Bottom-Right Intersection Circle Detail */}
          <div className="absolute right-0 bottom-[20%] translate-x-1/2 translate-y-1/2 flex items-center justify-center z-10">
            <div className="w-12 h-12 rounded-full border border-dashed border-[var(--border-hover)] bg-[var(--bg)]/80 backdrop-blur-sm animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-2 h-2 rounded-full bg-[var(--bg)] border border-[var(--border-active)]" />
            {/* Crosshair lines inside circle */}
            <div className="absolute w-6 h-px bg-[var(--border-active)]" />
            <div className="absolute h-6 w-px bg-[var(--border-active)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureHighlight({ icon: Icon, title, description, index }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="group relative"
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[var(--border)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 backdrop-blur-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--bg-hover)] to-transparent border border-[var(--border)] mb-4">
          <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    { icon: Palette, title: "Visual Editors", description: "Interactive controls for every CSS property with real-time preview." },
    { icon: Code, title: "Copy-Ready Code", description: "Export to CSS or Tailwind with a single click. Clean, readable output." },
    { icon: Zap, title: "Lightning Fast", description: "Built with Next.js for instant load times and smooth interactions." },
    { icon: Layers, title: "50+ Generators", description: "From gradients to layouts, animations to effects -- all in one place." },
  ];

  return (
    <Shell>
      <div className="space-y-24 md:space-y-32 pb-24">
        <section ref={ref} className="relative overflow-hidden pt-16 md:pt-28 pb-16 md:pb-24 border-b border-dashed border-[var(--border)]">
          <GridBackground />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.05]"
              >
                CSS design tools for modern developers
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
              >
                A collection of interactive generators for gradients, shadows, layouts, animations, and more. Copy-ready CSS and Tailwind code.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 mt-10 justify-center"
              >
                <Link
                  href="/gradient"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] text-sm font-semibold hover:opacity-90 transition-all duration-200"
                >
                  Get Started
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-all duration-200"
                >
                  Documentation
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 font-mono text-xs text-[var(--text-tertiary)] flex items-center gap-2 pointer-events-none select-none"
              >
                <span className="text-[var(--text-tertiary)] opacity-60">▲</span>
                <span>~</span>
                <span className="text-[var(--text-secondary)]">npx create-css-ui@latest</span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <FeatureHighlight key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </section>

        <section className="relative space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--text-secondary)]" />
              <h2 className="text-sm font-semibold text-[var(--text-secondary)] tracking-wide uppercase">Compilers</h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--border)] to-transparent" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {compilers.map((tool) => (
              <motion.div key={tool.href} variants={itemVariants}>
                <Link href={tool.href} className="group block relative">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[var(--border)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 backdrop-blur-sm group-hover:bg-[var(--bg-hover)] transition-all duration-300">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--bg-hover)] to-transparent border border-[var(--border)]">
                      <tool.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{tool.title}</h3>
                        <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="relative space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-[var(--text-secondary)]" />
              <h2 className="text-sm font-semibold text-[var(--text-secondary)] tracking-wide uppercase">Design Tools</h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--border)] to-transparent" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {tools.map((tool) => (
              <motion.div key={tool.href} variants={itemVariants}>
                <Link href={tool.href} className="group block relative">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[var(--border)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 backdrop-blur-sm group-hover:bg-[var(--bg-hover)] group-hover:border-[var(--border-hover)] transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--bg-hover)] to-transparent border border-[var(--border)]">
                        <tool.icon className="w-4 h-4 text-[var(--text-secondary)]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-[var(--text-primary)]/80 group-hover:text-[var(--text-primary)] transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5 line-clamp-1">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-card)] to-transparent p-8 md:p-12 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(102,126,234,0.08),transparent_50%)] pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
                Ready to build something great?
              </h2>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-8 text-sm md:text-base">
                Explore 50+ CSS design tools. All free, all in your browser.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/gradient"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg)] text-sm font-semibold hover:opacity-90 transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200"
                >
                  <BookOpen className="w-4 h-4" />
                  View Docs
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </Shell>
  );
}
