"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Palette, Box, Square, Layers, Sparkles, Grid, BookOpen,
  Menu, X, Search, Sun, Moon, Zap, Layout, Columns, Maximize,
  PanelLeft, Navigation, Monitor, CheckSquare, ToggleLeft, Tag,
  Info, ClipboardList, Play, RotateCw, Loader2, Type as TypeIcon,
  Scissors, Hexagon, Spline, Image, Activity, Code, Terminal, Cpu,
  Component, ArrowDownCircle, Star, Laptop, Braces, Wind, Ghost,
  Settings2, Frame, Type, MousePointer2, Coffee
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme as useNextTheme } from "next-themes";

const toolCategories = [
  {
    name: "Visual FX",
    tools: [
      { title: "Gradient Text", href: "/fx-gradient-text", icon: Type },
      { title: "Glow Effect", href: "/fx-glow", icon: Zap },
      { title: "Border Animation", href: "/fx-border-anim", icon: Box },
      { title: "Shimmer Effect", href: "/fx-shimmer", icon: Activity },
      { title: "Cursor Effect", href: "/fx-cursor", icon: MousePointer2 },
      { title: "Box Shadow", href: "/box-shadow", icon: Box },
      { title: "Border Radius", href: "/border-radius", icon: Square },
      { title: "Glassmorphism", href: "/glassmorphism", icon: Layers },
      { title: "Neumorphism", href: "/neumorphism", icon: Layers },
      { title: "Blob Shape", href: "/blob", icon: Sparkles },
      { title: "Noise Texture", href: "/noise", icon: Grid },
    ]
  },
  {
    name: "SVG & Geometry",
    tools: [
      { title: "SVG Shapes", href: "/svg-shape", icon: Zap },
      { title: "Clip-path", href: "/clip-path", icon: Scissors },
      { title: "SVG Divider", href: "/svg-divider", icon: Spline },
      { title: "Polygon Gen", href: "/polygon", icon: Hexagon },
      { title: "Curve Shape", href: "/curve-shape", icon: Activity },
    ]
  },
  {
    name: "Color & Patterns",
    tools: [
      { title: "Gradient", href: "/gradient", icon: Palette },
      { title: "Mesh Gradient", href: "/mesh-gradient", icon: Palette },
      { title: "Aurora FX", href: "/aurora", icon: Palette },
      { title: "Pattern Engine", href: "/pattern", icon: Grid },
      { title: "Text Shadow", href: "/text-shadow", icon: Type },
      { title: "Gradient Border", href: "/gradient-border", icon: Square },
      { title: "Color Palette", href: "/color-palette", icon: Palette },
    ]
  },
  {
    name: "Layout System",
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
    tools: [
      { title: "Navbar", href: "/navigation", icon: Navigation },
      { title: "Sidebar Pro", href: "/sidebar", icon: PanelLeft },
      { title: "Footer", href: "/footer", icon: Layout },
      { title: "Badge Lab", href: "/badge", icon: Tag },
      { title: "Tooltip Pro", href: "/tooltip", icon: Info },
    ]
  },
  {
    name: "Input & Motion",
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
  },
  {
    name: "Dev & Frameworks",
    tools: [
      { title: "HTML to TW", href: "/html-to-tw", icon: Code },
      { title: "CSS to TW", href: "/css-to-tw", icon: Terminal },
      { title: "HTML Compiler", href: "/html-compiler", icon: Cpu },
      { title: "React Sandbox", href: "/react-compiler", icon: Box },
      { title: "Python Compiler", href: "/python-compiler", icon: Braces },
      { title: "Java Compiler", href: "/java-compiler", icon: Coffee },
      { title: "C Compiler", href: "/c-compiler", icon: Terminal },
    ]
  }
];

function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => {
    setTheme(theme === "dark" || resolvedTheme === "dark" ? "light" : "dark");
  };

  const activeTheme = mounted ? (theme || resolvedTheme || "dark") : "dark";

  return { theme: activeTheme, toggle };
}

const docsList = [
  { title: "Introduction", href: "/docs", icon: BookOpen },
  { title: "Getting Started", href: "/docs/getting-started", icon: BookOpen },
  { title: "Visual FX Guide", href: "/docs/visual-fx", icon: BookOpen },
  { title: "Layout Lab Guide", href: "/docs/layout", icon: BookOpen },
  { title: "Color Palettes Docs", href: "/docs/colors", icon: BookOpen },
  { title: "API Reference", href: "/docs/api", icon: BookOpen },
  { title: "CLI Tool Usage", href: "/docs/cli", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const navItems = [
    { title: "Gradient", href: "/gradient", icon: Palette },
    { title: "Shadow", href: "/box-shadow", icon: Box },
    { title: "Radius", href: "/border-radius", icon: Square },
    { title: "Glass", href: "/glassmorphism", icon: Layers },
    { title: "Mesh", href: "/mesh-gradient", icon: Palette },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState<"tools" | "docs">("tools");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const allTools = [
    ...navItems,
    ...toolCategories.flatMap(c => c.tools)
  ];

  const searchResults = searchCategory === "tools"
    ? (searchQuery.trim() === ""
        ? allTools.slice(0, 7)
        : allTools.filter(tool => tool.title.toLowerCase().includes(searchQuery.toLowerCase())))
    : (searchQuery.trim() === ""
        ? docsList
        : docsList.filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase())));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "l") {
        e.preventDefault();
        setIsLibraryOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsLibraryOpen(false);
        setIsSearchOpen(false);
        setSearchQuery("");
      }

      if (isSearchOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % Math.max(1, searchResults.length));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
        } else if (e.key === "Enter") {
          e.preventDefault();
          const activeItem = searchResults[activeIndex];
          if (activeItem) {
            router.push(activeItem.href);
            setIsSearchOpen(false);
            setSearchQuery("");
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, activeIndex, searchResults, router]);

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Zap className="w-4 h-4 text-[var(--text-primary)]" />
            <span className="font-sans font-semibold text-base text-[var(--text-primary)] tracking-tight">
              UI Engine
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              );
            })}

            <button
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
            >
              <Grid className="w-3.5 h-3.5" />
              Library
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsSearchOpen(true);
              setSearchQuery("");
              setActiveIndex(0);
            }}
            className="relative hidden md:flex items-center bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-3 h-8 gap-2 group hover:border-[var(--border-hover)] transition-colors backdrop-blur-xl text-left cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="text-sm text-[var(--text-secondary)] w-24 sm:w-28 font-medium">Search...</span>
            <kbd className="hidden sm:inline-flex h-4 select-none items-center gap-1 rounded border border-[var(--border)] bg-[var(--bg-card)] px-1 font-mono text-[10px] text-[var(--text-secondary)]">
              <span>⌘</span>K
            </kbd>
          </button>

          <Link
            href="/docs"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Docs
          </Link>

          <button
            onClick={toggle}
            className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            className="lg:hidden p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>

    <AnimatePresence>
        {isLibraryOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-16 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLibraryOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.2, ease: [0.175, 0.885, 0.32, 1.1] }}
              className="relative w-full max-w-4xl bg-[var(--bg)] border border-[var(--border)] rounded-[12px] shadow-lg overflow-hidden"
            >
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tool Library</h2>
                    <p className="text-sm text-[var(--text-secondary)]">All available generators and tools.</p>
                  </div>
                  <button
                    onClick={() => setIsLibraryOpen(false)}
                    className="p-1.5 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {toolCategories.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                        {category.name}
                      </h3>
                      <div className="flex flex-col gap-0.5">
                        {category.tools.map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setIsLibraryOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-[4px] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
                          >
                            <tool.icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{tool.title}</span>
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)] overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {toolCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-1">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-[4px] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
                      >
                        <tool.icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{tool.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[250] flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Dialog Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-[260]"
            >
              {/* Header: Tabs */}
              <div className="p-4 pb-2 flex gap-2 border-b border-[var(--border)] bg-[var(--bg-card)]">
                <button
                  onClick={() => {
                    setSearchCategory("tools");
                    setActiveIndex(0);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                    searchCategory === "tools"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  App
                </button>
                <button
                  onClick={() => {
                    setSearchCategory("docs");
                    setActiveIndex(0);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                    searchCategory === "docs"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  Pages
                </button>
              </div>

              {/* Input Area */}
              <div className="relative flex items-center px-4 py-3 h-14">
                <Search className="w-5 h-5 text-[var(--text-secondary)] mr-3 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="What are you searching for?"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  className="bg-transparent border-0 outline-none w-full text-base md:text-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none"
                />
                <span className="hidden sm:inline-block border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)] bg-[var(--bg-card)] font-mono">
                  Esc
                </span>
              </div>

              {/* Separator */}
              <div className="h-px bg-[var(--border)]" />

              {/* Results List */}
              <div className="p-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {searchResults.length > 0 ? (
                  <div className="space-y-0.5">
                    {searchResults.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = index === activeIndex;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium cursor-pointer",
                            isActive
                              ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          )}
                        >
                          <Icon className="w-4.5 h-4.5 shrink-0 text-[var(--text-secondary)]" />
                          <div className="min-w-0 flex-1">
                            <span className="block truncate">{item.title}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-[var(--text-secondary)]">No results found for &ldquo;{searchQuery}&rdquo;</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
