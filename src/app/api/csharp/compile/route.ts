import { NextRequest, NextResponse } from "next/server";
import { spawnSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import os from "os";
import crypto from "crypto";

// ─────────────────────────────────────────────
// Piston API (free, no API key, supports C#)
// ─────────────────────────────────────────────

const PISTON_API = "https://emkc.org/api/v2/piston/execute";

async function runViaPiston(
  code: string,
  timeout: number
): Promise<NextResponse> {
  // Try csharp.net (dotnet 5) first, then mono as fallback
  const runtimes = [
    { language: "csharp.net", version: "5.0.201", filename: "Program.cs" },
    { language: "csharp", version: "6.12.0", filename: "code.cs" },
  ];

  let lastError: string | null = null;

  for (const rt of runtimes) {
    try {
      const resp = await fetch(PISTON_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: rt.language,
          version: rt.version,
          files: [{ name: rt.filename, content: code }],
          stdin: "",
          args: [],
          compile_timeout: Math.min(timeout, 15000),
          run_timeout: Math.min(timeout, 15000),
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
        signal: AbortSignal.timeout(Math.min(timeout + 5000, 35000)),
      });

      if (!resp.ok) {
        lastError = `Piston API error: HTTP ${resp.status}`;
        continue;
      }

      const result = await resp.json() as {
        language: string;
        version: string;
        compile?: { stdout: string; stderr: string; code: number | null };
        run: { stdout: string; stderr: string; code: number | null; signal: string | null };
        message?: string;
      };

      // Check for API-level errors
      if (result.message) {
        lastError = result.message;
        continue;
      }

      // Compile errors
      if (result.compile) {
        const compileStderr = (result.compile.stderr ?? "").trim();
        const compileStdout = (result.compile.stdout ?? "").trim();

        if (result.compile.code !== 0) {
          // Parse compilation errors — strip temp file paths
          const raw = compileStderr || compileStdout;
          const cleaned = raw
            .split("\n")
            .map((l: string) => l.replace(/\/piston\/jobs\/[^/]+\/[^/]+\//g, "").trim())
            .filter((l: string) => l.length > 0)
            .join("\n");

          return NextResponse.json({
            success: false,
            errors: cleaned || "Compilation failed",
          });
        }
      }

      // Runtime result
      const stdout = (result.run.stdout ?? "").trimEnd();
      const stderr = (result.run.stderr ?? "").trimEnd();
      const exitCode = result.run.code;
      const signal = result.run.signal;

      if (signal === "SIGKILL" || signal === "SIGTERM") {
        return NextResponse.json({
          success: false,
          runtimeError: `Execution killed (${signal}) — likely timed out or used too much memory`,
        });
      }

      if (exitCode !== 0 && exitCode !== null) {
        const errOutput = stderr || stdout || "";
        const cleaned = errOutput
          .split("\n")
          .map((l: string) => l.replace(/\/piston\/jobs\/[^/]+\/[^/]+\//g, "").trim())
          .join("\n");

        return NextResponse.json({
          success: false,
          runtimeError: cleaned || `Process exited with code ${exitCode}`,
        });
      }

      return NextResponse.json({
        success: true,
        output: stdout + (stderr ? "\n[stderr]\n" + stderr : ""),
        runtime: `${result.language} ${result.version}`,
      });
    } catch (fetchErr: unknown) {
      lastError = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      continue;
    }
  }

  return NextResponse.json({
    success: false,
    error: "C# execution service unavailable: " + (lastError ?? "Unknown error"),
    recoverable: true,
  });
}

// ─────────────────────────────────────────────
// Local dotnet fallback
// ─────────────────────────────────────────────

const BASE_TMP = join(os.tmpdir(), "csharp-compiler");

function findDotnet(): string | null {
  const isWindows = process.platform === "win32";

  const candidates = [
    join("C:\\Program Files\\dotnet", "dotnet.exe"),
    join("C:\\Program Files (x86)\\dotnet", "dotnet.exe"),
    join(os.homedir(), ".dotnet", isWindows ? "dotnet.exe" : "dotnet"),
    join(process.env.LOCALAPPDATA ?? "", "Microsoft", "dotnet", "dotnet.exe"),
    join(process.env.ProgramFiles ?? "", "dotnet", "dotnet.exe"),
    join(process.env["ProgramFiles(x86)"] ?? "", "dotnet", "dotnet.exe"),
    "/usr/local/share/dotnet/dotnet",
    "/usr/share/dotnet/dotnet",
    "/usr/bin/dotnet",
    "/usr/local/bin/dotnet",
  ];

  for (const c of candidates) {
    if (c && existsSync(c)) return c;
  }

  const testResult = spawnSync("dotnet", ["--version"], {
    encoding: "utf-8",
    timeout: 5000,
    windowsHide: true,
    shell: true,
  });

  if (testResult.status === 0) return "dotnet";
  return null;
}

async function runViaLocalDotnet(
  code: string,
  timeout: number,
  dotnetPath: string
): Promise<NextResponse> {
  const id = crypto.randomUUID().slice(0, 8);
  const tmpDir = join(BASE_TMP, id);
  const projDir = join(tmpDir, "app");

  try {
    mkdirSync(projDir, { recursive: true });

    const csproj = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <AllowUnsafeBlocks>true</AllowUnsafeBlocks>
  </PropertyGroup>
</Project>`;

    writeFileSync(join(projDir, "App.csproj"), csproj, "utf-8");
    writeFileSync(join(projDir, "Program.cs"), code, "utf-8");

    const buildResult = spawnSync(
      dotnetPath,
      ["build", "App.csproj", "-c", "Release", "--nologo", "-v", "q"],
      { cwd: projDir, encoding: "utf-8", timeout: Math.min(timeout, 90000), windowsHide: true }
    );

    if (buildResult.status !== 0) {
      const output = (buildResult.stdout ?? "") + (buildResult.stderr ?? "");
      const errorLines = output
        .split("\n")
        .filter((l) => /error (CS|MSBUILD)/i.test(l))
        .map((l) => l.replace(/.*Program\.cs(\(\d+,\d+\))?:\s*/i, "").trim())
        .filter(Boolean);

      return NextResponse.json({
        success: false,
        errors: errorLines.length ? errorLines.join("\n") : output.trim() || "Build failed",
      });
    }

    const runResult = spawnSync(
      dotnetPath,
      ["run", "--project", "App.csproj", "-c", "Release", "--no-build", "--nologo"],
      { cwd: projDir, encoding: "utf-8", timeout: Math.min(timeout, 30000), windowsHide: true }
    );

    if (runResult.status === null) {
      return NextResponse.json({ success: false, runtimeError: "Execution timed out (30s limit)" });
    }

    const stdout = runResult.stdout ?? "";
    const stderr = runResult.stderr ?? "";

    if (runResult.status !== 0) {
      return NextResponse.json({
        success: false,
        runtimeError: stderr || stdout || `Exit code: ${runResult.status}`,
      });
    }

    return NextResponse.json({ success: true, output: stdout + (stderr ? "\n" + stderr : "") });
  } finally {
    try { rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}

// ─────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, timeout = 30000 } = body as { code?: string; timeout?: number };

  if (!code || !code.trim()) {
    return NextResponse.json({ success: false, error: "No code provided" }, { status: 400 });
  }

  // Try local dotnet first (faster, better error messages)
  const dotnetPath = findDotnet();
  if (dotnetPath) {
    return runViaLocalDotnet(code, timeout, dotnetPath);
  }

  // Fall back to Piston API (free, no API key)
  return runViaPiston(code, timeout);
}