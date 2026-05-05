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
  ChevronDown,
  BookOpen,
  Sparkles,
  Settings2,
  Grid,
  Type
} from "lucide-react";

const navItems = [
  {
    title: "Gradient",
    href: "/gradient",
    icon: Palette,
  },
  {
    title: "Shadow",
    href: "/box-shadow",
    icon: Box,
  },
  {
    title: "Radius",
    href: "/border-radius",
    icon: Square,
  },
  {
    title: "Glass",
    href: "/glassmorphism",
    icon: Layers,
  },
  {
    title: "Mesh",
    href: "/mesh-gradient",
    icon: Palette,
  },
];

const moreTools = [
  { title: "Neumorphism", href: "/neumorphism", icon: Layers },
  { title: "Blob Shape", href: "/blob", icon: Sparkles },
  { title: "Noise Texture", href: "/noise", icon: Grid },
  { title: "Aurora", href: "/aurora", icon: Palette },
  { title: "Gradient Border", href: "/gradient-border", icon: Square },
  { title: "Text Shadow", href: "/text-shadow", icon: Type },
  { title: "Pattern Engine", href: "/pattern", icon: Grid },
  { title: "Custom Scrollbar", href: "/scrollbar", icon: Settings2 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#020617]/70 backdrop-blur-xl border-b border-white/5">
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
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
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
            
            <div className="relative group ml-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all">
                More
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 top-full mt-1 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100] overflow-hidden p-1">
                {moreTools.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold text-slate-400 hover:bg-white/5 hover:text-brand-primary rounded-lg transition-colors"
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary transition-all text-xs font-bold"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Docs
          </Link>
          <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
        </div>
      </div>
    </nav>
  );
}




