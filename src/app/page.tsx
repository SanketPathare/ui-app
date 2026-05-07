import { Shell } from "@/components/shell";
import Link from "next/link";
import { 
  Palette, 
  Box, 
  Square, 
  MousePointer2, 
  Layers,
  ArrowRight,
  Sparkles,
  Type,
  Frame,
  Ghost,
  RotateCw,
  Settings2,
  Grid,
  Layout,
  Columns,
  Rows,
  Maximize,
  PanelLeft,
  Navigation,
  Monitor,
  CheckSquare,
  ToggleLeft,
  Tag,
  Info,
  ClipboardList,
  Play,
  Loader2,
  Type as TypeIcon,
  Scissors,
  Hexagon,
  Spline,
  Image,
  Activity,
  Zap,
  Braces,
  Wind,
  Cpu,
  Terminal,
  Code
} from "lucide-react";

const tools = [
  {
    title: "Gradient Generator",
    description: "Craft stunning multi-point linear and radial gradients with ease.",
    href: "/gradient",
    icon: Palette,
    color: "from-violet-500 to-fuchsia-500",
    shadow: "shadow-violet-500/20",
  },
  {
    title: "Box Shadow",
    description: "Create depth with professional multi-layered elevation styles.",
    href: "/box-shadow",
    icon: Box,
    color: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/20",
  },
  {
    title: "Border Radius",
    description: "Design organic shapes and modern rounded components.",
    href: "/border-radius",
    icon: Square,
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "Button Styles",
    description: "High-conversion CTA components with hover interactions.",
    href: "/button",
    icon: MousePointer2,
    color: "from-orange-500 to-rose-500",
    shadow: "shadow-orange-500/20",
  },
  {
    title: "Glassmorphism",
    description: "The ultimate frosted glass effect with advanced filters.",
    href: "/glassmorphism",
    icon: Layers,
    color: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/20",
  },
  {
    title: "Text Shadow",
    description: "Add depth and character to your typography with layered shadows.",
    href: "/text-shadow",
    icon: Type,
    color: "from-blue-600 to-violet-600",
    shadow: "shadow-blue-600/20",
  },
  {
    title: "Outline Engine",
    description: "Design precise focus states and decorative element outlines.",
    href: "/outline",
    icon: Frame,
    color: "from-emerald-400 to-cyan-500",
    shadow: "shadow-emerald-400/20",
  },
  {
    title: "Opacity Control",
    description: "Master transparency and alpha channel transitions.",
    href: "/opacity",
    icon: Ghost,
    color: "from-slate-500 to-slate-700",
    shadow: "shadow-slate-500/20",
  },
  {
    title: "Transform Lab",
    description: "Rotate, scale, and skew elements with 2D transformations.",
    href: "/transform",
    icon: RotateCw,
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
  {
    title: "Filter Core",
    description: "Apply blurring, brightness, and color shifts to components.",
    href: "/filter",
    icon: Settings2,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
  },
  {
    title: "Patterns",
    description: "Generate mathematical background patterns and textures.",
    href: "/pattern",
    icon: Grid,
    color: "from-lime-500 to-emerald-600",
    shadow: "shadow-lime-500/20",
  },
  {
    title: "Neumorphism",
    description: "Create soft UI elements with realistic highlights and shadows.",
    href: "/neumorphism",
    icon: Layers,
    color: "from-slate-300 to-slate-400",
    shadow: "shadow-slate-300/20",
  },
  {
    title: "Blob Shape",
    description: "Generate organic, fluid SVG-like shapes using border-radius.",
    href: "/blob",
    icon: Sparkles,
    color: "from-fuchsia-500 to-pink-600",
    shadow: "shadow-fuchsia-500/20",
  },
  {
    title: "Mesh Gradient",
    description: "Create beautiful, fluid gradients by layering radial points.",
    href: "/mesh-gradient",
    icon: Palette,
    color: "from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/20",
  },
  {
    title: "Noise Texture",
    description: "Generate procedural grain and noise textures using SVG filters.",
    href: "/noise",
    icon: Grid,
    color: "from-gray-700 to-gray-900",
    shadow: "shadow-gray-700/20",
  },
  {
    title: "Aurora",
    description: "Create mesmerizing, animated aurora borealis effects.",
    href: "/aurora",
    icon: Palette,
    color: "from-emerald-400 via-blue-500 to-purple-600",
    shadow: "shadow-emerald-400/20",
  },
  {
    title: "Gradient Border",
    description: "Create elegant components with multi-color gradient borders.",
    href: "/gradient-border",
    icon: Square,
    color: "from-rose-400 to-orange-500",
    shadow: "shadow-rose-400/20",
  },
  {
    title: "Custom Scrollbar",
    description: "Design custom scrollbars for webkit browsers with full control.",
    href: "/scrollbar",
    icon: Settings2,
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20",
  },
  {
    title: "CSS Grid",
    description: "Design complex two-dimensional layouts with ease and precision.",
    href: "/grid",
    icon: Grid,
    color: "from-blue-600 to-indigo-700",
    shadow: "shadow-blue-600/20",
  },
  {
    title: "Flexbox Lab",
    description: "Master one-dimensional layouts with flexible alignment and spacing.",
    href: "/flexbox",
    icon: Columns,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "Container Lab",
    description: "Create responsive wrappers and fluid layout constraints.",
    href: "/container",
    icon: Maximize,
    color: "from-orange-500 to-red-600",
    shadow: "shadow-orange-500/20",
  },
  {
    title: "Navbar Engine",
    description: "Design modern, responsive navigation bars with glassmorphism.",
    href: "/navigation",
    icon: Navigation,
    color: "from-purple-500 to-violet-600",
    shadow: "shadow-purple-500/20",
  },
  {
    title: "Sidebar Pro",
    description: "Build functional application sidebars with collapsibility.",
    href: "/sidebar",
    icon: PanelLeft,
    color: "from-indigo-500 to-blue-600",
    shadow: "shadow-indigo-500/20",
  },
  {
    title: "Footer Builder",
    description: "Create information-rich footers with multi-column layouts.",
    href: "/footer",
    icon: Layout,
    color: "from-slate-700 to-slate-900",
    shadow: "shadow-slate-700/20",
  },
  {
    title: "Card Layouts",
    description: "Design responsive grid-based card architectures for content.",
    href: "/cards",
    icon: Grid,
    color: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/20",
  },
  {
    title: "Breakpoints",
    description: "Visualize and configure responsive design viewport constraints.",
    href: "/breakpoints",
    icon: Monitor,
    color: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/20",
  },
  {
    title: "Form Gen",
    description: "Build complex, responsive forms with customized layouts and validation states.",
    href: "/forms",
    icon: ClipboardList,
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
  {
    title: "Input Field",
    description: "Design premium input states, focus effects, and floating labels.",
    href: "/inputs",
    icon: Type,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
  },
  {
    title: "Checkbox & Radio",
    description: "Create custom-branded selection controls with smooth animations.",
    href: "/checkbox",
    icon: CheckSquare,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "Toggle Switch",
    description: "Design interactive iOS-style toggle switches with custom themes.",
    href: "/toggle",
    icon: ToggleLeft,
    color: "from-indigo-500 to-violet-600",
    shadow: "shadow-indigo-500/20",
  },
  {
    title: "Badge Lab",
    description: "Create status indicators, tags, and pill components with glass effects.",
    href: "/badge",
    icon: Tag,
    color: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/20",
  },
  {
    title: "Tooltip Pro",
    description: "Design elegant informational tooltips with smart positioning.",
    href: "/tooltip",
    icon: Info,
    color: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/20",
  },
  {
    title: "Animations",
    description: "Create complex CSS animations with timing functions and delays.",
    href: "/animations",
    icon: Play,
    color: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-500/20",
  },
  {
    title: "Keyframes",
    description: "Design multi-step CSS keyframe animations with visual timeline.",
    href: "/keyframes",
    icon: RotateCw,
    color: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/20",
  },
  {
    title: "Hover Lab",
    description: "Design premium hover effects, transitions, and button interactions.",
    href: "/hover",
    icon: MousePointer2,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
  },
  {
    title: "Spinners",
    description: "Build modern loading indicators and animated SVG spinners.",
    href: "/spinners",
    icon: Loader2,
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
  {
    title: "Typing",
    description: "Create realistic typing and typewriter animations for text content.",
    href: "/typing",
    icon: TypeIcon,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "Parallax",
    description: "Create immersive 3D parallax effects and depth layers.",
    href: "/parallax",
    icon: Layers,
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
  },
  {
    title: "SVG Shapes",
    description: "Create organic and geometric SVG shapes for your UI.",
    href: "/svg-shape",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    shadow: "shadow-yellow-400/20",
  },
  {
    title: "Clip-path",
    description: "Design custom clipping paths using CSS clip-path property.",
    href: "/clip-path",
    icon: Scissors,
    color: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/20",
  },
  {
    title: "SVG Divider",
    description: "Create beautiful section dividers and wave transitions.",
    href: "/svg-divider",
    icon: Spline,
    color: "from-cyan-400 to-blue-500",
    shadow: "shadow-cyan-400/20",
  },
  {
    title: "Polygon Gen",
    description: "Create custom multi-sided geometric shapes.",
    href: "/polygon",
    icon: Hexagon,
    color: "from-emerald-400 to-teal-500",
    shadow: "shadow-emerald-400/20",
  },
  {
    title: "Curve Shape",
    description: "Design smooth Bezier curves and organic fluid shapes.",
    href: "/curve-shape",
    icon: Activity,
    color: "from-orange-400 to-red-500",
    shadow: "shadow-orange-400/20",
  },
  {
    title: "Tailwind Gen",
    description: "Build custom Tailwind utility combinations for complex UI components.",
    href: "/tailwind-gen",
    icon: Wind,
    color: "from-sky-400 to-indigo-500",
    shadow: "shadow-sky-400/20",
  },
  {
    title: "HTML to TW",
    description: "Convert raw HTML with inline styles to clean Tailwind CSS classes.",
    href: "/html-to-tw",
    icon: Code,
    color: "from-emerald-500 to-green-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "CSS to TW",
    description: "Translate traditional CSS properties into equivalent Tailwind utilities.",
    href: "/css-to-tw",
    icon: Terminal,
    color: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/20",
  },
  {
    title: "Gradient Text",
    description: "Apply stunning multi-color gradients to your typography.",
    href: "/fx-gradient-text",
    icon: Type,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
  },
  {
    title: "Glow Effect",
    description: "Add professional neon and ambient glow styles to elements.",
    href: "/fx-glow",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    shadow: "shadow-yellow-400/20",
  },
  {
    title: "Border Animation",
    description: "Design dynamic animated borders with moving gradients.",
    href: "/fx-border-anim",
    icon: Box,
    color: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-600/20",
  },
  {
    title: "Shimmer Effect",
    description: "Add skeletal loading and shiny shimmer animations.",
    href: "/fx-shimmer",
    icon: Activity,
    color: "from-slate-400 to-slate-600",
    shadow: "shadow-slate-400/20",
  },
  {
    title: "Cursor Effect",
    description: "Custom mouse cursor interactions and following effects.",
    href: "/fx-cursor",
    icon: MousePointer2,
    color: "from-teal-400 to-emerald-600",
    shadow: "shadow-teal-400/20",
  },
  {
    title: "Custom Scrollbar",
    description: "Design unique scrollbar styles for a branded experience.",
    href: "/fx-scrollbar",
    icon: Rows,
    color: "from-indigo-400 to-blue-600",
    shadow: "shadow-indigo-400/20",
  },
  {
    title: "CSS Clamp",
    description: "Create responsive fluid typography and spacing without media queries.",
    href: "/fx-clamp",
    icon: Type,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
  },
  {
    title: "Aspect Ratio",
    description: "Control element proportions across all screen sizes with ease.",
    href: "/fx-aspect",
    icon: Maximize,
    color: "from-amber-400 to-orange-600",
    shadow: "shadow-amber-400/20",
  },
  {
    title: "CSS Mask",
    description: "Design advanced clipping and image masking effects.",
    href: "/fx-mask",
    icon: Scissors,
    color: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-500/20",
  },
  {
    title: "Backdrop Filter",
    description: "Frost glass effects and background blurs for premium UIs.",
    href: "/fx-backdrop",
    icon: Layers,
    color: "from-blue-400 to-cyan-600",
    shadow: "shadow-blue-400/20",
  },
  {
    title: "Object Fit",
    description: "Perfectly align and scale images/videos within containers.",
    href: "/fx-object-fit",
    icon: Image,
    color: "from-emerald-400 to-teal-600",
    shadow: "shadow-emerald-400/20",
  },
  {
    title: "CSS Variables",
    description: "Manage global design tokens and dynamic theme constants.",
    href: "/fx-vars",
    icon: Braces,
    color: "from-slate-400 to-slate-600",
    shadow: "shadow-slate-400/20",
  },
  {
    title: "Container Queries",
    description: "Style components based on their container size, not the viewport.",
    href: "/fx-container-query",
    icon: Layout,
    color: "from-violet-400 to-fuchsia-600",
    shadow: "shadow-violet-400/20",
  },
  {
    title: "Logical Properties",
    description: "RTL-ready layouts using margin-inline and padding-block.",
    href: "/fx-logical",
    icon: Navigation,
    color: "from-sky-400 to-blue-600",
    shadow: "shadow-sky-400/20",
  },
];

const compilers = [
  {
    title: "HTML Compiler Online",
    description: "Real-time HTML, CSS, and JS editor with live preview and edge rendering.",
    href: "/compiler",
    icon: Terminal,
    color: "from-indigo-600 to-slate-900",
    shadow: "shadow-indigo-600/20",
  },
];

export default function Home() {
  return (
    <Shell>
      <div className="relative isolate">
        {/* Background Decorative Elements */}
        <div className="absolute -top-40 -right-20 -z-10 h-[400px] w-[400px] rounded-full bg-brand-primary/20 blur-[120px] animate-glow" />
        <div className="absolute top-20 -left-20 -z-10 h-[300px] w-[300px] rounded-full bg-brand-secondary/20 blur-[100px] animate-glow" />

        <div className="space-y-12 py-4">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Next-Gen CSS Tools
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-[1.1]">
              Elevate your <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent">Digital Craft</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl font-medium">
              A premium suite of CSS generators for modern developers. 
              Create, refine, and deploy stunning UI components.
            </p>
          </div>

          {/* Online Compilers Section (Primary) */}
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000 delay-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-xl shadow-brand-primary/5">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Developer Engines</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full-Stack Sandboxing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compilers.map((tool) => (
                <Link 
                  key={tool.href} 
                  href={tool.href}
                  className="group relative p-8 rounded-[2.5rem] bg-brand-primary/5 border border-brand-primary/10 hover:border-brand-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-8 shadow-xl ${tool.shadow} group-hover:scale-110 transition-transform duration-500`}>
                    <tool.icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-brand-primary transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">{tool.description}</p>
                  
                  <div className="flex items-center text-[11px] font-black text-brand-primary uppercase tracking-widest group-hover:gap-4 gap-2 transition-all">
                    Initialize Workspace <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Design Utility Tools</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rapid Component Prototyping</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <Link 
                  key={tool.href} 
                  href={tool.href}
                  className="group relative p-6 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-brand-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-6 shadow-lg ${tool.shadow} group-hover:scale-110 transition-transform duration-500`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{tool.title}</h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed font-medium">{tool.description}</p>
                  
                  <div className="flex items-center text-[10px] font-black text-brand-primary uppercase tracking-widest group-hover:gap-3 gap-1.5 transition-all">
                    Launch Engine <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative rounded-[2.5rem] bg-indigo-950/40 p-6 md:p-12 text-center space-y-6 overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-display font-black text-white">Transform your workflow</h2>
              <p className="text-indigo-200/60 max-w-xl mx-auto text-base leading-relaxed font-medium">
                Join thousands of engineers using our tools to build 
                the next generation of the high-fidelity web.
              </p>
              <div className="pt-6 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Real-time Preview
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  Zero Config
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  Modern CSS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

