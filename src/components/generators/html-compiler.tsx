"use client";

import { useState, useEffect, useRef } from "react";
import {
  Code,
  Eye,
  RefreshCcw,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  ArrowLeft,
  Cpu,
  FileCode,
  Layers,
  Zap,
  Terminal,
  Maximize2,
  ChevronRight,
  Layout,
  Sparkles,
  Palette,
  Box,
  MousePointer2,
  Settings,
  ZapOff
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { html as htmlLang } from "@codemirror/lang-html";
import { css as cssLang } from "@codemirror/lang-css";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion } from "@codemirror/autocomplete";
import Link from "next/link";
import { cn } from "@/lib/utils";
import * as prettier from "prettier/standalone";
import * as htmlParser from "prettier/plugins/html";
import * as cssParser from "prettier/plugins/postcss";
import * as babelParser from "prettier/plugins/babel";
import * as estreeParser from "prettier/plugins/estree";

export function HtmlCompiler() {
  const [html, setHtml] = useState('<!-- Create something amazing -->\n<div class="card">\n  <h1>HTML Compiler</h1>\n  <p>Edit HTML, CSS, and JS to see live changes.</p>\n  <button id="sparkle">Sparkle!</button>\n</div>');
  const [css, setCss] = useState('body {\n  background: #020617;\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  padding: 3rem;\n  border-radius: 2rem;\n  text-align: center;\n  color: white;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);\n}\n\nh1 {\n  margin: 0 0 1rem;\n  font-size: 3rem;\n  font-weight: 900;\n  background: linear-gradient(to right, #8b5cf6, #ec4899);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\np {\n  color: #94a3b8;\n  margin-bottom: 2rem;\n}\n\nbutton {\n  background: #8b5cf6;\n  color: white;\n  border: none;\n  padding: 0.75rem 2rem;\n  border-radius: 1rem;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);\n}');
  const [js, setJs] = useState('document.getElementById("sparkle").addEventListener("click", () => {\n  alert("✨ UI Engine is Awesome! ✨");\n});');

  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile" | "wide">("desktop");
  const [copied, setCopied] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState<{ type: string; message: string; timestamp: string }[]>([]);
  const [showSnippets, setShowSnippets] = useState(false);
  const [autoCompleteEnabled, setAutoCompleteEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const SNIPPETS = [
    {
      id: "glass",
      name: "Glassmorphism",
      icon: <Layers className="w-3.5 h-3.5" />,
      html: `<div class="glass-container">\n  <div class="glass-card">\n    <h2>Frosted Glass</h2>\n    <p>A beautiful glassmorphic card effect using backdrop-filter.</p>\n    <button>Get Started</button>\n  </div>\n</div>`,
      css: `body {\n  background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n  font-family: 'Inter', sans-serif;\n}\n\n.glass-card {\n  background: rgba(255, 255, 255, 0.03);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 32px;\n  padding: 60px;\n  color: white;\n  text-align: center;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);\n  max-width: 400px;\n}\n\nh2 {\n  font-size: 2.5rem;\n  margin-bottom: 1rem;\n  font-weight: 800;\n}\n\np {\n  color: #94a3b8;\n  line-height: 1.6;\n  margin-bottom: 2rem;\n}\n\nbutton {\n  background: white;\n  color: black;\n  border: none;\n  padding: 12px 32px;\n  border-radius: 12px;\n  font-weight: 700;\n  cursor: pointer;\n  transition: 0.3s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n  background: #f8fafc;\n}`,
      js: `console.log("Glassmorphism Snippet Loaded!");`
    },
    {
      id: "neon",
      name: "Neon Glow",
      icon: <Zap className="w-3.5 h-3.5" />,
      html: `<div class="container">\n  <button class="neon-btn">\n    Cyberpunk\n  </button>\n</div>`,
      css: `body {\n  background: #020617;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.neon-btn {\n  background: transparent;\n  color: #c026d3;\n  border: 2px solid #c026d3;\n  padding: 20px 40px;\n  font-size: 24px;\n  font-weight: 900;\n  border-radius: 12px;\n  cursor: pointer;\n  transition: 0.4s;\n  box-shadow: 0 0 15px rgba(192, 38, 211, 0.3);\n  text-transform: uppercase;\n  letter-spacing: 4px;\n  position: relative;\n}\n\n.neon-btn:hover {\n  background: #c026d3;\n  color: white;\n  box-shadow: 0 0 50px #c026d3, 0 0 100px #c026d3;\n  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);\n}`,
      js: `document.querySelector(".neon-btn").addEventListener("click", () => {\n  console.log("Neon pulse activated!");\n});`
    },
    {
      id: "particles",
      name: "Particles JS",
      icon: <Sparkles className="w-3.5 h-3.5" />,
      html: `<canvas id="canvas"></canvas>\n<div class="overlay">\n  <h1>Neural Network</h1>\n  <p>Interactive Particle System</p>\n</div>`,
      css: `body { margin: 0; background: #000; overflow: hidden; color: white; font-family: sans-serif; }\n#canvas { position: absolute; top: 0; left: 0; }\n.overlay {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  pointer-events: none;\n  text-align: center;\n}\nh1 { font-size: 4rem; font-weight: 900; margin: 0; letter-spacing: -2px; }\np { color: #4f46e5; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; }`,
      js: `const canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\ncanvas.width = window.innerWidth;\ncanvas.height = window.innerHeight;\nconst particles = [];\n\nclass Particle {\n  constructor() {\n    this.x = Math.random() * canvas.width;\n    this.y = Math.random() * canvas.height;\n    this.size = Math.random() * 2 + 1;\n    this.speedX = Math.random() * 2 - 1;\n    this.speedY = Math.random() * 2 - 1;\n  }\n  update() {\n    this.x += this.speedX;\n    this.y += this.speedY;\n    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;\n    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;\n  }\n  draw() {\n    ctx.fillStyle = '#4f46e5';\n    ctx.beginPath();\n    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);\n    ctx.fill();\n  }\n}\n\nfunction init() {\n  for (let i = 0; i < 150; i++) particles.push(new Particle());\n}\n\nfunction animate() {\n  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  particles.forEach(p => {\n    p.update();\n    p.draw();\n  });\n  requestAnimationFrame(animate);\n}\n\ninit();\nanimate();\nconsole.log("Neural particles initialized.");`
    }
  ];

  const loadSnippet = (snippet: typeof SNIPPETS[0]) => {
    if (confirm(`Load "${snippet.name}" snippet? This will overwrite your current code.`)) {
      setHtml(snippet.html);
      setCss(snippet.css);
      setJs(snippet.js);
      setLogs([]);
      setShowSnippets(false);
    }
  };

  const openPreview = () => {
    const blob = new Blob([srcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && ["log", "error", "warn"].includes(event.data.type)) {
        setLogs((prev) => [
          ...prev,
          {
            type: event.data.type,
            message: event.data.content,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          },
        ].slice(-100));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    setIsCompiling(true);
    const start = performance.now();
    const timeout = setTimeout(() => {
      const consoleInterceptScript = `
        (function() {
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;

          function formatMessage(args) {
            return args.map(arg => {
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch (e) {
                  return String(arg);
                }
              }
              return String(arg);
            }).join(' ');
          }

          console.log = function(...args) {
            window.parent.postMessage({ type: 'log', content: formatMessage(args) }, '*');
            originalLog.apply(console, args);
          };
          console.error = function(...args) {
            window.parent.postMessage({ type: 'error', content: formatMessage(args) }, '*');
            originalError.apply(console, args);
          };
          console.warn = function(...args) {
            window.parent.postMessage({ type: 'warn', content: formatMessage(args) }, '*');
            originalWarn.apply(console, args);
          };

          window.onerror = function(message, source, lineno, colno, error) {
            window.parent.postMessage({ type: 'error', content: message + ' (line ' + lineno + ')' }, '*');
          };
        })();
      `;

      const combined = `
        <html>
          <head>
            <style>${css}</style>
            <script>${consoleInterceptScript}<\/script>
          </head>
          <body>
            ${html}
            <script>${js}<\/script>
          </body>
        </html>
      `;
      setSrcDoc(combined);
      setIsCompiling(false);
      setExecutionTime(Math.round(performance.now() - start));
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [html, css, js]);

  const handleCopy = () => {
    const code = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JS\n${js}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    if (confirm("Reset all editors to default?")) {
      setHtml('<!-- Create something amazing -->\n<div class="card">\n  <h1>HTML Compiler</h1>\n  <p>Edit HTML, CSS, and JS to see live changes.</p>\n  <button id="sparkle">Sparkle!</button>\n</div>');
      setCss('body {\n  background: #020617;\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  padding: 3rem;\n  border-radius: 2rem;\n  text-align: center;\n  color: white;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);\n}\n\nh1 {\n  margin: 0 0 1rem;\n  font-size: 3rem;\n  font-weight: 900;\n  background: linear-gradient(to right, #8b5cf6, #ec4899);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\np {\n  color: #94a3b8;\n  margin-bottom: 2rem;\n}\n\nbutton {\n  background: #8b5cf6;\n  color: white;\n  border: none;\n  padding: 0.75rem 2rem;\n  border-radius: 1rem;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);\n}');
      setJs('console.log("Welcome to HTML Compiler Online!");\ndocument.getElementById("sparkle").addEventListener("click", () => {\n  console.log("Sparkle button clicked!");\n  alert("✨ HTML Compiler is Awesome! ✨");\n});');
      setLogs([]);
    }
  };

  const formatCode = async () => {
    try {
      if (activeTab === "html") {
        const formatted = await prettier.format(html, {
          parser: "html",
          plugins: [htmlParser],
          printWidth: 80,
          tabWidth: 2,
        });
        setHtml(formatted);
      } else if (activeTab === "css") {
        const formatted = await prettier.format(css, {
          parser: "css",
          plugins: [cssParser],
          printWidth: 80,
          tabWidth: 2,
        });
        setCss(formatted);
      } else if (activeTab === "js") {
        const formatted = await prettier.format(js, {
          parser: "babel",
          plugins: [babelParser, estreeParser],
          printWidth: 80,
          tabWidth: 2,
        });
        setJs(formatted);
      }
    } catch (error) {
      console.error("Prettier formatting failed:", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-widest transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
              <Code className="w-8 h-8 text-[var(--text-primary)]" />
              HTML Compiler <span className="text-[var(--text-primary)]">Online</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-sm font-medium max-w-xl">
              A high-performance live editing environment for rapid HTML5 prototyping and real-time visualization.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-6 py-3 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border)] text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all active:scale-95"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-[8px] text-sm font-medium transition-all active:scale-95 shadow-2xl",
              copied ? "bg-emerald-500 text-white" : "bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-80"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Export Bundle'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Section */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-[12px] bg-[var(--bg)] border border-[var(--border)] overflow-hidden shadow-2xl flex flex-col h-[650px]">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-[var(--bg)] border-b border-[var(--border)]">
              <div className="flex overflow-x-auto no-scrollbar border-b sm:border-b-0 border-[var(--border)] px-4 sm:px-8 py-4 gap-6 flex-shrink-0">
                <button
                  onClick={() => setActiveTab("html")}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === "html" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">HTML5</span>
                </button>
                <button
                  onClick={() => setActiveTab("css")}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === "css" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">CSS</span>
                </button>
                <button
                  onClick={() => setActiveTab("js")}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === "js" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">JS Core</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2 px-4 sm:px-8 py-3 sm:py-0 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setAutoCompleteEnabled(!autoCompleteEnabled)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                    autoCompleteEnabled ? "bg-emerald-500/10 text-[var(--text-primary)]" : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                  title={autoCompleteEnabled ? "Autocompletion Active" : "Autocompletion Disabled"}
                >
                  {autoCompleteEnabled ? <Settings className="w-3 h-3 animate-spin-slow" /> : <ZapOff className="w-3 h-3" />}
                  <span className="hidden lg:inline">Suggest</span>
                </button>
                <button
                  onClick={formatCode}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all whitespace-nowrap"
                >
                  <Palette className="w-3 h-3 text-[var(--text-primary)]" />
                  <span className="hidden lg:inline">Format</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowSnippets(!showSnippets)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                      showSnippets ? "bg-[var(--text-primary)] text-[var(--bg)]" : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <Layout className="w-3 h-3" />
                    <span className="hidden lg:inline">Snippets</span>
                  </button>
                  {/* ... snippets menu ... */}

                    {showSnippets && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowSnippets(false)} 
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-[var(--border)] rounded-[8px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
                            <span className="text-xs font-medium tracking-[0.2em] text-[var(--text-secondary)]">Design Patterns</span>
                          </div>
                          <div className="p-2 space-y-1">
                            {SNIPPETS.map((snippet) => (
                              <button
                                key={snippet.id}
                                onClick={() => loadSnippet(snippet)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-left group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:bg-[var(--bg-hover)] transition-all">
                                  {snippet.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wide">{snippet.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (activeTab === "html") setHtml("");
                      else if (activeTab === "css") setCss("");
                      else setJs("");
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-[var(--text-primary)] transition-all ml-2"
                    title="Clear Current Editor"
                  >
                    <RefreshCcw className="w-3 h-3" />
                  </button>
                </div>
            </div>

            {/* Code Areas */}
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 custom-scrollbar overflow-y-auto">
                {activeTab === "html" && (
                  <CodeMirror
                    value={html}
                    height="100%"
                    theme={oneDark}
                    extensions={[
                      htmlLang(),
                      ...(autoCompleteEnabled ? [autocompletion()] : [])
                    ]}
                    onChange={(value) => setHtml(value)}
                    className="text-[12px] h-full"
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      highlightActiveLine: true,
                    }}
                  />
                )}
                {activeTab === "css" && (
                  <CodeMirror
                    value={css}
                    height="100%"
                    theme={oneDark}
                    extensions={[
                      cssLang(),
                      ...(autoCompleteEnabled ? [autocompletion()] : [])
                    ]}
                    onChange={(value) => setCss(value)}
                    className="text-[12px] h-full"
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      highlightActiveLine: true,
                    }}
                  />
                )}
                {activeTab === "js" && (
                  <CodeMirror
                    value={js}
                    height="100%"
                    theme={oneDark}
                    extensions={[
                      jsLang(),
                      ...(autoCompleteEnabled ? [autocompletion()] : [])
                    ]}
                    onChange={(value) => setJs(value)}
                    className="text-[12px] h-full"
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      highlightActiveLine: true,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Stats Footer */}
            <div className="px-8 py-3 bg-white/[0.01] border-t border-[var(--border)] flex items-center justify-between text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
              <div className="flex items-center gap-4">
                <span>UTF-8</span>
                <span>Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                Live Sync Active
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border)] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-primary)] flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white">Edge Rendering</h4>
              <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-relaxed">
                Low-latency execution environment optimized for modern web standards and rapid UI iteration.
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-primary)] ">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">Simulation Lab</h4>
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">High-Fidelity Preview</p>
                    {executionTime !== null && (
                      <span className="text-xs font-medium text-[var(--text-primary)] uppercase tracking-tighter bg-[var(--bg-card)] px-2 py-0.5 rounded-full">
                        Sync: {executionTime}ms
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <button onClick={() => setViewport("wide")} className={cn("p-2 rounded-lg transition-all", viewport === "wide" ? "bg-[var(--bg-hover)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")} title="Ultra Wide (1440px)"><Box className="w-4 h-4" /></button>
                  <button onClick={() => setViewport("desktop")} className={cn("p-2 rounded-lg transition-all", viewport === "desktop" ? "bg-[var(--bg-hover)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")} title="Desktop (100%)"><Monitor className="w-4 h-4" /></button>
                  <button onClick={() => setViewport("tablet")} className={cn("p-2 rounded-lg transition-all", viewport === "tablet" ? "bg-[var(--bg-hover)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")} title="Tablet (450px)"><Tablet className="w-4 h-4" /></button>
                  <button onClick={() => setViewport("mobile")} className={cn("p-2 rounded-lg transition-all", viewport === "mobile" ? "bg-[var(--bg-hover)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")} title="Mobile (320px)"><Smartphone className="w-4 h-4" /></button>
                </div>
                <button 
                  onClick={() => setIsFullscreen(true)}
                  className="p-3 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--text-primary)] transition-all shadow-xl"
                  title="Fullscreen Preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-[450px] rounded-[12px] bg-[var(--bg)] border border-[var(--border)] shadow-2xl relative overflow-hidden flex items-center justify-center transition-all group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-brand-primary)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />

              <div className={cn(
                "relative z-10 h-full transition-all duration-500 bg-white shadow-2xl overflow-hidden flex flex-col",
                viewport === "wide" ? "w-[120%] scale-90" : viewport === "desktop" ? "w-full" : viewport === "tablet" ? "w-[450px] h-[400px] rounded-[12px]" : "w-[320px] h-[380px] rounded-[12px]"
              )}>
                {/* Browser Frame */}
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 border-b border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 bg-white rounded-lg h-6 flex items-center px-3 gap-2 border border-slate-200 group/url cursor-pointer hover:border-[var(--border-hover)] transition-all" onClick={openPreview}>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-tight group-hover/url:text-[var(--text-primary)] transition-colors">localhost:3000/preview</span>
                    <Maximize2 className="w-2.5 h-2.5 ml-auto text-[var(--text-primary)] group-hover/url:text-[var(--text-primary)] transition-colors" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded bg-slate-200" />
                  </div>
                </div>

                  <iframe
                    ref={iframeRef}
                    srcDoc={srcDoc}
                    title="Compiler Preview"
                    className="flex-1 w-full border-none"
                    sandbox="allow-scripts"
                  />

                  {/* Loading Overlay */}
                  {isCompiling && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-[var(--border)] border-t-brand-primary animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Cpu className="w-4 h-4 text-[var(--text-primary)] animate-pulse" />
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col items-center">
                        <span className="text-xs font-medium text-[var(--text-primary)] animate-pulse">Rendering Engine...</span>
                        <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase mt-1">Estimating Latency</span>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Production Console */}
            <div className="rounded-[12px] bg-[var(--bg)] border border-[var(--border)] overflow-hidden shadow-2xl flex flex-col h-[180px]">
              <div className="flex items-center justify-between px-6 py-3 bg-[var(--bg)] border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[var(--text-primary)]" />
                  <span className="text-sm font-medium text-[var(--text-primary)]">Production Console</span>
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="text-[9px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-widest transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1.5 custom-scrollbar bg-[var(--bg)]">
                {logs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[var(--text-tertiary)] italic">
                    No logs recorded.
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                      <span className="text-[var(--text-tertiary)] flex-shrink-0">[{log.timestamp}]</span>
                      <span className={cn(
                        "break-all",
                        log.type === "error" ? "text-rose-400" : log.type === "warn" ? "text-amber-400" : "text-indigo-200"
                      )}>
                        <span className="opacity-50 mr-1.5">{log.type === "error" ? "✖" : log.type === "warn" ? "⚠" : "›"}</span>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className=" mt-10 fixed inset-0 z-[100] bg-[var(--bg)] p-8 md:p-16 flex flex-col animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-brand-primary)_0%,_transparent_40%)] opacity-20 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[8px] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-primary)]">
                <Maximize2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Expanded View</h2>
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Full Canvas Visualization</p>
              </div>
            </div>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="px-6 py-3 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border)] text-xs font-black text-[var(--text-secondary)] hover:bg-rose-500 hover:text-[var(--text-primary)] transition-all uppercase tracking-widest"
            >
              Close Preview
            </button>
          </div>

          <div className="flex-1 w-7xl mx-auto rounded-[12px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-[var(--border)] relative z-10">
            {/* Browser Frame */}
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-100 border-b border-slate-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 bg-white rounded-xl h-8 flex items-center px-4 gap-3 border border-slate-200 mx-8 group/url cursor-pointer hover:border-[var(--border-hover)] transition-all" onClick={openPreview}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-widest group-hover/url:text-[var(--text-primary)] transition-colors">localhost:3000/preview</span>
                <Maximize2 className="w-3.5 h-3.5 ml-auto text-[var(--text-primary)] group-hover/url:text-[var(--text-primary)] transition-colors" />
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-lg bg-slate-200" />
              </div>
            </div>

            <iframe
              srcDoc={srcDoc}
              title="Fullscreen Preview"
              className="flex-1 w-full border-none bg-white"
              sandbox="allow-scripts"
            />

            {/* Loading Overlay */}
            {isCompiling && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[var(--border)] border-t-brand-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-[var(--text-primary)] animate-pulse" />
                  </div>
                </div>
                <span className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--text-primary)] animate-pulse">Synchronizing Edge...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
