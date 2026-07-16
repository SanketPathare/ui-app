import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync, readdirSync } from "fs";
import { join } from "path";
import os from "os";
import crypto from "crypto";

const JAVA_HOME = process.env.JAVA_HOME || "C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.19.10-hotspot";
const JAVAC = join(JAVA_HOME, "bin", "javac");
const JAR_TOOL = join(JAVA_HOME, "bin", "jar");
const BASE_TMP = join(os.tmpdir(), "java-compiler");

function ensureCleanDir(dir: string) {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

function getPackageName(source: string): string {
  const match = source.match(/^\s*package\s+([a-zA-Z_][\w.]*)\s*;/m);
  return match ? match[1] : "";
}

function detectMainClass(code: string): string | null {
  const classMatch = code.match(/(?:public\s+)?class\s+(\w+)/);
  if (!classMatch) return null;
  const className = classMatch[1];
  const rest = code.slice(classMatch.index! + classMatch[0].length);
  const braceStack: number[] = [];
  let inString = false;
  let inChar = false;
  let mainFound = false;
  for (let i = 0; i < rest.length; i++) {
    const ch = rest[i];
    if (inString) { if (ch === '"' && rest[i - 1] !== "\\") inString = false; continue; }
    if (inChar) { if (ch === "'" && rest[i - 1] !== "\\") inChar = false; continue; }
    if (ch === '"') { inString = true; continue; }
    if (ch === "'") { inChar = true; continue; }
    if (ch === "{") braceStack.push(i);
    if (ch === "}") braceStack.pop();
    if (braceStack.length === 1) {
      const snippet = rest.slice(i);
      const mainMatch = snippet.match(/^\s*public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*\w+\s*\)/);
      if (mainMatch) {
        mainFound = true;
        break;
      }
    }
  }
  return mainFound ? className : null;
}

function listJavaFiles(dir: string): string[] {
  const entries = readdirSync(dir, { recursive: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (typeof entry === "string" && entry.endsWith(".java")) {
      files.push(join(dir, entry));
    }
  }
  return files;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, files = [], mainClass } = body as {
    code: string;
    files?: { name: string; content: string }[];
    mainClass?: string;
  };

  if (!code || !code.trim()) {
    return NextResponse.json({ success: false, errors: "No code provided" }, { status: 400 });
  }

  const id = crypto.randomUUID().slice(0, 8);
  const tmpDir = join(BASE_TMP, id);
  const srcDir = join(tmpDir, "src");
  const classesDir = join(tmpDir, "classes");

  try {
    ensureCleanDir(srcDir);
    mkdirSync(classesDir, { recursive: true });

    const allFiles = [{ name: "Main.java", content: code }, ...files];
    for (const file of allFiles) {
      const pkg = getPackageName(file.content);
      let filePath: string;
      if (pkg) {
        const pkgDir = pkg.replace(/\./g, "\\");
        const pkgFullDir = join(srcDir, pkgDir);
        mkdirSync(pkgFullDir, { recursive: true });
        filePath = join(pkgFullDir, file.name);
      } else {
        filePath = join(srcDir, file.name);
      }
      writeFileSync(filePath, file.content, "utf-8");
    }

    const helperPath = join(process.cwd(), "src", "api-helpers", "java", "CaptureHelper.java");
    const helperContent = readFileSync(helperPath, "utf-8");
    writeFileSync(join(srcDir, "CaptureHelper.java"), helperContent, "utf-8");

    const javaFiles = listJavaFiles(srcDir);
    try {
      execSync(`"${JAVAC}" -d "${classesDir}" ${javaFiles.map(f => `"${f}"`).join(" ")}`, { timeout: 30000, shell: true } as any);
    } catch (compileErr: any) {
      const stderr = compileErr.stderr?.toString() || "";
      const stdout = compileErr.stdout?.toString() || "";
      const raw = stderr || stdout || "Compilation failed";
      const cleaned = raw
        .replace(/.+CaptureHelper\.java:\d+: error: /g, "")
        .replace(/CaptureHelper\.java:\d+: error: /g, "")
        .replace(/.+javac\b.+/g, "")
        .replace(/^\s*\n/gm, "")
        .trim();
      return NextResponse.json({
        success: false,
        errors: cleaned || "Compilation failed",
      });
    }

    const detectedMainClass = mainClass || detectMainClass(code) || "Main";

    const classFiles = readdirSync(classesDir).filter(
      (f) => f.endsWith(".class") && !f.startsWith("CaptureHelper")
    );
    if (classFiles.length === 0) {
      return NextResponse.json({
        success: false,
        errors: "No class files generated. Ensure your code compiles to at least one class.",
      });
    }

    try {
      execSync(`"${JAR_TOOL}" cf "${join(tmpDir, "output.jar")}" -C "${classesDir}" .`, { timeout: 15000, shell: true } as any);
    } catch (jarErr: any) {
      return NextResponse.json({
        success: false,
        errors: "Failed to create JAR: " + (jarErr.stderr?.toString() || jarErr.message),
      });
    }

    return NextResponse.json({
      success: true,
      jarId: id,
      mainClass: detectedMainClass,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      errors: err.message || "Internal server error",
    }, { status: 500 });
  }
}
