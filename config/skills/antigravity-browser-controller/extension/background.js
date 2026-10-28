// Antigravity Omni-Browser Controller - Background Service Worker
// WebSocket Connection to local Antigravity Bridge Server (ws://127.0.0.1:8765)

const WS_URL = "ws://127.0.0.1:8765";
let socket = null;
let isConnected = false;
let attachedDebuggerTabs = new Set();
let consoleLogs = [];
let currentProfileName = "default";
let currentProfileEmail = "";

try {
  chrome.debugger.onDetach.addListener((source, reason) => {
    if (source && source.tabId) {
      console.log(`[Antigravity] Debugger detached from tab ${source.tabId}: ${reason}`);
      attachedDebuggerTabs.delete(source.tabId);
    }
  });
} catch (e) {}

async function detectAndSyncProfileIdentity() {
  try {
    if (chrome.identity && chrome.identity.getProfileUserInfo) {
      const info = await new Promise((resolve) => {
        try {
          chrome.identity.getProfileUserInfo({ accountStatus: "ANY" }, (u) => resolve(u || {}));
        } catch (e) {
          resolve({});
        }
      });
      if (info && info.email) {
        currentProfileEmail = info.email.toLowerCase().trim();
        if (currentProfileEmail.includes("enterprise_account")) {
          currentProfileName = "enterprise";
          await chrome.storage.local.set({ profile_name: "enterprise" });
          return;
        } else if (currentProfileEmail.includes("scmsap2022")) {
          currentProfileName = "54";
          await chrome.storage.local.set({ profile_name: "54" });
          return;
        } else if (currentProfileEmail.includes("creator_account")) {
          currentProfileName = "7";
          await chrome.storage.local.set({ profile_name: "7" });
          return;
        } else if (currentProfileEmail.includes("regsunoai2026")) {
          currentProfileName = "67";
          await chrome.storage.local.set({ profile_name: "67" });
          return;
        } else if (currentProfileEmail.includes("nerhor.densankhau")) {
          currentProfileName = "nerhordensankhau";
          await chrome.storage.local.set({ profile_name: "nerhordensankhau" });
          return;
        }
      }
    }
  } catch (e) {}

  try {
    const stored = await chrome.storage.local.get(["profile_name"]);
    if (stored && stored.profile_name) {
      currentProfileName = stored.profile_name;
    }
  } catch (e) {}

  // Also inspect open tabs if still "default"
  if (currentProfileName === "default" || !currentProfileName) {
    try {
      const allTabs = await chrome.tabs.query({});
      for (const t of allTabs) {
        const u = (t.url || "").toLowerCase();
        if (u.includes("aacb95cd-e131-42cd-acd4-5bfc4d3bec73") || u.includes("874baf0e-51d7-4b4a-a654-1dd8f6582763") || u.includes("15c8774e-317b-4f96-9c2d-bc71fa78fe22")) {
          currentProfileName = "54";
          await chrome.storage.local.set({ profile_name: "54" });
          break;
        } else if (u.includes("76f30d31-a8f7-4ef0-80f4-bfbc1bf12a6c")) {
          currentProfileName = "7";
          await chrome.storage.local.set({ profile_name: "7" });
          break;
        } else if (u.includes("suno.com")) {
          currentProfileName = "67";
          await chrome.storage.local.set({ profile_name: "67" });
          break;
        } else if (u.includes("example.com") || u.includes("sc-domain:example.com")) {
          currentProfileName = "enterprise";
          await chrome.storage.local.set({ profile_name: "enterprise" });
          break;
        }
      }
    } catch (e) {}
  }
}

detectAndSyncProfileIdentity();

console.log("[Antigravity] Background service worker started.");

let heartbeatInterval = null;

function startHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(async () => {
    try {
      if (chrome.runtime && chrome.runtime.getPlatformInfo) {
        await chrome.runtime.getPlatformInfo();
      }
    } catch (e) {}

    if (socket && socket.readyState === WebSocket.OPEN) {
      sendToBridge({
        type: "HEARTBEAT",
        profile: currentProfileName,
        email: currentProfileEmail
      });
    } else {
      connectWebSocket();
    }
  }, 10000);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

function connectWebSocket() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  try {
    socket = new WebSocket(WS_URL);

    socket.onopen = async () => {
      console.log("[Antigravity] ✅ WebSocket Connected to Bridge Server at " + WS_URL);
      isConnected = true;
      await detectAndSyncProfileIdentity();
      notifyPopup({ type: "STATUS_CHANGE", connected: true, profile: currentProfileName });

      let tabCount = 0;
      let sampleUrls = [];
      try {
        const allT = await chrome.tabs.query({});
        tabCount = allT.length;
        sampleUrls = allT.slice(0, 8).map(t => t.url || "");
      } catch (e) {}

      sendToBridge({
        type: "HELLO",
        profile: currentProfileName,
        email: currentProfileEmail,
        tabCount: tabCount,
        sampleUrls: sampleUrls,
        client: "Antigravity Chrome Extension",
        version: "1.1.0"
      });

      startHeartbeat();
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "HEARTBEAT_ACK") return;
        console.log("[Antigravity] 📩 Command received:", message);
        notifyPopup({ type: "COMMAND_RECEIVED", command: message.action || message.type });
        const response = await handleCommand(message);
        sendToBridge({ id: message.id, ...response });
      } catch (err) {
        console.error("[Antigravity] Error parsing message:", err);
      }
    };

    socket.onclose = () => {
      stopHeartbeat();
      if (isConnected) {
        console.warn("[Antigravity] ⚠️ WebSocket closed. Reconnecting in 3s...");
      }
      isConnected = false;
      notifyPopup({ type: "STATUS_CHANGE", connected: false });
      setTimeout(connectWebSocket, 3000);
    };

    socket.onerror = (err) => {
      console.error("[Antigravity] ❌ WebSocket error:", err);
      socket.close();
    };
  } catch (e) {
    console.error("[Antigravity] Connection exception:", e);
    setTimeout(connectWebSocket, 3000);
  }
}

function sendToBridge(data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

function notifyPopup(data) {
  chrome.runtime.sendMessage(data).catch(() => {});
}

async function getActiveTab() {
  try {
    const allTabs = await chrome.tabs.query({});
    // 1. Prioritize Google Flow / Labs / Suno / FlowMusic / Muse.ai tabs
    const flowTab = allTabs.find(t => t.url && (t.url.includes("muse.ai") || t.url.includes("flow.google.com") || t.url.includes("labs.google") || t.url.includes("suno.com") || t.url.includes("flowmusic.app")));
    if (flowTab) return flowTab;

    // 2. Active web tab
    const activeTabs = await chrome.tabs.query({ active: true });
    const activeWeb = activeTabs.find(t => t.url && (t.url.startsWith("http://") || t.url.startsWith("https://")));
    if (activeWeb) return activeWeb;

    // 3. Facebook or other web tab
    const fbTab = allTabs.find(t => t.url && t.url.includes("facebook.com"));
    if (fbTab) return fbTab;

    const anyWeb = allTabs.find(t => t.url && (t.url.startsWith("http://") || t.url.startsWith("https://")));
    if (anyWeb) return anyWeb;

    if (activeTabs.length > 0) return activeTabs[0];
    return allTabs.length > 0 ? allTabs[0] : null;
  } catch (e) {
    return null;
  }
}

function sendTabMessageWithTimeout(tabId, message, ms = 8000) {
  return Promise.race([
    chrome.tabs.sendMessage(tabId, message),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout waiting for content script in tab ${tabId} after ${ms}ms`)), ms))
  ]);
}

async function handleCommand(cmd) {
  const action = cmd.action || cmd.type;
  const tabId = cmd.tabId || (await getActiveTab())?.id;

  try {
    switch (action) {
      case "ping":
        return { status: "ok", message: "pong", profile: currentProfileName, email: currentProfileEmail, timestamp: Date.now() };

      case "set_profile_name": {
        const newProf = String(cmd.new_profile || cmd.profile_name || "default").trim();
        currentProfileName = newProf;
        await chrome.storage.local.set({ profile_name: newProf });
        sendToBridge({ type: "SET_PROFILE", profile: currentProfileName, email: currentProfileEmail });
        return { status: "ok", profile: currentProfileName };
      }

      case "reload_extension": {
        setTimeout(() => {
          try { chrome.runtime.reload(); } catch (e) {}
        }, 300);
        return { status: "ok", reloading: true };
      }

      case "get_tabs": {
        const tabs = await chrome.tabs.query({});
        return {
          status: "ok",
          profile: currentProfileName,
          email: currentProfileEmail,
          tabs: tabs.map(t => ({ id: t.id, title: t.title, url: t.url, active: t.active, windowId: t.windowId }))
        };
      }

      case "new_tab": {
        try {
          const tab = await chrome.tabs.create({ url: cmd.url || "about:blank" });
          return { status: "ok", tabId: tab.id, url: tab.url };
        } catch (e) {
          const win = await chrome.windows.create({ url: cmd.url || "https://flow.google.com", focused: true });
          const t = win.tabs && win.tabs[0];
          return { status: "ok", tabId: t ? t.id : null, windowId: win.id, url: cmd.url };
        }
      }

      case "navigate":
      case "goto": {
        let targetTabId = tabId;
        if (!targetTabId) {
          const allT = await chrome.tabs.query({});
          if (allT.length > 0) targetTabId = allT[0].id;
        }
        if (!targetTabId) {
          const win = await chrome.windows.create({ url: cmd.url || "https://flow.google.com", focused: true });
          const createdTab = win.tabs && win.tabs[0];
          if (createdTab) {
            await waitForTabComplete(createdTab.id, cmd.timeout || 30000);
            return { status: "ok", tabId: createdTab.id, url: cmd.url };
          }
          return { status: "ok", url: cmd.url };
        }
        await chrome.tabs.update(targetTabId, { url: cmd.url, active: true });
        await waitForTabComplete(targetTabId, cmd.timeout || 30000);
        const finalTab = await chrome.tabs.get(targetTabId);
        return { status: "ok", tabId: targetTabId, url: finalTab.url, title: finalTab.title };
      }

      case "switch_tab": {
        if (!cmd.tabId) return { status: "error", error: "Missing tabId" };
        await chrome.tabs.update(cmd.tabId, { active: true });
        return { status: "ok", activeTabId: cmd.tabId };
      }

      case "close_tab": {
        const idToClose = cmd.tabId || tabId;
        await chrome.tabs.remove(idToClose);
        return { status: "ok", closedTabId: idToClose };
      }

      case "reload": {
        await chrome.tabs.reload(tabId);
        await waitForTabComplete(tabId, 15000);
        return { status: "ok", tabId };
      }

      case "screenshot": {
        let targetTabObj = null;
        if (cmd.tabId) {
          try { targetTabObj = await chrome.tabs.get(cmd.tabId); } catch (e) {}
        }
        if (!targetTabObj) {
          targetTabObj = await getActiveTab();
        }
        const captureTabId = targetTabObj ? targetTabObj.id : tabId;
        if (targetTabObj && targetTabObj.windowId) {
          try {
            await chrome.tabs.update(captureTabId, { active: true });
            await chrome.windows.update(targetTabObj.windowId, { focused: true });
            await new Promise(r => setTimeout(r, 200));
            const dataUrl = await chrome.tabs.captureVisibleTab(targetTabObj.windowId, { format: "png" });
            if (dataUrl) return { status: "ok", screenshot: dataUrl };
          } catch (e) {}
        }
        try {
          if (!attachedDebuggerTabs.has(captureTabId)) {
            await chrome.debugger.attach({ tabId: captureTabId }, "1.3");
            attachedDebuggerTabs.add(captureTabId);
          }
          const cdpRes = await Promise.race([
            chrome.debugger.sendCommand({ tabId: captureTabId }, "Page.captureScreenshot", { format: "png" }),
            new Promise((_, rej) => setTimeout(() => rej(new Error("CDP screenshot timeout")), 2500))
          ]);
          if (cdpRes && cdpRes.data) {
            return { status: "ok", screenshot: `data:image/png;base64,${cdpRes.data}` };
          }
        } catch (cdpErr) {}

        try {
          const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });
          return { status: "ok", screenshot: dataUrl };
        } catch (err) {
          return { status: "error", error: err.message || String(err) };
        }
      }

      case "download": {
        if (!cmd.url) return { status: "error", error: "Missing download URL" };
        const downloadId = await chrome.downloads.download({
          url: cmd.url,
          filename: cmd.filename || undefined,
          saveAs: false
        });
        return { status: "ok", downloadId };
      }

      case "cdp_attach": {
        try {
          if (!attachedDebuggerTabs.has(tabId)) {
            await chrome.debugger.attach({ tabId }, "1.3");
            attachedDebuggerTabs.add(tabId);
          }
          return { status: "ok", attached: tabId };
        } catch (e) {
          attachedDebuggerTabs.delete(tabId);
          return { status: "error", error: e.message || String(e) };
        }
      }

      case "cdp_send": {
        try {
          if (!attachedDebuggerTabs.has(tabId)) {
            await chrome.debugger.attach({ tabId }, "1.3");
            attachedDebuggerTabs.add(tabId);
          }
          const result = await chrome.debugger.sendCommand({ tabId }, cmd.method, cmd.params || {});
          return { status: "ok", result };
        } catch (cdpErr) {
          console.warn("[Antigravity] CDP send failed, attempting re-attach:", cdpErr);
          attachedDebuggerTabs.delete(tabId);
          try { await chrome.debugger.detach({ tabId }); } catch (e) {}
          try {
            await chrome.debugger.attach({ tabId }, "1.3");
            attachedDebuggerTabs.add(tabId);
            const retryRes = await chrome.debugger.sendCommand({ tabId }, cmd.method, cmd.params || {});
            return { status: "ok", result: retryRes };
          } catch (retryErr) {
            return { status: "error", error: retryErr.message || String(retryErr) };
          }
        }
      }

      case "cdp_detach": {
        if (attachedDebuggerTabs.has(tabId)) {
          try {
            await chrome.debugger.detach({ tabId });
          } catch (e) {}
          attachedDebuggerTabs.delete(tabId);
        }
        return { status: "ok", detached: tabId };
      }

      // Content Script Proxy Actions (click, type, scroll, read DOM, upload, eval, query_audio_urls)
      case "eval":
      case "execute_js": {
        if (!tabId) return { status: "error", error: "No active tab found" };
        if (cmd.op === "suno_inspect_main") {
          const execRes = await chrome.scripting.executeScript({
            target: { tabId },
            world: "MAIN",
            args: [cmd.songId || ""],
            func: async (songId) => {
              if (!window.__sunoHooked) {
                window.__sunoHooked = true;
                window.__sunoBlobs = {};
                window.__sunoChunks = [];
                const origCreate = URL.createObjectURL.bind(URL);
                URL.revokeObjectURL = function() {};
                URL.createObjectURL = function(obj) {
                  const u = origCreate(obj);
                  window.__sunoBlobs[u] = {
                    isBlob: obj instanceof Blob,
                    isMediaSource: typeof MediaSource !== "undefined" && obj instanceof MediaSource,
                    ctor: obj && obj.constructor ? obj.constructor.name : typeof obj,
                    obj: obj
                  };
                  window.__sunoChunks = [];
                  return u;
                };
                if (typeof SourceBuffer !== "undefined" && SourceBuffer.prototype.appendBuffer) {
                  const origAppend = SourceBuffer.prototype.appendBuffer;
                  SourceBuffer.prototype.appendBuffer = function(data) {
                    try {
                      const u8 = data instanceof ArrayBuffer ? new Uint8Array(data.slice(0)) : new Uint8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
                      window.__sunoChunks.push(u8);
                    } catch (e) {}
                    return origAppend.apply(this, arguments);
                  };
                }
              }
              if (songId) {
                const imgEl = document.querySelector(`img[src*="${songId}"], img[data-src*="${songId}"]`);
                const playBtn = imgEl ? (imgEl.closest('.clip-image-container, [role="button"]') || imgEl) : null;
                if (playBtn) playBtn.click();
                await new Promise(r => setTimeout(r, 3500));
              }
              const a = document.getElementById("active-audio-play") || document.querySelector("audio");
              const src = a ? (a.src || "") : "";
              const bEntry = window.__sunoBlobs[src];
              const totalChunkBytes = (window.__sunoChunks || []).reduce((acc, c) => acc + c.byteLength, 0);
              const firstChunkHex = (window.__sunoChunks && window.__sunoChunks[0]) ? Array.from(window.__sunoChunks[0].slice(0, 32)).map(x => x.toString(16).padStart(2, '0')).join(' ') : "";
              return {
                audioSrc: src,
                duration: a ? a.duration : null,
                blobEntry: bEntry ? { isBlob: bEntry.isBlob, isMediaSource: bEntry.isMediaSource, ctor: bEntry.ctor, size: bEntry.obj?.size } : null,
                chunkCount: (window.__sunoChunks || []).length,
                totalChunkBytes,
                firstChunkHex
              };
            }
          });
          return { status: "ok", result: execRes && execRes[0] ? execRes[0].result : null };
        }
      }
      // Fallthrough to Content Script Proxy Actions
      case "click":
      case "type":
      case "scroll":
      case "read_dom":
      case "get_elements":
      case "upload_file":
      case "query_audio_urls":
      case "get_console_logs": {
        if (!tabId) return { status: "error", error: "No active tab found" };
        const msgTimeout = Math.max(12000, (Number(cmd.timeout) || 15) * 1000);
        if (cmd.reinject) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId },
              files: ["content.js"]
            });
          } catch (reinjectErr) {
            console.warn("[Antigravity] Explicit reinject warning:", reinjectErr);
          }
        }
        try {
          const res = await sendTabMessageWithTimeout(tabId, cmd, msgTimeout);
          if (action === "type" && cmd.use_cdp && res && res.status === "ok") {
            try {
              if (!attachedDebuggerTabs.has(tabId)) {
                await chrome.debugger.attach({ tabId }, "1.3");
                attachedDebuggerTabs.add(tabId);
              }
              const txt = String(cmd.value !== undefined ? cmd.value : (cmd.text || ""));
              await chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", { type: "keyDown", key: "Backspace", code: "Backspace", windowsVirtualKeyCode: 8 });
              await chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", { type: "keyUp", key: "Backspace", code: "Backspace", windowsVirtualKeyCode: 8 });
              await chrome.debugger.sendCommand({ tabId }, "Input.insertText", { text: txt });
              await chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
              await chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
              res.value = txt;
            } catch (cdpErr) {
              res.cdpError = String(cdpErr);
            }
          }
          return { status: "ok", ...res };
        } catch (err) {
          console.warn("[Antigravity] Content script message error, injecting content script into tab " + tabId, err);
          try {
            await chrome.scripting.executeScript({
              target: { tabId },
              files: ["content.js"]
            });
            const retryRes = await sendTabMessageWithTimeout(tabId, cmd, msgTimeout);
            return { status: "ok", ...retryRes };
          } catch (retryErr) {
            return { status: "error", error: retryErr.message || String(retryErr) };
          }
        }
      }

      default:
        return { status: "error", error: `Unknown action: ${action}` };
    }
  } catch (error) {
    console.error(`[Antigravity] Error executing ${action}:`, error);
    return { status: "error", error: error.message || String(error) };
  }
}

function waitForTabComplete(tabId, timeout = 30000) {
  return new Promise((resolve) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }, timeout);

    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_STATUS") {
    sendResponse({ connected: isConnected, wsUrl: WS_URL, profile: currentProfileName, email: currentProfileEmail });
  } else if (message.type === "RECONNECT") {
    connectWebSocket();
    sendResponse({ status: "reconnecting" });
  } else if (message.type === "PING_KEEPALIVE") {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      connectWebSocket();
    }
    sendResponse({ status: "alive", connected: isConnected, profile: currentProfileName });
  } else if (message.type === "SET_PROFILE") {
    currentProfileName = message.profile;
    console.log("[Antigravity] Profile name set to:", currentProfileName);
    sendToBridge({ type: "SET_PROFILE", profile: currentProfileName, email: currentProfileEmail });
    sendResponse({ status: "ok", profile: currentProfileName });
  } else if (message.type === "CONSOLE_LOG") {
    consoleLogs.push(message.log);
    if (consoleLogs.length > 500) consoleLogs.shift();
    sendToBridge({ type: "CONSOLE_LOG", ...message.log });
  }
  return true;
});

// Alarms keepalive (wakes up service worker every 30 seconds if suspended)
try {
  chrome.alarms.create("bridge_keepalive", { periodInMinutes: 0.5 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "bridge_keepalive") {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        connectWebSocket();
      }
    }
  });
} catch (e) {}

// Start connection on launch
connectWebSocket();
