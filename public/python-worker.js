importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

let pyodide;
let inputId;

const reactPyModule = {
  getInput: function (id, prompt) {
    var request = new XMLHttpRequest();
    request.open("GET", "/react-py-get-input/?id=" + id + "&prompt=" + encodeURIComponent(prompt), false);
    request.send(null);
    return request.responseText;
  },
};

self.addEventListener("message", async function (event) {
  var msg = event.data;

  switch (msg.type) {
    case "init":
      try {
        postMessage({ type: "loading" });
        pyodide = await self.loadPyodide({ stdout: function (s) { postMessage({ type: "stdout", text: s + "\n" }); } });

        inputId = self.crypto.randomUUID();
        pyodide.registerJsModule("react_py", reactPyModule);

        var patchCode =
          '\nimport sys, builtins\nimport react_py\n__prompt_str__ = ""\ndef get_input(prompt=""):\n    global __prompt_str__\n    __prompt_str__ = prompt\n    s = react_py.getInput("' +
          inputId +
          '", prompt)\n    print()\n    return s\nbuiltins.input = get_input\nsys.stdin.readline = lambda: react_py.getInput("' +
          inputId +
          '", __prompt_str__)\n';
        await pyodide.runPythonAsync(patchCode);

        postMessage({ type: "ready", id: inputId });
      } catch (err) {
        postMessage({ type: "error", message: err.message });
      }
      break;

    case "run":
      try {
        if (msg.files) {
          for (const file of msg.files) {
            if (file.name) {
              pyodide.FS.writeFile(file.name, file.content);
            }
          }

          const moduleNames = msg.files
            .filter(f => f.name.endsWith(".py"))
            .map(f => f.name.slice(0, -3));

          if (moduleNames.length > 0) {
            const clearModulesCode = `
import sys
for name in ${JSON.stringify(moduleNames)}:
    if name in sys.modules:
        del sys.modules[name]
`;
            pyodide.runPython(clearModulesCode);
          }
        }
        await pyodide.runPythonAsync(msg.code);
        postMessage({ type: "done" });
      } catch (err) {
        postMessage({ type: "error", message: err.message });
      }
      break;

    case "interrupt":
      try {
        pyodide.runPython("raise KeyboardInterrupt");
      } catch (_) {}
      break;
  }
});
