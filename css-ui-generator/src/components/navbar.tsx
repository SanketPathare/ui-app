"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Palette, 
  Box, 
  Square, 
  MousePointer2, 
  Layers,
  BookOpen,
  Sparkles,
  Settings2,
  Grid,
  Type,
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
  Maximize2,
  ClipboardList,
  Play,
  RotateCw,
  Loader2,
  ArrowDownCircle,
  Menu,
  X,
  Zap,
  Star,
  Search,
  Type as TypeIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const toolCategories = [
  {
    name: "Visual Effects",
    icon: Sparkles,
    color: "text-blue-400",
    tools: [
      { title: "Box Shadow", href: "/box-shadow", icon: Box },
      { title: "Border Radius", href: "/border-radius", icon: Square },
      { title: "Glassmorphism", href: "/glassmorphism", icon: Layers },
      { title: "Neumorphism", href: "/neumorphism", icon: Layers },
      { title: "Blob Shape", href: "/blob", icon: Sparkles },
      { title: "Noise Texture", href: "/noise", icon: Grid },
    ]
  },
  {
    name: "Color & Patterns",
    icon: Palette,
    color: "text-purple-400",
    tools: [
      { title: "Gradient", href: "/gradient", icon: Palette },
      { title: "Mesh Gradient", href: "/mesh-gradient", icon: Palette },
      { title: "Aurora FX", href: "/aurora", icon: Palette },
      { title: "Pattern Engine", href: "/pattern", icon: Grid },
      { title: "Text Shadow", href: "/text-shadow", icon: Type },
      { title: "Gradient Border", href: "/gradient-border", icon: Square },
    ]
  },
  {
    name: "Layout System",
    icon: Layout,
    color: "text-emerald-400",
    tools: [
      { title: "CSS Grid", href: "/grid", icon: Grid },
      { title: "Flexbox", href: "/flexbox", icon: Columns },
      { title: "Container", href: "/container", icon: Maximize },
      { title: "Breakpoints", href: "/breakpoints", icon: Monitor },
      { title: "Card Layout", href: "/cards", icon: Grid },
    ]
  },
  {
    name: "Navigation & UI",
    icon: Navigation,
    color: "text-orange-400",
    tools: [
      { title: "Navbar", href: "/navigation", icon: Navigation },
      { title: "Sidebar Pro", href: "/sidebar", icon: PanelLeft },
      { title: "Footer", href: "/footer", icon: Layout },
      { title: "Badge Lab", href: "/badge", icon: Tag },
      { title: "Tooltip Pro", href: "/tooltip", icon: Info },
      { title: "Custom Scroll", href: "/scrollbar", icon: Settings2 },
    ]
  },
  {
    name: "Input & Motion",
    icon: Play,
    color: "text-pink-400",
    tools: [
      { title: "Form Gen", href: "/forms", icon: ClipboardList },
      { title: "Input Field", href: "/inputs", icon: Type },
      { title: "Checkbox", href: "/checkbox", icon: CheckSquare },
      { title: "Toggle Switch", href: "/toggle", icon: ToggleLeft },
      { title: "Animations", href: "/animations", icon: Play },
      { title: "Keyframes", href: "/keyframes", icon: RotateCw },
      { title: "Hover Lab", href: "/hover", icon: MousePointer2 },
      { title: "Spinners", href: "/spinners", icon: Loader2 },
      { title: "Typing FX", href: "/typing", icon: TypeIcon },
      { title: "Parallax", href: "/parallax", icon: Layers },
    ]
  }
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { title: "Gradient", href: "/gradient", icon: Palette },
    { title: "Shadow", href: "/box-shadow", icon: Box },
    { title: "Radius", href: "/border-radius", icon: Square },
    { title: "Glass", href: "/glassmorphism", icon: Layers },
    { title: "Mesh", href: "/mesh-gradient", icon: Palette },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const allTools = [
    ...navItems,
    ...toolCategories.flatMap(c => c.tools)
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("nav-search");
        searchInput?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "l") {
        e.preventDefault();
        setIsLibraryOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsLibraryOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTools = searchQuery.trim() === "" 
    ? [] 
    : allTools.filter(tool => 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <nav className="sticky top-0 z-[100] w-full bg-[#020617]/70 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-black text-lg tracking-tighter">C</span>
            </div>
            <span className="hidden sm:inline-block font-display font-bold text-lg tracking-tight text-white">
              UI Engine
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300",
                    isActive 
                      ? "bg-brand-primary/10 text-brand-primary" 
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.title}
                </Link>
              );
            })}
            
            <button 
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
            >
              <Grid className="w-3.5 h-3.5" />
              Tool Library
              <kbd className="hidden xl:inline-flex h-4 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1 font-mono text-[9px] font-medium text-slate-500 ml-1">
                <span>⌘</span>L
              </kbd>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 gap-2 group focus-within:border-brand-primary/50 focus-within:bg-white/10 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
            <input 
              id="nav-search"
              type="text" 
              placeholder="Search tools..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] font-medium w-28 focus:w-48 transition-all text-slate-200 placeholder:text-slate-600"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="hover:text-white transition-colors"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}
            {!searchQuery && (
              <kbd className="hidden sm:inline-flex h-4 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1 font-mono text-[9px] font-medium text-slate-500 opacity-100">
                <span>⌘</span>K
              </kbd>
            )}

            {/* Search Results Dropdown */}
            {filteredTools.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[300] max-h-64 overflow-y-auto p-1">
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setSearchQuery("")}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all group/res"
                  >
                    <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center group-hover/res:bg-brand-primary/10 group-hover/res:text-brand-primary transition-colors">
                      <tool.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[12px] font-medium">{tool.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-brand-primary transition-all text-xs font-bold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Docs
            </Link>
            <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
            <button 
              className="lg:hidden p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tool Library Modal */}
      <AnimatePresence>
        {isLibraryOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLibraryOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-50" />
              
              <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Tool Library</h2>
                    <p className="text-sm text-slate-400">Explore our comprehensive suite of UI engineering tools.</p>
                  </div>
                  <button 
                    onClick={() => setIsLibraryOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {toolCategories.map((category) => (
                    <div key={category.name} className="space-y-4">
                      <div className="flex items-center gap-2 px-1">
                        <category.icon className={cn("w-4 h-4", category.color)} />
                        <h3 className="text-[11px] font-black text-white/90 uppercase tracking-widest">
                          {category.name}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {category.tools.map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setIsLibraryOpen(false)}
                            className="group/item flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-brand-primary/10 group-hover/item:text-brand-primary transition-colors">
                              <tool.icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-400 group-hover/item:text-slate-100 transition-colors">
                              {tool.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-slate-950 p-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-8">
              {toolCategories.map((category) => (
                <div key={category.name} className="flex flex-col gap-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-brand-primary/10 transition-colors"
                      >
                        <tool.icon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">{tool.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
