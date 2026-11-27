"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Monitor,
  AlertTriangle,
  ArrowLeft,
  Keyboard,
  Cpu,
} from "lucide-react";

const COMPILER_ROUTES = [
  "/html-compiler",
  "/react-compiler",
  "/python-compiler",
  "/java-compiler",
  "/c-compiler",
  "/csharp-compiler",
  "/cpp-compiler",
  "/r-compiler",
];

export function MobileCompilerGuard() {
  const pathname = usePathname();
  const isCompilerRoute = COMPILER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isCompilerRoute) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="desktop-required-title"
      aria-describedby="desktop-required-desc"
      className="fixed inset-0 z-[9999] flex md:hidden items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border-hover)] bg-[var(--bg)] shadow-2xl">
        {/* Top monochrome warning bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--text-primary)] to-transparent opacity-80" />

        {/* Subtle ambient monochrome glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, var(--text-primary) 0%, transparent 70%)",
          }}
        />

        <div className="relative p-6 text-center space-y-5">
          {/* Warning pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-hover)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-primary)]">
            <AlertTriangle className="h-3.5 w-3.5" />
            Desktop Required
          </div>

          {/* Monitor + warning badge */}
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-hover)] bg-[var(--bg-card)]">
            <Monitor className="h-8 w-8 text-[var(--text-primary)]" />
            <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-active)] bg-[var(--bg)] text-[var(--text-primary)] shadow-sm">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Title & explanation */}
          <div className="space-y-2">
            <h2
              id="desktop-required-title"
              className="text-xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              Use a Desktop
            </h2>
            <p
              id="desktop-required-desc"
              className="text-sm leading-relaxed text-[var(--text-secondary)]"
            >
              This compiler is disabled on mobile devices. Open this page on a
              laptop or desktop computer to write, compile, and run code.
            </p>
          </div>

          {/* Requirements breakdown */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 text-left space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
              <Keyboard className="h-4 w-4 shrink-0 text-[var(--text-primary)]" />
              <span>Full keyboard &amp; wider editor workspace needed</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
              <Cpu className="h-4 w-4 shrink-0 text-[var(--text-primary)]" />
              <span>Desktop browser runtime for WebAssembly compilers</span>
            </div>
          </div>

          {/* Non-closable: only navigation back to home */}
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 active:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
