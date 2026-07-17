"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play, Square, RotateCcw, Download, Terminal, File,
  Send, Settings, ArrowLeft, ChevronDown,
  PanelRight, PanelLeft, X, FilePlus, Trash2, Pencil, Check,
  AlertCircle, Coffee, FileJson
} from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useTheme as useNextTheme } from "next-themes";
import Link from "next/link";
import { CompilerLoading } from "@/components/compiler-loading";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const DEFAULT_CODE = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Welcome to Java Compiler!");
        System.out.println("\\n=== Calculator ===");

        try (Scanner sc = new Scanner(System.in)) {
            System.out.print("Enter first number: ");
            double a = sc.nextDouble();

            System.out.print("Enter second number: ");
            double b = sc.nextDouble();

            System.out.println("\\nResults:");
            System.out.printf("%.1f + %.1f = %.1f%n", a, b, a + b);
            System.out.printf("%.1f - %.1f = %.1f%n", a, b, a - b);
            System.out.printf("%.1f * %.1f = %.1f%n", a, b, a * b);
            System.out.printf("%.1f / %.1f = %.1f%n", a, b, a / b);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
`;

type SidebarTab = "explorer" | "settings";

interface FileData {
  id: string;
  name: string;
  content: string;
  language: string;
  outputs?: { type: "stdout" | "stderr"; text: string }[];
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

const SETTINGS_KEY = "java-compiler-settings";
const FILES_KEY = "java-compiler-files";

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
    case "java": return "java";
    case "txt": return "plaintext";
    case "json": return "json";
    case "md": return "markdown";
    default: return "plaintext";
  }
}

function getFileIcon(name: string, className?: string): React.ReactNode {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const cls = className || "w-4 h-4";
  if (ext === "java") return <Coffee className={`${cls} text-orange-500`} />;
  if (ext === "json") return <FileJson className={`${cls} text-yellow-500`} />;
  return <File className={`${cls} text-[var(--text-secondary)]`} />;
}

function makeDefaultFiles(): FileData[] {
  return [
    { id: "Main.java", name: "Main.java", content: DEFAULT_CODE, language: "java" },
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

declare global {
  interface Window {
    cheerpjInit: (options?: Record<string, any>) => Promise<void>;
    cheerpjCreateDisplay: (width: number, height: number, container?: HTMLElement | null) => void;
    cheerpjAddStringFile: (path: string, content: string | Uint8Array) => void;
    cheerpjRunMain: (className: string, classPath: string, ...args: string[]) => Promise<number>;
    cheerpOSAddStringFile?: (path: string, content: string | Uint8Array) => void;
    cheerpj: any;
  }
}

/** Write a file to CheerpJ's virtual filesystem (supports both API versions) */
function cheerpAddFile(path: string, content: Uint8Array) {
  if (typeof window.cheerpOSAddStringFile === "function") {
    window.cheerpOSAddStringFile(path, content);
  } else {
    window.cheerpjAddStringFile(path, content);
  }
}

function JavaEditor() {
  const storedFiles = getStoredFiles();
  const initialFiles = storedFiles?.length ? storedFiles : makeDefaultFiles();
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [activeFileId, setActiveFileId] = useState(initialFiles[0]?.id || "Main.java");
  const [openFileIds, setOpenFileIds] = useState<string[]>([initialFiles[0]?.id || "Main.java"]);
  const [isCheerpjReady, setIsCheerpjReady] = useState(false);
  const [isCheerpjLoading, setIsCheerpjLoading] = useState(true);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
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
  const [compileError, setCompileError] = useState<string | null>(null);
  const [outputText, setOutputText] = useState("");
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
  const [cheerpjStatus, setCheerpjStatus] = useState<string>("Loading compiler...");

  const renameInputRef = useRef<HTMLInputElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLPreElement>(null);
  const outputObserverRef = useRef<MutationObserver | null>(null);
  const isRunningRef = useRef(false);
  const activeFileIdRef = useRef(activeFileId);

  const readByteResolverRef = useRef<((value: number) => void) | null>(null);
  const readByteQueueRef = useRef<number[]>([]);

  const compileHelpers = useCallback(async () => {
    const inputStreamCode = `
package cheerpj;
import java.io.InputStream;
import java.io.IOException;

public class CheerpJInputStream extends InputStream {
    public static native int readByte();
    public static native int bytesAvailable();

    @Override
    public int read() throws IOException {
        return readByte();
    }

    @Override
    public int available() throws IOException {
        return bytesAvailable();
    }
    
    @Override
    public int read(byte[] b, int off, int len) throws IOException {
        if (b == null) {
            throw new NullPointerException();
        } else if (off < 0 || len < 0 || len > b.length - off) {
            throw new IndexOutOfBoundsException();
        } else if (len == 0) {
            return 0;
        }

        int c = read();
        if (c == -1) {
            return -1;
        }
        b[off] = (byte)c;

        int i = 1;
        try {
            while (i < len && available() > 0) {
                c = read();
                if (c == -1) {
                    break;
                }
                b[off + i] = (byte)c;
                i++;
            }
        } catch (IOException ee) {
        }
        return i;
    }
}
    `;
    
    const runnerCode = `
package cheerpj;
public class CheerpJRunner {
    public static void main(String[] args) throws Exception {
        if (args.length == 0) return;
        System.setIn(new CheerpJInputStream());
        Class<?> clazz = Class.forName(args[0]);
        java.lang.reflect.Method mainMethod = clazz.getMethod("main", String[].class);
        
        String[] targetArgs = new String[args.length - 1];
        System.arraycopy(args, 1, targetArgs, 0, targetArgs.length);
        mainMethod.invoke(null, (Object) targetArgs);
    }
}
    `;

    const encoder = new TextEncoder();
    try {
      if (typeof window.cheerpOSAddStringFile === "function") {
        window.cheerpOSAddStringFile("/str/CheerpJInputStream.java", encoder.encode(inputStreamCode));
        window.cheerpOSAddStringFile("/str/CheerpJRunner.java", encoder.encode(runnerCode));
      } else {
        window.cheerpjAddStringFile("/str/CheerpJInputStream.java", encoder.encode(inputStreamCode));
        window.cheerpjAddStringFile("/str/CheerpJRunner.java", encoder.encode(runnerCode));
      }

      await window.cheerpjRunMain(
        "org.eclipse.jdt.internal.compiler.batch.Main",
        "/app/ecj.jar:/files/",
        "-d", "/files/",
        "-source", "1.8",
        "-target", "1.8",
        "-nowarn",
        "/str/CheerpJInputStream.java",
        "/str/CheerpJRunner.java"
      );
    } catch (e) {
      console.error("Helper compilation failed:", e);
    }
  }, []);

  const handleSendInput = useCallback((text: string) => {
    const textWithNewline = text + "\n";
    
    setOutputText(prev => prev + text + "\n");
    
    if (consoleRef.current) {
      consoleRef.current.appendChild(document.createTextNode(text + "\n"));
    }

    const chars = Array.from(textWithNewline).map(c => c.charCodeAt(0));
    
    if (readByteResolverRef.current) {
      const firstChar = chars.shift()!;
      readByteQueueRef.current.push(...chars);
      const resolve = readByteResolverRef.current;
      readByteResolverRef.current = null;
      resolve(firstChar);
    } else {
      readByteQueueRef.current.push(...chars);
    }
  }, []);
  const filesRef = useRef<FileData[]>(files);
  const outputHeightRef = useRef(200);
  const isDraggingRef = useRef(false);
  const [outputHeight, setOutputHeight] = useState(200);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { resolvedTheme } = useNextTheme();
  const theme = resolvedTheme || "dark";
  const colors = THEMES[mounted && theme === "light" ? "light" : "dark"];

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => { activeFileIdRef.current = activeFileId; }, [activeFileId]);
  useEffect(() => { filesRef.current = files; }, [files]);
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
  }, [outputText]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const container = document.getElementById("java-main-body");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const fromBottom = rect.bottom - e.clientY;
      const h = Math.max(100, Math.min(fromBottom, rect.height * 0.6));
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

  useEffect(() => {
    (window as any).__cheerpjReadByte = async () => {
      return new Promise<number>((resolve) => {
        if (readByteQueueRef.current.length > 0) {
          resolve(readByteQueueRef.current.shift()!);
        } else {
          setIsAwaitingInput(true);
          readByteResolverRef.current = (byte) => {
            setIsAwaitingInput(false);
            resolve(byte);
          };
        }
      });
    };
    (window as any).__cheerpjBytesAvailable = () => {
      return readByteQueueRef.current.length;
    };
  });

  const cheerpjVersions = ["4.3", "4.2", "4.1"];
  const cheerpjRef = useRef<{ version: string; retries: number }>({
    version: cheerpjVersions[0],
    retries: 0,
  });

  const loadCheerpj = useCallback(async () => {
    if (typeof window.cheerpjInit !== "undefined") {
      setIsCheerpjLoading(false);
      setIsCheerpjReady(true);
      setCheerpjStatus("Ready");
      try {
        await compileHelpers();
      } catch (e) {
        console.error("Failed to compile helpers:", e);
      }
      return;
    }

    const v = cheerpjRef.current.version;
    setCheerpjStatus(`Loading CheerpJ ${v} runtime...`);
    const script = document.createElement("script");
    script.src = `https://cjrtnc.leaningtech.com/${v}/loader.js`;
    script.async = true;

    script.onload = async () => {
      try {
        setCheerpjStatus("Initializing JVM...");
        await window.cheerpjInit({
          version: 8,
          status: "none",
          natives: {
            Java_cheerpj_CheerpJInputStream_readByte: async function() {
              if (typeof (window as any).__cheerpjReadByte === "function") {
                return await (window as any).__cheerpjReadByte();
              }
              return -1;
            },
            Java_cheerpj_CheerpJInputStream_bytesAvailable: function() {
              if (typeof (window as any).__cheerpjBytesAvailable === "function") {
                return (window as any).__cheerpjBytesAvailable();
              }
              return 0;
            }
          }
        });
        setCheerpjStatus("Initializing interop helpers...");
        await compileHelpers();
        setIsCheerpjReady(true);
        setCheerpjStatus("Ready");
      } catch (err: any) {
        console.error(`CheerpJ ${v} init error:`, err);
        const idx = cheerpjVersions.indexOf(v);
        if (idx >= 0 && idx < cheerpjVersions.length - 1) {
          cheerpjRef.current.version = cheerpjVersions[idx + 1];
          setCheerpjStatus(`Trying CheerpJ ${cheerpjVersions[idx + 1]}...`);
          loadCheerpj();
        } else {
          setCheerpjStatus(`Initialization failed: ${err?.message || "unknown"}`);
          setIsCheerpjLoading(false);
        }
      } finally {
        setIsCheerpjLoading(false);
      }
    };

    script.onerror = () => {
      const idx = cheerpjVersions.indexOf(v);
      if (idx >= 0 && idx < cheerpjVersions.length - 1) {
        cheerpjRef.current.version = cheerpjVersions[idx + 1];
        setCheerpjStatus(`CheerpJ ${v} failed, trying ${cheerpjVersions[idx + 1]}...`);
        loadCheerpj();
      } else {
        setCheerpjStatus("Failed to load CheerpJ");
        setIsCheerpjLoading(false);
      }
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    loadCheerpj();
  }, [loadCheerpj]);

  const syncFilesToCheerpj = useCallback(async () => {
    if (!isCheerpjReady) return;
    const encoder = new TextEncoder();
    for (const file of filesRef.current) {
      try {
        cheerpAddFile("/str/" + file.name, encoder.encode(file.content));
      } catch (err) {
        console.error("Error writing file to CheerpJ VFS:", err);
      }
    }
  }, [isCheerpjReady]);

  useEffect(() => {
    if (isCheerpjReady) {
      syncFilesToCheerpj();
    }
  }, [isCheerpjReady, syncFilesToCheerpj]);

  const deriveMainClass = useCallback((file: FileData): string => {
    const className = file.name.replace(".java", "");
    const match = file.content.match(/package\s+(.+);/);
    if (match && match.length > 1) {
      return `${match[1]}.${className}`;
    }
    return className;
  }, []);

  const setupOutputObserver = useCallback(() => {
    if (outputObserverRef.current) {
      outputObserverRef.current.disconnect();
    }

    const consoleEl = consoleRef.current;
    if (!consoleEl) return;

    const observer = new MutationObserver(() => {
      if (isRunningRef.current && consoleEl.innerHTML) {
        setOutputText(consoleEl.textContent || "");
      }
    });

    observer.observe(consoleEl, { childList: true, subtree: true, characterData: true });
    outputObserverRef.current = observer;
  }, []);

  useEffect(() => {
    setupOutputObserver();
    return () => {
      if (outputObserverRef.current) {
        outputObserverRef.current.disconnect();
      }
    };
  }, [setupOutputObserver]);

  const compileAndRun = useCallback(async () => {
    if (!isCheerpjReady || !activeFile || isRunning || isCompiling) return;

    setIsCompiling(true);
    setIsRunning(true);
    isRunningRef.current = true;
    setCompileError(null);
    setOutputText("");
    setShowOutput(true);

    if (consoleRef.current) {
      consoleRef.current.innerHTML = "";
    }

    try {
      await syncFilesToCheerpj();

      const javaFiles = filesRef.current
        .filter(f => f.name.endsWith(".java"))
        .map(f => "/str/" + f.name);
      const outputDir = "/files/";
      const classPath = "/app/ecj.jar:/files/";

      setCheerpjStatus("Compiling...");

      let compileResult: number;
      try {
        compileResult = await window.cheerpjRunMain(
          "org.eclipse.jdt.internal.compiler.batch.Main",
          classPath,
          "-d", outputDir,
          "-source", "1.8",
          "-target", "1.8",
          "-nowarn",
          ...javaFiles
        );
      } catch (compileErr: any) {
        if (compileErr?.name === "CheerpException" && compileErr?.code === 0) {
          compileResult = 0;
        } else {
          throw compileErr;
        }
      }

      if (compileResult !== 0) {
        const consoleOutput = consoleRef.current?.textContent || "";
        const errorMsg = consoleOutput || "Compilation failed (exit code " + compileResult + ")";
        setCompileError(errorMsg);
        setOutputText(errorMsg);
        setCheerpjStatus("Compilation failed");
        return;
      }

      setIsCompiling(false);
      setCheerpjStatus("Running…");
      if (consoleRef.current) consoleRef.current.innerHTML = "";

      const mainClass = deriveMainClass(activeFile);

      try {
        readByteQueueRef.current = [];
        readByteResolverRef.current = null;
        await window.cheerpjRunMain("cheerpj.CheerpJRunner", "/files/", mainClass);
      } catch (runErr: any) {
        const isNormalExit =
          runErr?.name === "CheerpException" &&
          (runErr?.code === 0 || runErr?.isExit === false);
        if (!isNormalExit) throw runErr;
      }

      const finalOutput = consoleRef.current?.textContent || "";
      setOutputText(finalOutput);
      setCheerpjStatus("Finished");
    } catch (err: any) {
      const details = err?.message || String(err);
      const errMsg = "Runtime Error: " + details;
      setOutputText(errMsg);
      setCompileError(errMsg);
      setCheerpjStatus("Error");
    } finally {
      setIsCompiling(false);
      setIsRunning(false);
      isRunningRef.current = false;
      setIsAwaitingInput(false);
    }
  }, [isCheerpjReady, activeFile, isRunning, isCompiling, syncFilesToCheerpj, deriveMainClass]);

  const handleRun = useCallback(() => {
    compileAndRun();
  }, [compileAndRun]);

  const handleStop = useCallback(() => {
    if (isRunning || isCompiling) {
      setIsRunning(false);
      setIsCompiling(false);
      isRunningRef.current = false;
      setCheerpjStatus("Stopped");
      setIsAwaitingInput(false);
      if (readByteResolverRef.current) {
        const resolve = readByteResolverRef.current;
        readByteResolverRef.current = null;
        resolve(-1);
      }
    }
  }, [isRunning, isCompiling]);

  const handleClear = useCallback(() => {
    setOutputText("");
    setCompileError(null);
    if (consoleRef.current) {
      consoleRef.current.innerHTML = "";
    }
  }, []);

  const handleReset = useCallback(() => {
    const defaults = makeDefaultFiles();
    setFiles(defaults);
    setActiveFileId("Main.java");
    setOpenFileIds(["Main.java"]);
    setShowNewFile(false);
    setNewFileName("");
    setOutputText("");
    setCompileError(null);
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
    const newFile: FileData = {
      id,
      name: trimmed,
      content: trimmed.endsWith(".java")
        ? "public class " + trimmed.replace(".java", "") + " {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from " + trimmed.replace(".java", "") + "!\");\n    }\n}\n"
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
    <div className="java-compiler h-screen flex flex-col bg-[var(--bg)] overflow-hidden">
      <style>{`
        .java-compiler {
          ${Object.entries(colors).map(([key, val]) => `${key}: ${val};`).join("\n")}
        }
        .jc-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .jc-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .jc-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .jc-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>

      <pre id="console" ref={consoleRef} className="hidden" aria-hidden="true" />

      <div className="flex items-center justify-between px-4 h-9 bg-[var(--bg-title)] border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Back</span>
          </Link>
          <span className="w-px h-4 bg-[var(--border)]" />
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Java Compiler</span>
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

      <div id="java-main-body" className="flex-1 flex min-h-0">

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
              disabled={!isCheerpjReady || isCheerpjLoading}
              title={isCheerpjReady ? "Run" : "Loading..."}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-md transition-colors",
                isCheerpjReady ? "text-emerald-500 hover:bg-emerald-500/10" : "text-[var(--text-tertiary)] cursor-not-allowed"
              )}
            >
              {isCheerpjLoading ? (
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
            <div className="flex-1 overflow-y-auto py-1 jc-scrollbar">
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
                    placeholder="filename.java"
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
                      {isCompiling && activeFileId === file.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shrink-0 ml-1.5" />
                      )}
                      {isRunning && activeFileId === file.id && !isCompiling && (
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
            <div className="flex-1 overflow-y-auto p-3 space-y-4 jc-scrollbar">
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
                        ? "bg-[var(--bg)] text-[var(--text-primary)] border-b-2 border-orange-500"
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
                  disabled={!isCheerpjReady || isCheerpjLoading}
                  className={cn(
                    "px-3 h-full flex items-center gap-1.5 text-xs font-semibold transition-colors shrink-0 border-l border-r border-[var(--border)]",
                    isCheerpjReady
                      ? "text-emerald-500 hover:bg-[var(--bg-hover)] cursor-pointer"
                      : "text-[var(--text-tertiary)] cursor-not-allowed"
                  )}
                  title={isCheerpjReady ? "Run code" : "Loading compiler..."}
                >
                  {isCheerpjLoading ? (
                    <span className="w-3 h-3 border-2 border-[var(--text-tertiary)] border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                  )}
                  <span>{isCheerpjLoading ? "Loading..." : isCompiling ? "Compiling..." : "Run"}</span>
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
                className="h-1.5 cursor-ns-resize hover:bg-orange-500/30 transition-colors shrink-0 relative"
                onMouseDown={() => { isDraggingRef.current = true; }}
              >
                <div className="absolute inset-x-4 top-0.5 h-px bg-[var(--border)]" />
              </div>

              <div className="flex items-center justify-between px-3 h-8 bg-[var(--bg-secondary)] border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs font-medium text-[var(--text-secondary)] truncate">Output{activeFile ? `: ${activeFile.name}` : ""}</span>
                  {isCompiling && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shrink-0" />}
                  {isRunning && !isCompiling && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {(outputText || compileError) && (
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
                  className="flex-1 overflow-y-auto p-3 font-mono text-sm leading-relaxed bg-[var(--bg)] jc-scrollbar"
                >
                  {!outputText && !compileError && !isRunning ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-[var(--text-tertiary)]">
                        {isCheerpjLoading
                          ? "Loading CheerpJ runtime..."
                          : activeFile
                          ? `Run "${activeFile.name}" to see output`
                          : "No file selected"}
                      </p>
                    </div>
                  ) : compileError ? (
                    <div className="whitespace-pre-wrap break-all py-0.5 text-red-400">
                      <span className="text-red-500 font-semibold">
                        {outputText === compileError ? "Compilation Error:" : "Error: "}
                      </span>
                      {"\n"}{compileError}
                    </div>
                  ) : outputText ? (
                    <div className="whitespace-pre-wrap break-all py-0.5 text-[var(--text-primary)]">
                      {outputText}
                    </div>
                  ) : null}
                  {isRunning && !outputText && !compileError && (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xs text-emerald-500/80">
                        {isCompiling ? "Compiling..." : "Running..."}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stdin input bar at the bottom */}
                {isRunning && isAwaitingInput && (
                  <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 text-xs shrink-0 font-mono">&gt;</span>
                      <input
                        type="text"
                        placeholder="Type input and press Enter..."
                        className="flex-1 bg-transparent text-[var(--text-primary)] text-xs outline-none border-none placeholder:text-[var(--text-tertiary)] font-mono"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = e.currentTarget.value;
                            e.currentTarget.value = "";
                            handleSendInput(val);
                          }
                        }}
                      />
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
          <span>Java</span>
          <span className="w-px h-2.5 bg-[var(--border)]" />
          <span>
            {isCompiling
              ? "Compiling..."
              : isRunning
              ? "Running..."
              : isCheerpjLoading
              ? "Loading CheerpJ..."
              : cheerpjStatus || "Ready"}
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

export function JavaCompilerGenerator() {
  return <JavaEditor />;
}

