"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Eye, Monitor, Smartphone, Tablet,
  ArrowLeft, Cpu, FileCode, Terminal, Maximize2,
  Search, Settings, FolderTree, Download,
  ChevronDown, ChevronUp, X, Save,
  FileType, Brackets,
  Braces, File, Command,
  AlertCircle, Pencil, Check,
  Trash2, FilePlus
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as prettier from "prettier/standalone";
import * as htmlParser from "prettier/plugins/html";
import * as cssParser from "prettier/plugins/postcss";
import * as babelParser from "prettier/plugins/babel";
import * as estreeParser from "prettier/plugins/estree";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ─── Types ───

type Viewport = "desktop" | "tablet" | "mobile" | "wide";
type SidebarTab = "files" | "search" | "settings";
type BottomTab = "console" | "problems";
type LogType = "log" | "error" | "warn";

interface FileData {
  id: string;
  name: string;
  content: string;
  savedContent: string;
  language: string;
}


interface ConsoleLog {
  type: LogType;
  message: string;
  timestamp: string;
}

interface Problem {
  fileId: string;
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning" | "info";
}

interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: "on" | "off";
  minimap: boolean;
  formatOnSave: boolean;
}

interface CommandItem {
  id: string;
  label: string;
  shortcut: string;
  action: () => void;
}

// ─── Constants ───

const THEME_STORAGE_KEY = "compiler-theme";
const SETTINGS_STORAGE_KEY = "compiler-settings";

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 13,
  tabSize: 2,
  wordWrap: "on",
  minimap: false,
  formatOnSave: false,
};

const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  html: "html", htm: "html",
  css: "css", scss: "scss", less: "less",
  js: "javascript", jsx: "javascript",
  ts: "typescript", tsx: "typescript",
  json: "json", md: "markdown",
  xml: "xml", svg: "xml",
  txt: "plaintext", py: "python",
  rb: "ruby", java: "java",
  go: "go", rs: "rust",
  sh: "shell", bash: "shell",
  yml: "yaml", yaml: "yaml",
  toml: "toml", sql: "sql",
};

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  wide: "w-full max-w-7xl",
  desktop: "w-full max-w-5xl",
  tablet: "w-[450px]",
  mobile: "w-[320px]",
};

const ACTIVITY_ITEMS: { tab: SidebarTab; icon: React.ReactNode; label: string }[] = [
  { tab: "files", icon: <FolderTree className="w-5 h-5" />, label: "Files" },
  { tab: "search", icon: <Search className="w-5 h-5" />, label: "Search" },
  { tab: "settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
];

const DEFAULT_HTML_CONTENT = `<!-- HTML Compiler Online -->
<div class="card">
  <h1>HTML Compiler</h1>
  <p>Edit HTML, CSS, and JS with live preview.</p>
  <button id="action-btn">Click Me</button>
</div>`;

const DEFAULT_CSS_CONTENT = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a1a;
  color: #ededed;
}

.card {
  background: #252525;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  max-width: 480px;
  width: 100%;
}

h1 {
  margin: 0 0 1rem;
  font-size: 2.5rem;
  font-weight: 600;
}

p {
  color: #a0a0a0;
  margin-bottom: 2rem;
  line-height: 1.6;
}

button {
  background: #ededed;
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.8;
}`;

const DEFAULT_JS_CONTENT = `document.getElementById("action-btn").addEventListener("click", () => {
  console.log("Hello from HTML Compiler!");
  alert("HTML Compiler Online - VS Code Edition");
});`;

function makeDefaultFiles(): FileData[] {
  return [
    { id: "index.html", name: "index.html", content: DEFAULT_HTML_CONTENT, savedContent: DEFAULT_HTML_CONTENT, language: "html" },
    { id: "style.css", name: "style.css", content: DEFAULT_CSS_CONTENT, savedContent: DEFAULT_CSS_CONTENT, language: "css" },
    { id: "app.js", name: "app.js", content: DEFAULT_JS_CONTENT, savedContent: DEFAULT_JS_CONTENT, language: "javascript" },
  ];
}


// ─── Theme Colors ───

const THEMES = {
  dark: {
    "--bg-primary": "#000000",
    "--bg-secondary": "#000000",
    "--bg-tertiary": "#111111",
    "--bg-hover": "#1a1a1a",
    "--bg-active": "#222222",
    "--bg-title": "#000000",
    "--bg-activity": "#000000",
    "--border": "#333333",
    "--border-light": "#111111",
    "--text-primary": "#ffffff",
    "--text-secondary": "#999999",
    "--text-highlight": "#ffffff",
    "--status-bar": "#ffffff",
    "--console-bg": "#000000",
    "--console-toolbar": "#111111",
    "--problems-error": "#ffffff",
    "--problems-warning": "#ffffff",
    "--console-log": "#ffffff",
    "--tab-active-bg": "#000000",
    "--tab-inactive-bg": "#111111",
    "--tab-border": "#000000",
    "--preview-bg": "#000000",
    "--preview-border": "#333333",
    "--input-bg": "#1a1a1a",
    "--input-text": "#ffffff",
    "--input-placeholder": "#666666",
    "--scrollbar-thumb": "#333333",
    "--scrollbar-hover": "#555555",
    "--overlay-bg": "rgba(0,0,0,0.7)",
    "--text-danger": "#f48771",
  },
  light: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#ffffff",
    "--bg-tertiary": "#f5f5f5",
    "--bg-hover": "#eeeeee",
    "--bg-active": "#e0e0e0",
    "--bg-title": "#ffffff",
    "--bg-activity": "#ffffff",
    "--border": "#cccccc",
    "--border-light": "#eeeeee",
    "--text-primary": "#000000",
    "--text-secondary": "#666666",
    "--text-highlight": "#000000",
    "--status-bar": "#000000",
    "--console-bg": "#ffffff",
    "--console-toolbar": "#f5f5f5",
    "--problems-error": "#000000",
    "--problems-warning": "#000000",
    "--console-log": "#000000",
    "--tab-active-bg": "#ffffff",
    "--tab-inactive-bg": "#f5f5f5",
    "--tab-border": "#ffffff",
    "--preview-bg": "#ffffff",
    "--preview-border": "#cccccc",
    "--input-bg": "#f5f5f5",
    "--input-text": "#000000",
    "--input-placeholder": "#999999",
    "--scrollbar-thumb": "#cccccc",
    "--scrollbar-hover": "#aaaaaa",
    "--overlay-bg": "rgba(0,0,0,0.3)",
    "--text-danger": "#c53030",
  },
};

// ─── Helpers ───

function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return EXTENSION_LANGUAGE_MAP[ext] || "plaintext";
}

function getStoredTheme(): "dark" | "light" {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "dark";
}

function getInitialSettings(): EditorSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function getFileIcon(name: string, className?: string): React.ReactNode {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const cls = className || "w-4 h-4";
  const colorClass = "text-[var(--text-secondary)]";
  switch (ext) {
    case "html":
    case "htm":
      return <FileType className={`${cls} ${colorClass}`} />;
    case "css":
    case "scss":
    case "less":
      return <Brackets className={`${cls} ${colorClass}`} />;
    case "js":
    case "jsx":
      return <Braces className={`${cls} ${colorClass}`} />;
    case "ts":
    case "tsx":
      return <Braces className={`${cls} ${colorClass}`} />;
    case "json":
      return <Braces className={`${cls} ${colorClass}`} />;
    default:
      return <File className={`${cls} text-[var(--text-secondary)]`} />;
  }
}

// ─── Component ───

export function HtmlCompiler() {
  const [files, setFiles] = useState<FileData[]>(makeDefaultFiles);
  const [activeFileId, setActiveFileId] = useState("index.html");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [copied, setCopied] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("files");
  const [bottomTab, setBottomTab] = useState<BottomTab>("console");
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [logFilter, setLogFilter] = useState<LogType | "all">("all");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);
  const [settings, setSettings] = useState<EditorSettings>(getInitialSettings);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId?: string } | null>(null);
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const consoleRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const monacoRef = useRef<any>(null);
  const monacoInstanceRef = useRef<any>(null);
  const markerListenerRef = useRef<{ dispose: () => void } | null>(null);
  const cursorListenerRef = useRef<{ dispose: () => void } | null>(null);
  const modelListenerRef = useRef<{ dispose: () => void } | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const activeFileIdRef = useRef(activeFileId);

  useEffect(() => { activeFileIdRef.current = activeFileId; }, [activeFileId]);

  // Cleanup Monaco listeners on unmount
  useEffect(() => {
    return () => {
      markerListenerRef.current?.dispose();
      cursorListenerRef.current?.dispose();
      modelListenerRef.current?.dispose();
    };
  }, []);

  const colors = THEMES[theme];

  // ─── Derived ───

  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const isDirty = (f: FileData) => f.content !== f.savedContent;
  const openFiles = files; // all files are always open

  // ─── File Operations ───

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
  }, []);

  const switchFile = useCallback((id: string) => {
    setActiveFileId(id);
  }, []);

  const saveFile = useCallback((id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, savedContent: f.content } : f));
  }, []);

  const createFile = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed || files.some(f => f.name === trimmed)) return;
    const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newFile: FileData = {
      id,
      name: trimmed,
      content: "",
      savedContent: "",
      language: detectLanguage(trimmed),
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(id);
    setShowNewFile(false);
    setNewFileName("");
  }, [files]);

  const deleteFileById = useCallback((id: string) => {
    if (files.length <= 1) return;
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeFileId === id) {
      const remaining = files.filter(f => f.id !== id);
      setActiveFileId(remaining[0]?.id || "");
    }
    setContextMenu(null);
  }, [files, activeFileId]);

  const renameFileById = useCallback((id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || files.some(f => f.name === trimmed && f.id !== id)) return;
    const newId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setFiles(prev => prev.map(f => f.id === id ? {
      ...f, id: newId, name: trimmed, language: detectLanguage(trimmed)
    } : f));
    if (activeFileId === id) setActiveFileId(newId);
    setRenamingFileId(null);
    setRenameValue("");
  }, [files, activeFileId]);

  const handleContextMenu = useCallback((e: React.MouseEvent, fileId?: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    if (contextMenu) {
      const handler = () => closeContextMenu();
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, [contextMenu, closeContextMenu]);

  const startRename = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setRenamingFileId(id);
      setRenameValue(file.name);
      setTimeout(() => renameInputRef.current?.select(), 50);
    }
    setContextMenu(null);
  }, [files]);

  const commitRename = useCallback(() => {
    if (renamingFileId) renameFileById(renamingFileId, renameValue);
  }, [renamingFileId, renameValue, renameFileById]);

  // ─── Preview Compilation ───

  useEffect(() => {
    setIsCompiling(true);
    const start = performance.now();
    const timeout = setTimeout(() => {
      const htmlFile = files.find(f => f.name.endsWith(".html") || f.id.endsWith(".html"));
      const cssFiles = files.filter(f => f.name.endsWith(".css"));
      const jsFiles = files.filter(f => f.name.endsWith(".js"));
      const htmlContent = htmlFile?.content || "";
      const cssContent = cssFiles.map(f => f.content).join("\n");
      const jsContent = jsFiles.map(f => f.content).join("\n");
      const intercept = `
        (function() {
          const origLog = console.log;
          const origError = console.error;
          const origWarn = console.warn;
          function fmt(args) { return Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '); }
          console.log = function(...a) { window.parent.postMessage({type:'log',content:fmt(a)},'*'); origLog.apply(console,a); };
          console.error = function(...a) { window.parent.postMessage({type:'error',content:fmt(a)},'*'); origError.apply(console,a); };
          console.warn = function(...a) { window.parent.postMessage({type:'warn',content:fmt(a)},'*'); origWarn.apply(console,a); };
          window.onerror = function(m,src,line) { window.parent.postMessage({type:'error',content:m+' (line '+line+')'},'*'); };
        })();
      `;
      const combined = `<!DOCTYPE html><html><head><style>${cssContent}</style><script>${intercept}<\/script></head><body>${htmlContent}<script>${jsContent}<\/script></body></html>`;
      setSrcDoc(combined);
      setIsCompiling(false);
      setExecutionTime(Math.round(performance.now() - start));
    }, 400);
    return () => clearTimeout(timeout);
  }, [files]);

  // Update iframe srcdoc directly to avoid React parsing script tags
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc;
    }
  }, [srcDoc]);

  // ─── Console Listener ───

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data && ["log", "error", "warn"].includes(event.data.type)) {
        setLogs(prev => [...prev, {
          type: event.data.type,
          message: event.data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        }].slice(-200));
        setTimeout(() => {
          if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
          }
        }, 50);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // ─── Keyboard Shortcuts ───

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "p") {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
        return;
      }
      if (showCommandPalette) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (activeFile) {
          saveFile(activeFile.id);
          if (settings.formatOnSave) formatCode();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "`") {
        e.preventDefault();
        setShowConsole(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        if (activeFile) deleteFileById(activeFile.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showCommandPalette, activeFile, settings.formatOnSave]);

  // ─── Monaco ───

  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    monacoRef.current = editor;
    monacoInstanceRef.current = monaco;

    if (monaco) {
      monaco.editor.defineTheme("compiler-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#000000",
          "editor.foreground": "#ffffff",
          "editor.lineHighlightBackground": "#1a1a1a",
          "editor.selectionBackground": "#333333",
          "editor.inactiveSelectionBackground": "#222222",
          "editorCursor.foreground": "#ffffff",
          "editorLineNumber.foreground": "#555555",
          "editorLineNumber.activeForeground": "#ffffff",
          "editorBracketMatch.background": "#222222",
          "editorBracketMatch.border": "#ffffff",
        }
      });
      monaco.editor.defineTheme("compiler-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#000000",
          "editor.lineHighlightBackground": "#f5f5f5",
          "editor.selectionBackground": "#e0e0e0",
          "editor.inactiveSelectionBackground": "#eeeeee",
          "editorCursor.foreground": "#000000",
          "editorLineNumber.foreground": "#999999",
          "editorLineNumber.activeForeground": "#000000",
          "editorBracketMatch.background": "#f0f0f0",
          "editorBracketMatch.border": "#000000",
        }
      });
    }

    cursorListenerRef.current?.dispose();
    cursorListenerRef.current = editor.onDidChangeCursorPosition((e: any) => {
      setCursorPos({ line: e.position.lineNumber, column: e.position.column });
    });

    if (monaco) {
      modelListenerRef.current?.dispose();
      modelListenerRef.current = editor.onDidChangeModel(() => {
        const model = editor.getModel();
        if (model) {
          const markers = monaco.editor.getModelMarkers({ resource: model.uri });
          setProblems(markers.map((m: any) => ({
            fileId: activeFileIdRef.current,
            line: m.startLineNumber,
            column: m.startColumn,
            message: m.message,
            severity: m.severity === monaco.MarkerSeverity.Error ? "error" : m.severity >= monaco.MarkerSeverity.Warning ? "warning" : "info",
          })));
        }
      });

      markerListenerRef.current?.dispose();
      markerListenerRef.current = monaco.editor.onDidChangeMarkers((resources: any[]) => {
        const model = editor.getModel();
        if (model && resources.some((r: any) => r.toString() === model.uri.toString())) {
          const markers = monaco.editor.getModelMarkers({ resource: model.uri });
          setProblems(markers.map((m: any) => ({
            fileId: activeFileIdRef.current,
            line: m.startLineNumber,
            column: m.startColumn,
            message: m.message,
            severity: m.severity === monaco.MarkerSeverity.Error ? "error" : m.severity >= monaco.MarkerSeverity.Warning ? "warning" : "info",
          })));
        }
      });
    }
  }, []);

  // ─── Format ───

  const formatCode = useCallback(async () => {
    if (!activeFile) return;
    try {
      let formatted: string;
      const lang = activeFile.language;
      if (lang === "html") {
        formatted = await prettier.format(activeFile.content, { parser: "html", plugins: [htmlParser], printWidth: 80, tabWidth: settings.tabSize });
      } else if (["css", "scss", "less"].includes(lang)) {
        formatted = await prettier.format(activeFile.content, { parser: "css", plugins: [cssParser], printWidth: 80, tabWidth: settings.tabSize });
      } else if (lang === "javascript") {
        formatted = await prettier.format(activeFile.content, { parser: "babel", plugins: [babelParser, estreeParser], printWidth: 80, tabWidth: settings.tabSize });
      } else if (lang === "typescript") {
        formatted = await prettier.format(activeFile.content, { parser: "typescript", plugins: [babelParser, estreeParser], printWidth: 80, tabWidth: settings.tabSize });
      } else if (lang === "json") {
        formatted = await prettier.format(activeFile.content, { parser: "json", plugins: [babelParser, estreeParser], printWidth: 80, tabWidth: settings.tabSize });
      } else {
        return;
      }
      updateFileContent(activeFile.id, formatted);
    } catch (err) {
      console.error("Format failed:", err);
    }
  }, [activeFile, settings.tabSize, updateFileContent]);

  // ─── Handlers ───

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch {}
  }, [theme]);

  const handleCopy = useCallback(() => {
    const text = files.map(f => `// ${f.name}\n${f.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [files]);

  const downloadZip = useCallback(async () => {
    const zip = new JSZip();
    files.forEach(f => zip.file(f.name, f.content));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "project.zip");
  }, [files]);

  const downloadFile = useCallback(() => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeFile]);

  const resetCode = useCallback(() => {
    const defaults = makeDefaultFiles();
    setFiles(defaults);
    setLogs([]);
    setProblems([]);
    setActiveFileId("index.html");
  }, []);


  const openPreview = useCallback(() => {
    const blob = new Blob([srcDoc], { type: "text/html" });
    window.open(URL.createObjectURL(blob), "_blank");
  }, [srcDoc]);

  const clearConsole = useCallback(() => {
    setLogs([]);
  }, []);

  const updateSetting = useCallback(<K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // ─── Editor Options ───

  const editorOptions = useMemo(() => ({
    fontSize: settings.fontSize,
    fontFamily: "'Geist Mono', 'Cascadia Code', 'Fira Code', monospace",
    minimap: { enabled: settings.minimap },
    lineNumbers: "on" as const,
    renderLineHighlight: "all" as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: settings.tabSize,
    wordWrap: settings.wordWrap,
    padding: { top: 12 },
    cursorBlinking: "smooth" as const,
    smoothScrolling: true,
    bracketPairColorization: { enabled: true },
    folding: true,
    foldingHighlight: true,
    foldingStrategy: "indentation" as const,
    autoClosingBrackets: "always" as const,
    autoClosingQuotes: "always" as const,
    formatOnPaste: true,
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    stickyScroll: { enabled: true },
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
  }), [settings]);

  // ─── Commands ───

  const commands: CommandItem[] = useMemo(() => [
    { id: "format", label: "Format Code", shortcut: "Ctrl+S", action: () => { formatCode(); if (activeFile) saveFile(activeFile.id); } },
    { id: "toggle-sidebar", label: "Toggle Sidebar", shortcut: "Ctrl+B", action: () => setShowSidebar(p => !p) },
    { id: "toggle-console", label: "Toggle Console", shortcut: "Ctrl+`", action: () => setShowConsole(p => !p) },
    { id: "create-file", label: "Create New File", shortcut: "", action: () => { setShowNewFile(true); setShowCommandPalette(false); setTimeout(() => newFileInputRef.current?.focus(), 50); } },
    { id: "download-zip", label: "Download Project as ZIP", shortcut: "", action: () => { downloadZip(); setShowCommandPalette(false); } },
    { id: "copy-all", label: "Copy All Code", shortcut: "", action: () => { handleCopy(); setShowCommandPalette(false); } },
    { id: "reset", label: "Reset Workspace", shortcut: "", action: () => { resetCode(); setShowCommandPalette(false); } },
    { id: "open-preview", label: "Open Preview in New Tab", shortcut: "", action: () => { openPreview(); setShowCommandPalette(false); } },
    ...files.map(f => ({
      id: `switch-${f.id}`,
      label: `Switch to ${f.name}`,
      shortcut: "",
      action: () => { switchFile(f.id); setShowCommandPalette(false); },
    })),
    { id: "theme", label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`, shortcut: "", action: () => { toggleTheme(); setShowCommandPalette(false); } },
  ], [formatCode, saveFile, activeFile, downloadZip, handleCopy, resetCode, openPreview, switchFile, files, toggleTheme, theme]);

  const filteredCommands = useMemo(() => {
    if (!commandQuery.trim()) return commands;
    const q = commandQuery.toLowerCase();
    return commands.filter(c => c.label.toLowerCase().includes(q));
  }, [commandQuery, commands]);

  const executeCommand = useCallback((cmd: CommandItem) => {
    cmd.action();
    setShowCommandPalette(false);
    setCommandQuery("");
    setCommandIndex(0);
  }, []);

  // ─── Filtered Logs ───

  const filteredLogs = logFilter === "all" ? logs : logs.filter(l => l.type === logFilter);

  // ─── Render ───

  return (
    <>
      <div
        className="h-screen flex flex-col overflow-hidden select-none"
        style={colors as React.CSSProperties}
        onClick={closeContextMenu}
      >
        {/* ─── Title Bar ─── */}
        <div className="flex items-center justify-between px-4 h-9 bg-[var(--bg-title)] border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-highlight)] transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back
            </Link>
            <span className="w-px h-4 bg-[var(--border)]" />
            <span className="text-xs font-medium text-[var(--text-primary)]">HTML Compiler — VS Code Edition</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={formatCode} className="px-2 py-0.5 rounded text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-1">
              <Save className="w-3 h-3" /> Format
            </button>
            <button onClick={downloadFile} className="px-2 py-0.5 rounded text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-1">
              <Download className="w-3 h-3" /> File
            </button>
            <button onClick={downloadZip} className="px-2 py-0.5 rounded text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-1">
              <FileCode className="w-3 h-3" /> ZIP
            </button>
          </div>
        </div>

        {/* ─── Main Area ─── */}
        <div className="flex-1 flex min-h-0">
          {/* Activity Bar */}
          <div className="w-12 flex flex-col items-center py-2 gap-2 bg-[var(--bg-activity)] border-r border-[var(--border-light)] shrink-0 z-10">
            {ACTIVITY_ITEMS.map(({ tab, icon, label }) => (
              <button
                key={tab}
                onClick={() => { setSidebarTab(tab); if (sidebarTab === tab && showSidebar) setShowSidebar(false); else { setSidebarTab(tab); setShowSidebar(true); } }}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded transition-colors relative",
                  sidebarTab === tab && showSidebar ? "text-[var(--text-highlight)] before:absolute before:left-0 before:w-0.5 before:h-6 before:bg-[var(--text-highlight)] before:rounded-r" : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)]"
                )}
                title={label}
              >
                {icon}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] transition-colors"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Eye className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            </button>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="w-60 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)] shrink-0 z-10">
              <div className="flex items-center justify-between px-4 h-9 border-b border-[var(--border)]">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  {sidebarTab === "files" ? "Explorer" : sidebarTab === "search" ? "Search" : "Settings"}
                </span>
                <button onClick={() => setShowSidebar(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ─── Files Tab ─── */}
              {sidebarTab === "files" && (
                <div className="flex-1 overflow-y-auto py-1 text-sm">
                  <div className="flex items-center justify-between px-4 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                    <span>Workspace</span>
                    <button
                      onClick={() => { setShowNewFile(true); setTimeout(() => newFileInputRef.current?.focus(), 50); }}
                      className="p-0.5 rounded hover:bg-[var(--bg-hover)] transition-colors"
                      title="New File"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {files.map((file, idx) => (
                    <div key={file.id}>
                      {renamingFileId === file.id ? (
                        <div className="flex items-center gap-1 px-4 py-0.5">
                          {getFileIcon(file.name, "w-4 h-4 shrink-0")}
                          <input
                            ref={renameInputRef}
                            type="text"
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") commitRename();
                              if (e.key === "Escape") setRenamingFileId(null);
                            }}
                            className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] text-[13px] px-1.5 py-0.5 rounded border border-[var(--border)] outline-none"
                            style={{ background: "var(--input-bg)", color: "var(--input-text)" }}
                            autoFocus
                          />
                          <button onClick={commitRename} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)]">
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => switchFile(file.id)}
                          onContextMenu={e => handleContextMenu(e, file.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-4 py-1 text-[13px] transition-colors",
                            activeFileId === file.id ? "bg-[var(--bg-active)] text-[var(--text-highlight)]" : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)]"
                          )}
                        >
                          {getFileIcon(file.name)}
                          <span className="truncate">{file.name}</span>
                          {isDirty(file) && <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-highlight)] shrink-0 ml-auto" />}
                        </button>
                      )}
                    </div>
                  ))}
                  {showNewFile && (
                    <div className="flex items-center gap-1 px-4 py-0.5">
                      <File className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                      <input
                        ref={newFileInputRef}
                        type="text"
                        value={newFileName}
                        onChange={e => setNewFileName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") createFile(newFileName);
                          if (e.key === "Escape") { setShowNewFile(false); setNewFileName(""); }
                        }}
                        placeholder="filename.ext"
                        className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] text-[13px] px-1.5 py-0.5 rounded border border-[var(--border)] outline-none placeholder:text-[var(--input-placeholder)]"
                        style={{ background: "var(--input-bg)", color: "var(--input-text)" }}
                        autoFocus
                      />
                      <button onClick={() => { setShowNewFile(false); setNewFileName(""); }} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)]">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* ─── Search Tab ─── */}
              {sidebarTab === "search" && (
                <SearchSidebar
                  files={files}
                  activeFileId={activeFileId}
                  onSwitchFile={switchFile}
                />
              )}

              {/* ─── Settings Tab ─── */}
              {sidebarTab === "settings" && (
                <div className="flex-1 p-4 space-y-4 text-xs overflow-y-auto">
                  <SettingRow label="Font Size">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="10"
                        max="24"
                        value={settings.fontSize}
                        onChange={e => updateSetting("fontSize", parseInt(e.target.value))}
                        className="w-20 accent-[var(--text-highlight)]"
                      />
                      <span className="text-[var(--text-secondary)] w-6 text-center">{settings.fontSize}</span>
                    </div>
                  </SettingRow>
                  <SettingRow label="Tab Size">
                    <select
                      value={settings.tabSize}
                      onChange={e => updateSetting("tabSize", parseInt(e.target.value))}
                      className="bg-[var(--input-bg)] text-[var(--input-text)] text-xs px-2 py-1 rounded border border-[var(--border)] outline-none"
                      style={{ background: "var(--input-bg)", color: "var(--input-text)" }}
                    >
                      <option value={2}>2</option>
                      <option value={4}>4</option>
                      <option value={8}>8</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="Word Wrap">
                    <select
                      value={settings.wordWrap}
                      onChange={e => updateSetting("wordWrap", e.target.value as "on" | "off")}
                      className="bg-[var(--input-bg)] text-[var(--input-text)] text-xs px-2 py-1 rounded border border-[var(--border)] outline-none"
                      style={{ background: "var(--input-bg)", color: "var(--input-text)" }}
                    >
                      <option value="on">On</option>
                      <option value="off">Off</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="Minimap">
                    <input
                      type="checkbox"
                      checked={settings.minimap}
                      onChange={e => updateSetting("minimap", e.target.checked)}
                      className="accent-[var(--text-highlight)]"
                    />
                  </SettingRow>
                  <SettingRow label="Format on Save">
                    <input
                      type="checkbox"
                      checked={settings.formatOnSave}
                      onChange={e => updateSetting("formatOnSave", e.target.checked)}
                      className="accent-[var(--text-highlight)]"
                    />
                  </SettingRow>
                </div>
              )}
            </div>
          )}

          {/* Editor + Preview */}
          <div className="flex-1 flex min-h-0">
            {/* Editor Panel */}
            <div className={cn("flex flex-col min-h-0", "flex-1")}>
              {/* Tab Bar */}
              <div className="flex items-center bg-[var(--bg-secondary)] border-b border-[var(--border)] shrink-0 overflow-x-auto">
                {openFiles.map((file) => (
                  <div
                    key={file.id}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-[13px] border-r border-[var(--border)] transition-colors cursor-pointer relative group",
                      activeFileId === file.id
                        ? "bg-[var(--tab-active-bg)] text-[var(--text-highlight)]"
                        : "bg-[var(--tab-inactive-bg)] text-[var(--text-secondary)] hover:text-[var(--text-highlight)]"
                    )}
                    onClick={() => switchFile(file.id)}
                    onContextMenu={e => handleContextMenu(e, file.id)}
                  >
                    {getFileIcon(file.name, "w-3.5 h-3.5")}
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    {isDirty(file) && (
                      <span className="w-2 h-2 rounded-full bg-[var(--text-highlight)] shrink-0" />
                    )}
                    {files.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteFileById(file.id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-secondary)] hover:text-[var(--text-highlight)] ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex-1 bg-[var(--bg-secondary)]" />
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 min-h-0">
                <MonacoEditor
                  key={theme}
                  height="100%"
                  language={activeFile?.language || "html"}
                  theme={theme === "dark" ? "compiler-dark" : "compiler-light"}
                  value={activeFile?.content || ""}
                  onChange={(val) => {
                    if (activeFile && val !== undefined) {
                      updateFileContent(activeFile.id, val);
                    }
                  }}
                  onMount={handleEditorMount}
                  options={editorOptions}
                  loading={
                    <div className="h-full flex items-center justify-center text-[var(--text-secondary)] text-xs gap-2">
                      <Cpu className="w-4 h-4 animate-pulse" />
                      Loading editor...
                    </div>
                  }
                />
              </div>
            </div>

            {/* Preview Panel */}
            <div className="w-[45%] min-w-[320px] flex flex-col border-l border-[var(--border)] bg-[var(--preview-bg)]">
              {/* Preview Toolbar */}
              <div className="flex items-center justify-between px-3 h-9 bg-[var(--bg-tertiary)] border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Preview</span>
                  {executionTime !== null && (
                    <span className="text-[10px] text-[var(--text-secondary)] ml-2 opacity-60">{executionTime}ms</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewport("wide")} className={cn("p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors", viewport === "wide" && "text-[var(--text-highlight)] bg-[var(--bg-hover)]")} title="Wide"><Monitor className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setViewport("desktop")} className={cn("p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors", viewport === "desktop" && "text-[var(--text-highlight)] bg-[var(--bg-hover)]")} title="Desktop"><Monitor className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setViewport("tablet")} className={cn("p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors", viewport === "tablet" && "text-[var(--text-highlight)] bg-[var(--bg-hover)]")} title="Tablet"><Tablet className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setViewport("mobile")} className={cn("p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors", viewport === "mobile" && "text-[var(--text-highlight)] bg-[var(--bg-hover)]")} title="Mobile"><Smartphone className="w-3.5 h-3.5" /></button>
                  <span className="w-px h-4 bg-[var(--border)] mx-1" />
                  <button onClick={openPreview} className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors" title="Open in new tab"><Maximize2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* Iframe */}
              <div className="flex-1 flex items-center justify-center bg-[var(--preview-bg)] p-4 min-h-0 relative overflow-hidden">
                <div className={cn("h-full flex flex-col overflow-hidden shadow-lg", VIEWPORT_WIDTHS[viewport])}>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#f5f5f5] border-b border-[#e0e0e0] shrink-0 rounded-t">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="bg-white rounded h-5 flex items-center px-3 border border-[#e0e0e0] text-[9px] text-[#888] truncate max-w-[200px]">
                        localhost/preview
                      </div>
                    </div>
                  </div>
                  <iframe
                    ref={iframeRef}
                    title="Preview"
                    className="flex-1 w-full border-none bg-white"
                    sandbox="allow-scripts"
                  />
                </div>
                {isCompiling && (
                  <div className="absolute inset-0 bg-[var(--overlay-bg)] flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Cpu className="w-4 h-4 animate-pulse" />
                      Compiling...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Status Bar ─── */}
        <div className="flex items-center justify-between px-4 h-5 bg-[var(--status-bar)] text-[var(--status-bar-text)] text-[11px] shrink-0 z-10" style={{ color: theme === "dark" ? "#000" : "#fff" }}>
          <div className="flex items-center gap-4">
            <span>Ln {cursorPos.line}, Col {cursorPos.column}</span>
            <span className="w-px h-3" style={{ backgroundColor: theme === "dark" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)" }} />
            <span>UTF-8</span>
            <span className="w-px h-3" style={{ backgroundColor: theme === "dark" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)" }} />
            <span>{activeFile?.language || ""}</span>
            <span className="w-px h-3" style={{ backgroundColor: theme === "dark" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)" }} />
            <span className="flex items-center gap-1">
              <span className={cn("w-1.5 h-1.5 rounded-full", isCompiling ? "bg-[#ff0] animate-pulse" : "")} style={{ backgroundColor: theme === "dark" ? "#000" : "#fff" }} />
              {isCompiling ? "Compiling..." : activeFile && isDirty(activeFile) ? "Unsaved" : "Ready"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {executionTime !== null && <span>Compiled: {executionTime}ms</span>}
            <button
              onClick={() => setShowConsole(prev => !prev)}
              className="flex items-center gap-1 hover:opacity-70 px-1.5 py-0.5 rounded transition-opacity"
              style={{ color: theme === "dark" ? "#000" : "#fff" }}
            >
              <Terminal className="w-3 h-3" />
              Console
              {logs.length > 0 && (
                <span className="text-[10px] px-1 rounded" style={{ backgroundColor: theme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.3)" }}>{logs.length}</span>
              )}
              {showConsole ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setBottomTab("problems")}
              className="flex items-center gap-1 hover:opacity-70 px-1.5 py-0.5 rounded transition-opacity"
              style={{ color: theme === "dark" ? "#000" : "#fff", backgroundColor: bottomTab === "problems" ? (theme === "dark" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)") : "transparent" }}
            >
              <AlertCircle className="w-3 h-3" />
              Problems
              {problems.length > 0 && (
                <span className="text-[10px] px-1 rounded" style={{ backgroundColor: theme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.3)" }}>{problems.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* ─── Bottom Panel ─── */}
        {showConsole && (
          <div className="h-44 flex flex-col bg-[var(--bg-secondary)] border-t border-[var(--border)] shrink-0 z-10">
            {/* Bottom Tab Bar */}
            <div className="flex items-center justify-between px-4 h-8 bg-[var(--console-toolbar)] border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBottomTab("console")}
                  className={cn("px-3 py-1 text-[11px] font-medium rounded-t transition-colors", bottomTab === "console" ? "text-[var(--text-highlight)] bg-[var(--bg-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)]")}
                >
                  <Terminal className="w-3 h-3 inline mr-1" />
                  Console
                </button>
                <button
                  onClick={() => setBottomTab("problems")}
                  className={cn("px-3 py-1 text-[11px] font-medium rounded-t transition-colors", bottomTab === "problems" ? "text-[var(--text-highlight)] bg-[var(--bg-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)]")}
                >
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Problems
                  {problems.length > 0 && <span className="ml-1 text-[10px] opacity-60">({problems.length})</span>}
                </button>
              </div>
              <button onClick={() => setShowConsole(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)] transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Console Panel */}
            {bottomTab === "console" && (
              <>
                <div className="flex items-center gap-2 px-4 py-1 bg-[var(--console-toolbar)] border-b border-[var(--border)] shrink-0">
                  <div className="flex items-center gap-1">
                    {(["all", "log", "warn", "error"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setLogFilter(f)}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] uppercase transition-colors",
                          logFilter === f ? "bg-[var(--status-bar)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)]"
                        )}
                      >
                        {f === "all" ? "All" : f}
                        {f !== "all" && (
                          <span className="ml-1 opacity-60">{logs.filter(l => l.type === f).length}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1" />
                  <button onClick={clearConsole} className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-highlight)] transition-colors flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div ref={consoleRef} className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed space-y-1 bg-[var(--console-bg)]">
                  {filteredLogs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[var(--text-secondary)] italic opacity-50">
                      No {logFilter !== "all" ? logFilter : ""} messages
                    </div>
                  ) : (
                    filteredLogs.map((log, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-[var(--text-secondary)] shrink-0 opacity-50">[{log.timestamp}]</span>
                        <span className={cn(
                          "break-all",
                          log.type === "error" ? "text-[var(--problems-error)]" : log.type === "warn" ? "text-[var(--problems-warning)]" : "text-[var(--console-log)]"
                        )}>
                          <span className="mr-1">{log.type === "error" ? "✖" : log.type === "warn" ? "⚠" : "›"}</span>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Problems Panel */}
            {bottomTab === "problems" && (
              <div className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed space-y-1 bg-[var(--console-bg)]">
                {problems.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[var(--text-secondary)] italic opacity-50">
                    No problems detected
                  </div>
                ) : (
                  problems.map((p, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className={cn(
                        "shrink-0 mt-0.5",
                        p.severity === "error" ? "text-[var(--problems-error)]" : p.severity === "warning" ? "text-[var(--problems-warning)]" : "text-[var(--text-secondary)]"
                      )}>
                        {p.severity === "error" ? "✖" : p.severity === "warning" ? "⚠" : "ℹ"}
                      </span>
                      <span className="text-[var(--text-secondary)] shrink-0">
                        {p.fileId === activeFileId ? "" : files.find(f => f.id === p.fileId)?.name}:{p.line}:{p.column}
                      </span>
                      <span className={cn(
                        p.severity === "error" ? "text-[var(--problems-error)]" : p.severity === "warning" ? "text-[var(--problems-warning)]" : "text-[var(--console-log)]"
                      )}>
                        {p.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      {/* ─── Context Menu ─── */}
      {contextMenu && (
        <div
          className="fixed z-50 w-44 bg-[var(--bg-secondary)] border border-[var(--border)] rounded shadow-xl py-1 text-sm"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => { setShowNewFile(true); setContextMenu(null); setTimeout(() => newFileInputRef.current?.focus(), 50); }}
            className="w-full flex items-center gap-2 px-4 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors text-left"
          >
            <FilePlus className="w-4 h-4" />
            New File
          </button>
          {contextMenu.fileId && (
            <>
              <div className="h-px bg-[var(--border)] mx-2 my-1" />
              <button
                onClick={() => startRename(contextMenu.fileId!)}
                className="w-full flex items-center gap-2 px-4 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors text-left"
              >
                <Pencil className="w-4 h-4" />
                Rename
              </button>
              <button
                onClick={() => deleteFileById(contextMenu.fileId!)}
                className="w-full flex items-center gap-2 px-4 py-1.5 text-[var(--text-danger)] hover:bg-[var(--bg-hover)] transition-colors text-left"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* ─── Command Palette ─── */}
      {showCommandPalette && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-[var(--overlay-bg)]"
          onClick={() => { setShowCommandPalette(false); setCommandQuery(""); setCommandIndex(0); }}
        >
          <div
            className="w-[600px] max-w-[90vw] bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
              <Command className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
              <input
                ref={commandInputRef}
                type="text"
                value={commandQuery}
                onChange={e => { setCommandQuery(e.target.value); setCommandIndex(0); }}
                onKeyDown={e => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setCommandIndex(i => Math.min(i + 1, filteredCommands.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setCommandIndex(i => Math.max(i - 1, 0)); }
                  if (e.key === "Enter" && filteredCommands[commandIndex]) executeCommand(filteredCommands[commandIndex]);
                  if (e.key === "Escape") { setShowCommandPalette(false); setCommandQuery(""); setCommandIndex(0); }
                }}
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-[var(--text-primary)] outline-none border-none text-sm placeholder:text-[var(--input-placeholder)]"
                autoFocus
              />
              <kbd className="text-[10px] text-[var(--text-secondary)] border border-[var(--border)] rounded px-1.5 py-0.5">↵</kbd>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {filteredCommands.map((cmd, i) => (
                <div
                  key={cmd.id}
                  className={cn(
                    "flex items-center justify-between px-4 py-2 cursor-pointer text-sm transition-colors",
                    i === commandIndex
                      ? "bg-[var(--bg-active)] text-[var(--text-highlight)]"
                      : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  )}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setCommandIndex(i)}
                >
                  <div className="flex items-center gap-2">
                    {cmd.id.startsWith("switch-") ? getFileIcon(cmd.label.replace("Switch to ", ""), "w-4 h-4") : null}
                    <span>{cmd.label}</span>
                  </div>
                  {cmd.shortcut && (
                    <kbd className="text-[9px] text-[var(--text-secondary)] border border-[var(--border)] rounded px-1.5 py-0.5">{cmd.shortcut}</kbd>
                  )}
                </div>
              ))}
              {filteredCommands.length === 0 && (
                <div className="px-4 py-8 text-center text-[var(--text-secondary)] text-sm">
                  No matching commands
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

// ─── Sub-components ───

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between text-[var(--text-primary)]">
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      {children}
    </label>
  );
}

function SearchSidebar({
  files,
  activeFileId,
  onSwitchFile,
}: {
  files: FileData[];
  activeFileId: string;
  onSwitchFile: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const out: { fileId: string; fileName: string; line: number; content: string }[] = [];
    files.forEach(f => {
      const lines = f.content.split("\n");
      lines.forEach((line, i) => {
        if (line.toLowerCase().includes(q)) {
          out.push({ fileId: f.id, fileName: f.name, line: i + 1, content: line.trim() });
        }
      });
    });
    return out;
  }, [query, files]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-2">
        <div className="flex items-center gap-2 bg-[var(--input-bg)] rounded border border-[var(--border)] px-2 py-1.5" style={{ background: "var(--input-bg)" }}>
          <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
            placeholder="Search across files..."
            className="flex-1 bg-transparent text-[var(--input-text)] text-[13px] outline-none border-none placeholder:text-[var(--input-placeholder)]"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)]">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto text-[13px]">
        <div className="px-4 py-1 text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
          {query ? `${results.length} result${results.length !== 1 ? "s" : ""}` : "Search"}
        </div>
        {results.map((r, i) => (
          <button
            key={`${r.fileId}:${r.line}`}
            onClick={() => onSwitchFile(r.fileId)}
            onMouseEnter={() => setSelectedIdx(i)}
            className={cn(
              "w-full text-left px-4 py-1.5 transition-colors",
              i === selectedIdx ? "bg-[var(--bg-active)]" : "hover:bg-[var(--bg-hover)]"
            )}
          >
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-0.5">
              {getFileIcon(r.fileName, "w-3 h-3")}
              <span className="truncate">{r.fileName}</span>
              <span className="text-[10px] opacity-60">:{r.line}</span>
            </div>
            <div className="text-[12px] text-[var(--text-primary)] font-mono truncate pl-5">
              {highlightMatch(r.content, query)}
            </div>
          </button>
        ))}
        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-[var(--text-secondary)] text-xs">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const qi = text.toLowerCase().indexOf(query.toLowerCase());
  if (qi === -1) return text;
  return (
    <>
      {text.slice(0, qi)}
      <span className="bg-[var(--text-highlight)] text-[var(--bg-primary)] rounded px-0.5">{text.slice(qi, qi + query.length)}</span>
      {text.slice(qi + query.length)}
    </>
  );
}
