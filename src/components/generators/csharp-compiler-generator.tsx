"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play, Square, RotateCcw, Download, Terminal, File,
  Settings, ArrowLeft, ChevronDown,
  PanelRight, PanelLeft, X, FilePlus, Trash2, Pencil, Check,
  FileCode, FileJson, AlertCircle
} from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useTheme as useNextTheme } from "next-themes";
import Link from "next/link";
import { CompilerLoading } from "@/components/compiler-loading";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const THEMES: Record<string, Record<string, string>> = {
  dark: {
    "--bg-title": "#000000",
    "--bg-secondary": "#000000",
    "--bg-activity": "#000000",
    "--bg-hover": "#1a1a1a",
    "--bg-active": "#222222",
    "--border": "#333333",
    "--text-primary": "#ffffff",
    "--text-secondary": "#999999",
    "--text-tertiary": "#666666",
    "--text-highlight": "#ffffff",
    "--status-bar": "#ffffff",
    "--tab-active-bg": "#000000",
    "--tab-inactive-bg": "#111111",
    "--input-bg": "#1a1a1a",
    "--input-text": "#ffffff",
    "--input-placeholder": "#666666",
  },
  light: {
    "--bg-title": "#ffffff",
    "--bg-secondary": "#ffffff",
    "--bg-activity": "#ffffff",
    "--bg-hover": "#eeeeee",
    "--bg-active": "#e0e0e0",
    "--border": "#cccccc",
    "--text-primary": "#000000",
    "--text-secondary": "#666666",
    "--text-tertiary": "#999999",
    "--text-highlight": "#000000",
    "--status-bar": "#000000",
    "--tab-active-bg": "#ffffff",
    "--tab-inactive-bg": "#f5f5f5",
    "--input-bg": "#f5f5f5",
    "--input-text": "#000000",
    "--input-placeholder": "#999999",
  },
};

const DEFAULT_CODE = `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== C# Interactive Demo ===\\n");

        // Collections & loops
        var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        var evenSquares = new List<int>();
        foreach (var n in numbers)
            if (n % 2 == 0) evenSquares.Add(n * n);

        Console.WriteLine($"Even squares: {string.Join(", ", evenSquares)}");

        // Generics
        var result = Max(42, 17);
        Console.WriteLine($"\\nMax(42, 17) = {result}");

        // Pattern matching
        object value = 42;
        if (value is int i && i > 0)
            Console.WriteLine($"Positive integer: {i}");

        // Records
        var point = new Point(3, 4);
        Console.WriteLine($"\\nPoint {point}, Distance: {point.Distance():F2}");

        // Dictionary
        var scores = new Dictionary<string, int>
        {
            { "Alice", 95 },
            { "Bob", 87 },
            { "Charlie", 92 }
        };
        Console.WriteLine("\\nScores:");
        foreach (var kvp in scores)
            Console.WriteLine($"  {kvp.Key}: {kvp.Value}");

        Console.WriteLine("\\nDone!");
    }

    static T Max<T>(T a, T b) where T : IComparable<T>
        => a.CompareTo(b) > 0 ? a : b;
}

record Point(int X, int Y)
{
    public double Distance() => Math.Sqrt(X * X + Y * Y);
}
`;


type SidebarTab = "explorer" | "settings";

interface FileData {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: "on" | "off";
  minimap: boolean;
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 13,
  tabSize: 4,
  wordWrap: "on",
  minimap: true,
};

const SETTINGS_KEY = "csharp-compiler-settings";
const FILES_KEY = "csharp-compiler-files";

interface CsharpCompilerBridge {
  init: () => void;
  onReady: (fn: () => void) => void;
  onError: (fn: (msg: string) => void) => void;
  compile: (code: string, timeout?: number) => Promise<string>;
  isReady: () => boolean;
}

function getBridge(): CsharpCompilerBridge | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as Record<string, unknown>).__csharpCompiler as CsharpCompilerBridge ?? null;
}

function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "cs": return "csharp";
    case "json": return "json";
    case "txt": return "plaintext";
    case "md": return "markdown";
    case "xml": return "xml";
    default: return "plaintext";
  }
}

function getFileIcon(name: string, className?: string): React.ReactNode {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const cls = className || "w-4 h-4";
  if (ext === "cs") return <FileCode className={`${cls} text-purple-500`} />;
  if (ext === "json") return <FileJson className={`${cls} text-yellow-500`} />;
  return <File className={`${cls} text-[var(--text-secondary)]`} />;
}

function makeDefaultFiles(): FileData[] {
  return [
    { id: "Program.cs", name: "Program.cs", content: DEFAULT_CODE, language: "csharp" },
  ];
}

function getStoredFiles(): FileData[] | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(FILES_KEY);
    if (stored) return JSON.parse(stored) as FileData[];
  } catch { /* ignore */ }
  return null;
}

function CSharpEditor() {
  const storedFiles = getStoredFiles();
  const initialFiles = storedFiles?.length ? storedFiles : makeDefaultFiles();
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [activeFileId, setActiveFileId] = useState(initialFiles[0]?.id || "Program.cs");
  const [openFileIds, setOpenFileIds] = useState<string[]>([initialFiles[0]?.id || "Program.cs"]);
  const [isCompilerReady, setIsCompilerReady] = useState(false);
  const [isCompilerLoading, setIsCompilerLoading] = useState(true);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    try { return !localStorage.getItem("csharp-compiler-loaded-before"); } catch { return true; }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [outputLines, setOutputLines] = useState<{ text: string; type: "info" | "error" | "output" | "input" }[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("explorer");
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [settings, setSettings] = useState<EditorSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId?: string } | null>(null);
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [compilerStatus, setCompilerStatus] = useState<string>("Loading compiler...");
  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const renameInputRef = useRef<HTMLInputElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false);
  const activeFileIdRef = useRef(activeFileId);
  const [outputHeight, setOutputHeight] = useState(250);
  const outputHeightRef = useRef(250);
  const isDraggingRef = useRef(false);
  const compilerInitRef = useRef(false);
  const [compilationMode, setCompilationMode] = useState<"wasm" | "api">("api");
  const [runtimeInfo, setRuntimeInfo] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { resolvedTheme } = useNextTheme();
  const theme = resolvedTheme || "dark";
  const colors = THEMES[mounted && theme === "light" ? "light" : "dark"];

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
      try { localStorage.setItem("csharp-compiler-loaded-before", "true"); } catch { /* ignore */ }
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading]);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => { activeFileIdRef.current = activeFileId; }, [activeFileId]);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(FILES_KEY, JSON.stringify(files));
    } catch { /* ignore */ }
  }, [files]);

  useEffect(() => {
    if (contextMenu) {
      const handler = () => setContextMenu(null);
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, [contextMenu]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputLines]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const container = document.getElementById("csharp-main-body");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const fromBottom = rect.bottom - e.clientY;
      const h = Math.max(150, Math.min(fromBottom, rect.height * 0.6));
      outputHeightRef.current = h;
      setOutputHeight(h);
    };
    const handleMouseUp = () => { isDraggingRef.current = false; };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const addOutput = useCallback((text: string, type: "info" | "error" | "output" | "input") => {
    setOutputLines(prev => [...prev, { text, type }]);
  }, []);

  const loadCompiler = useCallback(() => {
    if (compilerInitRef.current) return;
    compilerInitRef.current = true;

    if (typeof window === "undefined") return;

    // Check if WASM bridge is already loaded and ready
    const bridge = getBridge();
    if (bridge?.isReady()) {
      setIsCompilerReady(true);
      setIsCompilerLoading(false);
      setCompilationMode("wasm");
      setCompilerStatus("Ready (Blazor WASM)");
      return;
    }

    setIsCompilerLoading(true);
    setCompilerStatus("Loading Blazor WASM...");

    // Try WASM first — Blazor cold start takes 10–60s (downloads ~8MB dotnet WASM)
    const WASM_TIMEOUT_MS = 60000;

    const checkReady = setInterval(() => {
      const b = getBridge();
      if (b?.isReady()) {
        clearInterval(checkReady);
        clearTimeout(wasmTimeout);
        setCompilationMode("wasm");
        setIsCompilerReady(true);
        setIsCompilerLoading(false);
        setCompilerStatus("Ready (Blazor WASM)");
      }
    }, 500);

    const wasmTimeout = setTimeout(() => {
      clearInterval(checkReady);
      // WASM timeout — fall back to API mode
      setCompilationMode("api");
      setIsCompilerReady(true);
      setIsCompilerLoading(false);
      setCompilerStatus("Ready");
    }, WASM_TIMEOUT_MS);

    // Load the worker script which creates a hidden iframe with csharp-compiler-runner.html
    const script = document.createElement("script");
    script.src = "/csharp-worker.js?v=3";
    script.onload = () => {
      const b = getBridge();
      if (b) {
        b.init();
        b.onError((msg: string) => {
          clearInterval(checkReady);
          clearTimeout(wasmTimeout);
          // WASM init failed — fall back to API mode
          setIsCompilerLoading(false);
          setIsCompilerReady(true);
          setCompilationMode("api");
          setCompilerStatus("Ready");
          console.warn("WASM runtime error, using API mode:", msg);
        });
      }
    };
    script.onerror = () => {
      clearInterval(checkReady);
      clearTimeout(wasmTimeout);
      setIsCompilerLoading(false);
      setIsCompilerReady(true);
      setCompilationMode("api");
      setCompilerStatus("Ready");
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    loadCompiler();
  }, [loadCompiler]);

  const handleRun = useCallback(() => {
    if (!activeFile || isRunning) return;

    if (compilationMode === "wasm") {
      const bridge = getBridge();
      if (!bridge?.isReady()) return;
    }

    setIsRunning(true);
    isRunningRef.current = true;
    setShowOutput(true);
    setOutputLines([]);
    setRuntimeInfo("");
    setCompilerStatus("Compiling...");
    addOutput("=== Running " + activeFile.name + " ===", "info");
    setIsAwaitingInput(false);

    if (compilationMode === "wasm") {
      const bridge = getBridge()!;
      bridge.compile(activeFile.content).then((result: string) => {
        setIsRunning(false);
        isRunningRef.current = false;
        setIsAwaitingInput(false);

        // Bridge unavailable — auto-switch to API mode and re-run
        if (result === "WASM_BRIDGE_UNAVAILABLE") {
          setCompilationMode("api");
          setCompilerStatus("Server compiler");
          addOutput("WASM bridge unavailable — switched to server API mode. Click Run again.", "info");
          return;
        }

        if (result.startsWith("COMPILATION_ERRORS")) {
          const err = result.substring("COMPILATION_ERRORS".length + 1);
          err.split("\n").filter((l: string) => l.trim()).forEach((l: string) => addOutput(l, "error"));
          addOutput("Compilation failed with errors", "error");
          setCompilerStatus("Compilation Error");
        } else if (result.startsWith("RUNTIME_ERROR")) {
          const errMsg = result.substring("RUNTIME_ERROR".length + 1);
          errMsg.split("\n").filter((l: string) => l.trim()).forEach((l: string) => {
            if (l.trim()) addOutput(l, "error");
          });
          addOutput("Runtime error", "error");
          setCompilerStatus("Runtime Error");
        } else if (result.startsWith("SUCCESS")) {
          const output = result.substring("SUCCESS".length + 1);
          if (output.length > 0) {
            output.split("\n").forEach((l: string) => addOutput(l || " ", "output"));
          }
          addOutput("Execution completed successfully", "info");
          setCompilerStatus("Finished");
        } else {
          addOutput(result, "output");
          addOutput("Execution completed", "info");
          setCompilerStatus("Finished");
        }
      });
    } else {
      fetch("/api/csharp/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: activeFile.content, timeout: 30000 }),
      })
        .then(async (res) => {
          const data = await res.json();
          setIsRunning(false);
          isRunningRef.current = false;

          if (data.success) {
            if (data.output) {
              const lines = data.output.split("\n");
              // Trim trailing empty lines
              while (lines.length > 0 && !lines[lines.length - 1].trim()) lines.pop();
              lines.forEach((l: string) => addOutput(l || " ", "output"));
            }
            const rt = data.runtime ? ` (${data.runtime})` : "";
            addOutput(`Execution completed successfully${rt}`, "info");
            if (data.runtime) setRuntimeInfo(data.runtime);
            setCompilerStatus("Finished");
          } else if (data.recoverable) {
            // Config-level issue (e.g., .NET SDK not installed) — show as info
            const msg = data.error || "Server compiler unavailable";
            msg.split("\n").filter((l: string) => l.trim()).forEach((l: string) => addOutput(l, "info"));
            addOutput("To run C# server-side, install .NET 8 SDK on this machine.", "info");
            setCompilerStatus("SDK Not Found");
          } else {
            if (data.errors) {
              data.errors.split("\n").filter((l: string) => l.trim()).forEach((l: string) => addOutput(l, "error"));
              addOutput("Compilation failed with errors", "error");
              setCompilerStatus("Compilation Error");
            } else if (data.runtimeError) {
              data.runtimeError.split("\n").filter((l: string) => l.trim()).forEach((l: string) => addOutput("  " + l, "error"));
              addOutput("Runtime error", "error");
              setCompilerStatus("Runtime Error");
            } else {
              addOutput("Error: " + (data.error || "Unknown error"), "error");
              setCompilerStatus("Error");
            }
          }
        })
        .catch((err) => {
          setIsRunning(false);
          isRunningRef.current = false;
          addOutput("Failed to contact compiler server: " + err.message, "error");
          setCompilerStatus("Connection Error");
        });
    }
  }, [compilationMode, activeFile, isRunning, addOutput]);

  const handleSendInput = useCallback(() => {
    setInputValue("");
    setIsAwaitingInput(false);
  }, []);

  const handleStop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      isRunningRef.current = false;
      setCompilerStatus("Stopped");
      addOutput("=== Stopped ===", "info");
    }
  }, [isRunning, addOutput]);

  const handleClear = useCallback(() => {
    setOutputLines([]);
  }, []);

  const handleReset = useCallback(() => {
    const defaults = makeDefaultFiles();
    setFiles(defaults);
    setActiveFileId("Program.cs");
    setOpenFileIds(["Program.cs"]);
    setShowNewFile(false);
    setNewFileName("");
    setOutputLines([]);
  }, []);

  const handleDownload = useCallback(() => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeFile]);

  const handleEditorMount = useCallback((editor: any) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e: { position: { lineNumber: number; column: number } }) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
  }, []);

  const switchFile = useCallback((id: string) => {
    setActiveFileId(id);
    setOpenFileIds(prev => prev.includes(id) ? prev : [...prev, id]);
    setShowNewFile(false);
    setContextMenu(null);
  }, []);

  const closeFileTab = useCallback((id: string) => {
    setOpenFileIds(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(fid => fid !== id);
      if (activeFileIdRef.current === id) {
        const idx = prev.indexOf(id);
        const target = next[Math.min(idx, next.length - 1)] || next[0];
        setActiveFileId(target);
      }
      return next;
    });
  }, []);

  const createFile = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (files.some(f => f.name === trimmed)) return;
    const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newFile: FileData = {
      id,
      name: trimmed,
      content: trimmed.endsWith(".cs")
        ? `using System;\n\nclass ${trimmed.replace(/\.cs$/i, "")}\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello from ${trimmed.replace(/\.cs$/i, "")}!");\n    }\n}\n`
        : "",
      language: detectLanguage(trimmed),
    };
    setFiles(prev => [...prev, newFile]);
    switchFile(id);
    setShowNewFile(false);
    setNewFileName("");
  }, [files, switchFile]);

  const deleteFileById = useCallback((id: string) => {
    if (files.length <= 1) return;
    setFiles(prev => prev.filter(f => f.id !== id));
    setOpenFileIds(prev => prev.filter(fid => fid !== id));
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
    setOpenFileIds(prev => prev.map(fid => fid === id ? newId : fid));
    if (activeFileId === id) setActiveFileId(newId);
    setRenamingFileId(null);
    setRenameValue("");
    setContextMenu(null);
  }, [files, activeFileId]);

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

  const handleContextMenu = useCallback((e: React.MouseEvent, fileId?: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
  }, []);

  const toggleSidebar = useCallback((tab: SidebarTab) => {
    setShowSidebar((prev) => (prev && sidebarTab === tab ? false : true));
    setSidebarTab(tab);
  }, [sidebarTab]);

  const activityItems = [
    { tab: "explorer" as SidebarTab, icon: File, label: "Explorer" },
    { tab: "settings" as SidebarTab, icon: Settings, label: "Settings" },
  ];

  if (loading) {
    return <CompilerLoading />;
  }

  return (
    <div className="csharp-compiler h-screen flex flex-col bg-[var(--bg)] overflow-hidden">
      <style>{`
        .csharp-compiler {
          ${Object.entries(colors).map(([key, val]) => `${key}: ${val};`).join("\n")}
        }
        .c-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .c-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .c-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .c-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        .c-input-area textarea { resize: none; }
      `}</style>

      <div className="flex items-center justify-between px-4 h-9 bg-[var(--bg-title)] border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Back</span>
          </Link>
          <span className="w-px h-4 bg-[var(--border)]" />
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">C# Compiler</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button onClick={handleDownload} disabled={!activeFile} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-30">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      <div id="csharp-main-body" className="flex-1 flex min-h-0">
        <div className="w-12 flex flex-col items-center py-2 gap-2 bg-[var(--bg-activity)] border-r border-[var(--border)] shrink-0">
          {activityItems.map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => toggleSidebar(tab)}
              title={label}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-md transition-colors",
                showSidebar && sidebarTab === tab
                  ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="flex-1" />
          {isRunning ? (
            <button onClick={handleStop} title="Stop" className="w-9 h-9 flex items-center justify-center rounded-md text-red-500 hover:bg-red-500/10 transition-colors">
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleRun}
              disabled={!isCompilerReady || isCompilerLoading}
              title={isCompilerReady ? "Run" : "Loading..."}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-md transition-colors",
                isCompilerReady ? "text-purple-500 hover:bg-purple-500/10" : "text-[var(--text-tertiary)] cursor-not-allowed"
              )}
            >
              {isCompilerLoading ? (
                <span className="w-4 h-4 border-2 border-[var(--text-tertiary)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {showSidebar && sidebarTab === "explorer" && (
          <div className="w-56 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)] shrink-0">
            <div className="flex items-center justify-between px-3 h-9 border-b border-[var(--border)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Files</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => { setNewFileName(""); setShowNewFile(true); setTimeout(() => newFileInputRef.current?.focus(), 50); }}
                  className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                  title="New File"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setShowSidebar(false)} className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
                  <PanelRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-1 c-scrollbar">
              {showNewFile && (
                <div className="flex items-center gap-1 px-3 py-0.5">
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
                    placeholder="filename.cs"
                    className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] text-xs px-1.5 py-0.5 rounded border border-[var(--border)] outline-none placeholder:text-[var(--input-placeholder)]"
                    autoFocus
                  />
                  <button onClick={() => { setShowNewFile(false); setNewFileName(""); }} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)]">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {files.map((file) => (
                <div key={file.id}>
                  {renamingFileId === file.id ? (
                    <div className="flex items-center gap-1 px-3 py-0.5">
                      {getFileIcon(file.name, "w-4 h-4 shrink-0")}
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") { setRenamingFileId(null); setContextMenu(null); }
                        }}
                        className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] text-xs px-1.5 py-0.5 rounded border border-[var(--border)] outline-none"
                        autoFocus
                      />
                      <button onClick={commitRename} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)]">
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => switchFile(file.id)}
                      onContextMenu={(e) => handleContextMenu(e, file.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-1 text-xs transition-colors group",
                        activeFileId === file.id
                          ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                      )}
                    >
                      {getFileIcon(file.name, "w-4 h-4 shrink-0")}
                      <span className="truncate flex-1 text-left">{file.name}</span>
                      {isRunning && activeFileId === file.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shrink-0 ml-1.5" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showSidebar && sidebarTab === "settings" && (
          <div className="w-56 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)] shrink-0">
            <div className="flex items-center justify-between px-3 h-9 border-b border-[var(--border)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Settings</span>
              <button onClick={() => setShowSidebar(false)} className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
                <PanelRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4 c-scrollbar">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Font Size</label>
                <input type="range" min="10" max="24" value={settings.fontSize} onChange={(e) => setSettings((s) => ({ ...s, fontSize: Number(e.target.value) }))} className="w-full accent-purple-500" />
                <span className="text-[11px] text-[var(--text-tertiary)]">{settings.fontSize}px</span>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Tab Size</label>
                <select value={settings.tabSize} onChange={(e) => setSettings((s) => ({ ...s, tabSize: Number(e.target.value) }))} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text-primary)] outline-none">
                  {[2, 4, 8].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Word Wrap</label>
                <button onClick={() => setSettings((s) => ({ ...s, wordWrap: s.wordWrap === "on" ? "off" : "on" }))} className={cn("px-2 py-0.5 rounded text-[10px] font-semibold transition-colors", settings.wordWrap === "on" ? "bg-purple-500/10 text-purple-500" : "bg-[var(--bg-hover)] text-[var(--text-tertiary)]")}>{settings.wordWrap === "on" ? "On" : "Off"}</button>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Minimap</label>
                <button onClick={() => setSettings((s) => ({ ...s, minimap: !s.minimap }))} className={cn("px-2 py-0.5 rounded text-[10px] font-semibold transition-colors", settings.minimap ? "bg-purple-500/10 text-purple-500" : "bg-[var(--bg-hover)] text-[var(--text-tertiary)]")}>{settings.minimap ? "On" : "Off"}</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col min-h-0 flex-1">
            <div className="flex items-center bg-[var(--bg-secondary)] border-b border-[var(--border)] shrink-0 overflow-x-auto">
              {openFileIds.map((fid) => {
                const file = files.find(f => f.id === fid);
                if (!file) return null;
                return (
                  <div
                    key={file.id}
                    className={cn(
                      "flex items-center gap-1.5 px-3 h-9 text-xs border-r border-[var(--border)] transition-colors cursor-pointer shrink-0 group",
                      activeFileId === file.id
                        ? "bg-[var(--bg)] text-[var(--text-primary)] border-b-2 border-purple-500"
                        : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                    )}
                    onClick={() => switchFile(file.id)}
                    onContextMenu={e => handleContextMenu(e, file.id)}
                  >
                    {getFileIcon(file.name, "w-3.5 h-3.5")}
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    {openFileIds.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); closeFileTab(file.id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-tertiary)] hover:text-[var(--text-primary)] ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
              <div className="flex-1 min-w-0" />
              <button
                onClick={() => setCompilationMode(m => m === "wasm" ? "api" : "wasm")}
                className={cn(
                  "px-2 h-full flex items-center gap-1 text-[10px] font-mono font-semibold transition-colors shrink-0 border-r border-[var(--border)]",
                  compilationMode === "wasm"
                    ? "text-purple-500 hover:text-purple-400"
                    : "text-green-500 hover:text-green-400"
                )}
                title={compilationMode === "wasm" ? "Click to switch to Piston API mode" : "Click to switch to WASM mode"}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", compilationMode === "wasm" ? "bg-purple-500" : "bg-green-500")} />
                {compilationMode === "wasm" ? "WASM" : "Piston"}
              </button>
              {isRunning ? (
                <button
                  onClick={handleStop}
                  className="px-3 h-full flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-[var(--bg-hover)] transition-colors shrink-0 border-l border-r border-[var(--border)]"
                  title="Stop execution"
                >
                  <Square className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={handleRun}
                  disabled={!isCompilerReady || isCompilerLoading}
                  className={cn(
                    "px-3 h-full flex items-center gap-1.5 text-xs font-semibold transition-colors shrink-0 border-l border-r border-[var(--border)]",
                    isCompilerReady
                      ? "text-purple-500 hover:bg-[var(--bg-hover)] cursor-pointer"
                      : "text-[var(--text-tertiary)] cursor-not-allowed"
                  )}
                  title={isCompilerReady ? `Run code (${compilationMode === "wasm" ? "WASM" : "API"} mode)` : "Loading compiler..."}
                >
                  {isCompilerLoading ? (
                    <span className="w-3 h-3 border-2 border-[var(--text-tertiary)] border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-purple-500 text-purple-500" />
                  )}
                  <span>{isCompilerLoading ? "Loading..." : isRunning ? "Running..." : "Run"}</span>
                </button>
              )}
              <button onClick={() => setShowOutput(!showOutput)} className="px-2 h-full flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors shrink-0" title={showOutput ? "Hide output" : "Show output"}>
                <Terminal className="w-3 h-3" />
                {showOutput ? <ChevronDown className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 -rotate-90" />}
              </button>
            </div>
            <div className="flex-1 min-h-0">
              {activeFile ? (
                <MonacoEditor
                  key={`${activeFile.id}-${theme}`}
                  value={activeFile.content}
                  onChange={(val) => {
                    if (val !== undefined) updateFileContent(activeFile.id, val);
                  }}
                  language={activeFile.language}
                  theme={theme === "dark" ? "vs-dark" : "vs"}
                  onMount={handleEditorMount}
                  options={{
                    fontSize: settings.fontSize,
                    lineNumbers: "on",
                    minimap: { enabled: settings.minimap },
                    scrollBeyondLastLine: false,
                    wordWrap: settings.wordWrap,
                    tabSize: settings.tabSize,
                    automaticLayout: true,
                    padding: { top: 8 },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-[var(--text-tertiary)]">
                  No file selected
                </div>
              )}
            </div>
          </div>

          {showOutput && (
            <div className="flex flex-col border-t border-[var(--border)] shrink-0" style={{ height: `${outputHeight}px` }}>
              <div
                className="h-1.5 cursor-ns-resize hover:bg-purple-500/30 transition-colors shrink-0 relative"
                onMouseDown={() => { isDraggingRef.current = true; }}
              >
                <div className="absolute inset-x-4 top-0.5 h-px bg-[var(--border)]" />
              </div>

              <div className="flex items-center justify-between px-3 h-8 bg-[var(--bg-secondary)] border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span className="text-xs font-medium text-[var(--text-secondary)] truncate">Output{activeFile ? `: ${activeFile.name}` : ""}</span>
                  {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shrink-0" />}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {outputLines.length > 0 && (
                    <button onClick={handleClear} className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors" title="Clear output">
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={() => setShowOutput(false)} className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors" title="Close output">
                    <PanelLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div
                  ref={outputRef}
                  className="flex-1 overflow-y-auto p-3 font-mono text-sm leading-relaxed bg-[var(--bg)] c-scrollbar space-y-0.5"
                >
                  {outputLines.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-[var(--text-tertiary)]">
                        {isCompilerLoading
                          ? "Loading .NET WebAssembly runtime..."
                          : activeFile
                          ? `Run "${activeFile.name}" to execute`
                          : "No file selected"}
                      </p>
                    </div>
                  ) : (
                    outputLines.map((line, i) => (
                      <div
                        key={i}
                        className={cn(
                          "whitespace-pre-wrap break-all py-0.5",
                          line.type === "error" && "text-red-400",
                          line.type === "info" && "text-[var(--text-tertiary)]",
                          line.type === "output" && "text-[var(--text-primary)]",
                          line.type === "input" && "text-purple-400",
                        )}
                      >
                        {line.type === "error" && <AlertCircle className="w-3 h-3 inline mr-1 -mt-0.5 shrink-0" />}
                        {line.text}
                      </div>
                    ))
                  )}
                  {isRunning && outputLines.length <= 1 && (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xs text-purple-500/80">Running...</span>
                    </div>
                  )}
                </div>

                {isRunning && isAwaitingInput && (
                  <div className="c-input-area border-t border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-tertiary)] text-xs font-mono shrink-0">&gt;</span>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && inputValue.trim() !== "") {
                            e.preventDefault();
                            handleSendInput();
                          }
                        }}
                        placeholder="Enter input value..."
                        className="flex-1 bg-transparent text-[var(--input-text)] text-xs outline-none border-none placeholder:text-[var(--input-placeholder)] font-mono"
                        autoComplete="off"
                        spellCheck={false}
                        autoFocus
                      />
                      <button
                        onClick={handleSendInput}
                        disabled={!inputValue.trim()}
                        className={cn(
                          "px-3 py-1 rounded text-[10px] font-semibold transition-colors shrink-0",
                          inputValue.trim()
                            ? "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
                            : "bg-[var(--bg-hover)] text-[var(--text-tertiary)] cursor-not-allowed"
                        )}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 w-44 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-xl text-xs"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.fileId && (
            <>
              <button
                onClick={() => startRename(contextMenu.fileId!)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Rename
              </button>
              <button
                onClick={() => deleteFileById(contextMenu.fileId!)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-red-400 hover:bg-[var(--bg-hover)] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-between px-3 h-5 bg-[var(--status-bar)] border-t border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="w-px h-2.5 bg-[var(--border)]" />
          <span className="text-purple-500 font-semibold">C#</span>
          <span className="w-px h-2.5 bg-[var(--border)]" />
          <span className={cn("font-mono text-[10px]", compilationMode === "wasm" ? "text-purple-500" : "text-green-500")}>
            [{compilationMode === "wasm" ? "WASM" : "Piston"}]
          </span>
          <span className="w-px h-2.5 bg-[var(--border)]" />
          <span>
            {isRunning
              ? "Running..."
              : isCompilerLoading
              ? "Loading..."
              : runtimeInfo
              ? runtimeInfo
              : compilerStatus || "Ready"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors",
              showOutput ? "text-[var(--text-primary)]" : "hover:text-[var(--text-primary)]"
            )}
          >
            <Terminal className="w-3 h-3" />
            <span>Output</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function CSharpCompilerGenerator() {
  return <CSharpEditor />;
}
