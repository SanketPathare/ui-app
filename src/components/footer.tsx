import Link from "next/link";
import { GitBranch, Globe, Heart, Zap } from "lucide-react";

const footerLinks = [
  {
    title: "Tools",
    links: [
      { label: "Gradient", href: "/gradient" },
      { label: "Box Shadow", href: "/box-shadow" },
      { label: "Grid", href: "/grid" },
      { label: "Flexbox", href: "/flexbox" },
      { label: "Glassmorphism", href: "/glassmorphism" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Components", href: "/badge" },
      { label: "Animations", href: "/animations" },
      { label: "Keyframes", href: "/keyframes" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#" },
      { label: "Blog", href: "/#" },
      { label: "GitHub", href: "https://github.com" },
      { label: "Twitter", href: "https://twitter.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--text-primary)]" />
              <span className="font-semibold text-base text-[var(--text-primary)] tracking-tight">
                UI Engine
              </span>
            </Link>
            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed max-w-xs">
              A collection of CSS generators and design tools for modern developers.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
              >
                <GitBranch className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>

            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-tertiary)]">
            &copy; {new Date().getFullYear()} UI Engine. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}