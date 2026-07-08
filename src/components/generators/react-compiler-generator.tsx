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
  Trash2, FilePlus, Package,
  Plus, RefreshCw, Box, Globe,
  Layers, Play, FolderPlus,
  ChevronRight, Folder
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
import { useTheme as useNextTheme } from "next-themes";
import * as Babel from "@babel/standalone";
import { emmetHTML, emmetCSS, emmetJSX } from "emmet-monaco-es";
import { CompilerLoading } from "@/components/compiler-loading";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Viewport = "desktop" | "tablet" | "mobile" | "wide";
type SidebarTab = "files" | "search" | "settings" | "packages";
type BottomTab = "terminal" | "console" | "problems";
type LogType = "log" | "error" | "warn";

interface FileData {
  id: string;
  name: string;
  path: string;
  content: string;
  savedContent: string;
  language: string;
}

interface TreeNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children: TreeNode[];
  fileId?: string;
  language?: string;
  isDirty?: boolean;
  expanded?: boolean;
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

interface Dependency {
  name: string;
  version: string;
}

const SETTINGS_STORAGE_KEY = "react-compiler-settings";
const FILES_STORAGE_KEY = "react-compiler-files";
const DEPS_STORAGE_KEY = "react-compiler-deps";

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
  txt: "plaintext",
};

const REACT_SNIPPETS: Array<{ label: string; kind: number; insertText: string; detail: string }> = [
  { label: "rfce", kind: 2, insertText: "import React from 'react';\n\nconst ${1:ComponentName} = () => {\n  return (\n    <${2:div}>\n      $0\n    </${2:div}>\n  );\n};\n\nexport default ${1:ComponentName};", detail: "React Functional Component (export)" },
  { label: "rfcp", kind: 2, insertText: "const ${1:ComponentName} = ({ ${2:props} }: ${3:Props}) => {\n  return (\n    <${4:div}>\n      $0\n    </${4:div}>\n  );\n};\n\nexport default ${1:ComponentName};", detail: "React Functional Component with Props" },
  { label: "useState", kind: 2, insertText: "const [${1:state}, set${1:State}] = useState<${2:type}>(${3:initialValue});", detail: "useState hook" },
  { label: "useEffect", kind: 2, insertText: "useEffect(() => {\n  $0\n  return () => {};\n}, [${1}]);", detail: "useEffect hook" },
  { label: "useRef", kind: 2, insertText: "const ${1:ref} = useRef<${2:type}>(null);", detail: "useRef hook" },
  { label: "useMemo", kind: 2, insertText: "const ${1:value} = useMemo(() => {\n  $0\n}, [${2}]);", detail: "useMemo hook" },
  { label: "useCallback", kind: 2, insertText: "const ${1:fn} = useCallback((${2:params}) => {\n  $0\n}, [${3}]);", detail: "useCallback hook" },
  { label: "useContext", kind: 2, insertText: "const ${1:contextValue} = useContext(${2:Context});", detail: "useContext hook" },
  { label: "useReducer", kind: 2, insertText: "const [${1:state}, ${2:dispatch}] = useReducer(${3:reducer}, ${4:initialState});", detail: "useReducer hook" },
  { label: "imp", kind: 2, insertText: "import ${1:defaultExport} from '${2:module}';", detail: "Import statement" },
  { label: "impd", kind: 2, insertText: "import { ${1:destructuredExport} } from '${2:module}';", detail: "Destructured import" },
  { label: "clg", kind: 2, insertText: "console.log($0);", detail: "Console log" },
  { label: "clr", kind: 2, insertText: "console.error($0);", detail: "Console error" },
  { label: "clo", kind: 2, insertText: "console.log('${1:label} :>> ', ${1:label});", detail: "Console log with label" },
  { label: "anfn", kind: 2, insertText: "(${1:params}) => {\n  $0\n}", detail: "Arrow function" },
  { label: "nfn", kind: 2, insertText: "const ${1:name} = (${2:params}) => {\n  $0\n};", detail: "Named arrow function" },
  { label: "tsfn", kind: 2, insertText: "type ${1:Name}Props = {\n  ${2:prop}: ${3:type};\n};\n\nconst ${1:Name} = ({ ${2:prop} }: ${1:Name}Props) => {\n  return (\n    <${4:div}>\n      $0\n    </${4:div}>\n  );\n};", detail: "TS typed function component" },
  { label: "exp", kind: 2, insertText: "export default ${1:name};", detail: "Export default" },
  { label: "edf", kind: 2, insertText: "export default function ${1:name}(${2:params}) {\n  $0\n}", detail: "Export default function" },
  { label: "edc", kind: 2, insertText: "export default class ${1:ClassName} {\n  $0\n}", detail: "Export default class" },
];

const TAILWIND_CLASSES = [
  "flex", "inline-flex", "grid", "inline-grid", "block", "inline-block", "hidden",
  "flex-row", "flex-col", "flex-wrap", "flex-nowrap", "flex-1", "flex-auto", "flex-initial", "flex-none",
  "items-start", "items-end", "items-center", "items-baseline", "items-stretch",
  "justify-start", "justify-end", "justify-center", "justify-between", "justify-around", "justify-evenly",
  "gap-0", "gap-1", "gap-2", "gap-3", "gap-4", "gap-5", "gap-6", "gap-8", "gap-10", "gap-12",
  "p-0", "p-1", "p-2", "p-3", "p-4", "p-5", "p-6", "p-8", "p-10",
  "px-0", "px-1", "px-2", "px-3", "px-4", "px-5", "px-6", "px-8",
  "py-0", "py-1", "py-2", "py-3", "py-4", "py-5", "py-6", "py-8",
  "pt-0", "pt-1", "pt-2", "pt-3", "pt-4", "pt-5", "pt-6", "pt-8",
  "pb-0", "pb-1", "pb-2", "pb-3", "pb-4", "pb-5", "pb-6", "pb-8",
  "pl-0", "pl-1", "pl-2", "pl-3", "pl-4", "pl-5", "pl-6", "pl-8",
  "pr-0", "pr-1", "pr-2", "pr-3", "pr-4", "pr-5", "pr-6", "pr-8",
  "m-0", "m-1", "m-2", "m-3", "m-4", "m-5", "m-6", "m-8", "m-10", "m-auto",
  "mx-0", "mx-1", "mx-2", "mx-3", "mx-4", "mx-5", "mx-6", "mx-8", "mx-auto",
  "my-0", "my-1", "my-2", "my-3", "my-4", "my-5", "my-6", "my-8", "my-auto",
  "mt-0", "mt-1", "mt-2", "mt-3", "mt-4", "mt-5", "mt-6", "mt-8", "mt-auto",
  "mb-0", "mb-1", "mb-2", "mb-3", "mb-4", "mb-5", "mb-6", "mb-8", "mb-auto",
  "ml-0", "ml-1", "ml-2", "ml-3", "ml-4", "ml-5", "ml-6", "ml-8", "ml-auto",
  "mr-0", "mr-1", "mr-2", "mr-3", "mr-4", "mr-5", "mr-6", "mr-8", "mr-auto",
  "w-0", "w-1", "w-2", "w-3", "w-4", "w-5", "w-6", "w-8", "w-10", "w-12", "w-16", "w-20", "w-24",
  "w-32", "w-40", "w-48", "w-56", "w-64", "w-auto", "w-full", "w-screen", "w-1/2", "w-1/3", "w-2/3",
  "h-0", "h-1", "h-2", "h-3", "h-4", "h-5", "h-6", "h-8", "h-10", "h-12", "h-16", "h-20", "h-24",
  "h-32", "h-40", "h-48", "h-56", "h-64", "h-auto", "h-full", "h-screen",
  "min-w-0", "min-w-full", "min-h-0", "min-h-full", "min-h-screen",
  "max-w-xs", "max-w-sm", "max-w-md", "max-w-lg", "max-w-xl", "max-w-2xl", "max-w-3xl", "max-w-4xl", "max-w-5xl", "max-w-6xl", "max-w-7xl", "max-w-full",
  "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl",
  "text-left", "text-center", "text-right", "text-justify",
  "font-thin", "font-extralight", "font-light", "font-normal", "font-medium", "font-semibold", "font-bold", "font-extrabold", "font-black",
  "text-white", "text-black", "text-gray-50", "text-gray-100", "text-gray-200", "text-gray-300", "text-gray-400", "text-gray-500", "text-gray-600", "text-gray-700", "text-gray-800", "text-gray-900",
  "text-red-500", "text-red-600", "text-red-700", "text-blue-500", "text-blue-600", "text-blue-700", "text-green-500", "text-green-600", "text-green-700",
  "bg-white", "bg-black", "bg-transparent", "bg-gray-50", "bg-gray-100", "bg-gray-200", "bg-gray-300", "bg-gray-400", "bg-gray-500", "bg-gray-600", "bg-gray-700", "bg-gray-800", "bg-gray-900",
  "bg-red-500", "bg-red-600", "bg-blue-500", "bg-blue-600", "bg-green-500", "bg-green-600",
  "rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full",
  "rounded-t", "rounded-b", "rounded-l", "rounded-r",
  "border", "border-0", "border-2", "border-4", "border-8",
  "border-t", "border-b", "border-l", "border-r",
  "border-gray-200", "border-gray-300", "border-gray-400", "border-gray-500",
  "shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl",
  "opacity-0", "opacity-25", "opacity-50", "opacity-75", "opacity-100",
  "cursor-pointer", "cursor-not-allowed", "cursor-default",
  "relative", "absolute", "fixed", "sticky", "static",
  "top-0", "right-0", "bottom-0", "left-0",
  "z-0", "z-10", "z-20", "z-30", "z-40", "z-50",
  "overflow-hidden", "overflow-auto", "overflow-scroll", "overflow-visible",
  "overflow-x-hidden", "overflow-y-auto",
  "truncate", "whitespace-nowrap", "whitespace-pre-wrap", "break-all", "break-words",
  "inline", "contents", "table", "table-cell", "table-row",
  "object-cover", "object-contain", "object-fill", "object-scale-down",
  "transition", "transition-all", "transition-colors", "transition-opacity", "transition-shadow", "transition-transform",
  "duration-100", "duration-200", "duration-300", "duration-500", "duration-700", "duration-1000",
  "ease-linear", "ease-in", "ease-out", "ease-in-out",
  "scale-0", "scale-50", "scale-75", "scale-90", "scale-95", "scale-100", "scale-105", "scale-110", "scale-125", "scale-150",
  "rotate-0", "rotate-45", "rotate-90", "rotate-180",
  "translate-x-0", "translate-y-0", "-translate-x-1/2", "-translate-y-1/2",
  "animate-pulse", "animate-spin", "animate-bounce", "animate-ping",
  "hover:bg-gray-100", "hover:bg-gray-200", "hover:bg-gray-300",
  "hover:text-blue-600", "hover:text-blue-700",
  "hover:opacity-80", "hover:opacity-100",
  "hover:shadow-lg", "hover:scale-105",
  "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:ring-offset-2",
  "active:scale-95",
  "disabled:opacity-50", "disabled:cursor-not-allowed",
  "group-hover:opacity-100",
  "sm:flex", "sm:hidden", "sm:w-1/2", "sm:w-1/3",
  "md:flex", "md:hidden", "md:w-1/2", "md:w-1/3",
  "lg:flex", "lg:hidden", "lg:w-1/2",
  "xl:flex", "xl:hidden",
  "dark:bg-gray-800", "dark:bg-gray-900", "dark:text-white", "dark:text-gray-300",
  "select-none", "select-all", "select-text",
  "list-none", "list-disc", "list-decimal",
  "leading-none", "leading-tight", "leading-snug", "leading-normal", "leading-relaxed", "leading-loose",
  "tracking-tighter", "tracking-tight", "tracking-normal", "tracking-wide", "tracking-wider", "tracking-widest",
  "italic", "not-italic", "underline", "line-through", "no-underline",
  "uppercase", "lowercase", "capitalize", "normal-case",
  "col-span-1", "col-span-2", "col-span-3", "col-span-4", "col-span-5", "col-span-6", "col-span-full",
  "row-span-1", "row-span-2", "row-span-3", "row-span-full",
  "gap-x-1", "gap-x-2", "gap-x-4", "gap-x-8", "gap-y-1", "gap-y-2", "gap-y-4", "gap-y-8",
  "space-x-0", "space-x-1", "space-x-2", "space-x-3", "space-x-4", "space-x-6", "space-x-8",
  "space-y-0", "space-y-1", "space-y-2", "space-y-3", "space-y-4", "space-y-6", "space-y-8",
  "order-first", "order-last", "order-none", "order-1", "order-2", "order-3",
  "self-start", "self-end", "self-center", "self-stretch", "self-auto",
  "place-items-center", "place-items-start", "place-items-end",
  "place-content-center", "place-content-between",
];

const TAILWIND_CSS_SNIPPETS: Array<{ label: string; kind: number; insertText: string; detail: string }> = [
  { label: "@apply", kind: 2, insertText: "@apply ${1:classNames};", detail: "Tailwind @apply directive" },
  { label: "@layer", kind: 2, insertText: "@layer ${1:components|utilities|base} {\n  $0\n}", detail: "Tailwind @layer directive" },
  { label: "@tailwind", kind: 2, insertText: "@tailwind ${1:base|components|utilities|variants};", detail: "Tailwind directive" },
  { label: "tw-responsive", kind: 2, insertText: "@media (min-width: ${1:768}px) {\n  $0\n}", detail: "Tailwind responsive media query" },
  { label: "tw-dark", kind: 2, insertText: ".dark {\n  $0\n}\n\n@media (prefers-color-scheme: dark) {\n  $0\n}", detail: "Tailwind dark mode styles" },
];

const TAILWIND_COMPONENT_SNIPPETS: Array<{ label: string; kind: number; insertText: string; detail: string }> = [
  { label: "tw-btn", kind: 2, insertText: "<button className=\"inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:scale-[0.97] transition-all duration-150\">\n  $0\n</button>", detail: "Tailwind v4 button" },
  { label: "tw-btn-outline", kind: 2, insertText: "<button className=\"inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 active:scale-[0.97] transition-all duration-150\">\n  $0\n</button>", detail: "Tailwind v4 outline button" },
  { label: "tw-btn-ghost", kind: 2, insertText: "<button className=\"inline-flex items-center justify-center gap-2 px-5 py-2.5 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 active:scale-[0.97] transition-all duration-150\">\n  $0\n</button>", detail: "Tailwind v4 ghost button" },
  { label: "tw-btn-danger", kind: 2, insertText: "<button className=\"inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 active:scale-[0.97] transition-all duration-150\">\n  $0\n</button>", detail: "Tailwind v4 danger button" },
  { label: "tw-btn-sm", kind: 2, insertText: "<button className=\"inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all duration-150\">\n  $0\n</button>", detail: "Tailwind v4 small button" },
  { label: "tw-btn-lg", kind: 2, insertText: "<button className=\"inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-blue-600 text-white text-base font-semibold rounded-2xl hover:bg-blue-700 active:scale-[0.97] shadow-lg shadow-blue-600/25 transition-all duration-150\">\n  $0\n</button>", detail: "Tailwind v4 large button" },
  { label: "tw-btn-icon", kind: 2, insertText: "<button className=\"p-2.5 text-gray-600 rounded-xl hover:bg-gray-100 active:scale-[0.92] transition-all duration-150\">\n  $0\n</button>", detail: "Tailwind v4 icon button" },
  { label: "tw-btn-group", kind: 2, insertText: "<div className=\"inline-flex items-center rounded-xl border border-gray-300 divide-x divide-gray-300 overflow-hidden\">\n  <button className=\"px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors\">${1:Left}</button>\n  <button className=\"px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors\">${2:Middle}</button>\n  <button className=\"px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors\">${3:Right}</button>\n</div>", detail: "Tailwind v4 button group" },
  { label: "tw-card", kind: 2, insertText: "<div className=\"bg-white rounded-2xl shadow-sm border border-gray-200 p-6\">\n  <h3 className=\"text-lg font-semibold text-gray-900 mb-2\">${1:Title}</h3>\n  <p className=\"text-gray-600 leading-relaxed\">$0</p>\n</div>", detail: "Tailwind v4 card" },
  { label: "tw-card-hover", kind: 2, insertText: "<div className=\"bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer\">\n  <h3 className=\"text-lg font-semibold text-gray-900 mb-2\">${1:Title}</h3>\n  <p className=\"text-gray-600 leading-relaxed\">$0</p>\n</div>", detail: "Tailwind v4 hover card" },
  { label: "tw-card-image", kind: 2, insertText: "<div className=\"bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden\">\n  <div className=\"h-48 bg-gradient-to-br from-blue-500 to-purple-600\"></div>\n  <div className=\"p-5\">\n    <h3 className=\"text-lg font-semibold text-gray-900 mb-2\">${1:Title}</h3>\n    <p className=\"text-gray-600 text-sm leading-relaxed\">$0</p>\n  </div>\n</div>", detail: "Tailwind v4 image card" },
  { label: "tw-input", kind: 2, insertText: "<input\n  type=\"${1:text}\"\n  placeholder=\"${2:Placeholder}\"\n  className=\"w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150\"\n/>", detail: "Tailwind v4 input" },
  { label: "tw-input-error", kind: 2, insertText: "<input\n  type=\"${1:text}\"\n  placeholder=\"${2:Placeholder}\"\n  className=\"w-full px-4 py-2.5 bg-white border border-red-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-150\"\n/>", detail: "Tailwind v4 input with error" },
  { label: "tw-input-label", kind: 2, insertText: "<div className=\"space-y-1.5\">\n  <label className=\"block text-sm font-medium text-gray-700\">${1:Label}</label>\n  <input\n    type=\"${2:text}\"\n    placeholder=\"${3:Placeholder}\"\n    className=\"w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150\"\n  />\n  <p className=\"text-xs text-gray-500\">${4:Helper text}</p>\n</div>", detail: "Tailwind v4 labeled input" },
  { label: "tw-input-group", kind: 2, insertText: "<div className=\"flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-150\">\n  <span className=\"px-3 text-sm text-gray-500 bg-gray-50 border-r border-gray-300 py-2.5\">${1:@}</span>\n  <input type=\"${2:text}\" placeholder=\"${3:Placeholder}\" className=\"flex-1 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none\" />\n</div>", detail: "Tailwind v4 input group" },
  { label: "tw-select", kind: 2, insertText: "<select className=\"w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150\">\n  <option value=\"\" disabled selected>${1:Select option}</option>\n  <option value=\"option1\">Option 1</option>\n  <option value=\"option2\">Option 2</option>\n  $0\n</select>", detail: "Tailwind v4 select" },
  { label: "tw-textarea", kind: 2, insertText: "<textarea\n  placeholder=\"${1:Placeholder}\"\n  rows={${2:4}}\n  className=\"w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 resize-y\"\n/>", detail: "Tailwind v4 textarea" },
  { label: "tw-checkbox", kind: 2, insertText: "<label className=\"inline-flex items-center gap-3 cursor-pointer group\">\n  <input type=\"checkbox\" className=\"w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 checked:bg-blue-600 checked:border-blue-600 transition-all duration-150\" />\n  <span className=\"text-sm text-gray-700 group-hover:text-gray-900 transition-colors\">${1:Label}</span>\n</label>", detail: "Tailwind v4 checkbox" },
  { label: "tw-radio", kind: 2, insertText: "<label className=\"inline-flex items-center gap-3 cursor-pointer group\">\n  <input type=\"radio\" name=\"${1:group}\" className=\"w-4 h-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all duration-150\" />\n  <span className=\"text-sm text-gray-700 group-hover:text-gray-900 transition-colors\">${2:Label}</span>\n</label>", detail: "Tailwind v4 radio" },
  { label: "tw-toggle", kind: 2, insertText: "<label className=\"relative inline-flex items-center cursor-pointer\">\n  <input type=\"checkbox\" className=\"sr-only peer\" />\n  <div className=\"w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600\"></div>\n  <span className=\"ms-3 text-sm font-medium text-gray-700\">${1:Label}</span>\n</label>", detail: "Tailwind v4 toggle" },
  { label: "tw-badge", kind: 2, insertText: "<span className=\"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10\">\n  $0\n</span>", detail: "Tailwind v4 badge" },
  { label: "tw-badge-green", kind: 2, insertText: "<span className=\"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-700/10\">\n  $0\n</span>", detail: "Tailwind v4 green badge" },
  { label: "tw-badge-red", kind: 2, insertText: "<span className=\"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 ring-1 ring-inset ring-red-700/10\">\n  $0\n</span>", detail: "Tailwind v4 red badge" },
  { label: "tw-badge-purple", kind: 2, insertText: "<span className=\"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10\">\n  $0\n</span>", detail: "Tailwind v4 purple badge" },
  { label: "tw-badge-dot", kind: 2, insertText: "<span className=\"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-700/10\">\n  <span className=\"w-1.5 h-1.5 rounded-full bg-blue-500\"></span>\n  $0\n</span>", detail: "Tailwind v4 badge with dot" },
  { label: "tw-chip", kind: 2, insertText: "<span className=\"inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700\">\n  ${1:Label}\n  <button className=\"ml-0.5 w-3.5 h-3.5 rounded-full inline-flex items-center justify-center hover:bg-gray-300 transition-colors\">&times;</button>\n</span>", detail: "Tailwind v4 chip/tag" },
  { label: "tw-alert", kind: 2, insertText: "<div className=\"flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200\" role=\"alert\">\n  <div className=\"flex-1\">\n    <p className=\"text-sm font-medium text-blue-800 mb-0.5\">${1:Title}</p>\n    <p className=\"text-sm text-blue-700\">$0</p>\n  </div>\n</div>", detail: "Tailwind v4 alert" },
  { label: "tw-alert-error", kind: 2, insertText: "<div className=\"flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200\" role=\"alert\">\n  <div className=\"flex-1\">\n    <p className=\"text-sm font-medium text-red-800 mb-0.5\">${1:Error}</p>\n    <p className=\"text-sm text-red-700\">$0</p>\n  </div>\n</div>", detail: "Tailwind v4 error alert" },
  { label: "tw-alert-success", kind: 2, insertText: "<div className=\"flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200\" role=\"alert\">\n  <div className=\"flex-1\">\n    <p className=\"text-sm font-medium text-green-800 mb-0.5\">${1:Success}</p>\n    <p className=\"text-sm text-green-700\">$0</p>\n  </div>\n</div>", detail: "Tailwind v4 success alert" },
  { label: "tw-alert-warning", kind: 2, insertText: "<div className=\"flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200\" role=\"alert\">\n  <div className=\"flex-1\">\n    <p className=\"text-sm font-medium text-yellow-800 mb-0.5\">${1:Warning}</p>\n    <p className=\"text-sm text-yellow-700\">$0</p>\n  </div>\n</div>", detail: "Tailwind v4 warning alert" },
  { label: "tw-modal", kind: 2, insertText: "<div className=\"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4\">\n  <div className=\"bg-white rounded-2xl shadow-xl p-6 max-w-md w-full\">\n    <div className=\"flex items-center justify-between mb-4\">\n      <h3 className=\"text-lg font-semibold text-gray-900\">${1:Title}</h3>\n      <button className=\"p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors\">&times;</button>\n    </div>\n    <div className=\"text-gray-600 text-sm leading-relaxed mb-6\">\n      $0\n    </div>\n    <div className=\"flex justify-end gap-3\">\n      <button className=\"px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors\">Cancel</button>\n      <button className=\"px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors\">Confirm</button>\n    </div>\n  </div>\n</div>", detail: "Tailwind v4 modal" },
  { label: "tw-drawer", kind: 2, insertText: "<div className=\"fixed inset-0 bg-black/50 z-50\">\n  <div className=\"absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6\">\n    <div className=\"flex items-center justify-between mb-6\">\n      <h3 className=\"text-lg font-semibold text-gray-900\">${1:Title}</h3>\n      <button className=\"p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors\">&times;</button>\n    </div>\n    <div className=\"text-gray-600 text-sm\">$0</div>\n  </div>\n</div>", detail: "Tailwind v4 drawer" },
  { label: "tw-navbar", kind: 2, insertText: "<nav className=\"flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200\">\n  <div className=\"flex items-center gap-8\">\n    <span className=\"text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent\">${1:Brand}</span>\n    <div className=\"hidden md:flex items-center gap-6\">\n      <a className=\"text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors\">${2:Link}</a>\n      <a className=\"text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors\">Link</a>\n    </div>\n  </div>\n  <div className=\"flex items-center gap-3\">\n    $0\n  </div>\n</nav>", detail: "Tailwind v4 navbar" },
  { label: "tw-sidebar", kind: 2, insertText: "<aside className=\"w-64 bg-white border-r border-gray-200 h-screen flex flex-col\">\n  <div className=\"p-5 border-b border-gray-100\">\n    <h2 className=\"text-lg font-semibold text-gray-900\">${1:Title}</h2>\n  </div>\n  <nav className=\"flex-1 p-3 space-y-1 overflow-y-auto\">\n    <a className=\"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 bg-blue-50 transition-colors\">\n      <span className=\"w-5 h-5 rounded bg-blue-600/20\"></span>\n      $0\n    </a>\n    <a className=\"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors\">\n      <span className=\"w-5 h-5 rounded bg-gray-200\"></span>\n      Item\n    </a>\n  </nav>\n</aside>", detail: "Tailwind v4 sidebar" },
  { label: "tw-table", kind: 2, insertText: "<div className=\"overflow-x-auto rounded-xl border border-gray-200\">\n  <table className=\"min-w-full divide-y divide-gray-200\">\n    <thead>\n      <tr className=\"bg-gray-50\">\n        <th className=\"px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider\">${1:Header}</th>\n        <th className=\"px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider\">Status</th>\n        <th className=\"px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider\">Actions</th>\n      </tr>\n    </thead>\n    <tbody className=\"bg-white divide-y divide-gray-100\">\n      <tr className=\"hover:bg-gray-50 transition-colors\">\n        <td className=\"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900\">$0</td>\n        <td className=\"px-6 py-4 whitespace-nowrap\"><span className=\"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700\">Active</span></td>\n        <td className=\"px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500\">Edit</td>\n      </tr>\n    </tbody>\n  </table>\n</div>", detail: "Tailwind v4 table" },
  { label: "tw-data-table", kind: 2, insertText: "<div className=\"rounded-xl border border-gray-200 overflow-hidden\">\n  <div className=\"p-4 bg-white border-b border-gray-100 flex items-center justify-between\">\n    <input type=\"text\" placeholder=\"Search...\" className=\"px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500\" />\n    <button className=\"px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors\">+ New</button>\n  </div>\n  <table className=\"min-w-full divide-y divide-gray-200\">\n    <thead className=\"bg-gray-50\"><tr><th className=\"px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase\">${1:Name}</th><th className=\"px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase\">Role</th></tr></thead>\n    <tbody className=\"bg-white divide-y divide-gray-100\">\n      <tr className=\"hover:bg-gray-50\"><td className=\"px-6 py-4 text-sm text-gray-900\">$0</td><td className=\"px-6 py-4 text-sm text-gray-600\">User</td></tr>\n    </tbody>\n  </table>\n  <div className=\"px-6 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-sm text-gray-500\">\n    <span>Page 1 of 1</span>\n    <div className=\"flex gap-1\"><button className=\"px-2 py-1 border rounded hover:bg-gray-50\">Prev</button><button className=\"px-2 py-1 border rounded hover:bg-gray-50\">Next</button></div>\n  </div>\n</div>", detail: "Tailwind v4 data table" },
  { label: "tw-accordion", kind: 2, insertText: "<div className=\"border border-gray-200 rounded-xl overflow-hidden\">\n  <details className=\"group\">\n    <summary className=\"flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors [&::-webkit-details-marker]:hidden\">\n      ${1:Accordion Title}\n      <svg className=\"w-4 h-4 text-gray-500 transition-transform duration-200 group-open:rotate-180\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M19 9l-7 7-7-7\" /></svg>\n    </summary>\n    <div className=\"px-5 pb-4 text-sm text-gray-600 leading-relaxed\">\n      $0\n    </div>\n  </details>\n</div>", detail: "Tailwind v4 accordion" },
  { label: "tw-tabs", kind: 2, insertText: "<div className=\"border-b border-gray-200\">\n  <nav className=\"flex gap-0 -mb-px\" role=\"tablist\">\n    <button className=\"px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-colors\" role=\"tab\">${1:Active}</button>\n    <button className=\"px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors\" role=\"tab\">${2:Tab}</button>\n    <button className=\"px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors\" role=\"tab\">Tab</button>\n  </nav>\n</div>\n<div className=\"pt-4 text-sm text-gray-600\">\n  $0\n</div>", detail: "Tailwind v4 tabs" },
  { label: "tw-spinner", kind: 2, insertText: "<div className=\"animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600\"></div>", detail: "Tailwind v4 spinner" },
  { label: "tw-spinner-lg", kind: 2, insertText: "<div className=\"animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-blue-600\"></div>", detail: "Tailwind v4 large spinner" },
  { label: "tw-skeleton", kind: 2, insertText: "<div className=\"animate-pulse space-y-3\">\n  <div className=\"h-3 bg-gray-200 rounded-full w-3/4\"></div>\n  <div className=\"h-3 bg-gray-200 rounded-full\"></div>\n  <div className=\"h-3 bg-gray-200 rounded-full w-5/6\"></div>\n</div>", detail: "Tailwind v4 skeleton" },
  { label: "tw-skeleton-card", kind: 2, insertText: "<div className=\"animate-pulse rounded-2xl border border-gray-200 p-5 space-y-4\">\n  <div className=\"h-40 bg-gray-200 rounded-xl\"></div>\n  <div className=\"space-y-2\">\n    <div className=\"h-4 bg-gray-200 rounded-full w-1/2\"></div>\n    <div className=\"h-3 bg-gray-200 rounded-full w-3/4\"></div>\n  </div>\n</div>", detail: "Tailwind v4 skeleton card" },
  { label: "tw-tooltip", kind: 2, insertText: "<div className=\"relative group\">\n  $0\n  <div className=\"absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg\">\n    ${1:Tooltip text}\n    <div className=\"absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900\"></div>\n  </div>\n</div>", detail: "Tailwind v4 tooltip" },
  { label: "tw-progress", kind: 2, insertText: "<div className=\"space-y-1.5\">\n  <div className=\"flex items-center justify-between text-sm\">\n    <span className=\"font-medium text-gray-700\">${1:Progress}</span>\n    <span className=\"text-gray-500\">${2:60}%</span>\n  </div>\n  <div className=\"w-full bg-gray-100 rounded-full h-2.5 overflow-hidden\">\n    <div className=\"bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500\" style={{ width: \"${2:60}%\" }}></div>\n  </div>\n</div>", detail: "Tailwind v4 progress bar" },
  { label: "tw-progress-steps", kind: 2, insertText: "<div className=\"flex items-center justify-between\">\n  <div className=\"flex items-center\">\n    <div className=\"w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center justify-center\">1</div>\n    <div className=\"w-12 h-0.5 bg-blue-600\"></div>\n  </div>\n  <div className=\"flex items-center\">\n    <div className=\"w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center justify-center\">2</div>\n    <div className=\"w-12 h-0.5 bg-gray-200\"></div>\n  </div>\n  <div className=\"flex items-center\">\n    <div className=\"w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-medium flex items-center justify-center\">3</div>\n  </div>\n</div>", detail: "Tailwind v4 step progress" },
  { label: "tw-dropdown", kind: 2, insertText: "<div className=\"relative inline-block\">\n  <button className=\"inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors\">\n    ${1:Menu}\n    <svg className=\"w-4 h-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M19 9l-7 7-7-7\" /></svg>\n  </button>\n  <div className=\"absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50\">\n    <a className=\"block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors\">$0</a>\n    <a className=\"block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors\">Option</a>\n    <hr className=\"my-1 border-gray-100\" />\n    <a className=\"block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors\">Delete</a>\n  </div>\n</div>", detail: "Tailwind v4 dropdown" },
  { label: "tw-breadcrumb", kind: 2, insertText: "<nav className=\"flex items-center gap-2 text-sm\">\n  <a className=\"text-gray-500 hover:text-gray-700 transition-colors\">${1:Home}</a>\n  <svg className=\"w-4 h-4 text-gray-400\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 5l7 7-7 7\" /></svg>\n  <a className=\"text-gray-500 hover:text-gray-700 transition-colors\">${2:Parent}</a>\n  <svg className=\"w-4 h-4 text-gray-400\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 5l7 7-7 7\" /></svg>\n  <span className=\"text-gray-900 font-medium\">$0</span>\n</nav>", detail: "Tailwind v4 breadcrumb" },
  { label: "tw-pagination", kind: 2, insertText: "<div className=\"flex items-center justify-center gap-2\">\n  <button className=\"px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors\">Previous</button>\n  <button className=\"w-9 h-9 text-sm font-medium text-white bg-blue-600 rounded-lg\">${1:1}</button>\n  <button className=\"w-9 h-9 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors\">${2:2}</button>\n  <button className=\"w-9 h-9 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors\">3</button>\n  <button className=\"px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors\">Next</button>\n</div>", detail: "Tailwind v4 pagination" },
  { label: "tw-hero", kind: 2, insertText: "<section className=\"py-24 px-4 text-center bg-gradient-to-b from-gray-50 to-white\">\n  <span className=\"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6\">${1:New feature}</span>\n  <h1 className=\"text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6\">${2:Heading}</h1>\n  <p className=\"text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed\">$0</p>\n  <div className=\"flex flex-wrap justify-center gap-4\">\n    <button className=\"px-7 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:scale-[0.97] shadow-lg shadow-blue-600/25 transition-all\">Get Started</button>\n    <button className=\"px-7 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 active:scale-[0.97] transition-all\">Learn More</button>\n  </div>\n</section>", detail: "Tailwind v4 hero" },
  { label: "tw-avatar", kind: 2, insertText: "<div className=\"flex items-center gap-3\">\n  <div className=\"w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0\">\n    ${1:JD}\n  </div>\n  <div>\n    <p className=\"text-sm font-medium text-gray-900\">${2:John Doe}</p>\n    <p className=\"text-xs text-gray-500\">${3:johndoe@email.com}</p>\n  </div>\n</div>", detail: "Tailwind v4 avatar" },
  { label: "tw-avatar-stack", kind: 2, insertText: "<div className=\"flex -space-x-2\">\n  <div className=\"w-9 h-9 rounded-full ring-2 ring-white bg-blue-500 flex items-center justify-center text-white text-xs font-semibold\">${1:A}</div>\n  <div className=\"w-9 h-9 rounded-full ring-2 ring-white bg-green-500 flex items-center justify-center text-white text-xs font-semibold\">B</div>\n  <div className=\"w-9 h-9 rounded-full ring-2 ring-white bg-purple-500 flex items-center justify-center text-white text-xs font-semibold\">C</div>\n  <div className=\"w-9 h-9 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-semibold\">+${2:3}</div>\n</div>", detail: "Tailwind v4 avatar stack" },
  { label: "tw-kbd", kind: 2, insertText: "<kbd className=\"inline-flex items-center gap-0.5 px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-200 rounded-lg text-gray-600\">\n  <span className=\"text-[10px]\">${1:\u2318}</span>${2:K}\n</kbd>", detail: "Tailwind v4 keyboard shortcut" },
  { label: "tw-divider", kind: 2, insertText: "<div className=\"relative my-8\">\n  <div className=\"absolute inset-0 flex items-center\">\n    <div className=\"w-full border-t border-gray-200\"></div>\n  </div>\n  <div className=\"relative flex justify-center\">\n    <span className=\"px-3 bg-white text-xs text-gray-500\">${1:or continue with}</span>\n  </div>\n</div>", detail: "Tailwind v4 divider with text" },
  { label: "tw-divider-simple", kind: 2, insertText: "<div className=\"w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8\"></div>", detail: "Tailwind v4 simple divider" },
  { label: "tw-container", kind: 2, insertText: "<div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">\n  $0\n</div>", detail: "Tailwind v4 container" },
  { label: "tw-section", kind: 2, insertText: "<section className=\"py-16 md:py-24 px-4\">\n  <div className=\"max-w-7xl mx-auto\">\n    <span className=\"text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2 block\">${1:Section}</span>\n    <h2 className=\"text-3xl md:text-4xl font-bold text-gray-900 mb-4\">$0</h2>\n  </div>\n</section>", detail: "Tailwind v4 section" },
  { label: "tw-flex-center", kind: 2, insertText: "<div className=\"flex items-center justify-center\">\n  $0\n</div>", detail: "Tailwind v4 flex center" },
  { label: "tw-flex-between", kind: 2, insertText: "<div className=\"flex items-center justify-between\">\n  $0\n</div>", detail: "Tailwind v4 flex between" },
  { label: "tw-grid-cols", kind: 2, insertText: "<div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${1:3} gap-${2:6}\">\n  $0\n</div>", detail: "Tailwind v4 responsive grid" },
  { label: "tw-stack-h", kind: 2, insertText: "<div className=\"flex flex-wrap items-center gap-${1:3}\">\n  $0\n</div>", detail: "Tailwind v4 horizontal stack" },
  { label: "tw-stack-v", kind: 2, insertText: "<div className=\"flex flex-col gap-${1:4}\">\n  $0\n</div>", detail: "Tailwind v4 vertical stack" },
  { label: "tw-card-grid", kind: 2, insertText: "<div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6\">\n  {[${1:1}, 2, 3, 4, 5, 6].map((item) => (\n    <div key={item} className=\"bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200\">\n      <div className=\"w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3\">\n        <span className=\"text-blue-600 font-semibold\">{item}</span>\n      </div>\n      <h3 className=\"font-semibold text-gray-900 mb-1\">Card {item}</h3>\n      <p className=\"text-sm text-gray-600\">$0</p>\n    </div>\n  ))}\n</div>", detail: "Tailwind v4 card grid" },
  { label: "tw-stats", kind: 2, insertText: "<div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">\n  <div className=\"bg-white rounded-2xl border border-gray-200 p-5 text-center\">\n    <p className=\"text-3xl font-bold text-gray-900\">${1:12}</p>\n    <p className=\"text-sm text-gray-500 mt-1\">${2:Projects}</p>\n  </div>\n  <div className=\"bg-white rounded-2xl border border-gray-200 p-5 text-center\">\n    <p className=\"text-3xl font-bold text-gray-900\">${3:48}</p>\n    <p className=\"text-sm text-gray-500 mt-1\">Tasks</p>\n  </div>\n  <div className=\"bg-white rounded-2xl border border-gray-200 p-5 text-center\">\n    <p className=\"text-3xl font-bold text-gray-900\">4.9</p>\n    <p className=\"text-sm text-gray-500 mt-1\">Rating</p>\n  </div>\n  <div className=\"bg-white rounded-2xl border border-gray-200 p-5 text-center\">\n    <p className=\"text-3xl font-bold text-gray-900\">99%</p>\n    <p className=\"text-sm text-gray-500 mt-1\">Uptime</p>\n  </div>\n</div>", detail: "Tailwind v4 stats grid" },
  { label: "tw-testimonial", kind: 2, insertText: "<div className=\"bg-white rounded-2xl border border-gray-200 p-6 max-w-md\">\n  <div className=\"flex items-center gap-1 mb-3\">\n    {[1, 2, 3, 4, 5].map((star) => (\n      <svg key={star} className=\"w-4 h-4 text-yellow-400 fill-yellow-400\" viewBox=\"0 0 24 24\"><path d=\"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\"/></svg>\n    ))}\n  </div>\n  <p className=\"text-sm text-gray-600 leading-relaxed mb-4\">\n    &ldquo;${1:Amazing product! Really streamlined our workflow and saved us hours every week.}&rdquo;\n  </p>\n  <div className=\"flex items-center gap-3\">\n    <div className=\"w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold\">${2:SK}</div>\n    <div>\n      <p className=\"text-sm font-medium text-gray-900\">${3:Sarah Kim}</p>\n      <p className=\"text-xs text-gray-500\">${4:CEO, Company}</p>\n    </div>\n  </div>\n</div>", detail: "Tailwind v4 testimonial card" },
  { label: "tw-pricing", kind: 2, insertText: "<div className=\"bg-white rounded-2xl border border-gray-200 p-6 max-w-sm\">\n  <p className=\"text-sm font-semibold text-blue-600 mb-2\">${1:Starter}</p>\n  <div className=\"flex items-baseline gap-1 mb-4\">\n    <span className=\"text-4xl font-bold text-gray-900\">$${2:19}</span>\n    <span className=\"text-gray-500\">/month</span>\n  </div>\n  <ul className=\"space-y-2.5 mb-6\">\n    <li className=\"flex items-center gap-2 text-sm text-gray-600\"><svg className=\"w-4 h-4 text-green-500 shrink-0\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M5 13l4 4L19 7\"/></svg> ${3:Feature one}</li>\n    <li className=\"flex items-center gap-2 text-sm text-gray-600\"><svg className=\"w-4 h-4 text-green-500 shrink-0\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M5 13l4 4L19 7\"/></svg> Feature two</li>\n  </ul>\n  <button className=\"w-full py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors\">Get Started</button>\n</div>", detail: "Tailwind v4 pricing card" },
  { label: "tw-empty-state", kind: 2, insertText: "<div className=\"flex flex-col items-center justify-center py-16 px-4 text-center\">\n  <div className=\"w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4\">\n    <svg className=\"w-8 h-8 text-gray-400\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={1.5} d=\"M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4\"/></svg>\n  </div>\n  <h3 className=\"text-lg font-semibold text-gray-900 mb-1\">${1:No items found}</h3>\n  <p className=\"text-sm text-gray-500 mb-6 max-w-sm\">$0</p>\n  <button className=\"px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors\">Create New</button>\n</div>", detail: "Tailwind v4 empty state" },
  { label: "tw-toast", kind: 2, insertText: "<div className=\"fixed top-4 right-4 z-50 max-w-sm animate-slide-up\">\n  <div className=\"flex items-start gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-200\">\n    <div className=\"w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5\">\n      <svg className=\"w-3 h-3 text-white\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={3} d=\"M5 13l4 4L19 7\"/></svg>\n    </div>\n    <div class=\"flex-1\">\n      <p class=\"text-sm font-medium text-gray-900\">${1:Success}</p>\n      <p class=\"text-xs text-gray-500 mt-0.5\">$0</p>\n    </div>\n    <button class=\"p-0.5 text-gray-400 hover:text-gray-600 transition-colors\">&times;</button>\n  </div>\n</div>", detail: "Tailwind v4 toast notification" },
  { label: "tw-command", kind: 2, insertText: "<div className=\"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh] z-50 p-4\">\n  <div className=\"w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden\">\n    <div className=\"flex items-center gap-3 px-4 py-3.5 border-b border-gray-100\">\n      <svg className=\"w-4 h-4 text-gray-400 shrink-0\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\"/></svg>\n      <input type=\"text\" placeholder=\"${1:Search commands...}\" className=\"flex-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none\" autoFocus />\n    </div>\n    <div className=\"p-2 max-h-72 overflow-y-auto\">\n      <div className=\"px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider\">${2:Suggestions}</div>\n      <button className=\"w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left\">\n        <svg className=\"w-4 h-4 text-gray-400\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M13 10V3L4 14h7v7l9-11h-7z\"/></svg>\n        $0\n      </button>\n    </div>\n  </div>\n</div>", detail: "Tailwind v4 command palette" },
  { label: "tw-bento-grid", kind: 2, insertText: "<div className=\"grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto\">\n  <div className=\"md:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white\">\n    <h3 className=\"text-xl font-bold mb-2\">${1:Featured}</h3>\n    <p className=\"text-white/80 text-sm\">$0</p>\n  </div>\n  <div className=\"bg-white rounded-2xl border border-gray-200 p-6\">\n    <h3 className=\"font-semibold text-gray-900\">${2:Card}</h3>\n    <p className=\"text-sm text-gray-600 mt-1\">Content</p>\n  </div>\n  <div className=\"bg-white rounded-2xl border border-gray-200 p-6\">\n    <h3 className=\"font-semibold text-gray-900\">Card</h3>\n    <p className=\"text-sm text-gray-600 mt-1\">Content</p>\n  </div>\n  <div className=\"bg-white rounded-2xl border border-gray-200 p-6\">\n    <h3 className=\"font-semibold text-gray-900\">Card</h3>\n    <p className=\"text-sm text-gray-600 mt-1\">Content</p>\n  </div>\n  <div className=\"bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white\">\n    <h3 className=\"font-semibold\">Highlight</h3>\n    <p className=\"text-white/80 text-sm mt-1\">Content</p>\n  </div>\n</div>", detail: "Tailwind v4 bento grid" },
];

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  wide: "w-full max-w-7xl",
  desktop: "w-full max-w-5xl",
  tablet: "w-[450px]",
  mobile: "w-[320px]",
};

const ACTIVITY_ITEMS: { tab: SidebarTab; icon: React.ReactNode; label: string }[] = [
  { tab: "files", icon: <FolderTree className="w-5 h-5" />, label: "Files" },
  { tab: "search", icon: <Search className="w-5 h-5" />, label: "Search" },
  { tab: "packages", icon: <Package className="w-5 h-5" />, label: "Packages" },
  { tab: "settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
];

const DEFAULT_APP_JSX = `const { useState, useEffect } = React;

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Hello React!');

  useEffect(() => {
    console.log('React Sandbox mounted successfully');
  }, []);

  return (
    <div className="app">
      <header>
        <h1>React Sandbox</h1>
        <p className="subtitle">Online React Compiler with Terminal</p>
      </header>

      <main>
        <div className="card">
          <h2>Interactive Counter</h2>
          <div className="counter">
            <button onClick={() => setCount(c => Math.max(0, c - 1))}>-</button>
            <span className="count">{count}</span>
            <button onClick={() => setCount(c => c + 1)}>+</button>
          </div>
        </div>

        <div className="card">
          <h2>Message</h2>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <p className="message">{message}</p>
        </div>

        <div className="card">
          <h2>Package Test</h2>
          <button onClick={() => alert('React Sandbox works!')}>
            Click Me
          </button>
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`;

const DEFAULT_APP_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0a0a0a;
  color: #ededed;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.app {
  max-width: 600px;
  width: 100%;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #888;
  font-size: 0.9rem;
}

main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.5rem;
}

.card h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ccc;
}

.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.counter button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #252525;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.counter button:hover {
  background: #333;
  border-color: #60a5fa;
}

.count {
  font-size: 2rem;
  font-weight: 700;
  min-width: 60px;
  text-align: center;
  color: #60a5fa;
}

input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #252525;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 0.75rem;
}

input[type="text"]:focus {
  border-color: #60a5fa;
}

.message {
  color: #a78bfa;
  font-size: 1.1rem;
  text-align: center;
  padding: 0.5rem;
}

.card button:not(.counter button) {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.card button:not(.counter button):hover {
  opacity: 0.9;
}
`;

const DEFAULT_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>React Sandbox</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

const DEFAULT_PACKAGE_JSON = `{
  "name": "react-sandbox",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`;

function makeDefaultFiles(): FileData[] {
  return [
    { id: "App.jsx", name: "App.jsx", path: "src", content: DEFAULT_APP_JSX, savedContent: DEFAULT_APP_JSX, language: "javascript" },
    { id: "App.css", name: "App.css", path: "src", content: DEFAULT_APP_CSS, savedContent: DEFAULT_APP_CSS, language: "css" },
    { id: "index.html", name: "index.html", path: "public", content: DEFAULT_INDEX_HTML, savedContent: DEFAULT_INDEX_HTML, language: "html" },
    { id: "package.json", name: "package.json", path: "", content: DEFAULT_PACKAGE_JSON, savedContent: DEFAULT_PACKAGE_JSON, language: "json" },
  ];
}

function getFilePath(file: FileData): string {
  return file.path ? `${file.path}/${file.name}` : file.name;
}

function getFileParentPath(file: FileData): string {
  return file.path || "";
}

function buildFileTree(files: FileData[], expandedFolders: Set<string>, emptyFolders: Set<string> = new Set()): TreeNode[] {
  const root: TreeNode[] = [];
  const map = new Map<string, TreeNode>();
  const seenPaths = new Set<string>();

  files.forEach(f => {
    const parts = f.path ? f.path.split("/") : [];
    let currentPath = "";
    let currentLevel = root;

    parts.forEach((part, i) => {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      seenPaths.add(currentPath);
      if (!map.has(currentPath)) {
        const node: TreeNode = {
          name: part,
          type: "folder",
          path: currentPath,
          children: [],
          expanded: expandedFolders.has(currentPath),
        };
        map.set(currentPath, node);
        currentLevel.push(node);
      }
      currentLevel = map.get(currentPath)!.children;
    });

    currentLevel.push({
      name: f.name,
      type: "file",
      path: f.path || "",
      children: [],
      fileId: f.id,
      language: f.language,
    });
  });

  emptyFolders.forEach(folderPath => {
    if (seenPaths.has(folderPath)) return;
    const parts = folderPath.split("/");
    let currentPath = "";
    let currentLevel = root;

    parts.forEach((part, i) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      if (!map.has(currentPath)) {
        const node: TreeNode = {
          name: part,
          type: "folder",
          path: currentPath,
          children: [],
          expanded: expandedFolders.has(currentPath),
        };
        map.set(currentPath, node);
        currentLevel.push(node);
      }
      currentLevel = map.get(currentPath)!.children;
    });
  });

  return root;
}

function sortTree(nodes: TreeNode[]): TreeNode[] {
  const folders = nodes.filter(n => n.type === "folder").sort((a, b) => a.name.localeCompare(b.name));
  const files = nodes.filter(n => n.type === "file").sort((a, b) => a.name.localeCompare(b.name));
  return [...folders.map(f => ({ ...f, children: sortTree(f.children) })), ...files];
}

const defaultDeps: Dependency[] = [
  { name: "react", version: "^18.2.0" },
  { name: "react-dom", version: "^18.2.0" },
];

const THEMES = {
  dark: {
    "--bg-primary": "#000000",
    "--bg-secondary": "#000000",
    "--bg-tertiary": "#111111",
    "--bg-hover": "#1a1a1a",
    "--bg-active": "#222222",
    "--bg-title": "#000000",
    "--bg-activity": "#000000",
    "--bg-card": "#111111",
    "--border": "#333333",
    "--border-light": "#111111",
    "--text-primary": "#ffffff",
    "--text-secondary": "#999999",
    "--text-highlight": "#ffffff",
    "--status-bar": "#ffffff",
    "--status-bar-text": "#000000",
    "--accent": "#3b82f6",
    "--accent-text": "#ffffff",
    "--console-bg": "#000000",
    "--console-toolbar": "#111111",
    "--problems-error": "#f48771",
    "--problems-warning": "#e9c46a",
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
    "--term-bg": "#0d1117",
    "--term-cursor": "#ffffff",
    "--term-text": "#c9d1d9",
    "--success": "#3fb950",
    "--info": "#58a6ff",
  },
  light: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#ffffff",
    "--bg-tertiary": "#f5f5f5",
    "--bg-hover": "#eeeeee",
    "--bg-active": "#e0e0e0",
    "--bg-title": "#ffffff",
    "--bg-activity": "#ffffff",
    "--bg-card": "#f5f5f5",
    "--border": "#cccccc",
    "--border-light": "#eeeeee",
    "--text-primary": "#000000",
    "--text-secondary": "#666666",
    "--text-highlight": "#000000",
    "--status-bar": "#000000",
    "--status-bar-text": "#ffffff",
    "--accent": "#4f46e5",
    "--accent-text": "#ffffff",
    "--console-bg": "#ffffff",
    "--console-toolbar": "#f5f5f5",
    "--problems-error": "#c53030",
    "--problems-warning": "#b8860b",
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
    "--term-bg": "#ffffff",
    "--term-cursor": "#000000",
    "--term-text": "#000000",
    "--success": "#16a34a",
    "--info": "#2563eb",
  },
};

function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return EXTENSION_LANGUAGE_MAP[ext] || "plaintext";
}

function getInitialSettings(): EditorSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function getStoredFiles(): FileData[] | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(FILES_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function getStoredDeps(): Dependency[] | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(DEPS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
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

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function ReactCompilerGenerator() {
  const storedFiles = getStoredFiles();
  const storedDeps = getStoredDeps();

  const [files, setFiles] = useState<FileData[]>(storedFiles || makeDefaultFiles);
  const [activeFileId, setActiveFileId] = useState("App.jsx");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [copied, setCopied] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showBottom, setShowBottom] = useState(true);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("files");
  const [bottomTab, setBottomTab] = useState<BottomTab>("console");
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [logFilter, setLogFilter] = useState<LogType | "all">("all");
  const [deps, setDeps] = useState<Dependency[]>(storedDeps || defaultDeps);
  const [installingPkg, setInstallingPkg] = useState<string | null>(null);
  const [searchPkgQuery, setSearchPkgQuery] = useState("");
  const [pkgSearchResults, setPkgSearchResults] = useState<any[]>([]);
  const [searchingPkg, setSearchingPkg] = useState(false);
  const { theme: nextTheme, setTheme: setNextTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme: "dark" | "light" = mounted && (nextTheme === "light" || resolvedTheme === "light") ? "light" : "dark";
  const setTheme = (val: "dark" | "light") => setNextTheme(val);

  const [settings, setSettings] = useState<EditorSettings>(getInitialSettings);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId?: string } | null>(null);
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFilePath, setNewFilePath] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000);
    return () => clearTimeout(timer);
  }, []);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src", "public"]));
  const [emptyFolders, setEmptyFolders] = useState<Set<string>>(new Set());
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [openFileIds, setOpenFileIds] = useState<string[]>(["App.jsx", "App.css", "index.html", "package.json"]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [terminalHistoryIndex, setTerminalHistoryIndex] = useState(-1);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "React Sandbox Terminal v1.0.0",
    "Type 'npm install <package>' to install packages",
    "Type 'help' for available commands",
    "────────────────────────────────────",
    ""
  ]);

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
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const activeFileIdRef = useRef(activeFileId);
  const pkgSearchTimerRef = useRef<any>(null);
  const compilingRef = useRef(false);

  useEffect(() => { activeFileIdRef.current = activeFileId; }, [activeFileId]);

  useEffect(() => {
    return () => {
      markerListenerRef.current?.dispose();
      cursorListenerRef.current?.dispose();
      modelListenerRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
    } catch {}
  }, [files]);

  useEffect(() => {
    try {
      localStorage.setItem(DEPS_STORAGE_KEY, JSON.stringify(deps));
    } catch {}
  }, [deps]);

  const colors = THEMES[theme];

  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const isDirty = (f: FileData) => f.content !== f.savedContent;

  const babelTransform = useCallback((code: string, filename: string): string => {
    try {
      const presets: any[] = [
        ["react", { runtime: "classic" }],
        ["env", { modules: false, targets: { browsers: "last 2 versions" } }],
      ];
      if (filename.endsWith(".tsx") || filename.endsWith(".ts")) {
        presets.push("typescript");
      }
      const result = Babel.transform(code, {
        filename,
        presets,
        plugins: [],
        sourceMaps: false,
        ast: false,
      });
      return result.code || "";
    } catch (err: any) {
      setProblems(prev => [...prev, {
        fileId: activeFileIdRef.current,
        line: 0,
        column: 0,
        message: `Babel: ${err.message}`,
        severity: "error",
      }]);
      return "";
    }
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
  }, []);

  const switchFile = useCallback((id: string) => {
    setActiveFileId(id);
    setOpenFileIds(prev => prev.includes(id) ? prev : [...prev, id]);
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

  const saveFile = useCallback((id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, savedContent: f.content } : f));
  }, []);

  const createFile = useCallback((name: string, folderPath: string = "") => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const fullName = folderPath ? `${folderPath}/${trimmed}` : trimmed;
    if (files.some(f => {
      const fPath = f.path ? `${f.path}/${f.name}` : f.name;
      return fPath === fullName;
    })) return;
    const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newFile: FileData = {
      id,
      name: trimmed,
      path: folderPath,
      content: "",
      savedContent: "",
      language: detectLanguage(trimmed),
    };
    setFiles(prev => [...prev, newFile]);
    switchFile(id);
    const parentPathParts = folderPath.split("/").filter(Boolean);
    let acc = "";
    parentPathParts.forEach(p => {
      acc = acc ? `${acc}/${p}` : p;
      setExpandedFolders(prev => new Set(prev).add(acc));
    });
    if (folderPath) {
      setEmptyFolders(prev => {
        const next = new Set(prev);
        next.delete(folderPath);
        return next;
      });
    }
    setShowNewFile(false);
    setNewFileName("");
    setCreatingFolder(false);
  }, [files, switchFile]);

  const createFolder = useCallback((folderPath: string) => {
    setShowNewFile(true);
    setCreatingFolder(true);
    setNewFilePath(folderPath);
    setNewFileName("");
    setTimeout(() => newFileInputRef.current?.focus(), 50);
  }, []);

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const getFilesInFolder = useCallback((folderPath: string): FileData[] => {
    return files.filter(f => f.path === folderPath);
  }, [files]);

  const deleteFileById = useCallback((id: string) => {
    if (files.length <= 1) return;
    const fileToDelete = files.find(f => f.id === id);
    if (!fileToDelete || ["package.json"].includes(fileToDelete.name)) return;
    const folderPath = fileToDelete.path || "";
    setFiles(prev => {
      const next = prev.filter(f => f.id !== id);
      if (folderPath && !next.some(f => f.path === folderPath)) {
        setEmptyFolders(prev2 => new Set(prev2).add(folderPath));
      }
      return next;
    });
    setOpenFileIds(prev => prev.filter(fid => fid !== id));
    if (activeFileId === id) {
      const remaining = files.filter(f => f.id !== id);
      const tabTarget = openFileIds.find(fid => fid !== id && files.some(f => f.id === fid));
      setActiveFileId(tabTarget || remaining[0]?.id || "");
    }
    setContextMenu(null);
  }, [files, activeFileId, openFileIds]);

  const moveFile = useCallback((fileId: string, targetFolderPath: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id !== fileId) return f;
      const oldPath = f.path || "";
      const newName = f.name;
      if (oldPath === targetFolderPath) return f;
      const fullName = targetFolderPath ? `${targetFolderPath}/${newName}` : newName;
      const dup = prev.some(o => o.id !== fileId && (o.path || "") === targetFolderPath && o.name === newName);
      if (dup) return f;
      return { ...f, path: targetFolderPath };
    }));
    setDragOverFolder(null);
    setEmptyFolders(prev => {
      const next = new Set(prev);
      next.delete(targetFolderPath);
      return next;
    });
  }, []);

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

  const getCompiledBundle = useCallback((currentFiles: FileData[], currentDeps: Dependency[]): string => {
    const htmlFile = currentFiles.find(f => f.name === "index.html") || currentFiles.find(f => f.name.endsWith(".html"));
    const cssFile = currentFiles.find(f => f.name === "App.css") || currentFiles.find(f => f.name.endsWith(".css") && f.name !== "index.html");
    const jsxFiles = currentFiles.filter(f => f.name.endsWith(".jsx") || f.name.endsWith(".tsx") || (f.name.endsWith(".js") && f.name !== "index.html"));

    const htmlContent = htmlFile?.content || DEFAULT_INDEX_HTML;

    const cssContent = cssFile?.content || "";

    const reactDep = currentDeps.find(d => d.name === "react");
    const reactDomDep = currentDeps.find(d => d.name === "react-dom");
    const reactVer = reactDep ? reactDep.version.replace("^", "").replace("~", "") : "18.2.0";
    const reactDomVer = reactDomDep ? reactDomDep.version.replace("^", "").replace("~", "") : "18.2.0";

    const extraPkgScripts = currentDeps
      .filter(d => d.name !== "react" && d.name !== "react-dom")
      .map(d => {
        const ver = d.version.replace("^", "").replace("~", "");
        return `<script type="module" crossorigin src="https://esm.sh/${d.name}@${ver}"><\/script>`;
      })
      .join("\n");

    const combinedJs = jsxFiles
      .map(f => {
        try {
          return babelTransform(f.content, f.name);
        } catch {
          return "";
        }
      })
      .filter(Boolean)
      .join("\n");

    const intercept = `(function(){var a=console.log,b=console.error,c=console.warn;function d(e){return Array.from(e).map(function(f){return typeof f==="object"?JSON.stringify(f,null,2):String(f)}).join(" ")}console.log=function(){parent.postMessage({type:"log",content:d(arguments)},"*");a.apply(console,arguments)};console.error=function(){parent.postMessage({type:"error",content:d(arguments)},"*");b.apply(console,arguments)};console.warn=function(){parent.postMessage({type:"warn",content:d(arguments)},"*");c.apply(console,arguments)};window.onerror=function(e,f,g){parent.postMessage({type:"error",content:e+" (line "+g+")"},"*")};window.addEventListener("unhandledrejection",function(e){parent.postMessage({type:"error",content:"Unhandled: "+(e.reason&&e.reason.message?e.reason.message:String(e.reason))},"*")})})();`;

    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1].trim() : '<div id="root"></div>';
    const titleMatch = htmlContent.match(/<title>([^<]*)<\/title>/i);
    const titleTag = titleMatch ? titleMatch[1] : "React Sandbox";

    const finalDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titleTag}</title>
<style>
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #555; }
* { scrollbar-width: thin; scrollbar-color: #888 #f1f1f1; }
${cssContent}</style>
<script src="https://cdn.tailwindcss.com"><\/script>
<script src="https://cdn.jsdelivr.net/npm/react@${reactVer}/umd/react.development.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@${reactDomVer}/umd/react-dom.development.js"><\/script>
${extraPkgScripts}
<script>${intercept}<\/script>
</head>
<body>
${bodyContent}
<script>${combinedJs}<\/script>
</body>
</html>`;

    return finalDoc;
  }, [babelTransform]);

  useEffect(() => {
    if (compilingRef.current) return;
    compilingRef.current = true;
    setIsCompiling(true);
    setProblems([]);
    const start = performance.now();
    const timeout = setTimeout(() => {
      try {
        const doc = getCompiledBundle(files, deps);
        setSrcDoc(doc);
        if (iframeRef.current) {
          iframeRef.current.srcdoc = doc;
        }
        setExecutionTime(Math.round(performance.now() - start));
      } catch (err: any) {
        setProblems(prev => [...prev, {
          fileId: activeFileIdRef.current,
          line: 0,
          column: 0,
          message: `Compilation error: ${err.message}`,
          severity: "error",
        }]);
      }
      setIsCompiling(false);
      compilingRef.current = false;
    }, 400);
    return () => {
      clearTimeout(timeout);
      compilingRef.current = false;
    };
  }, [files, deps, getCompiledBundle]);

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

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const executeTerminalCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const addLine = (line: string) => setTerminalLines(prev => [...prev, line]);

    addLine(`$ ${trimmed}`);

    if (trimmed === "clear") {
      setTerminalLines([]);
      return;
    }

    if (trimmed === "help") {
      addLine("  Available commands:");
      addLine("    npm install <pkg>[@<version>]  Install a package");
      addLine("    npm uninstall <pkg>            Remove a package");
      addLine("    npm list                       List installed packages");
      addLine("    npm start                      Recompile the project");
      addLine("    clear                          Clear terminal");
      addLine("    help                           Show this help");
      addLine("    echo <text>                    Print text");
      addLine("    ls                             List project files");
      return;
    }

    if (trimmed.startsWith("echo ")) {
      addLine(trimmed.slice(5));
      return;
    }

    if (trimmed === "ls") {
      files.forEach(f => addLine(`  ${f.name}`));
      return;
    }

    if (trimmed === "npm list" || trimmed === "npm ls") {
      if (deps.length === 0) {
        addLine("  No dependencies installed");
      } else {
        deps.forEach(d => addLine(`  ${d.name}@${d.version}`));
      }
      return;
    }

    if (trimmed === "npm start") {
      addLine("  Compiling...");
      return;
    }

    if (trimmed.startsWith("npm install ")) {
      const pkgSpec = trimmed.slice("npm install ".length).trim();
      const match = pkgSpec.match(/^(@?[^@]+)(?:@(.+))?$/);
      if (!match) {
        addLine(`  Error: Invalid package name "${pkgSpec}"`);
        return;
      }
      const pkgName = match[1];
      const pkgVersion = match[2] || "latest";
      handleInstallPackage(pkgName, pkgVersion, addLine);
      return;
    }

    if (trimmed.startsWith("npm uninstall ") || trimmed.startsWith("npm remove ")) {
      const pkgName = trimmed.replace(/^npm (uninstall|remove) /, "").trim();
      setDeps(prev => prev.filter(d => d.name !== pkgName));
      updatePackageJsonInFiles(pkgName, true);
      addLine(`  Removed ${pkgName}`);
      return;
    }

    addLine(`  Command not found: ${trimmed}. Type 'help' for available commands.`);
  }, [deps, files]);

  const handleInstallPackage = useCallback(async (pkgName: string, version: string, addLine: (line: string) => void) => {
    setInstallingPkg(pkgName);
    addLine(`  Resolving ${pkgName}@${version}...`);

    try {
      const ver = version === "latest" ? "latest" : version;
      const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkgName)}/${ver}`);
      if (!res.ok) {
        addLine(`  Error: Package "${pkgName}${ver === 'latest' ? '' : '@' + ver}" not found`);
        setInstallingPkg(null);
        return;
      }
      const data = await res.json();
      const resolvedVersion = data.version;

      setDeps(prev => {
        const existing = prev.find(d => d.name === pkgName);
        if (existing) {
          return prev.map(d => d.name === pkgName ? { ...d, version: `^${ver}` } : d);
        }
        return [...prev, { name: pkgName, version: `^${ver}` }];
      });

      updatePackageJsonInFiles(pkgName, false);
      addLine(`  Installed ${pkgName}@${ver} (resolved from npm registry)`);
      addLine(`  Package will be loaded via esm.sh CDN at runtime`);
    } catch (err: any) {
      addLine(`  Error installing ${pkgName}: ${err.message}`);
    }
    setInstallingPkg(null);
  }, []);

  const updatePackageJsonInFiles = useCallback((pkgName: string, isRemove: boolean) => {
    setFiles(prev => prev.map(f => {
      if (f.name !== "package.json") return f;
      try {
        const pkg = JSON.parse(f.content);
        if (!pkg.dependencies) pkg.dependencies = {};
        if (isRemove) {
          delete pkg.dependencies[pkgName];
        } else {
          const existingDep = deps.find(d => d.name === pkgName);
          if (existingDep) {
            pkg.dependencies[pkgName] = existingDep.version;
          }
        }
        const newContent = JSON.stringify(pkg, null, 2);
        return { ...f, content: newContent, savedContent: newContent };
      } catch {
        return f;
      }
    }));
  }, [deps]);

  useEffect(() => {
    const allDepNames = deps.map(d => d.name);
    setFiles(prev => prev.map(f => {
      if (f.name !== "package.json") return f;
      try {
        const pkg = JSON.parse(f.content);
        if (!pkg.dependencies) pkg.dependencies = {};
        let changed = false;
        deps.forEach(d => {
          if (pkg.dependencies[d.name] !== d.version) {
            pkg.dependencies[d.name] = d.version;
            changed = true;
          }
        });
        Object.keys(pkg.dependencies).forEach(k => {
          if (!allDepNames.includes(k)) {
            delete pkg.dependencies[k];
            changed = true;
          }
        });
        if (changed) {
          const newContent = JSON.stringify(pkg, null, 2);
          return { ...f, content: newContent, savedContent: newContent };
        }
        return f;
      } catch {
        return f;
      }
    }));
  }, [deps]);

  const searchNpmPackages = useCallback(async (query: string) => {
    if (!query.trim()) {
      setPkgSearchResults([]);
      return;
    }
    setSearchingPkg(true);
    try {
      const res = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=10`);
      if (res.ok) {
        const data = await res.json();
        setPkgSearchResults(data.objects || []);
      }
    } catch {}
    setSearchingPkg(false);
  }, []);

  useEffect(() => {
    if (pkgSearchTimerRef.current) clearTimeout(pkgSearchTimerRef.current);
    pkgSearchTimerRef.current = setTimeout(() => {
      searchNpmPackages(searchPkgQuery);
    }, 400);
    return () => {
      if (pkgSearchTimerRef.current) clearTimeout(pkgSearchTimerRef.current);
    };
  }, [searchPkgQuery, searchNpmPackages]);

  const addPackage = useCallback((pkgName: string, version: string) => {
    setDeps(prev => {
      if (prev.find(d => d.name === pkgName)) return prev;
      return [...prev, { name: pkgName, version: `^${version}` }];
    });
    setTerminalLines(prev => [...prev, `$ npm install ${pkgName}`, `  Installed ${pkgName}@${version}`]);
    setSearchPkgQuery("");
    setPkgSearchResults([]);
  }, []);

  const removePackage = useCallback((pkgName: string) => {
    setDeps(prev => prev.filter(d => d.name !== pkgName));
    setTerminalLines(prev => [...prev, `$ npm uninstall ${pkgName}`, `  Removed ${pkgName}`]);
  }, []);

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
        setShowBottom(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        if (activeFile) deleteFileById(activeFile.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showCommandPalette, activeFile, settings.formatOnSave, deleteFileById, saveFile]);

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

      emmetHTML(monaco);
      emmetCSS(monaco);
      emmetJSX(monaco);

      monaco.languages.registerCompletionItemProvider("javascript", {
        triggerCharacters: [".", "/", "<"],
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return { suggestions: [...REACT_SNIPPETS, ...TAILWIND_COMPONENT_SNIPPETS].map(s => ({ ...s, range })) };
        }
      });

      monaco.languages.registerCompletionItemProvider("typescript", {
        triggerCharacters: [".", "/", "<"],
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return { suggestions: [...REACT_SNIPPETS, ...TAILWIND_COMPONENT_SNIPPETS].map(s => ({ ...s, range })) };
        }
      });

      monaco.languages.registerCompletionItemProvider("css", {
        triggerCharacters: ["-", ":"],
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          const textBefore = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });
          if (textBefore.includes("@apply")) {
            return { suggestions: TAILWIND_CLASSES.map(c => ({
              label: c,
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: c,
              range,
              documentation: `Tailwind: ${c}`,
            })) };
          }
          return { suggestions: TAILWIND_CSS_SNIPPETS.map(s => ({ ...s, range })) };
        }
      });

      monaco.languages.registerCompletionItemProvider("html", {
        triggerCharacters: [" ", "\"", "'", "."],
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          const textBefore = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: Math.max(1, position.column - 50),
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });
          const inClassAttr = /class(Name)?=["'][^"']*$/i.test(textBefore);
          if (inClassAttr) {
            return { suggestions: TAILWIND_CLASSES.map(c => ({
              label: c,
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: c,
              range,
              documentation: `Tailwind: ${c}`,
            })) };
          }
          return { suggestions: [] };
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

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" || resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [theme, resolvedTheme, setTheme]);

  const downloadZip = useCallback(async () => {
    const zip = new JSZip();
    files.forEach(f => zip.file(f.name, f.content));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "react-sandbox.zip");
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
    setDeps(defaultDeps);
    setActiveFileId("App.jsx");
    setOpenFileIds(["App.jsx", "App.css", "index.html", "package.json"]);
    setTerminalLines([
      "React Sandbox Terminal v1.0.0",
      "Type 'npm install <package>' to install packages",
      "Type 'help' for available commands",
      "────────────────────────────────────",
      ""
    ]);
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

  const commands: CommandItem[] = useMemo(() => [
    { id: "format", label: "Format Code", shortcut: "Ctrl+S", action: () => { formatCode(); if (activeFile) saveFile(activeFile.id); } },
    { id: "toggle-sidebar", label: "Toggle Sidebar", shortcut: "Ctrl+B", action: () => setShowSidebar(p => !p) },
    { id: "toggle-console", label: "Toggle Terminal", shortcut: "Ctrl+`", action: () => setShowBottom(p => !p) },
    { id: "create-file", label: "Create New File", shortcut: "", action: () => { setShowNewFile(true); setShowCommandPalette(false); setTimeout(() => newFileInputRef.current?.focus(), 50); } },
    { id: "download-zip", label: "Download Project as ZIP", shortcut: "", action: () => { downloadZip(); setShowCommandPalette(false); } },
    { id: "reset", label: "Reset Workspace", shortcut: "", action: () => { resetCode(); setShowCommandPalette(false); } },
    { id: "open-preview", label: "Open Preview in New Tab", shortcut: "", action: () => { openPreview(); setShowCommandPalette(false); } },
    ...files.map(f => ({
      id: `switch-${f.id}`,
      label: `Switch to ${f.name}`,
      shortcut: "",
      action: () => { switchFile(f.id); setShowCommandPalette(false); },
    })),
    { id: "theme", label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`, shortcut: "", action: () => { toggleTheme(); setShowCommandPalette(false); } },
  ], [formatCode, saveFile, activeFile, downloadZip, resetCode, openPreview, switchFile, files, toggleTheme, theme]);

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

  const filteredLogs = logFilter === "all" ? logs : logs.filter(l => l.type === logFilter);

  const isProtectedFile = (name: string) =>
    name === "package.json";

  const handleTerminalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = terminalInput.trim();
      if (cmd) {
        setTerminalHistory(prev => {
          const next = [cmd, ...prev.filter(c => c !== cmd)].slice(0, 50);
          return next;
        });
      }
      setTerminalHistoryIndex(-1);
      executeTerminalCommand(terminalInput);
      setTerminalInput("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (terminalHistory.length === 0) return;
      const newIdx = terminalHistoryIndex < terminalHistory.length - 1
        ? terminalHistoryIndex + 1
        : 0;
      setTerminalHistoryIndex(newIdx);
      setTerminalInput(terminalHistory[newIdx]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (terminalHistory.length === 0) return;
      const newIdx = terminalHistoryIndex < terminalHistory.length - 1
        ? terminalHistoryIndex + 1
        : terminalHistory.length - 1;
      setTerminalHistoryIndex(newIdx);
      setTerminalInput(terminalHistory[newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (terminalHistoryIndex <= 0) {
        setTerminalHistoryIndex(-1);
        setTerminalInput("");
      } else {
        const newIdx = terminalHistoryIndex - 1;
        setTerminalHistoryIndex(newIdx);
        setTerminalInput(terminalHistory[newIdx]);
      }
    }
  }, [terminalInput, executeTerminalCommand, terminalHistory, terminalHistoryIndex]);

  if (loading) return <CompilerLoading />;

  return (
    <>
      <div
        className="rc-compiler-root h-screen flex flex-col overflow-hidden select-none"
        style={colors as React.CSSProperties}
        onClick={closeContextMenu}
      >
        <style>{`
          .rc-compiler-root ::-webkit-scrollbar { width: 6px; height: 6px; }
          .rc-compiler-root ::-webkit-scrollbar-track { background: transparent; }
          .rc-compiler-root ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 9999px; }
          .rc-compiler-root ::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-hover); }
          .rc-compiler-root * { scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb) transparent; }
          .rc-compiler-root .tab-bar::-webkit-scrollbar { height: 3px; }
          .rc-compiler-root input::placeholder { color: var(--input-placeholder); opacity: 1; }
          .rc-compiler-root .term-input::placeholder { color: var(--term-text); opacity: 0.35; }
        `}</style>
        <div className="flex items-center justify-between px-4 h-9 bg-[var(--bg-title)] border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-highlight)] transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back
            </Link>
            <span className="w-px h-4 bg-[var(--border)]" />
            <Cpu className="w-3.5 h-3.5 text-[var(--text-highlight)]" />
            <span className="text-xs font-medium text-[var(--text-primary)]">React Sandbox</span>
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

        <div className="flex-1 flex min-h-0">
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

          {showSidebar && (
            <div className="w-60 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)] shrink-0 z-10">
              <div className="flex items-center justify-between px-4 h-9 border-b border-[var(--border)]">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  {sidebarTab === "files" ? "Explorer" : sidebarTab === "search" ? "Search" : sidebarTab === "packages" ? "Packages" : "Settings"}
                </span>
                <button onClick={() => setShowSidebar(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {sidebarTab === "files" && (
                <div className="flex-1 overflow-y-auto py-1 text-sm custom-scrollbar">
                  <div className="flex items-center justify-between px-4 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                    <span>Workspace</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => { setCreatingFolder(true); setShowNewFile(true); setNewFilePath(""); setNewFileName(""); setTimeout(() => newFileInputRef.current?.focus(), 50); }}
                        className="p-0.5 rounded hover:bg-[var(--bg-hover)] transition-colors"
                        title="New Folder"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setCreatingFolder(false); setShowNewFile(true); setNewFilePath(""); setNewFileName(""); setTimeout(() => newFileInputRef.current?.focus(), 50); }}
                        className="p-0.5 rounded hover:bg-[var(--bg-hover)] transition-colors"
                        title="New File"
                      >
                        <FilePlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const tree = sortTree(buildFileTree(files, expandedFolders, emptyFolders));
                    return renderTreeNodes(tree, {
                      activeFileId,
                      expandedFolders,
                      renamingFileId,
                      renameValue,
                      renameInputRef,
                      onToggleFolder: toggleFolder,
                      onSwitchFile: switchFile,
                      onContextMenu: handleContextMenu,
                      onRename: startRename,
                      onCommitRename: commitRename,
                      onRenameChange: setRenameValue,
                      onRenameCancel: () => setRenamingFileId(null),
                      isProtectedFile,
                      isDirty,
                      getFileIcon,
                      onNewFileInFolder: (folderPath: string) => {
                        setCreatingFolder(false);
                        setNewFilePath(folderPath);
                        setShowNewFile(true);
                        setNewFileName("");
                        setTimeout(() => newFileInputRef.current?.focus(), 50);
                      },
                      onNewFolderInFolder: (folderPath: string) => {
                        setCreatingFolder(true);
                        setNewFilePath(folderPath);
                        setShowNewFile(true);
                        setNewFileName("");
                        setTimeout(() => newFileInputRef.current?.focus(), 50);
                      },
                      onMoveFile: moveFile,
                      dragOverFolder,
                      onDragOverFolder: setDragOverFolder,
                    });
                  })()}

                  {showNewFile && (
                    <div className="flex items-center gap-1 px-4 py-0.5" style={{ paddingLeft: newFilePath ? `${12 + newFilePath.split("/").length * 12}px` : "16px" }}>
                      {creatingFolder ? (
                        <FolderPlus className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                      ) : (
                        <File className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                      )}
                      <input
                        ref={newFileInputRef}
                        type="text"
                        value={newFileName}
                        onChange={e => setNewFileName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            if (creatingFolder) {
                              const trimmed = newFileName.trim();
                              if (trimmed) {
                                const folderPath = newFilePath ? `${newFilePath}/${trimmed}` : trimmed;
                                setExpandedFolders(prev => new Set(prev).add(folderPath));
                                setEmptyFolders(prev => new Set(prev).add(folderPath));
                              }
                              setShowNewFile(false);
                              setNewFileName("");
                              setCreatingFolder(false);
                            } else {
                              createFile(newFileName, newFilePath);
                            }
                          }
                          if (e.key === "Escape") { setShowNewFile(false); setNewFileName(""); setCreatingFolder(false); }
                        }}
                        placeholder={creatingFolder ? "folder-name" : "filename.ext"}
                        className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] text-[13px] px-1.5 py-0.5 rounded border border-[var(--border)] outline-none placeholder:text-[var(--input-placeholder)]"
                        style={{ background: "var(--input-bg)", color: "var(--input-text)" }}
                        autoFocus
                      />
                      <button onClick={() => { setShowNewFile(false); setNewFileName(""); setCreatingFolder(false); }} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)]">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {sidebarTab === "search" && (
                <SearchSidebar
                  files={files}
                  activeFileId={activeFileId}
                  onSwitchFile={switchFile}
                />
              )}

              {sidebarTab === "packages" && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-2">
                    <div className="flex items-center gap-2 bg-[var(--input-bg)] rounded border border-[var(--border)] px-2 py-1.5" style={{ background: "var(--input-bg)" }}>
                      <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
                      <input
                        type="text"
                        value={searchPkgQuery}
                        onChange={e => setSearchPkgQuery(e.target.value)}
                        placeholder="Search npm packages..."
                        className="flex-1 bg-transparent text-[var(--input-text)] text-[13px] outline-none border-none placeholder:text-[var(--input-placeholder)]"
                      />
                      {searchPkgQuery && (
                        <button onClick={() => { setSearchPkgQuery(""); setPkgSearchResults([]); }} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)]">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto text-[13px] custom-scrollbar">
                    {searchPkgQuery ? (
                      <>
                        <div className="px-4 py-1 text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
                          {searchingPkg ? "Searching..." : `${pkgSearchResults.length} results`}
                        </div>
                        {pkgSearchResults.map((pkg: any) => (
                          <div
                            key={pkg.package.name}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            <Package className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] text-[var(--text-primary)] truncate">{pkg.package.name}</div>
                              <div className="text-[11px] text-[var(--text-secondary)] truncate">{pkg.package.description || "No description"}</div>
                            </div>
                            <div className="text-[11px] text-[var(--text-secondary)] shrink-0">{pkg.package.version}</div>
                            <button
                              onClick={() => addPackage(pkg.package.name, pkg.package.version)}
                              disabled={deps.some(d => d.name === pkg.package.name)}
                              className={cn(
                                "p-1 rounded transition-colors shrink-0",
                                deps.some(d => d.name === pkg.package.name)
                                  ? "text-[var(--success)] cursor-default"
                                  : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)]"
                              )}
                              title={deps.some(d => d.name === pkg.package.name) ? "Already installed" : "Install"}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {!searchingPkg && pkgSearchResults.length === 0 && (
                          <div className="px-4 py-8 text-center text-[var(--text-secondary)] text-xs">No packages found</div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-1 text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
                          Installed ({deps.length})
                        </div>
                        {deps.map((dep) => (
                          <div
                            key={dep.name}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] transition-colors group"
                          >
                            <Package className="w-3.5 h-3.5 text-[var(--info)] shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] text-[var(--text-primary)]">{dep.name}</div>
                              <div className="text-[11px] text-[var(--text-secondary)]">{dep.version}</div>
                            </div>
                            {dep.name !== "react" && dep.name !== "react-dom" && (
                              <button
                                onClick={() => removePackage(dep.name)}
                                className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-danger)] hover:bg-[var(--bg-hover)] transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                                title="Remove"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {sidebarTab === "settings" && (
                <div className="flex-1 p-4 space-y-4 text-xs overflow-y-auto custom-scrollbar">
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

          <div className="flex-1 flex min-h-0">
            <div className={cn("flex flex-col min-h-0", "flex-1")}>
              <div className="tab-bar flex items-center bg-[var(--bg-secondary)] border-b border-[var(--border)] shrink-0 overflow-x-auto" style={{'--scrollbar-h':'3px'} as React.CSSProperties}>
                {openFileIds.map((fid) => {
                  const file = files.find(f => f.id === fid);
                  if (!file) return null;
                  return (
                    <div
                      key={file.id}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-[13px] border-r border-[var(--border)] transition-colors cursor-pointer relative group",
                        activeFileId === file.id
                          ? "bg-[var(--tab-active-bg)] text-[var(--text-highlight)]"
                          : "bg-[var(--tab-inactive-bg)] text-[var(--text-secondary)] hover:text-[var(--text-highlight)]"
                      )}
                      onClick={() => switchFile(file.id)}
                      onContextMenu={e => {
                        if (!isProtectedFile(file.name)) handleContextMenu(e, file.id);
                      }}
                    >
                      {getFileIcon(file.name, "w-3.5 h-3.5")}
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      {isDirty(file) && (
                        <span className="w-2 h-2 rounded-full bg-[var(--text-highlight)] shrink-0" />
                      )}
                      {openFileIds.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); closeFileTab(file.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-secondary)] hover:text-[var(--text-highlight)] ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
                <div className="flex-1 bg-[var(--bg-secondary)]" />
              </div>

              <div className="flex-1 min-h-0">
                <MonacoEditor
                  key={theme}
                  height="100%"
                  language={activeFile?.language || "javascript"}
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

            <div className="w-[50%] min-w-[300px] flex flex-col border-l border-[var(--border)] bg-[var(--preview-bg)]">
              <div className="flex items-center justify-between px-3 h-8 bg-[var(--bg-tertiary)] border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Preview</span>
                  {executionTime !== null && (
                    <span className="text-[10px] text-[var(--text-secondary)] ml-2 opacity-60">{formatTime(executionTime)}</span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => setViewport("wide")} className={cn("p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors", viewport === "wide" && "text-[var(--text-highlight)] bg-[var(--bg-hover)]")} title="Wide"><Monitor className="w-3 h-3" /></button>
                  <button onClick={() => setViewport("desktop")} className={cn("p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors", viewport === "desktop" && "text-[var(--text-highlight)] bg-[var(--bg-hover)]")} title="Desktop"><Monitor className="w-3 h-3" /></button>
                  <button onClick={() => setViewport("tablet")} className={cn("p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors", viewport === "tablet" && "text-[var(--text-highlight)] bg-[var(--bg-hover)]")} title="Tablet"><Tablet className="w-3 h-3" /></button>
                  <button onClick={() => setViewport("mobile")} className={cn("p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors", viewport === "mobile" && "text-[var(--text-highlight)] bg-[var(--bg-hover)]")} title="Mobile"><Smartphone className="w-3 h-3" /></button>
                  <span className="w-px h-3 bg-[var(--border)] mx-1" />
                  <button onClick={openPreview} className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)] transition-colors" title="Open in new tab"><Maximize2 className="w-3 h-3" /></button>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center bg-[var(--preview-bg)] min-h-0 relative overflow-hidden custom-scrollbar">
                <div className={cn("h-full w-full flex flex-col overflow-hidden", VIEWPORT_WIDTHS[viewport])}>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] border-b border-[var(--border)] shrink-0 rounded-t">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="bg-[var(--bg-active)] rounded h-4 flex items-center px-3 border border-[var(--border)] text-[9px] text-[var(--text-secondary)] truncate max-w-[200px]">
                        localhost:3000/react-sandbox
                      </div>
                    </div>
                  </div>
                  <iframe
                    ref={iframeRef}
                    title="React Preview"
                    className="flex-1 w-full border-none bg-white"
                    sandbox="allow-scripts"
                  />
                </div>
                {isCompiling && (
                  <div className="absolute inset-0 bg-[var(--overlay-bg)] flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Cpu className="w-4 h-4 animate-pulse" />
                      Compiling with Babel...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 h-5 bg-[var(--status-bar)] shrink-0 z-10 text-[10px]" style={{ color: "var(--status-bar-text)" }}>
          <div className="flex items-center gap-3" style={{ color: "var(--status-bar-text)" }}>
            <span>Ln {cursorPos.line}, Col {cursorPos.column}</span>
            <span className="w-px h-2.5" style={{ backgroundColor: "color-mix(in srgb, var(--status-bar-text) 25%, transparent)" }} />
            <span>UTF-8</span>
            <span className="w-px h-2.5" style={{ backgroundColor: "color-mix(in srgb, var(--status-bar-text) 25%, transparent)" }} />
            <span>{activeFile?.language || ""}</span>
            <span className="w-px h-2.5" style={{ backgroundColor: "color-mix(in srgb, var(--status-bar-text) 25%, transparent)" }} />
            <span className="flex items-center gap-1">
              <span className={cn("w-1.5 h-1.5 rounded-full", isCompiling ? "bg-yellow-300 animate-pulse" : "bg-current")} />
              {isCompiling ? "Compiling..." : activeFile && isDirty(activeFile) ? "Unsaved" : "Ready"}
            </span>
            <span className="w-px h-2.5" style={{ backgroundColor: "color-mix(in srgb, var(--status-bar-text) 25%, transparent)" }} />
            <span className="flex items-center gap-1">
              <Package className="w-2.5 h-2.5" />
              {deps.length} deps
            </span>
          </div>
          <div className="flex items-center gap-2" style={{ color: "var(--status-bar-text)" }}>
            {executionTime !== null && <span>Compiled: {formatTime(executionTime)}</span>}
            <button
              onClick={() => { setBottomTab("terminal"); setShowBottom(true); }}
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors",
                bottomTab === "terminal" && showBottom ? "opacity-100" : "opacity-70 hover:opacity-100"
              )}
              style={bottomTab === "terminal" && showBottom ? { backgroundColor: "color-mix(in srgb, var(--status-bar-text) 15%, transparent)" } : {}}
            >
              <Terminal className="w-2.5 h-2.5" />
              Terminal
            </button>
            <button
              onClick={() => { setBottomTab("console"); setShowBottom(true); }}
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors",
                bottomTab === "console" && showBottom ? "opacity-100" : "opacity-70 hover:opacity-100"
              )}
              style={bottomTab === "console" && showBottom ? { backgroundColor: "color-mix(in srgb, var(--status-bar-text) 15%, transparent)" } : {}}
            >
              <Box className="w-2.5 h-2.5" />
              Console
              {logs.length > 0 && (
                <span className="text-[9px] px-1 rounded" style={{ backgroundColor: "color-mix(in srgb, var(--status-bar-text) 20%, transparent)" }}>{logs.length}</span>
              )}
            </button>
            <button
              onClick={() => { setBottomTab("problems"); setShowBottom(true); }}
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors",
                bottomTab === "problems" && showBottom ? "opacity-100" : "opacity-70 hover:opacity-100"
              )}
              style={bottomTab === "problems" && showBottom ? { backgroundColor: "color-mix(in srgb, var(--status-bar-text) 15%, transparent)" } : {}}
            >
              <AlertCircle className="w-2.5 h-2.5" />
              Problems
              {problems.length > 0 && (
                <span className="text-[9px] px-1 rounded" style={{ backgroundColor: "color-mix(in srgb, var(--status-bar-text) 20%, transparent)" }}>{problems.length}</span>
              )}
            </button>
            <button
              onClick={() => setShowBottom(prev => !prev)}
              className="flex items-center gap-1 px-1 py-0.5 rounded hover:opacity-70 transition-opacity"
            >
              {showBottom ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronUp className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>

        {showBottom && (
          <div
            className="flex flex-col bg-[var(--bg-secondary)] border-t border-[var(--border)] shrink-0 z-10"
            style={{ height: `${bottomPanelHeight}px`, minHeight: "120px", maxHeight: "60vh" }}
          >
            <div
              className="h-1.5 cursor-ns-resize shrink-0 hover:bg-[var(--text-highlight)]/20 transition-colors relative -mt-px"
              onMouseDown={(e) => {
                e.preventDefault();
                const startY = e.clientY;
                const startH = bottomPanelHeight;
                const onMove = (ev: MouseEvent) => {
                  const delta = startY - ev.clientY;
                  const newH = Math.min(Math.max(startH + delta, 120), window.innerHeight * 0.6);
                  setBottomPanelHeight(newH);
                };
                const onUp = () => {
                  window.removeEventListener("mousemove", onMove);
                  window.removeEventListener("mouseup", onUp);
                };
                window.addEventListener("mousemove", onMove);
                window.addEventListener("mouseup", onUp);
              }}
            />
            <div className="flex items-center justify-between px-4 h-8 bg-[var(--console-toolbar)] border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBottomTab("terminal")}
                  className={cn("px-3 py-1 text-[11px] font-medium rounded-t transition-colors", bottomTab === "terminal" ? "text-[var(--text-highlight)] bg-[var(--bg-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)]")}
                >
                  <Terminal className="w-3 h-3 inline mr-1" />
                  Terminal
                </button>
                <button
                  onClick={() => setBottomTab("console")}
                  className={cn("px-3 py-1 text-[11px] font-medium rounded-t transition-colors", bottomTab === "console" ? "text-[var(--text-highlight)] bg-[var(--bg-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)]")}
                >
                  <Box className="w-3 h-3 inline mr-1" />
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
              <button onClick={() => setShowBottom(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)] transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>

            {bottomTab === "terminal" && (
              <div className="flex-1 flex flex-col font-mono min-h-0" style={{ backgroundColor: "#0d1117", "--term-bg": "#0d1117", "--term-text": "#c9d1d9", "--term-cursor": "#c9d1d9", "--border": "#21262d", "--success": "#3fb950", "--text-danger": "#f85149", "--info": "#58a6ff" } as React.CSSProperties}>
                <div
                  className="flex items-center justify-between px-3 h-7 shrink-0 select-none"
                  style={{ backgroundColor: "var(--term-bg)", borderBottom: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 px-2 py-0.5 text-[11px]" style={{ color: "var(--term-text)" }}>
                      <Terminal className="w-3 h-3" />
                      <span className="font-medium">TERMINAL</span>
                    </div>
                    <span className="w-px h-3.5" style={{ backgroundColor: "var(--border)" }} />
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 text-[11px] rounded cursor-pointer"
                      style={{
                        color: "var(--term-text)",
                        backgroundColor: "color-mix(in srgb, var(--term-text) 10%, transparent)",
                      }}
                    >
                      <Terminal className="w-2.5 h-2.5" />
                      <span>bash</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => {
                        setTerminalLines(prev => [...prev, "", "─".repeat(40), "New terminal session", "─".repeat(40), ""]);
                        setTerminalInput("");
                      }}
                      className="w-6 h-6 flex items-center justify-center rounded text-[11px] transition-colors"
                      style={{ color: "var(--term-text)" }}
                      title="New Terminal"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>

                <div
                  ref={terminalScrollRef}
                  className="flex-1 overflow-y-auto custom-scrollbar term-scrollbar"
                  style={{
                    color: "var(--term-text)",
                    padding: "8px 16px",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  {terminalLines.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-all" style={{ minHeight: "18px" }}>
                      {line.startsWith("$ ") ? (
                        <span>
                          <span style={{ color: "var(--success)", userSelect: "none" }}>$ </span>
                          <span>{line.slice(2)}</span>
                        </span>
                      ) : line.startsWith("  Error") ? (
                        <span style={{ color: "var(--text-danger)" }}>{line}</span>
                      ) : line.startsWith("  Installed") || line.startsWith("  Removed") ? (
                        <span style={{ color: "var(--success)" }}>{line}</span>
                      ) : line.startsWith("  Resolving") || line.startsWith("  Package") ? (
                        <span style={{ color: "var(--info)" }}>{line}</span>
                      ) : (
                        <span style={{ opacity: line.startsWith("─") ? 0.4 : 0.85 }}>{line}</span>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5" style={{ minHeight: "20px" }}>
                    <span style={{ color: "var(--success)", userSelect: "none", fontSize: "13px" }}>$</span>
                    <span style={{ color: "var(--term-text)", fontSize: "13px" }}>
                      {terminalInput || "\u00A0"}
                    </span>
                    <span
                      className="animate-pulse"
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "15px",
                        backgroundColor: "var(--term-cursor)",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 px-3 py-1.5 shrink-0 border-t select-none"
                  style={{
                    backgroundColor: "var(--term-bg)",
                    borderColor: "var(--border)",
                  }}
                >
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={terminalInput}
                    onChange={e => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalKeyDown}
                    placeholder="npm install <package> or type help"
                    className="flex-1 border-none outline-none text-[13px] font-mono min-w-0"
                    style={{
                      background: "transparent",
                      color: "var(--term-text)",
                      caretColor: "var(--term-cursor)",
                    }}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                  {installingPkg && (
                    <span className="text-[11px] flex items-center gap-1 shrink-0" style={{ color: "var(--text-secondary)" }}>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Installing {installingPkg}...
                    </span>
                  )}
                </div>
              </div>
            )}

            {bottomTab === "console" && (
              <>
                <div className="flex items-center gap-2 px-4 py-1 bg-[var(--console-toolbar)] border-b border-[var(--border)] shrink-0">
                  <div className="flex items-center gap-1">
                    {([
                      { id: "all" as const, label: "All" },
                      { id: "log" as const, label: "Log" },
                      { id: "warn" as const, label: "Warn" },
                      { id: "error" as const, label: "Error" },
                    ]).map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => setLogFilter(id)}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] uppercase tracking-wide transition-colors",
                          logFilter === id ? "bg-[var(--accent)] text-[var(--accent-text)]" : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)]"
                        )}
                      >
                        {label}
                        {id !== "all" && (
                          <span className="ml-1 opacity-60">{logs.filter(l => l.type === id).length}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1" />
                  <button onClick={clearConsole} className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-highlight)] transition-colors flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div ref={consoleRef} className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed space-y-1 bg-[var(--console-bg)] custom-scrollbar">
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

            {bottomTab === "problems" && (
              <div className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed space-y-1 bg-[var(--console-bg)] custom-scrollbar">
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

        {contextMenu && (
          <div
            className="fixed z-50 w-44 bg-[var(--bg-secondary)] border border-[var(--border)] rounded shadow-xl py-1 text-sm"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => { setCreatingFolder(false); setShowNewFile(true); setNewFilePath(""); setNewFileName(""); setContextMenu(null); setTimeout(() => newFileInputRef.current?.focus(), 50); }}
              className="w-full flex items-center gap-2 px-4 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors text-left"
            >
              <FilePlus className="w-4 h-4" />
              New File
            </button>
            <button
              onClick={() => { setCreatingFolder(true); setShowNewFile(true); setNewFilePath(""); setNewFileName(""); setContextMenu(null); setTimeout(() => newFileInputRef.current?.focus(), 50); }}
              className="w-full flex items-center gap-2 px-4 py-1.5 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors text-left"
            >
              <FolderPlus className="w-4 h-4" />
              New Folder
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
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
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
      <div className="flex-1 overflow-y-auto text-[13px] custom-scrollbar">
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

interface TreeRenderProps {
  activeFileId: string;
  expandedFolders: Set<string>;
  renamingFileId: string | null;
  renameValue: string;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  onToggleFolder: (path: string) => void;
  onSwitchFile: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, fileId?: string) => void;
  onRename: (id: string) => void;
  onCommitRename: () => void;
  onRenameChange: (val: string) => void;
  onRenameCancel: () => void;
  isProtectedFile: (name: string) => boolean;
  isDirty: (file: any) => boolean;
  getFileIcon: (name: string, className?: string) => React.ReactNode;
  onNewFileInFolder: (folderPath: string) => void;
  onNewFolderInFolder: (folderPath: string) => void;
  onMoveFile: (fileId: string, targetFolderPath: string) => void;
  dragOverFolder: string | null;
  onDragOverFolder: (path: string | null) => void;
}

function renderTreeNodes(nodes: TreeNode[], props: TreeRenderProps, depth: number = 0): React.ReactNode[] {
  const result: React.ReactNode[] = [];

  nodes.forEach((node, idx) => {
    const key = `${node.path}/${node.name}`;

    if (node.type === "folder") {
      const isExpanded = props.expandedFolders.has(node.path);
      result.push(
        <div key={key}>
          <button
            onClick={() => props.onToggleFolder(node.path)}
            onContextMenu={(e) => props.onContextMenu(e)}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); props.onDragOverFolder(node.path); }}
            onDragLeave={() => { if (props.dragOverFolder === node.path) props.onDragOverFolder(null); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const fileId = e.dataTransfer.getData("text/file-id");
              if (fileId) props.onMoveFile(fileId, node.path);
              props.onDragOverFolder(null);
            }}
            className={cn(
              "w-full flex items-center gap-1 px-4 py-1 text-[13px] transition-colors hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-highlight)] group",
              props.dragOverFolder === node.path && "bg-[var(--bg-active)] ring-1 ring-inset ring-[var(--info)]"
            )}
            style={{ paddingLeft: `${12 + depth * 12}px` }}
          >
            <ChevronRight
              className={cn(
                "w-3 h-3 shrink-0 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
            <Folder className="w-4 h-4 shrink-0 text-[var(--info)]" />
            <span className="truncate">{node.name}</span>
            <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span
                onClick={(e) => { e.stopPropagation(); props.onNewFileInFolder(node.path); }}
                className="p-0.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                title="New File"
              >
                <FilePlus className="w-3 h-3" />
              </span>
              <span
                onClick={(e) => { e.stopPropagation(); props.onNewFolderInFolder(node.path); }}
                className="p-0.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                title="New Folder"
              >
                <FolderPlus className="w-3 h-3" />
              </span>
            </div>
          </button>
          {isExpanded && (
            <div>
              {renderTreeNodes(node.children, props, depth + 1)}
            </div>
          )}
        </div>
      );
    } else {
      const file = node.fileId ? { id: node.fileId, name: node.name, path: node.path } as FileData : null;
      if (!file) return result;

      result.push(
        <div key={key}>
          {props.renamingFileId === file.id ? (
            <div className="flex items-center gap-1 px-4 py-0.5" style={{ paddingLeft: `${12 + depth * 12}px` }}>
              {props.getFileIcon(file.name, "w-4 h-4 shrink-0")}
              <input
                ref={props.renameInputRef}
                type="text"
                value={props.renameValue}
                onChange={e => props.onRenameChange(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") props.onCommitRename();
                  if (e.key === "Escape") props.onRenameCancel();
                }}
                className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] text-[13px] px-1.5 py-0.5 rounded border border-[var(--border)] outline-none"
                style={{ background: "var(--input-bg)", color: "var(--input-text)" }}
                autoFocus
              />
              <button onClick={props.onCommitRename} className="text-[var(--text-secondary)] hover:text-[var(--text-highlight)]">
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              draggable={!props.isProtectedFile(file.name)}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/file-id", file.id!);
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={() => props.onSwitchFile(file.id!)}
              onContextMenu={e => {
                if (!props.isProtectedFile(file.name)) props.onContextMenu(e, file.id);
              }}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-1 text-[13px] transition-colors",
                props.activeFileId === file.id ? "bg-[var(--bg-active)] text-[var(--text-highlight)]" : "text-[var(--text-secondary)] hover:text-[var(--text-highlight)] hover:bg-[var(--bg-hover)]"
              )}
              style={{ paddingLeft: `${16 + depth * 12}px` }}
            >
              {props.getFileIcon(file.name)}
              <span className="truncate">{file.name}</span>
              {props.isDirty(file) && <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-highlight)] shrink-0 ml-auto" />}
              {props.isProtectedFile(file.name) && <Globe className="w-3 h-3 text-[var(--text-secondary)] shrink-0 ml-auto" />}
            </button>
          )}
        </div>
      );
    }
  });

  return result;
}
