"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play, Square, RotateCcw, Download, Terminal, File,
  Send, Settings, ArrowLeft, ChevronDown,
  PanelRight, PanelLeft, X, FilePlus, Trash2, Pencil, Check,
  BarChart2
} from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useTheme as useNextTheme } from "next-themes";
import Link from "next/link";
import { CompilerLoading } from "@/components/compiler-loading";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const DEFAULT_CODE = `# R Compiler - Write your R code here
print("Hello, World!")

# Interactive User Input (uses the input bar below)
cat("What is your name? ")
name <- readLines(con = stdin(), n = 1)
cat(paste("Nice to meet you,", name, "!\\n"))

# Matrix manipulation and statistics
cat("\\n=== Matrix Calculations ===\\n")
A <- matrix(1:9, nrow=3, ncol=3)
print(A)

cat("\\n=== Statistics ===\\n")
data <- c(12, 15, 18, 22, 19, 21, 25, 30, 28)
cat(paste("Mean:", mean(data), "\\n"))
cat(paste("Standard Deviation:", sd(data), "\\n"))
`;

type SidebarTab = "explorer" | "settings";

interface FileData {
  id: string;
  name: string;
  content: string;
  language: string;
  outputs?: { type: "stdout" | "stderr"; text: string }[];
}

interface MonacoCursorPositionEvent {
  position: {
    lineNumber: number;
    column: number;
  };
}

interface MonacoEditorInstance {
  onDidChangeCursorPosition: (cb: (e: MonacoCursorPositionEvent) => void) => void;
}

const EMPTY_ARRAY: { type: "stdout" | "stderr"; text: string }[] = [];

interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: "on" | "off";
  minimap: boolean;
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 13,
  tabSize: 2,
  wordWrap: "on",
  minimap: true,
};

const SETTINGS_KEY = "r-compiler-settings";
const FILES_KEY = "r-compiler-files";

const THEMES = {
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
    case "r": return "r";
    case "txt": return "plaintext";
    case "json": return "json";
    case "md": return "markdown";
    default: return "plaintext";
  }
}

function getFileIcon(name: string, className?: string): React.ReactNode {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const cls = className || "w-4 h-4";
  if (ext === "r") return <BarChart2 className={`${cls} text-purple-500`} />;
  return <File className={`${cls} text-[var(--text-secondary)]`} />;
}

function isProtectedFile(name: string): boolean {
  return false;
}

function makeDefaultFiles(): FileData[] {
  return [
    { id: "main.R", name: "main.R", content: DEFAULT_CODE, language: "r" },
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

function REditor() {
  const storedFiles = getStoredFiles();
  const initialFiles = storedFiles?.length ? storedFiles : makeDefaultFiles();
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [activeFileId, setActiveFileId] = useState(initialFiles[0]?.id || "main.R");
  const [openFileIds, setOpenFileIds] = useState<string[]>([initialFiles[0]?.id || "main.R"]);
  const [runningFileId, setRunningFileId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isReady, setIsReady] = useState(false);
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

  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
  const [promptStr, setPromptStr] = useState("");
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
  const renameInputRef = useRef<HTMLInputElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const { resolvedTheme } = useNextTheme();
  const theme = resolvedTheme || "dark";
  const colors = THEMES[theme === "dark" ? "dark" : "light"];
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const webRRef = useRef<any>(null);
  const rConsoleRef = useRef<any>(null);
  
  const activeFileIdRef = useRef(activeFileId);
  const runningFileIdRef = useRef<string | null>(null);
  const filesRef = useRef<FileData[]>(files);

  useEffect(() => {
    activeFileIdRef.current = activeFileId;
  }, [activeFileId]);

  useEffect(() => {
    runningFileIdRef.current = runningFileId;
  }, [runningFileId]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const [outputHeight, setOutputHeight] = useState(200);
  const isDraggingRef = useRef(false);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const activeOutputs = activeFile?.outputs || EMPTY_ARRAY;
  const isRunning = runningFileId !== null;

  // Save settings
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Save files
  useEffect(() => {
    try {
      localStorage.setItem(FILES_KEY, JSON.stringify(files));
    } catch {}
  }, [files]);

  // Close context menu on click outside
  useEffect(() => {
    if (contextMenu) {
      const handler = () => setContextMenu(null);
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, [contextMenu]);

  // Add output streamingly helper
  const addOutput = useCallback((text: string, type: "stdout" | "stderr") => {
    const runningId = runningFileIdRef.current || activeFileIdRef.current;
    if (runningId) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === runningId
            ? { ...f, outputs: [...(f.outputs || []), { type, text }] }
            : f
        )
      );
    }
  }, []);

  // Trigger single reload if cross-origin isolation is not present (to try to apply next.config.ts headers)
  useEffect(() => {
    if (typeof window !== "undefined" && !window.crossOriginIsolated) {
      const reloaded = sessionStorage.getItem("r-compiler-reloaded");
      if (!reloaded) {
        sessionStorage.setItem("r-compiler-reloaded", "true");
        window.location.reload();
      }
    } else if (typeof window !== "undefined") {
      sessionStorage.removeItem("r-compiler-reloaded");
    }
  }, []);

  // Initialize WebR on mount
  useEffect(() => {
    let active = true;
    
    const initWebR = async () => {
      try {
        const webrModule = (await import("webr")) as any;
        const WebRClass = webrModule.WebR;
        const ChannelType = webrModule.ChannelType;
        
        let channelType = undefined;
        if (typeof window !== "undefined" && !window.crossOriginIsolated) {
          channelType = ChannelType.PostMessage;
        }
        
        const webR = new WebRClass({ channelType });
        await webR.init();
        
        if (!active) return;
        webRRef.current = webR;
        
        const callbacks = {
          stdout: (line: string) => {
            addOutput(line + "\n", "stdout");
          },
          stderr: (line: string) => {
            addOutput(line + "\n", "stderr");
          },
          prompt: (promptText: string) => {
            const cleanPrompt = promptText.trim();
            // Default interactive prompt characters are ">" or "+"
            if (cleanPrompt === ">" || cleanPrompt === "+") {
              setRunningFileId(null);
              setIsAwaitingInput(false);
            } else {
              setPromptStr(promptText);
              setIsAwaitingInput(true);
            }
          }
        };

        const ConsoleClass = webrModule.Console;
        
        const rConsole = new ConsoleClass(callbacks);
        rConsoleRef.current = rConsole;
        rConsole.run();
        
        setIsReady(true);
        setLoading(false);
      } catch (err: any) {
        console.error("WebR Initialization Failed:", err);
        if (active) {
          addOutput("Failed to load R environment: " + err.message + "\n", "stderr");
          setLoading(false);
        }
      }
    };

    initWebR();

    return () => {
      active = false;
      // In WebR we don't necessarily have a simple shutdown method for Console, but it cleans up on page unload.
    };
  }, [addOutput]);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [activeOutputs]);

  // Focus input when awaiting
  useEffect(() => {
    if (isAwaitingInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAwaitingInput]);

  // Output resize handle
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const container = document.getElementById("r-main-body");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const fromBottom = rect.bottom - e.clientY;
      setOutputHeight(Math.max(100, Math.min(fromBottom, rect.height * 0.6)));
    };
    const handleMouseUp = () => { isDraggingRef.current = false; };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleRun = useCallback(async () => {
    if (!rConsoleRef.current || !activeFile) return;

    setRunningFileId(activeFile.id);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFile.id ? { ...f, outputs: [] } : f
      )
    );
    setIsAwaitingInput(false);
    setPromptStr("");
    setShowOutput(true);

    // Send code to R's stdin
    rConsoleRef.current.stdin(activeFile.content + "\n");
  }, [activeFile]);

  const handleSendInput = useCallback(() => {
    if (!rConsoleRef.current || !inputValue) return;
    
    // Echo input locally so user can see it in terminal history
    addOutput(inputValue + "\n", "stdout");

    rConsoleRef.current.stdin(inputValue + "\n");
    setInputValue("");
    setIsAwaitingInput(false);
    setPromptStr("");
  }, [inputValue, addOutput]);

  const handleStop = useCallback(async () => {
    if (webRRef.current) {
      await webRRef.current.interrupt();
    }
    setRunningFileId(null);
    setIsAwaitingInput(false);
  }, []);

  const handleClear = useCallback(() => {
    if (activeFileId) {
      setFiles((prev) =>
        prev.map((f) => (f.id === activeFileId ? { ...f, outputs: [] } : f))
      );
    }
  }, [activeFileId]);

  const handleReset = useCallback(() => {
    const defaults = makeDefaultFiles();
    setFiles(defaults);
    setActiveFileId("main.R");
    setOpenFileIds(["main.R"]);
    setShowNewFile(false);
    setNewFileName("");
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

  const handleEditorMount = useCallback((editor: MonacoEditorInstance) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e: MonacoCursorPositionEvent) => {
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
      content: "",
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
    <div className="r-compiler h-screen flex flex-col bg-[var(--bg)] overflow-hidden">
      <style>{`
        .r-compiler {
          ${Object.entries(colors).map(([key, val]) => `${key}: ${val};`).join("\n")}
        }
        .rc-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .rc-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .rc-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .rc-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--border-hover); }
      `}</style>

      {/* ─── Title Bar ─── */}
      <div className="flex items-center justify-between px-4 h-9 bg-[var(--bg-title)] border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Back</span>
          </Link>
          <span className="w-px h-4 bg-[var(--border)]" />
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">R Compiler</span>
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

      {/* ─── Main Body ─── */}
      <div id="r-main-body" className="flex-1 flex min-h-0">

        {/* ─── Activity Bar ─── */}
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
          {runningFileId === activeFileId ? (
            <button onClick={handleStop} title="Stop" className="w-9 h-9 flex items-center justify-center rounded-md text-red-500 hover:bg-red-500/10 transition-colors">
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleRun}
              disabled={!isReady && runningFileId === null}
              title={isReady || runningFileId !== null ? "Run" : "Loading..."}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-md transition-colors",
                isReady || runningFileId !== null ? "text-emerald-500 hover:bg-emerald-500/10" : "text-[var(--text-tertiary)] cursor-not-allowed"
              )}
            >
              {!isReady && runningFileId === null ? (
                <span className="w-4 h-4 border-2 border-[var(--text-tertiary)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* ─── Sidebar ─── */}
        {showSidebar && sidebarTab === "explorer" && (
          <div className="w-56 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)] shrink-0">
            <div className="flex items-center justify-between px-3 h-9 border-b border-[var(--border)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Explorer</span>
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
            <div className="flex-1 overflow-y-auto py-1 rc-scrollbar">
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
                    placeholder="filename.R"
                    className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] text-xs px-1.5 py-0.5 rounded border border-[var(--border)] outline-none placeholder:text-[var(--input-placeholder)]"
                    style={{ background: "var(--input-bg)", color: "var(--input-text)" }}
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
                      {runningFileId === file.id && (
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
            <div className="flex-1 overflow-y-auto p-3 space-y-4 rc-scrollbar">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Font Size</label>
                <input type="range" min="10" max="24" value={settings.fontSize} onChange={(e) => setSettings((s) => ({ ...s, fontSize: Number(e.target.value) }))} className="w-full accent-blue-500" />
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
                <button onClick={() => setSettings((s) => ({ ...s, wordWrap: s.wordWrap === "on" ? "off" : "on" }))} className={cn("px-2 py-0.5 rounded text-[10px] font-semibold transition-colors", settings.wordWrap === "on" ? "bg-blue-500/10 text-blue-500" : "bg-[var(--bg-hover)] text-[var(--text-tertiary)]")}>{settings.wordWrap === "on" ? "On" : "Off"}</button>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Minimap</label>
                <button onClick={() => setSettings((s) => ({ ...s, minimap: !s.minimap }))} className={cn("px-2 py-0.5 rounded text-[10px] font-semibold transition-colors", settings.minimap ? "bg-blue-500/10 text-blue-500" : "bg-[var(--bg-hover)] text-[var(--text-tertiary)]")}>{settings.minimap ? "On" : "Off"}</button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Center Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor */}
          <div className="flex flex-col min-h-0 flex-1">
            {/* Editor tab bar */}
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
                    {runningFileId === file.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1" />
                    )}
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
              {runningFileId === activeFileId ? (
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
                  disabled={!isReady && runningFileId === null}
                  className={cn(
                    "px-3 h-full flex items-center gap-1.5 text-xs font-semibold transition-colors shrink-0 border-l border-r border-[var(--border)]",
                    isReady || runningFileId !== null
                      ? "text-emerald-500 hover:bg-[var(--bg-hover)] cursor-pointer"
                      : "text-[var(--text-tertiary)] cursor-not-allowed"
                  )}
                  title={isReady || runningFileId !== null ? "Run code" : "Loading R environment..."}
                >
                  {!isReady && runningFileId === null ? (
                    <span className="w-3 h-3 border-2 border-[var(--text-tertiary)] border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                  )}
                  <span>{!isReady && runningFileId === null ? "Loading..." : "Run"}</span>
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

          {/* ─── Output Panel ─── */}
          {showOutput && (
            <div className="flex flex-col border-t border-[var(--border)] shrink-0" style={{ height: `${outputHeight}px` }}>
              {/* Resize handle */}
              <div
                className="h-1.5 cursor-ns-resize hover:bg-blue-500/30 transition-colors shrink-0 relative"
                onMouseDown={() => { isDraggingRef.current = true; }}
              >
                <div className="absolute inset-x-4 top-0.5 h-px bg-[var(--border)]" />
              </div>

              {/* Output header */}
              <div className="flex items-center justify-between px-3 h-8 bg-[var(--bg-secondary)] border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs font-medium text-[var(--text-secondary)] truncate">Output{activeFile ? `: ${activeFile.name}` : ""}</span>
                  {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isAwaitingInput && runningFileId === activeFileId && (
                    <span className="text-[10px] text-amber-500 font-medium animate-pulse">Awaiting input...</span>
                  )}
                  {activeOutputs.length > 0 && (
                    <button onClick={handleClear} className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors" title="Clear output">
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={() => setShowOutput(false)} className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors" title="Close output">
                    <PanelLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Output content */}
              <div className="flex-1 flex flex-col min-h-0">
                <div
                  ref={outputRef}
                  className="flex-1 overflow-y-auto p-3 font-mono text-sm leading-relaxed bg-[var(--bg)] rc-scrollbar"
                >
                  {activeOutputs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      {isAwaitingInput && runningFileId === activeFileId ? (
                        <span className="text-sm text-amber-500/80">{promptStr || "Waiting for input..."}</span>
                      ) : (
                        <p className="text-xs text-[var(--text-tertiary)]">{activeFile ? `Run "${activeFile.name}" to see output` : "No file selected"}</p>
                      )}
                    </div>
                  ) : (
                    activeOutputs.map((line, i) => (
                      <div key={i} className={cn("whitespace-pre-wrap break-all py-0.5", line.type === "stderr" ? "text-red-400" : "text-[var(--text-primary)]")}>
                        {line.text}
                      </div>
                    ))
                  )}
                </div>

                {/* Input bar */}
                {isAwaitingInput && runningFileId === activeFileId && (
                  <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2">
                    <div className="flex items-center gap-2">
                      {promptStr && (
                        <span className="text-sm font-mono text-amber-400 shrink-0 whitespace-pre">{promptStr}</span>
                      )}
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSendInput(); }}
                        placeholder={promptStr ? "" : "Type input value..."}
                        className="flex-1 bg-transparent border-0 outline-none text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-0"
                      />
                      <button
                        onClick={handleSendInput}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors shrink-0"
                      >
                        <Send className="w-3 h-3" />
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

      {/* ─── Context Menu ─── */}
      {contextMenu && (
        <div
          className="fixed z-50 w-44 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-xl text-xs"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.fileId && !isProtectedFile(files.find(f => f.id === contextMenu.fileId)?.name || "") && (
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

      {/* ─── Status Bar ─── */}
      <div className="flex items-center justify-between px-3 h-5 bg-[var(--status-bar)] border-t border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="w-px h-2.5 bg-[var(--border)]" />
          <span>R</span>
          <span className="w-px h-2.5 bg-[var(--border)]" />
          <span>
            {isRunning
              ? `Running ${files.find((f) => f.id === runningFileId)?.name || ""}...`
              : isReady
              ? "Ready"
              : "Loading..."}
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
            {activeOutputs.length > 0 && (
              <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-[var(--border)] text-[10px] font-medium">{activeOutputs.length}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RCompilerGenerator() {
  return <REditor />;
}
