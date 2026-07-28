(function () {
  "use strict";

  var runnerReady = false;
  var pendingRequests = {};
  var requestIdCounter = 0;
  var iframe = null;
  var parentOrigin = window.location.origin;

  function createIframe() {
    iframe = document.createElement("iframe");
    iframe.src = "/csharp-compiler-runner.html";
    iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;visibility:hidden;";
    document.body.appendChild(iframe);
  }

  function handleRunnerMessage(e) {
    if (e.source !== iframe.contentWindow) return;

    var msg = e.data;
    switch (msg.type) {
      case "runner-ready":
        runnerReady = true;
        notifyReady();
        break;
      case "runner-error":
        notifyError(msg.message);
        break;
      case "compile-result":
        if (msg.id && pendingRequests[msg.id]) {
          pendingRequests[msg.id](msg.result);
          delete pendingRequests[msg.id];
        }
        break;
    }
  }

  var readyListeners = [];
  var errorListeners = [];

  function notifyReady() {
    readyListeners.forEach(function (fn) { fn(); });
    readyListeners = [];
  }

  function notifyError(err) {
    errorListeners.forEach(function (fn) { fn(err); });
    errorListeners = [];
  }

  function init() {
    window.addEventListener("message", handleRunnerMessage);
    createIframe();
  }

  function onReady(fn) {
    if (runnerReady) { fn(); return; }
    readyListeners.push(fn);
  }

  function onError(fn) {
    errorListeners.push(fn);
  }

  function compile(code, timeout) {
    return new Promise(function (resolve) {
      var id = ++requestIdCounter;
      pendingRequests[id] = resolve;
      iframe.contentWindow.postMessage({
        type: "compile",
        id: id,
        code: code,
        timeout: timeout || 10000
      }, parentOrigin);
    });
  }

  window.__csharpCompiler = {
    init: init,
    onReady: onReady,
    onError: onError,
    compile: compile,
    isReady: function () { return runnerReady; }
  };
})();