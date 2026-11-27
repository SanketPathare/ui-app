"use client";

import { ReactNode, useState, useEffect } from "react";
import { Copy, Check, RefreshCcw, ArrowLeft, Sun, Moon, Code } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface GeneratorLayoutProps {
  title: string;
  description: string;
  controls: ReactNode;
  preview: ReactNode;
  cssCode?: string;
  tailwindCode?: string;
  htmlCode?: string;
  jsCode?: string;
  icon?: ReactNode;
  onReset?: () => void;
}

export function GeneratorLayout({
  title,
  description,
  controls,
  preview,
  cssCode,
  tailwindCode,
  htmlCode,
  jsCode,
  icon,
  onReset
}: GeneratorLayoutProps) {
  const [copied, setCopied] = useState(false);
  const defaultTab = tailwindCode ? "react" : cssCode ? "css" : htmlCode ? "html" : "js";
  const [activeTab, setActiveTab] = useState<"react" | "css" | "html" | "js">(defaultTab);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const previewMode: "dark" | "light" =
    mounted && resolvedTheme === "light" ? "light" : "dark";

  const copyToClipboard = () => {
    let codeToCopy = "";
    if (activeTab === "css") codeToCopy = cssCode || "";
    else if (activeTab === "react") codeToCopy = tailwindCode || "";
    else if (activeTab === "html") codeToCopy = htmlCode || "";
    else codeToCopy = jsCode || "";

    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchPreviewMode = (mode: "dark" | "light") => {
    setTheme(mode);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              {icon && <span className="text-[var(--text-secondary)] shrink-0">{icon}</span>}
              {title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl">
              {description}
            </p>
          </div>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="btn-secondary text-sm self-start md:self-auto"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-4">
          <div className="card p-4 sm:p-5 space-y-5">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
              Configuration
            </label>
            <div className="space-y-4">
              {controls}
            </div>
          </div>

          <div className="card p-4 flex items-start gap-3">
            <Code className="w-4 h-4 text-[var(--text-secondary)] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-[var(--text-primary)]">Export &amp; Compatibility</h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Generates standards-compliant CSS and Tailwind utility classes
                ready for Chrome, Firefox, Safari, and Edge.{" "}
                <Link href="/docs" className="underline underline-offset-2 hover:text-[var(--text-primary)]">
                  Read docs
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[var(--text-primary)]">Preview</h4>
              <div className="flex p-0.5 rounded-[6px] border border-[var(--border)]">
                <button
                  onClick={() => switchPreviewMode("light")}
                  className={cn(
                    "p-1.5 rounded-[4px] transition-colors text-sm",
                    previewMode === "light" ? "bg-[var(--bg-card)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => switchPreviewMode("dark")}
                  className={cn(
                    "p-1.5 rounded-[4px] transition-colors text-sm",
                    previewMode === "dark" ? "bg-[var(--bg-card)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              className={cn(
                "rounded-[6px] border transition-colors flex items-center justify-center min-h-[260px] sm:min-h-[340px] md:min-h-[400px] relative overflow-hidden",
                previewMode === "dark" ? "bg-[var(--bg)] border-[var(--border)]" : "bg-white border-[#e0e0e0]"
              )}
            >
              <div className="relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-x-auto">
                {preview}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[var(--text-primary)]">Code</h4>
              <button
                onClick={copyToClipboard}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm font-medium transition-colors",
                  copied
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)]"
                    : "bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-80"
                )}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="rounded-[6px] bg-[var(--bg)] border border-[var(--border)] overflow-hidden">
              <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-card)] overflow-x-auto whitespace-nowrap">
                {tailwindCode && (
                  <button
                    onClick={() => setActiveTab("react")}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      activeTab === "react" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    React / Tailwind
                  </button>
                )}
                {cssCode && (
                  <button
                    onClick={() => setActiveTab("css")}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      activeTab === "css" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    CSS
                  </button>
                )}
                {htmlCode && (
                  <button
                    onClick={() => setActiveTab("html")}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      activeTab === "html" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    HTML
                  </button>
                )}
                {jsCode && (
                  <button
                    onClick={() => setActiveTab("js")}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      activeTab === "js" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    JavaScript
                  </button>
                )}
              </div>
              <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm leading-relaxed max-h-[300px] overflow-y-auto text-[var(--text-primary)]">
                <pre className="whitespace-pre-wrap break-words">
                  {activeTab === "react" ? (tailwindCode || "") : activeTab === "css" ? (cssCode || "") : activeTab === "html" ? (htmlCode || "") : (jsCode || "")}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
