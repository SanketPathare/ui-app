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
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
            CSS design tools for{" "}
            <span className="text-[var(--text-primary)]">modern developers</span>
          </h1>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-lg">
            A collection of generators for gradients, shadows, layouts, animations, and more.
            Copy-ready CSS and Tailwind code.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/gradient" className="btn-primary text-sm">
              Get Started
            </Link>
            <Link href="/docs" className="btn-secondary text-sm">
              Documentation
            </Link>
          </div>
        </div>

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
                className="card p-4 hover:border-[var(--border-hover)] transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <tool.icon className="w-5 h-5 text-[var(--text-secondary)] mt-0.5" />
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
                className="card p-4 hover:border-[var(--border-hover)] transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <tool.icon className="w-5 h-5 text-[var(--text-secondary)] mt-0.5 shrink-0" />
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
