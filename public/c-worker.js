"use strict";

var COMPILER_URL = "https://divsmith.github.io/c2wasm/compiler.wasm";

var compilerModule = null;
var isReady = false;

var EXIT_TAG = { __wasi_exit: true };

function createWasiHarness(config) {
  var mode = config.mode || "buffer";
  var args = config.args || (mode === "buffer" ? ["c2wasm"] : ["program"]);
  var rawMode = config.rawMode || false;

  var state = {
    memory: null,
    exitCode: 0,
    stdoutChunks: [],
    stdoutByteChunks: [],
    stderrChunks: [],
    inputPos: 0,
    inputBytes: config.inputBytes || new Uint8Array(0),
  };

  var openFiles = {};

  function writeText(fd, text) {
    (fd === 2 ? state.stderrChunks : state.stdoutChunks).push(text);
  }

  var imports = {
    wasi_snapshot_preview1: {
      proc_exit: function (code) {
        state.exitCode = code;
        throw EXIT_TAG;
      },
      fd_write: function (fd, iovs, iovs_len, nwritten_ptr) {
        var buf = state.memory.buffer;
        var view = new DataView(buf);
        var bytes = new Uint8Array(buf);
        var total = 0;

        if (fd !== 2 && rawMode) {
          for (var i = 0; i < iovs_len; i++) {
            var ptr = view.getUint32(iovs + i * 8, true);
            var len = view.getUint32(iovs + i * 8 + 4, true);
            state.stdoutByteChunks.push(bytes.slice(ptr, ptr + len));
            total += len;
          }
        } else {
          var decoder = new TextDecoder("utf-8", { fatal: false });
          for (var i = 0; i < iovs_len; i++) {
            var ptr = view.getUint32(iovs + i * 8, true);
            var len = view.getUint32(iovs + i * 8 + 4, true);
            var isLast = i === iovs_len - 1;
            writeText(fd, decoder.decode(bytes.slice(ptr, ptr + len), { stream: !isLast }));
            total += len;
          }
        }

        view.setUint32(nwritten_ptr, total, true);
        return 0;
      },
      fd_read: function (fd, iovs, iovs_len, nread_ptr) {
        var view = new DataView(state.memory.buffer);
        var bytes = new Uint8Array(state.memory.buffer);
        var totalRead = 0;
        var i, iovPtr, iovLen, written;

        if (openFiles[fd]) {
          var vf = openFiles[fd];
          for (i = 0; i < iovs_len; i++) {
            iovPtr = view.getUint32(iovs + i * 8, true);
            iovLen = view.getUint32(iovs + i * 8 + 4, true);
            written = 0;
            while (written < iovLen && vf.position < vf.content.length) {
              bytes[iovPtr + written] = vf.content[vf.position++];
              written++;
              totalRead++;
            }
          }
          view.setUint32(nread_ptr, totalRead, true);
          return 0;
        }

        for (i = 0; i < iovs_len; i++) {
          iovPtr = view.getUint32(iovs + i * 8, true);
          iovLen = view.getUint32(iovs + i * 8 + 4, true);
          written = 0;
          while (written < iovLen && state.inputPos < state.inputBytes.length) {
            bytes[iovPtr + written] = state.inputBytes[state.inputPos++];
            written++;
            totalRead++;
          }
        }

        view.setUint32(nread_ptr, totalRead, true);
        return 0;
      },
      fd_close: function (fd) {
        if (openFiles[fd]) delete openFiles[fd];
        return 0;
      },
      fd_seek: function () { return 8; },
      fd_prestat_get: function (fd, prestat_ptr) {
        if (fd === 3) {
          var view = new DataView(state.memory.buffer);
          view.setUint8(prestat_ptr, 0);
          view.setUint32(prestat_ptr + 4, 1, true);
          return 0;
        }
        return 8;
      },
      fd_prestat_dir_name: function (fd, path_ptr) {
        if (fd === 3) {
          new Uint8Array(state.memory.buffer)[path_ptr] = 0x2E;
          return 0;
        }
        return 8;
      },
      fd_fdstat_set_flags: function () { return 0; },
      path_open: function () {
        return 44;
      },
      fd_fdstat_get: function (fd, fdstat_ptr) {
        var view = new DataView(state.memory.buffer);
        view.setUint8(fdstat_ptr, fd <= 2 ? 2 : (fd === 3 ? 3 : 4));
        view.setUint16(fdstat_ptr + 2, 0, true);
        view.setBigUint64(fdstat_ptr + 8, BigInt("0x1FFFFFFF"), true);
        view.setBigUint64(fdstat_ptr + 16, BigInt("0x1FFFFFFF"), true);
        return 0;
      },
      environ_sizes_get: function (count_ptr, size_ptr) {
        var view = new DataView(state.memory.buffer);
        view.setUint32(count_ptr, 0, true);
        view.setUint32(size_ptr, 0, true);
        return 0;
      },
      environ_get: function () { return 0; },
      args_sizes_get: function (argc_ptr, argv_buf_size_ptr) {
        var view = new DataView(state.memory.buffer);
        view.setUint32(argc_ptr, args.length, true);
        var totalSize = 0;
        for (var i = 0; i < args.length; i++) {
          totalSize += new TextEncoder().encode(args[i]).length + 1;
        }
        view.setUint32(argv_buf_size_ptr, totalSize, true);
        return 0;
      },
      args_get: function (argv_ptr, argv_buf_ptr) {
        var view = new DataView(state.memory.buffer);
        var mem = new Uint8Array(state.memory.buffer);
        var bufOffset = argv_buf_ptr;
        for (var i = 0; i < args.length; i++) {
          view.setUint32(argv_ptr + i * 4, bufOffset, true);
          var encoded = new TextEncoder().encode(args[i]);
          mem.set(encoded, bufOffset);
          mem[bufOffset + encoded.length] = 0;
          bufOffset += encoded.length + 1;
        }
        return 0;
      },
      clock_time_get: function (id, precision, time_ptr) {
        new DataView(state.memory.buffer).setBigUint64(time_ptr, BigInt(Date.now()) * BigInt(1000000), true);
        return 0;
      },
      random_get: function (buf_ptr, len) {
        var bytes = new Uint8Array(state.memory.buffer, buf_ptr, len);
        if (typeof crypto !== "undefined" && crypto.getRandomValues) {
          crypto.getRandomValues(bytes);
        } else {
          for (var i = 0; i < len; i++) bytes[i] = (Math.random() * 256) | 0;
        }
        return 0;
      }
    }
  };

  return {
    imports: imports,
    setMemory: function (m) { state.memory = m; },
    get exitCode() { return state.exitCode; },
    get stdout() { return state.stdoutChunks.join(""); },
    get stdoutBytes() {
      var total = 0;
      for (var i = 0; i < state.stdoutByteChunks.length; i++) total += state.stdoutByteChunks[i].length;
      var result = new Uint8Array(total);
      var offset = 0;
      for (i = 0; i < state.stdoutByteChunks.length; i++) {
        result.set(state.stdoutByteChunks[i], offset);
        offset += state.stdoutByteChunks[i].length;
      }
      return result;
    },
    get stderr() { return state.stderrChunks.join(""); },
    isExit: function (e) { return e === EXIT_TAG; }
  };
}

function runCompiler(mod, cSource, rawMode, args) {
  var inputBytes = new TextEncoder().encode(cSource);
  var ctx = createWasiHarness({ mode: "buffer", inputBytes: inputBytes, rawMode: rawMode, args: args });
  var instance = new WebAssembly.Instance(mod, ctx.imports);
  ctx.setMemory(instance.exports.memory);

  try {
    instance.exports._start();
  } catch (e) {
    if (!ctx.isExit(e)) throw e;
  }

  return ctx;
}

async function initCompiler() {
  try {
    var resp = await fetch(COMPILER_URL);
    if (!resp.ok) throw new Error("compiler.wasm not found (HTTP " + resp.status + ")");
    var wasmBytes = await resp.arrayBuffer();
    compilerModule = await WebAssembly.compile(wasmBytes);
    isReady = true;
    postMessage({ type: "ready" });
  } catch (err) {
    postMessage({ type: "error", message: "Failed to load C compiler: " + err.message });
  }
}

async function compileAndRun(sourceCode, inputText) {
  if (!compilerModule || !isReady) {
    postMessage({ type: "result", output: "Error: Compiler not ready", stderr: "" });
    return;
  }

  try {
    var ctx = runCompiler(compilerModule, sourceCode, true, ["c2wasm", "-b"]);

    if (ctx.exitCode !== 0 || ctx.stderr) {
      var errMsg = ctx.stderr || ("Compiler exited with code " + ctx.exitCode);
      postMessage({ type: "result", output: errMsg, stderr: errMsg });
      return;
    }

    var wasmBytes = ctx.stdoutBytes;
    if (wasmBytes.length === 0) {
      postMessage({ type: "result", output: ctx.stderr || "Compiler produced no output", stderr: ctx.stderr });
      return;
    }

    var runModule = await WebAssembly.compile(wasmBytes.buffer.slice(wasmBytes.byteOffset, wasmBytes.byteOffset + wasmBytes.byteLength));

    var inputBytes = new TextEncoder().encode(inputText || "");
    var runCtx = createWasiHarness({ mode: "buffer", inputBytes: inputBytes, rawMode: false, args: ["program"] });

    var runInstance = new WebAssembly.Instance(runModule, runCtx.imports);
    runCtx.setMemory(runInstance.exports.memory);

    try {
      runInstance.exports._start();
    } catch (e) {
      if (!runCtx.isExit(e)) throw e;
    }

    var output = runCtx.stdout;
    if (runCtx.exitCode !== 0 && !output) {
      output = runCtx.stderr || "Program exited with code " + runCtx.exitCode;
    }

    postMessage({ type: "result", output: output, stderr: runCtx.stderr });
  } catch (err) {
    postMessage({ type: "result", output: "Error: " + err.message, stderr: err.message });
  }
}

self.addEventListener("message", async function (event) {
  var msg = event.data;

  switch (msg.type) {
    case "init":
      initCompiler();
      break;
    case "compile":
      await compileAndRun(msg.code, msg.input);
      break;
  }
});
