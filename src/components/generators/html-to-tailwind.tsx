"use client";

import { useState, useEffect } from "react";
import { 
  Code, 
  Zap, 
  Terminal, 
  Eye, 
  Settings2, 
  Sparkles, 
  RefreshCcw,
  Braces,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HtmlToTailwind() {
  const [input, setInput] = useState('<div style="background-color: #8b5cf6; padding: 32px; border-radius: 24px; box-shadow: 0 10px 15px rgba(0,0,0,0.1);">\n  <h1 style="font-size: 32px; color: white; font-weight: 800; margin-bottom: 16px;">Modern UI</h1>\n  <p style="color: rgba(255,255,255,0.8); line-height: 1.6;">Converted from legacy HTML to Tailwind CSS in real-time.</p>\n</div>');
  const [output, setOutput] = useState("");
  const [isReact, setIsReact] = useState(true);
  const [useArbitrary, setUseArbitrary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const convertStyleToTailwind = (styleStr: string) => {
    const styles = styleStr.split(';').map(s => s.trim()).filter(s => s);
    const classes: string[] = [];

    styles.forEach(style => {
      const [prop, value] = style.split(':').map(s => s.trim());
      if (!prop || !value) return;

      if (prop === 'background-color' || prop === 'background') {
        if (useArbitrary) classes.push(`bg-[${value}]`);
        else if (value.includes('#8b5cf6')) classes.push('bg-brand-primary');
        else classes.push(`bg-[${value}]`);
      }
      if (prop === 'padding') {
        const val = parseInt(value);
        if (!useArbitrary && !isNaN(val)) classes.push(`p-${val / 4}`);
        else classes.push(`p-[${value}]`);
      }
      if (prop === 'margin-bottom') {
        const val = parseInt(value);
        if (!useArbitrary && !isNaN(val)) classes.push(`mb-${val / 4}`);
        else classes.push(`mb-[${value}]`);
      }
      if (prop === 'border-radius') {
        if (value.includes('24px')) classes.push('rounded-[12px]');
        else if (value.includes('16px')) classes.push('rounded-[8px]');
        else classes.push(`rounded-[${value}]`);
      }
      if (prop === 'font-size') {
        if (value.includes('32px')) classes.push('text-4xl');
        else if (value.includes('24px')) classes.push('text-2xl');
        else classes.push(`text-[${value}]`);
      }
      if (prop === 'color') {
        if (value === 'white') classes.push('text-white');
        else classes.push(`text-[${value}]`);
      }
      if (prop === 'font-weight') {
        if (value === '800') classes.push('font-black');
        else if (value === '700') classes.push('font-bold');
      }
      if (prop === 'line-height') classes.push('leading-relaxed');
      if (prop === 'box-shadow') classes.push('shadow-xl');
    });

    return classes.join(' ');
  };

  const formatHtml = (html: string) => {
    let indent = 0;
    const tab = "  ";
    return html
      .replace(/<([^/][^>]*|[/][^>]+)>/g, (match) => {
        let result = "";
        if (match.startsWith("</")) {
          indent--;
          result = "\n" + tab.repeat(indent) + match;
        } else if (match.endsWith("/>")) {
          result = "\n" + tab.repeat(indent) + match;
        } else {
          result = "\n" + tab.repeat(indent) + match;
          indent++;
        }
        return result;
      })
      .trim();
  };

  useEffect(() => {
    let result = input.replace(/style="([^"]*)"/g, (match, p1) => {
      const twClasses = convertStyleToTailwind(p1);
      return `${isReact ? 'className' : 'class'}="${twClasses}"`;
    });

    if (isReact) {
      result = result.replace(/<(img|br|hr|input)([^>]*[^/])>/g, '<$1$2 />');
    }

    // Format the output for better readability
    const formatted = formatHtml(result);
    setOutput(formatted);
  }, [input, isReact, useArbitrary]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = (code: string) => {
    return code.split('\n').map((line, i) => {
      let escapedLine = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      escapedLine = escapedLine.replace(/(&lt;\/?[a-z1-6]+)/g, '<span class="text-rose-400">$1</span>');
      escapedLine = escapedLine.replace(/\b([a-z-]+)=/g, '<span class="text-amber-300">$1</span>=');
      escapedLine = escapedLine.replace(/"([^"]*)"/g, '"<span class="text-emerald-400">$1</span>"');
      escapedLine = escapedLine.replace(/(&gt;)/g, '<span class="text-rose-400">$1</span>');
      
      return (
        <div key={i} className="flex gap-4 px-4 -mx-4 hover:bg-[var(--bg-card)] transition-colors group/line">
          <span className="w-8 text-right text-[var(--text-tertiary)] font-mono text-[9px] pt-1 select-none">{i + 1}</span>
          <span className="flex-1 whitespace-pre-wrap break-all py-1" dangerouslySetInnerHTML={{ __html: escapedLine }} />
        </div>
      );
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Custom Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              HTML <span className="text-[var(--text-primary)]">→</span> Tailwind
            </h1>
            <p className="text-[var(--text-secondary)] text-sm font-medium max-w-xl">
              Professional-grade migration engine for converting legacy HTML architecture to modern utility-first CSS.
            </p>
          </div>
        </div>
        <button onClick={() => setInput("")} className="flex items-center gap-2 px-6 py-3 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border)] text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all active:scale-95">
          <RefreshCcw className="w-3.5 h-3.5" />
          Purge Source
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar: Inputs & Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[12px] bg-[var(--bg)] border border-[var(--border)] space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Cpu className="w-20 h-20 text-[var(--text-primary)]" />
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <div className="w-1 h-3 bg-brand-primary rounded-full" />
                Legacy Source
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste HTML here..."
                className="w-full h-64 bg-[var(--bg)] border border-[var(--border)] rounded-[12px] p-6 text-[11px] font-mono text-[var(--text-primary)] focus:ring-1 focus:ring-brand-primary outline-none transition-all custom-scrollbar leading-relaxed"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                Converter Logic
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setIsReact(true)} className={cn("py-3 rounded-[8px] border text-xs font-medium transition-all", isReact ? "bg-brand-primary border-[var(--border-hover)] text-white " : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)]")}>React JSX</button>
                <button onClick={() => setIsReact(false)} className={cn("py-3 rounded-[8px] border text-xs font-medium transition-all", !isReact ? "bg-brand-primary border-[var(--border-hover)] text-white " : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)]")}>HTML5</button>
              </div>
              <button onClick={() => setUseArbitrary(!useArbitrary)} className={cn("w-full flex items-center justify-between p-4 rounded-[8px] border transition-all", useArbitrary ? "bg-brand-accent/10 border-brand-accent text-brand-accent shadow-lg shadow-brand-accent/10" : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)]")}>
                <span className="text-sm font-medium">Arbitrary Values</span>
                <div className={cn("w-2 h-2 rounded-full", useArbitrary ? "bg-brand-accent animate-pulse" : "bg-[var(--bg-active)]")} />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border)] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-primary)] flex-shrink-0">
               <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
               <h4 className="text-sm font-medium text-white">Secure Conversion</h4>
               <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-relaxed">
                 All processing happens locally in your browser. No code is transmitted to external servers.
               </p>
            </div>
          </div>
        </div>

        {/* Main Content: Output & Preview */}
        <div className="lg:col-span-8 space-y-10">
          {/* Top: Code Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 flex items-center justify-center text-[var(--text-primary)] shadow-xl shadow-emerald-500/5">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">Optimized Output</h4>
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Utility-First Architecture</p>
                </div>
              </div>
              <button onClick={handleCopy} className={cn("flex items-center gap-2 px-6 py-3 rounded-[8px] text-sm font-medium transition-all active:scale-95 shadow-2xl", copied ? "bg-emerald-500 text-white" : "bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-80")}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Export Code'}
              </button>
            </div>

            <div className="rounded-[12px] bg-[#030712] border border-[var(--border)] overflow-hidden shadow-3xl">
              <div className="flex items-center justify-between px-8 py-4 bg-[var(--bg)] border-b border-[var(--border)]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50" />
                  <div className="w-3 h-3 rounded-full bg-[var(--text-primary)]/20 border border-[var(--border-hover)]/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">{isReact ? 'COMPONENT.TSX' : 'INDEX.HTML'}</span>
                </div>
              </div>
              <div className="p-8 font-mono text-[11px] leading-relaxed custom-scrollbar max-h-[600px] overflow-y-auto">
                {highlightCode(output)}
              </div>
            </div>
          </div>

          {/* Bottom: Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-primary)] ">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">Visual Result</h4>
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Live Rendering Engine</p>
                </div>
              </div>
              <div className="flex p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <button onClick={() => setViewport("desktop")} className={cn("p-2 rounded-lg transition-all", viewport === "desktop" ? "bg-[var(--bg-hover)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}><Monitor className="w-4 h-4" /></button>
                <button onClick={() => setViewport("tablet")} className={cn("p-2 rounded-lg transition-all", viewport === "tablet" ? "bg-[var(--bg-hover)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}><Tablet className="w-4 h-4" /></button>
                <button onClick={() => setViewport("mobile")} className={cn("p-2 rounded-lg transition-all", viewport === "mobile" ? "bg-[var(--bg-hover)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}><Smartphone className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-6 md:p-12 rounded-[12px] bg-[var(--bg)] border border-[var(--border)] shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[350px] transition-all group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-brand-primary)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />
               <div className={cn("relative z-10 transition-all duration-500 bg-[var(--bg-card)] shadow-2xl rounded-[12px] border border-[var(--border)] p-4 overflow-hidden", viewport === "desktop" ? "w-full" : viewport === "tablet" ? "w-[450px]" : "w-[320px]")}>
                  <div className="absolute top-0 left-0 right-0 h-6 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center px-3 gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-card)]" />
                     <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-card)]" />
                  </div>
                  <div className="pt-8 overflow-x-auto custom-scrollbar" dangerouslySetInnerHTML={{ __html: output.replace(/className=/g, 'class=') }} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
