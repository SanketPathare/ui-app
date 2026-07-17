"use strict";

// ============= CONFIGURATION =============
var BROWSERCC_BASE = "https://cdn.jsdelivr.net/npm/browsercc@0.1.1/dist";
var WASI_SHIM_URL = "https://cdn.jsdelivr.net/npm/@bjorn3/browser_wasi_shim@0.4.2/dist/index.js";

// ============= STATE =============
var browserccCompile = null;
var WasiShim = null;
var isReady = false;
var stdinBuffer = null;

// ============= STDIN BUFFER =============
function createStdinBuffer() { return { data: new Uint8Array(0) }; }
function appendToBuffer(buf, text) {
  var newData = new TextEncoder().encode(text);
  var combined = new Uint8Array(buf.data.length + newData.length);
  combined.set(buf.data);
  combined.set(newData, buf.data.length);
  buf.data = combined;
}

// ============= INTERACTIVE STDIN =============
var currentInputId = null;

function fetchInputSync(inputId) {
  try {
    var request = new XMLHttpRequest();
    request.open("GET", "/react-py-get-input/?id=" + inputId + "&prompt=", false);
    request.send(null);
    var val = request.responseText;
    if (!val.endsWith("\n")) {
      val += "\n";
    }
    return val;
  } catch (err) {
    return "\n";
  }
}

function createInteractiveStdin(OpenFile, File, buffer) {
  var stdin = new OpenFile(new File(new Uint8Array(0)));
  stdin._buffer = buffer;
  stdin._pos = 0n;
  stdin.fd_read = function (size) {
    var buf = this._buffer.data;
    var start = Number(this._pos);
    if (start >= buf.length && currentInputId) {
      // Notify main thread that we are waiting for input
      postMessage({ type: "awaiting-input", id: currentInputId });
      
      // Fetch input synchronously (blocks thread)
      var newInput = fetchInputSync(currentInputId);
      
      // Echo the input to stdout so the user sees it in the output log
      postMessage({ type: "stdout-echo", text: newInput });
      
      appendToBuffer(this._buffer, newInput);
      buf = this._buffer.data;
    }
    
    var end = Math.min(start + Number(size), buf.length);
    if (start >= buf.length) return { ret: 0, data: new Uint8Array(0) };
    var slice = buf.slice(start, end);
    this._pos = BigInt(end);
    return { ret: 0, data: slice };
  };
  return stdin;
}

// ============= INIT =============
async function init() {
  try {
    var mod = await import(BROWSERCC_BASE + "/index.js");
    browserccCompile = mod.compile;
    var wasmMod = await import(WASI_SHIM_URL);
    WasiShim = wasmMod;
    isReady = true;
    postMessage({ type: "ready" });
  } catch (err) {
    postMessage({ type: "error", message: "Failed to load: " + err.message });
  }
}

// ============= COMPILE + RUN =============
async function compileAndRun(code, input) {
  // 1. Compile with browsercc's compile function
  //    Use .cpp extension and -std=c++17 to work with clang++ driver
  //    -x c forces C language mode
  var result = await browserccCompile({
    source: code,
    fileName: "program.cpp",
    flags: ["-std=c++17"],
  });

  if (!result.module) {
    return { exitCode: 1, stdout: "", stderr: result.compileOutput || "Compilation failed" };
  }

  // 2. Run with WASI shim
  var WASI = WasiShim.WASI;
  var WASIProcExit = WasiShim.WASIProcExit;
  var File = WasiShim.File;
  var OpenFile = WasiShim.OpenFile;
  var ConsoleStdout = WasiShim.ConsoleStdout;

  var buf = createStdinBuffer();
  if (input) appendToBuffer(buf, input);
  stdinBuffer = buf;

  var wasi = new WASI(["program"], [], [
    createInteractiveStdin(OpenFile, File, buf),
    new ConsoleStdout(function (data) {
      var text = new TextDecoder().decode(data);
      postMessage({ type: "stdout", text: text });
    }),
    new ConsoleStdout(function (data) {
      var text = new TextDecoder().decode(data);
      postMessage({ type: "stderr", text: text });
    }),
  ]);

  var instance = await WebAssembly.instantiate(result.module, { wasi_snapshot_preview1: wasi.wasiImport });

  var exitCode = 0;
  try {
    wasi.start(instance);
  } catch (e) {
    if (typeof WASIProcExit !== "undefined" && e instanceof WASIProcExit) {
      exitCode = e.code;
    } else if (e.__wasi_exit) {
      exitCode = e.code || 0;
    } else {
      return { exitCode: 1, stderr: stderr || String(e) };
    }
  }

  return { exitCode: exitCode };
}

// ============= MESSAGE HANDLER =============
self.addEventListener("message", async function (e) {
  var msg = e.data;
  switch (msg.type) {
    case "init":
      init();
      break;
    case "run":
      if (!isReady) {
        postMessage({ type: "run-result", id: msg.id, exitCode: 1, stderr: "Compiler not ready" });
        return;
      }
      try {
        currentInputId = msg.inputId || null;
        var runResult = await compileAndRun(msg.code, msg.input);
        postMessage({ type: "run-result", id: msg.id, exitCode: runResult.exitCode, stderr: runResult.stderr });
      } catch (err) {
        postMessage({ type: "run-result", id: msg.id, exitCode: 1, stderr: "Error: " + err.message });
      } finally {
        currentInputId = null;
      }
      break;
    case "stdin":
      if (stdinBuffer) appendToBuffer(stdinBuffer, msg.text);
      break;
  }
});
