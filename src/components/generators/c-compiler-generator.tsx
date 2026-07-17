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

const DEFAULT_CODE = `#include <stdio.h>

int main() {
    int a, b, sum;

    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);
    sum = a + b;

    printf("%d + %d = %d\\n", a, b, sum);
    return 0;
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

const SETTINGS_KEY = "c-compiler-settings";
const FILES_KEY = "c-compiler-files";

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

function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "c": return "c";
    case "h": return "c";
    case "txt": return "plaintext";
    case "json": return "json";
    case "md": return "markdown";
    default: return "plaintext";
  }
}

function getFileIcon(name: string, className?: string): React.ReactNode {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const cls = className || "w-4 h-4";
  if (ext === "c" || ext === "h") return <FileCode className={`${cls} text-blue-500`} />;
  if (ext === "json") return <FileJson className={`${cls} text-yellow-500`} />;
  return <File className={`${cls} text-[var(--text-secondary)]`} />;
}

function makeDefaultFiles(): FileData[] {
  return [
    { id: "main.c", name: "main.c", content: DEFAULT_CODE, language: "c" },
  ];
}

function getStoredFiles(): FileData[] | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(FILES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

let msgIdCounter = 0;

function CEditor() {
  const storedFiles = getStoredFiles();
  const initialFiles = storedFiles?.length ? storedFiles : makeDefaultFiles();
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [activeFileId, setActiveFileId] = useState(initialFiles[0]?.id || "main.c");
  const [openFileIds, setOpenFileIds] = useState<string[]>([initialFiles[0]?.id || "main.c"]);
  const [isCompilerReady, setIsCompilerReady] = useState(false);
  const [isCompilerLoading, setIsCompilerLoading] = useState(true);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    try { return !localStorage.getItem("compiler-loaded-before"); } catch { return true; }
  });

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
      try { localStorage.setItem("compiler-loaded-before", "true"); } catch {}
    }, 10000);
    return () => clearTimeout(timer);
  }, [loading]);
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
  // Interactive stdin state
  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
  const [inputId, setInputId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [promptStr, setPromptStr] = useState("");
  const swRegRef = useRef<ServiceWorkerRegistration | null>(null);

  const renameInputRef = useRef<HTMLInputElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false);
  const activeFileIdRef = useRef(activeFileId);
  const workerRef = useRef<Worker | null>(null);
  const [outputHeight, setOutputHeight] = useState(250);
  const outputHeightRef = useRef(250);
  const isDraggingRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const pendingRequests = useRef<Map<number, string>>(new Map());
  useEffect(() => {
    setMounted(true);
  }, []);

  const { resolvedTheme } = useNextTheme();
  const theme = resolvedTheme || "dark";
  const colors = THEMES[mounted && theme === "light" ? "light" : "dark"];

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => { activeFileIdRef.current = activeFileId; }, [activeFileId]);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(FILES_KEY, JSON.stringify(files));
    } catch {}
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
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/react-py-sw.js", { scope: "/" }).then(
        (reg) => { swRegRef.current = reg; },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const container = document.getElementById("c-main-body");
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

  const appendStreamingOutput = useCallback((text: string, type: "info" | "error" | "output" | "input") => {
    setOutputLines(prev => {
      if (prev.length === 0) {
        return [{ text, type }];
      }
      const last = prev[prev.length - 1];
      if (last.type === type && !last.text.endsWith("\n")) {
        return [...prev.slice(0, -1), { ...last, text: last.text + text }];
      } else {
        return [...prev, { text, type }];
      }
    });
  }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    const worker = new Worker("/c-worker.js?v=" + Date.now());
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const msg = event.data;

      switch (msg.type) {
        case "ready":
          setIsCompilerReady(true);
          setIsCompilerLoading(false);
          setCompilerStatus("Ready");
          break;
        case "error":
          setIsCompilerLoading(false);
          setCompilerStatus("Error: " + msg.message);
          addOutput("Failed to load compiler: " + msg.message, "error");
          break;
        case "check-result":
          if (msg.exitCode !== 0) {
            addOutput("Syntax check failed:", "error");
            msg.stderr.split("\n").filter((l: string) => l.trim()).forEach((l: string) => addOutput(l, "error"));
          }
          break;
        case "run-result":
          setIsRunning(false);
          isRunningRef.current = false;
          setIsAwaitingInput(false);
          setPromptStr("");
          if (msg.stderr) {
            msg.stderr.split("\n").filter((l: string) => l.trim()).forEach((l: string) => addOutput(l, "error"));
          }
          addOutput("Process exited with code " + msg.exitCode, msg.exitCode === 0 ? "info" : "error");
          setCompilerStatus(msg.exitCode === 0 ? "Finished" : "Error");
          break;
        case "stdout":
          appendStreamingOutput(msg.text, "output");
          break;
        case "stderr":
          appendStreamingOutput(msg.text, "error");
          break;
        case "awaiting-input":
          setIsAwaitingInput(true);
          setInputId(msg.id);
          // Extract the last output line as a prompt suggestion
          setOutputLines((prev) => {
            const lastOutput = [...prev].reverse().find((l) => l.type === "output");
            if (lastOutput) {
              setPromptStr(lastOutput.text.trim());
            } else {
              setPromptStr("");
            }
            return prev;
          });
          break;
        case "stdout-echo":
          appendStreamingOutput(msg.text, "input");
          break;
      }
    };

    worker.postMessage({ type: "init" });
  }, [addOutput, appendStreamingOutput]);

  useEffect(() => {
    initWorker();
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [initWorker]);

  const handleRun = useCallback(() => {
    if (!isCompilerReady || !activeFile || isRunning) return;

    const runId = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2) + Date.now();

    setIsRunning(true);
    isRunningRef.current = true;
    setShowOutput(true);
    setOutputLines([]);
    setCompilerStatus("Compiling...");
    addOutput("=== Compiling " + activeFile.name + " ===", "info");

    setInputId(runId);
    setIsAwaitingInput(false);
    setPromptStr("");

    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "run",
        code: activeFile.content,
        inputId: runId,
        input: "",
      });
    }
  }, [isCompilerReady, activeFile, isRunning, addOutput]);

  const handleSendInput = useCallback(() => {
    const sw = swRegRef.current?.active || navigator.serviceWorker.controller;
    if (!inputId || !sw) return;
    sw.postMessage({
      type: "REACT_PY_INPUT",
      id: inputId,
      value: inputValue,
    });
    setInputValue("");
    setIsAwaitingInput(false);
  }, [inputId, inputValue]);



  const handleStop = useCallback(() => {
    if (isRunning) {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      setIsRunning(false);
      isRunningRef.current = false;
      setCompilerStatus("Stopped");
      addOutput("=== Stopped ===", "info");
      setPromptStr("");
      initWorker();
    }
  }, [isRunning, initWorker, addOutput]);

  const handleClear = useCallback(() => {
    setOutputLines([]);
    setPromptStr("");
  }, []);

  const handleReset = useCallback(() => {
    const defaults = makeDefaultFiles();
    setFiles(defaults);
    setActiveFileId("main.c");
    setOpenFileIds(["main.c"]);
    setShowNewFile(false);
    setNewFileName("");
    setOutputLines([]);
    setPromptStr("");
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
    editor.onDidChangeCursorPosition((e: any) => {
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
    const base = trimmed.replace(/\.c$/i, "");
    const newFile: FileData = {
      id,
      name: trimmed,
      content: trimmed.endsWith(".c")
        ? `#include <stdio.h>\n\nint main() {\n    printf("Hello from ${base}!\\n");\n    return 0;\n}\n`
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
    <div className="c-compiler h-screen flex flex-col bg-[var(--bg)] overflow-hidden">
      <style>{`
        .c-compiler {
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
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">C Compiler</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      <div id="c-main-body" className="flex-1 flex min-h-0">

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
                isCompilerReady ? "text-emerald-500 hover:bg-emerald-500/10" : "text-[var(--text-tertiary)] cursor-not-allowed"
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
                    placeholder="filename.c"
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
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1.5" />
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
                <input type="range" min="10" max="24" value={settings.fontSize} onChange={(e) => setSettings((s) => ({ ...s, fontSize: Number(e.target.value) }))} className="w-full accent-emerald-500" />
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
                <button onClick={() => setSettings((s) => ({ ...s, wordWrap: s.wordWrap === "on" ? "off" : "on" }))} className={cn("px-2 py-0.5 rounded text-[10px] font-semibold transition-colors", settings.wordWrap === "on" ? "bg-emerald-500/10 text-emerald-500" : "bg-[var(--bg-hover)] text-[var(--text-tertiary)]")}>{settings.wordWrap === "on" ? "On" : "Off"}</button>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Minimap</label>
                <button onClick={() => setSettings((s) => ({ ...s, minimap: !s.minimap }))} className={cn("px-2 py-0.5 rounded text-[10px] font-semibold transition-colors", settings.minimap ? "bg-emerald-500/10 text-emerald-500" : "bg-[var(--bg-hover)] text-[var(--text-tertiary)]")}>{settings.minimap ? "On" : "Off"}</button>
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
                        ? "bg-[var(--bg)] text-[var(--text-primary)] border-b-2 border-emerald-500"
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
                      ? "text-emerald-500 hover:bg-[var(--bg-hover)] cursor-pointer"
                      : "text-[var(--text-tertiary)] cursor-not-allowed"
                  )}
                  title={isCompilerReady ? "Run code" : "Loading compiler..."}
                >
                  {isCompilerLoading ? (
                    <span className="w-3 h-3 border-2 border-[var(--text-tertiary)] border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
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
                className="h-1.5 cursor-ns-resize hover:bg-emerald-500/30 transition-colors shrink-0 relative"
                onMouseDown={() => { isDraggingRef.current = true; }}
              >
                <div className="absolute inset-x-4 top-0.5 h-px bg-[var(--border)]" />
              </div>

              <div className="flex items-center justify-between px-3 h-8 bg-[var(--bg-secondary)] border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs font-medium text-[var(--text-secondary)] truncate">Output{activeFile ? `: ${activeFile.name}` : ""}</span>
                  {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
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
                          ? "Loading C compiler runtime..."
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
                          line.type === "input" && "text-emerald-400",
                        )}
                      >
                        {line.type === "error" && <AlertCircle className="w-3 h-3 inline mr-1 -mt-0.5 shrink-0" />}
                        {line.text}
                      </div>
                    ))
                  )}
                  {isRunning && outputLines.length <= 1 && (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xs text-emerald-500/80">Running...</span>
                    </div>
                  )}
                </div>

                {/* Simple Stdin Input Bar (Only visible when awaiting input) */}
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
                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
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
          <span>C</span>
          <span className="w-px h-2.5 bg-[var(--border)]" />
          <span>
            {isRunning
              ? "Running..."
              : isCompilerLoading
              ? "Loading Compiler..."
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

export function CCompilerGenerator() {
  return <CEditor />;
}
