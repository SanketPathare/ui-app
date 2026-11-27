# UI Engine

A modern suite of visual CSS/UI design generators, Tailwind CSS converters, and in-browser WebAssembly code compilers built with Next.js, React, and TypeScript.

## Features

### CSS & UI Design Generators
Over 50 interactive visual tools organized across design categories:

- **Visual FX**: Gradient Text, Glow Effect, Border Animation, Shimmer Effect, Cursor Effect, Box Shadow, Border Radius, Glassmorphism, Neumorphism, Blob Shape, Noise Texture, Opacity Control, Transform Lab, Filter Core, Outline Engine, Aspect Ratio, Object Fit, CSS Clamp
- **Color & Patterns**: Gradient Generator, Mesh Gradient, Aurora FX, Pattern Engine, Text Shadow, Gradient Border, Color Palette, Contrast Checker (WCAG AA/AAA), Scrollbar Studio
- **SVG & Geometry**: SVG Shapes, Clip-path, SVG Divider, Polygon Gen, Curve Shape
- **Layout System**: CSS Grid, Flexbox Lab, Container Lab, Breakpoints, Card Layouts
- **Navigation & UI**: Navbar Engine, Sidebar Pro, Footer Builder, Button Styles, Badge Lab, Tooltip Pro
- **Input & Motion**: Form Gen, Input Field, Checkbox & Radio, Toggle Switch, Animations, Keyframes, Hover Lab, Spinners, Typing FX, Parallax, Cubic Bezier
- **Tailwind Utilities**: HTML to Tailwind (`/html-to-tw`), CSS to Tailwind (`/css-to-tw`)

### In-Browser Compilers & Sandboxes
Run code directly in the browser with Monaco/CodeMirror editors and `xterm` terminal output:

- **HTML Compiler** (`/html-compiler`) — Real-time HTML, CSS, and JavaScript editor with live preview
- **React Sandbox** (`/react-compiler`) — Online React sandbox powered by `@babel/standalone` with live preview
- **Python Compiler** (`/python-compiler`) — Browser-based Python runtime powered by Pyodide / WebAssembly
- **Java Compiler** (`/java-compiler`) — Browser-based Java compiler powered by CheerpJ and Eclipse ECJ
- **C Compiler** (`/c-compiler`) — WebAssembly-powered C compiler
- **C++ Compiler** (`/cpp-compiler`) — WebAssembly/Clang-powered C++ compiler
- **C# Compiler** (`/csharp-compiler`) — Blazor WebAssembly-powered C# compiler (`CSharpBridge`)
- **R Compiler** (`/r-compiler`) — WebAssembly-powered R environment via WebR

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), TypeScript
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide Icons](https://lucide.dev/), `next-themes`
- **Editors & Terminal**: Monaco Editor (`@monaco-editor/react`), CodeMirror (`@uiw/react-codemirror`), `xterm`
- **Browser Runtimes**: `@babel/standalone`, `pyodide` / `react-py`, `webr`, Blazor WebAssembly, CheerpJ

## Getting Started

### Prerequisites

- Node.js 20+ (or [Bun](https://bun.sh/))
- *(Optional)* [.NET 8 SDK](https://dotnet.microsoft.com/) with the `wasm-tools` workload if rebuilding the C# Blazor WebAssembly bridge

### Installation

```bash
npm install
# or
bun install
```

### Development

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the project |

### Optional Compiler Setup

- **Java Compiler (`ecj.jar`)**: If `public/ecj.jar` is not present, download it with:
  ```bash
  node scripts/download-java-compiler.mjs
  ```
- **C# Compiler (`CSharpBridge`)**: To rebuild the Blazor WebAssembly runtime in `public/_framework/` on Windows:
  ```bat
  scripts\build-csharp-bridge.bat
  ```

> **Note:** `next.config.ts` configures `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers for `/r-compiler`, `/csharp-compiler`, `/csharp-compiler-runner.html`, and `/_framework/*` to support `SharedArrayBuffer` and WebAssembly execution.

## Project Structure

```text
├── CSharpBridge/          # .NET 8 Blazor WebAssembly bridge for the C# compiler
├── public/                # Static assets, _framework/ WASM files, and compiler runners
├── scripts/               # Helper scripts for Java (ECJ) and C# (Blazor WASM) setup
└── src/
    ├── app/               # Next.js App Router pages for each generator and compiler
    ├── components/        # Shared layout, navigation, theme, and generator components
    └── lib/               # Utility helpers
```
