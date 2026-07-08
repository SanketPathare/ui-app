import { Shell } from "@/components/shell";
import Link from "next/link";
import {
  Palette, Box, Square, MousePointer2, Layers,
  ArrowRight, Sparkles, Type, Frame, Ghost, RotateCw,
  Settings2, Grid, Layout, Columns, Rows, Maximize, PanelLeft,
  Navigation, Monitor, CheckSquare, ToggleLeft, Tag, Info,
  ClipboardList, Play, Loader2, Scissors, Hexagon, Spline,
  Image, Activity, Zap, Code, Terminal, Cpu
} from "lucide-react";

const tools = [
  {
    title: "Gradient Generator",
    description: "Multi-point linear and radial gradients.",
    href: "/gradient",
    icon: Palette,
  },
  {
    title: "Box Shadow",
    description: "Multi-layered elevation styles.",
    href: "/box-shadow",
    icon: Box,
  },
  {
    title: "Border Radius",
    description: "Organic shapes and rounded components.",
    href: "/border-radius",
    icon: Square,
  },
  {
    title: "Button Styles",
    description: "CTA components with hover interactions.",
    href: "/button",
    icon: MousePointer2,
  },
  {
    title: "Glassmorphism",
    description: "Frosted glass effect with filters.",
    href: "/glassmorphism",
    icon: Layers,
  },
  {
    title: "Text Shadow",
    description: "Layered shadows for typography.",
    href: "/text-shadow",
    icon: Type,
  },
  {
    title: "Outline Engine",
    description: "Focus states and decorative outlines.",
    href: "/outline",
    icon: Frame,
  },
  {
    title: "Opacity Control",
    description: "Transparency and alpha transitions.",
    href: "/opacity",
    icon: Ghost,
  },
  {
    title: "Transform Lab",
    description: "Rotate, scale, and skew elements.",
    href: "/transform",
    icon: RotateCw,
  },
  {
    title: "Filter Core",
    description: "Blur, brightness, and color shifts.",
    href: "/filter",
    icon: Settings2,
  },
  {
    title: "Patterns",
    description: "Mathematical background patterns.",
    href: "/pattern",
    icon: Grid,
  },
  {
    title: "Neumorphism",
    description: "Soft UI with highlights and shadows.",
    href: "/neumorphism",
    icon: Layers,
  },
  {
    title: "Blob Shape",
    description: "Organic SVG-like shapes.",
    href: "/blob",
    icon: Sparkles,
  },
  {
    title: "Mesh Gradient",
    description: "Fluid gradients by layering points.",
    href: "/mesh-gradient",
    icon: Palette,
  },
  {
    title: "Noise Texture",
    description: "Procedural grain textures.",
    href: "/noise",
    icon: Grid,
  },
  {
    title: "Aurora",
    description: "Animated aurora borealis effects.",
    href: "/aurora",
    icon: Palette,
  },
  {
    title: "Gradient Border",
    description: "Multi-color gradient borders.",
    href: "/gradient-border",
    icon: Square,
  },
  {
    title: "CSS Grid",
    description: "Two-dimensional layouts.",
    href: "/grid",
    icon: Grid,
  },
  {
    title: "Flexbox Lab",
    description: "One-dimensional layouts.",
    href: "/flexbox",
    icon: Columns,
  },
  {
    title: "Container Lab",
    description: "Responsive wrappers.",
    href: "/container",
    icon: Maximize,
  },
  {
    title: "Navbar Engine",
    description: "Responsive navigation bars.",
    href: "/navigation",
    icon: Navigation,
  },
  {
    title: "Sidebar Pro",
    description: "Collapsible application sidebars.",
    href: "/sidebar",
    icon: PanelLeft,
  },
  {
    title: "Footer Builder",
    description: "Multi-column footers.",
    href: "/footer",
    icon: Layout,
  },
  {
    title: "Card Layouts",
    description: "Responsive card grid architectures.",
    href: "/cards",
    icon: Grid,
  },
  {
    title: "Breakpoints",
    description: "Responsive viewport constraints.",
    href: "/breakpoints",
    icon: Monitor,
  },
  {
    title: "Form Gen",
    description: "Complex forms with validation.",
    href: "/forms",
    icon: ClipboardList,
  },
  {
    title: "Input Field",
    description: "Input states and floating labels.",
    href: "/inputs",
    icon: Type,
  },
  {
    title: "Checkbox & Radio",
    description: "Custom selection controls.",
    href: "/checkbox",
    icon: CheckSquare,
  },
  {
    title: "Toggle Switch",
    description: "iOS-style toggle switches.",
    href: "/toggle",
    icon: ToggleLeft,
  },
  {
    title: "Badge Lab",
    description: "Status indicators and tags.",
    href: "/badge",
    icon: Tag,
  },
  {
    title: "Tooltip Pro",
    description: "Informational tooltips.",
    href: "/tooltip",
    icon: Info,
  },
  {
    title: "Animations",
    description: "CSS animations with timing functions.",
    href: "/animations",
    icon: Play,
  },
  {
    title: "Keyframes",
    description: "Multi-step keyframe animations.",
    href: "/keyframes",
    icon: RotateCw,
  },
  {
    title: "Hover Lab",
    description: "Hover effects and transitions.",
    href: "/hover",
    icon: MousePointer2,
  },
  {
    title: "Spinners",
    description: "Loading indicators.",
    href: "/spinners",
    icon: Loader2,
  },
  {
    title: "Typing",
    description: "Typewriter text animations.",
    href: "/typing",
    icon: Type,
  },
  {
    title: "Parallax",
    description: "3D parallax depth layers.",
    href: "/parallax",
    icon: Layers,
  },
  {
    title: "SVG Shapes",
    description: "Organic and geometric SVG shapes.",
    href: "/svg-shape",
    icon: Zap,
  },
  {
    title: "Clip-path",
    description: "Custom CSS clipping paths.",
    href: "/clip-path",
    icon: Scissors,
  },
  {
    title: "SVG Divider",
    description: "Section dividers and waves.",
    href: "/svg-divider",
    icon: Spline,
  },
  {
    title: "Polygon Gen",
    description: "Multi-sided geometric shapes.",
    href: "/polygon",
    icon: Hexagon,
  },
  {
    title: "Curve Shape",
    description: "Smooth Bezier curves.",
    href: "/curve-shape",
    icon: Activity,
  },
  {
    title: "HTML to TW",
    description: "HTML to Tailwind conversion.",
    href: "/html-to-tw",
    icon: Code,
  },
  {
    title: "CSS to TW",
    description: "CSS to Tailwind translation.",
    href: "/css-to-tw",
    icon: Terminal,
  },
  {
    title: "Gradient Text",
    description: "Multi-color text gradients.",
    href: "/fx-gradient-text",
    icon: Type,
  },
  {
    title: "Glow Effect",
    description: "Neon and ambient glow styles.",
    href: "/fx-glow",
    icon: Zap,
  },
  {
    title: "Border Animation",
    description: "Animated gradient borders.",
    href: "/fx-border-anim",
    icon: Box,
  },
  {
    title: "Color Palette",
    description: "Color system with multi-format export.",
    href: "/color-palette",
    icon: Palette,
  },
  {
    title: "Shimmer Effect",
    description: "Skeletal loading animations.",
    href: "/fx-shimmer",
    icon: Activity,
  },
  {
    title: "Cursor Effect",
    description: "Custom cursor interactions.",
    href: "/fx-cursor",
    icon: MousePointer2,
  },
  {
    title: "CSS Clamp",
    description: "Fluid typography without media queries.",
    href: "/fx-clamp",
    icon: Type,
  },
  {
    title: "Aspect Ratio",
    description: "Element proportion control.",
    href: "/fx-aspect",
    icon: Maximize,
  },
  {
    title: "Object Fit",
    description: "Image/video alignment.",
    href: "/fx-object-fit",
    icon: Image,
  },
];

const compilers = [
  {
    title: "HTML Compiler",
    description: "Real-time HTML, CSS, and JS editor with live preview.",
    href: "/html-compiler",
    icon: Terminal,
  },
  {
    title: "React Sandbox",
    description: "Online React JS compiler with terminal, npm packages, and live preview.",
    href: "/react-compiler",
    icon: Cpu,
  },
];

export default function Home() {
  return (
    <Shell>
      <div className="space-y-16">
        <section className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(94,255,212,0.16),transparent_25%)] opacity-80" />
          <div className="pointer-events-none absolute -right-16 top-16 h-60 w-60 rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.16),transparent_60%)]" />
          <div className="pointer-events-none absolute left-10 bottom-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.14),transparent_60%)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
                CSS design tools for{" "}
                <span className="text-[var(--text-primary)]">modern developers</span>
              </h1>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-lg">
                A collection of generators for gradients, shadows, layouts, animations, and more.
                Copy-ready CSS and Tailwind code.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/gradient" className="btn-primary text-sm">
                  Get Started
                </Link>
                <Link href="/docs" className="btn-secondary text-sm">
                  Documentation
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between gap-4 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#facc15]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                    Preview
                  </span>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[28px] border border-[var(--border)] bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-900/25 p-4">
                    <div className="h-44 rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_55%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg)] p-3">
                      <div className="h-24 rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]" />
                      <div className="mt-3 h-2.5 w-14 rounded-full bg-[var(--border)]" />
                      <div className="mt-2 h-2.5 w-8 rounded-full bg-[var(--border)]" />
                    </div>
                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg)] p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_20px_50px_rgba(59,130,246,0.12)]" />
                        <div className="flex-1 space-y-2">
                          <div className="h-2.5 w-14 rounded-full bg-[var(--border)]" />
                          <div className="h-2.5 w-10 rounded-full bg-[var(--border)]" />
                        </div>
                      </div>
                      <div className="mt-3 h-16 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),transparent_55%)]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-10 left-4 h-24 w-24 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.18),transparent_65%)] blur-2xl" />
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[var(--text-secondary)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Compiler</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {compilers.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="card p-4 transition-all duration-200 hover:scale-[1.01] hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.08)] group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
                    <tool.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-[var(--text-primary)]">{tool.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-2">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-[var(--text-secondary)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Design Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="card p-4 transition-all duration-200 hover:scale-[1.01] hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.08)] group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
                    <tool.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-[var(--text-primary)]">{tool.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-2">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6 text-center space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Ready to build?</h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Explore the tools above or check the documentation to learn more.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <Link href="/docs" className="btn-primary text-sm">
              View Docs
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
