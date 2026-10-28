// Antigravity Omni-Browser Controller - Content Script (v1.1.0)
// Injected into web pages to execute direct DOM operations & intercept logs

(function () {
  if (window.__antigravity_msg_listener) {
    try {
      chrome.runtime.onMessage.removeListener(window.__antigravity_msg_listener);
    } catch (e) {}
  }

  console.log("[Antigravity] Content script v1.1.0 active on:", window.location.href);
  try {
    chrome.runtime.sendMessage({ type: "PING_KEEPALIVE", url: window.location.href }).catch(() => {});
  } catch (e) {}

  const capturedLogs = window.__antigravity_captured_logs || [];
  window.__antigravity_captured_logs = capturedLogs;

  if (!window.__antigravity_log_hooked) {
    window.__antigravity_log_hooked = true;
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    function recordLog(level, args) {
      const text = Array.from(args).map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      const logItem = { level, text, url: window.location.href, time: Date.now() };
      capturedLogs.push(logItem);
      if (capturedLogs.length > 200) capturedLogs.shift();
      chrome.runtime.sendMessage({ type: "CONSOLE_LOG", log: logItem }).catch(() => {});
    }

    console.log = function (...args) { recordLog('log', args); originalLog.apply(console, args); };
    console.warn = function (...args) { recordLog('warn', args); originalWarn.apply(console, args); };
    console.error = function (...args) { recordLog('error', args); originalError.apply(console, args); };

    window.addEventListener('error', (event) => {
      recordLog('error', [event.message, event.filename, event.lineno]);
    });

    window.addEventListener('unhandledrejection', (event) => {
      recordLog('error', ['Unhandled Promise Rejection:', event.reason]);
    });
  }

  function isVisible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && window.getComputedStyle(el).visibility !== 'hidden' && window.getComputedStyle(el).display !== 'none';
  }

  function findElement(selector, textSearch = null) {
    if (selector && selector.startsWith('//')) {
      try {
        const result = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (result.singleNodeValue) return result.singleNodeValue;
      } catch (e) {}
    }

    if (selector && !selector.startsWith('//')) {
      try {
        const all = Array.from(document.querySelectorAll(selector));
        const vis = all.find(isVisible);
        if (vis) return vis;
        if (all.length > 0) return all[0];
      } catch (e) {}
    }

    if (textSearch) {
      const lower = textSearch.trim().toLowerCase();
      // 1. Check placeholders and aria-labels on inputs/textareas/buttons first
      const formEls = Array.from(document.querySelectorAll('textarea, input, [role="textbox"], [contenteditable="true"], button, a, [role="button"], [role="menuitem"]'));
      for (const el of formEls) {
        if (!isVisible(el)) continue;
        const ph = (el.getAttribute('CONFIG_REQUIRED') || '').toLowerCase();
        const aria = (el.getAttribute('aria-label') || '').toLowerCase();
        if ((ph && ph.includes(lower)) || (aria && aria.includes(lower))) {
          return el;
        }
      }

      // 2. Exact text match on interactive elements
      const interactive = Array.from(document.querySelectorAll('button, a, [role="button"], [role="menuitem"], [role="tab"], [role="radio"], [role="option"]')).filter(isVisible);
      const exactMatch = interactive.find(el => (el.innerText || '').trim().toLowerCase() === lower);
      if (exactMatch) return exactMatch;

      // 3. Substring match on interactive elements (prefer shortest innerText)
      const subMatches = interactive
        .filter(el => {
          const t = (el.innerText || '').trim().toLowerCase();
          return t.includes(lower) && t.length < 150;
        })
        .sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
      if (subMatches.length > 0) return subMatches[0];

      // 4. Leaf span/div fallback
      const leaves = Array.from(document.querySelectorAll('span, div, label')).filter(el => isVisible(el) && el.children.length === 0);
      const leafExact = leaves.find(el => (el.innerText || '').trim().toLowerCase() === lower);
      if (leafExact) return leafExact;
      const leafSub = leaves.find(el => {
        const t = (el.innerText || '').trim().toLowerCase();
        return t.includes(lower) && t.length < 120;
      });
      if (leafSub) return leafSub;
    }

    return null;
  }

  function setNativeValue(el, val) {
    const strVal = String(val ?? '');
    const tag = (el.tagName || '').toUpperCase();
    const proto = tag === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    try {
      el.focus();
      if (typeof el.select === 'function') el.select();
      if (strVal === '') {
        document.execCommand('delete', false, null);
      } else {
        document.execCommand('insertText', false, strVal);
      }
    } catch (e) {}
    if (el.value !== strVal) {
      if (setter) {
        setter.call(el, strVal);
      } else {
        el.value = strVal;
      }
    }
    try {
      el.dispatchEvent(new InputEvent('input', { bubbles: true, data: strVal, inputType: 'insertText' }));
    } catch (e) {
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const lastChar = strVal.slice(-1) || '0';
    const kc = lastChar.charCodeAt(0);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: lastChar, keyCode: kc, which: kc, bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keypress', { key: lastChar, keyCode: kc, charCode: kc, which: kc, bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { key: lastChar, keyCode: kc, which: kc, bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new FocusEvent('blur', { bubbles: false }));
    el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  }

  function dispatchRealClick(target) {
    target.scrollIntoView({ behavior: 'auto', block: 'center' });
    try { target.focus(); } catch (e) {}
    const rect = target.getBoundingClientRect();
    const clientX = rect.left + rect.width / 2;
    const clientY = rect.top + rect.height / 2;
    const mouseOpts = { bubbles: true, cancelable: true, view: window, clientX, clientY };
    target.dispatchEvent(new PointerEvent('pointerover', mouseOpts));
    target.dispatchEvent(new MouseEvent('mouseover', mouseOpts));
    target.dispatchEvent(new PointerEvent('pointerdown', mouseOpts));
    target.dispatchEvent(new MouseEvent('mousedown', mouseOpts));
    target.dispatchEvent(new PointerEvent('pointerup', mouseOpts));
    target.dispatchEvent(new MouseEvent('mouseup', mouseOpts));
    target.dispatchEvent(new MouseEvent('click', mouseOpts));
    return { x: Math.round(clientX), y: Math.round(clientY) };
  }

  const messageListener = (request, sender, sendResponse) => {
    const action = request.action || request.type;

    try {
      switch (action) {
        case "ping":
          sendResponse({ status: "ok", url: window.location.href, title: document.title });
          break;

        case "click": {
          const el = findElement(request.selector, request.text);
          if (!el) {
            sendResponse({ status: "error", error: `Element not found: ${request.selector || request.text}` });
            break;
          }
          const target = el.closest('button') || el.closest('a') || el.closest('[role="button"]') || el;
          const coords = dispatchRealClick(target);
          sendResponse({
            status: "ok",
            tagName: target.tagName,
            role: target.getAttribute('role'),
            text: (target.innerText || '').trim().slice(0, 120),
            x: coords.x,
            y: coords.y
          });
          break;
        }

        case "type": {
          const el = findElement(request.selector, request.text);
          if (!el) {
            sendResponse({ status: "error", error: `Input element not found: ${request.selector || request.text}` });
            break;
          }
          el.scrollIntoView({ behavior: 'auto', block: 'center' });
          el.focus();

          const valueToSet = request.value !== undefined ? request.value : request.text;

          if (el.isContentEditable || el.getAttribute('contenteditable') === 'true' || (el.getAttribute('role') === 'textbox' && el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT')) {
            if (request.clear) {
              document.execCommand('selectAll', false, null);
              document.execCommand('delete', false, null);
            }
            document.execCommand('insertText', false, valueToSet);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));

            if (request.press_enter) {
              el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
              el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            }

            sendResponse({ status: "ok", value: el.innerText });
            break;
          }

          if (request.use_cdp) {
            try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (e) {}
            sendResponse({ status: "ok", focused: true });
            break;
          }

          if (request.clear) {
            try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (e) {}
          }
          setNativeValue(el, valueToSet);

          if (request.press_enter) {
            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
          }

          sendResponse({ status: "ok", value: el.value });
          break;
        }

        case "query_audio_urls": {
          const aUrls = Array.from(document.querySelectorAll('audio, audio source')).map(a => a.src || a.getAttribute('src')).filter(Boolean);
          const linkUrls = Array.from(document.querySelectorAll('a[href]')).map(a => a.href).filter(h => h && (h.includes('.mp3') || h.includes('.m4a') || h.includes('.wav')));
          const rUrls = performance.getEntriesByType('resource').map(e => e.name).filter(n => n && (n.includes('.mp3') || n.includes('.m4a') || n.includes('.wav') || n.includes('cdn1.suno.ai') || n.includes('cdn2.suno.ai') || n.includes('audiopipe.suno.ai') || n.includes('flowmusic')));
          const merged = Array.from(new Set([...aUrls, ...linkUrls, ...rUrls]));
          sendResponse({ status: "ok", audioUrls: merged, urls: merged, url: window.location.href });
          break;
        }

        case "upload_file": {
          let inputEl = findElement(request.selector);
          if (!inputEl) {
            inputEl = document.querySelector('input[type="file"][accept*="image"]') || document.querySelector('input[type="file"]');
          }

          if (!inputEl) {
            sendResponse({ status: "error", error: "File input element not found" });
            break;
          }

          const byteCharacters = atob(request.fileData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          let mime = request.mimeType;
          if (!mime) {
            const fname = (request.fileName || '').toLowerCase();
            if (fname.endsWith('.png')) mime = 'image/png';
            else if (fname.endsWith('.jpg') || fname.endsWith('.jpeg')) mime = 'image/jpeg';
            else if (fname.endsWith('.webp')) mime = 'image/webp';
            else if (fname.endsWith('.gif')) mime = 'image/gif';
            else mime = 'application/octet-stream';
          }

          const blob = new Blob([byteArray], { type: mime });
          const file = new File([blob], request.fileName || 'upload.bin', { type: mime, lastModified: Date.now() });

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          inputEl.files = dataTransfer.files;

          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));

          sendResponse({ status: "ok", fileName: file.name, fileSize: file.size, mimeType: mime });
          break;
        }

        case "scroll": {
          const x = request.x || 0;
          const y = request.y !== undefined ? request.y : (request.direction === 'up' ? -500 : 500);
          window.scrollBy({ top: y, left: x, behavior: 'smooth' });
          sendResponse({ status: "ok", scrollY: window.scrollY, scrollX: window.scrollX });
          break;
        }

        case "read_dom": {
          if (request.selector) {
            const el = findElement(request.selector);
            if (el) {
              const r = el.getBoundingClientRect();
              sendResponse({
                status: "ok",
                text: el.innerText,
                html: el.innerHTML,
                value: el.value || null,
                x: Math.round(r.left + r.width / 2),
                y: Math.round(r.top + r.height / 2)
              });
              break;
            }
          }
          sendResponse({
            status: "ok",
            title: document.title,
            url: window.location.href,
            bodyText: document.body.innerText.substring(0, 10000),
            buttons: Array.from(document.querySelectorAll('button, a[role="button"]')).filter(isVisible).map(b => b.innerText.trim()).filter(Boolean).slice(0, 40),
            inputs: Array.from(document.querySelectorAll('input, textarea, [role="textbox"]')).filter(isVisible).map(i => ({
              tag: i.tagName,
              type: i.type || '',
              CONFIG_REQUIRED: i.getAttribute('CONFIG_REQUIRED') || '',
              ariaLabel: i.getAttribute('aria-label') || '',
              name: i.name || '',
              value: i.value !== undefined ? i.value : (i.innerText || '')
            })).slice(0, 30)
          });
          break;
        }

        case "eval":
        case "execute_js": {
          if (request.op === "inspect_suno") {
            (async () => {
              try {
                const audios = Array.from(document.querySelectorAll('audio, video')).map(a => ({
                  id: a.id,
                  src: a.src || a.currentSrc,
                  duration: a.duration,
                  paused: a.paused
                }));
                let blobInfo = null;
                const activeAudio = document.querySelector('#active-audio-play') || document.querySelector('audio[src^="blob:"]');
                if (activeAudio && activeAudio.src && activeAudio.src.startsWith('blob:')) {
                  const r = await fetch(activeAudio.src);
                  const b = await r.blob();
                  const ab = await b.arrayBuffer();
                  const u8 = new Uint8Array(ab.slice(0, 32));
                  blobInfo = {
                    size: b.size,
                    type: b.type,
                    headerHex: Array.from(u8).map(x => x.toString(16).padStart(2, '0')).join(' ')
                  };
                }
                sendResponse({
                  status: "ok",
                  audios,
                  blobInfo,
                  cookies: document.cookie ? document.cookie.split(';').map(c => c.trim().split('=')[0]) : []
                });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "extract_suno_audio_base64") {
            (async () => {
              try {
                const songId = request.songId || "";
                let activeAudio = document.querySelector('#active-audio-play') || document.querySelector('audio[src^="blob:"]');
                const prevSrc = activeAudio ? (activeAudio.src || "") : "";

                let clickedPlay = false;

                if (songId) {
                  let playBtn = null;
                  const imgEl = document.querySelector(`img[src*="${songId}"], img[data-src*="${songId}"]`);
                  if (imgEl) {
                    playBtn = imgEl.closest('.clip-image-container, [role="button"]') || imgEl;
                  }
                  if (!playBtn) {
                    const songLink = document.querySelector(`a[href*="/song/${songId}"]`);
                    if (songLink) {
                      let cur = songLink.parentElement;
                      for (let d = 0; d < 8 && cur; d++) {
                        const candidate = cur.querySelector('.clip-image-container, [role="button"][aria-label^="Play"], button[aria-label^="Play"]');
                        if (candidate) {
                          playBtn = candidate;
                          break;
                        }
                        cur = cur.parentElement;
                      }
                    }
                  }
                  if (playBtn) {
                    const aria = (playBtn.getAttribute('aria-label') || '').toLowerCase();
                    if (!aria.startsWith('pause') || !prevSrc.startsWith('blob:')) {
                      dispatchRealClick(playBtn);
                      clickedPlay = true;
                    }
                  }
                }

                let targetBlobUrl = "";
                for (let i = 0; i < 30; i++) {
                  await new Promise(r => setTimeout(r, 400));
                  activeAudio = document.querySelector('#active-audio-play') || document.querySelector('audio[src^="blob:"]');
                  if (activeAudio && activeAudio.src && activeAudio.src.startsWith('blob:')) {
                    if (!clickedPlay || activeAudio.src !== prevSrc) {
                      targetBlobUrl = activeAudio.src;
                      break;
                    }
                  }
                }

                if (!targetBlobUrl) {
                  sendResponse({ status: "error", error: "No active blob audio URL found on Suno page" });
                  return;
                }

                const resp = await fetch(targetBlobUrl);
                const blob = await resp.blob();
                try { if (activeAudio && !activeAudio.paused) activeAudio.pause(); } catch (e) {}

                const dataUrl = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });

                sendResponse({
                  status: "ok",
                  blobUrl: targetBlobUrl,
                  size: blob.size,
                  mimeType: blob.type,
                  dataUrl: dataUrl
                });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "muse_inspect") {
            (async () => {
              try {
                const msgEls = Array.from(document.querySelectorAll('[data-pel-impression="chat_message_impression"]'));
                const messages = msgEls.map((el, idx) => {
                  const vidWrappers = Array.from(el.querySelectorAll('[data-hatch-video-wrapper="true"], video:not([data-hatch-media-owner="avatar-layer"])'));
                  const videos = [];
                  const posterSet = new Set();
                  for (const vw of vidWrappers) {
                    const vEl = vw.tagName === "VIDEO" ? vw : vw.querySelector("video");
                    const src = vw.getAttribute("data-hatch-video-src") || (vEl && (vEl.src || vEl.currentSrc)) || "";
                    const poster = vw.getAttribute("data-hatch-video-poster") || (vEl && vEl.poster) || "";
                    const label = vw.getAttribute("aria-label") || "";
                    if (poster) posterSet.add(poster);
                    if (src && !videos.some(x => x.src === src)) {
                      videos.push({ src, poster, label, duration: vEl ? vEl.duration : null });
                    }
                  }
                  const imgEls = Array.from(el.querySelectorAll("img"));
                  const images = [];
                  for (const img of imgEls) {
                    const iSrc = img.src || img.getAttribute("src") || "";
                    if (!iSrc || posterSet.has(iSrc)) continue;
                    const w = img.naturalWidth || img.width || 0;
                    const h = img.naturalHeight || img.height || 0;
                    if (w >= 64 || h >= 64 || iSrc.startsWith("blob:") || iSrc.startsWith("http")) {
                      if (!images.some(x => x.src === iSrc)) {
                        images.push({ src: iSrc, alt: img.alt || "", width: w, height: h });
                      }
                    }
                  }
                  const busy = Boolean(el.querySelector('[aria-busy="true"]') || el.getAttribute("aria-busy") === "true");
                  return {
                    index: idx,
                    text: (el.innerText || "").trim(),
                    busy,
                    videos,
                    images
                  };
                });

                const allVideoWrappers = Array.from(document.querySelectorAll('[data-hatch-video-wrapper="true"], video:not([data-hatch-media-owner="avatar-layer"])'));
                const allVideos = [];
                const globalPosters = new Set();
                for (const vw of allVideoWrappers) {
                  if (vw.closest('[data-hatch-avatar-host="true"]')) continue;
                  const vEl = vw.tagName === "VIDEO" ? vw : vw.querySelector("video");
                  if (vEl && vEl.getAttribute("data-hatch-media-owner") === "avatar-layer") continue;
                  const src = vw.getAttribute("data-hatch-video-src") || (vEl && (vEl.src || vEl.currentSrc)) || "";
                  const poster = vw.getAttribute("data-hatch-video-poster") || (vEl && vEl.poster) || "";
                  const label = vw.getAttribute("aria-label") || "";
                  if (poster) globalPosters.add(poster);
                  if (src && !allVideos.some(x => x.src === src)) {
                    allVideos.push({ src, poster, label, duration: vEl ? vEl.duration : null });
                  }
                }

                const allImages = [];
                for (const img of Array.from(document.querySelectorAll("img"))) {
                  if (img.closest('[data-hatch-avatar-host="true"]')) continue;
                  const iSrc = img.src || img.getAttribute("src") || "";
                  if (!iSrc || globalPosters.has(iSrc)) continue;
                  const w = img.naturalWidth || img.width || 0;
                  const h = img.naturalHeight || img.height || 0;
                  if (w >= 120 || h >= 120) {
                    if (!allImages.some(x => x.src === iSrc)) {
                      allImages.push({ src: iSrc, alt: img.alt || "", width: w, height: h });
                    }
                  }
                }

                const anyBusyAttr = Boolean(document.querySelector('[data-pel-impression="chat_message_impression"] [aria-busy="true"]'));
                const stopBtn = Array.from(document.querySelectorAll("button")).find(b => {
                  if (!isVisible(b)) return false;
                  const al = (b.getAttribute("aria-label") || "").toLowerCase();
                  return al.includes("dừng") || al.includes("stop");
                });

                sendResponse({
                  status: "ok",
                  url: window.location.href,
                  title: document.title,
                  isBusy: anyBusyAttr || Boolean(stopBtn),
                  messageCount: messages.length,
                  messages: messages.slice(-15),
                  allVideos,
                  allImages
                });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "muse_send_prompt") {
            (async () => {
              try {
                const promptText = String(request.prompt || "").trim();
                if (!promptText) {
                  sendResponse({ status: "error", error: "Empty prompt" });
                  return;
                }
                const composer =
                  document.querySelector('textarea[data-hatch-composer-prehydration-input]') ||
                  document.querySelector('textarea[CONFIG_REQUIRED="Nhắn tin"]') ||
                  document.querySelector('textarea[aria-label="Nhắn tin"]') ||
                  document.querySelector("textarea") ||
                  document.querySelector('[role="textbox"][contenteditable="true"]');

                if (!composer) {
                  sendResponse({ status: "error", error: "Muse composer input not found" });
                  return;
                }

                composer.scrollIntoView({ behavior: "auto", block: "center" });
                composer.focus();

                if (composer.tagName === "TEXTAREA" || composer.tagName === "INPUT") {
                  setNativeValue(composer, "");
                  setNativeValue(composer, promptText);
                } else {
                  document.execCommand("selectAll", false, null);
                  document.execCommand("delete", false, null);
                  document.execCommand("insertText", false, promptText);
                  composer.dispatchEvent(new Event("input", { bubbles: true }));
                  composer.dispatchEvent(new Event("change", { bubbles: true }));
                }

                await new Promise(r => setTimeout(r, 250));

                let clickedButton = false;
                const actionSlotBtn = document.querySelector('[data-hatch-composer-action-slot="true"] button:not([disabled])');
                if (actionSlotBtn && isVisible(actionSlotBtn)) {
                  dispatchRealClick(actionSlotBtn);
                  clickedButton = true;
                } else {
                  const enterOpts = { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true };
                  composer.dispatchEvent(new KeyboardEvent("keydown", enterOpts));
                  composer.dispatchEvent(new KeyboardEvent("keypress", enterOpts));
                  composer.dispatchEvent(new KeyboardEvent("keyup", enterOpts));
                }

                await new Promise(r => setTimeout(r, 200));
                const remaining = composer.value !== undefined ? composer.value : (composer.innerText || "");
                if (remaining && remaining.trim().length > 0) {
                  const enterOpts = { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true };
                  composer.dispatchEvent(new KeyboardEvent("keydown", enterOpts));
                  composer.dispatchEvent(new KeyboardEvent("keyup", enterOpts));
                }

                sendResponse({
                  status: "ok",
                  sentPrompt: promptText,
                  clickedButton,
                  remaining: composer.value !== undefined ? composer.value : (composer.innerText || "")
                });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "muse_extract_blob") {
            (async () => {
              try {
                let targetUrl = request.blobUrl || request.url || "";
                if (!targetUrl) {
                  const vw = Array.from(document.querySelectorAll('[data-hatch-video-wrapper="true"], video:not([data-hatch-media-owner="avatar-layer"])'))
                    .filter(el => !el.closest('[data-hatch-avatar-host="true"]'))
                    .pop();
                  if (vw) {
                    const vEl = vw.tagName === "VIDEO" ? vw : vw.querySelector("video");
                    targetUrl = vw.getAttribute("data-hatch-video-src") || (vEl && (vEl.src || vEl.currentSrc)) || "";
                  }
                }
                if (!targetUrl) {
                  sendResponse({ status: "error", error: "No target blob/media URL found" });
                  return;
                }
                window.__museBlobCache = window.__museBlobCache || {};
                let cached = window.__museBlobCache[targetUrl];
                if (!cached || request.forceRefresh) {
                  const resp = await fetch(targetUrl);
                  const blob = await resp.blob();
                  const fullDataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                  });
                  cached = {
                    size: blob.size,
                    mimeType: blob.type,
                    dataUrl: fullDataUrl
                  };
                  window.__museBlobCache[targetUrl] = cached;
                }

                const offset = Number(request.offset || 0);
                const maxChunk = Number(request.chunkSize || 450000);
                const totalLen = cached.dataUrl.length;
                const chunkStr = cached.dataUrl.slice(offset, offset + maxChunk);
                const nextOffset = offset + chunkStr.length;
                const hasMore = nextOffset < totalLen;
                if (!hasMore) {
                  delete window.__museBlobCache[targetUrl];
                }

                sendResponse({
                  status: "ok",
                  blobUrl: targetUrl,
                  size: cached.size,
                  mimeType: cached.mimeType,
                  totalLength: totalLen,
                  offset: offset,
                  nextOffset: nextOffset,
                  hasMore: hasMore,
                  chunk: chunkStr
                });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "flow_ensure_mode") {
            (async () => {
              try {
                const wantVideo = request.wantVideo !== undefined ? Boolean(request.wantVideo) : String(request.stageType || "").toLowerCase() === "video";
                const wantFrames = request.wantFrames !== undefined ? Boolean(request.wantFrames) : String(request.refMode || "").toLowerCase() === "start";
                const targetAspect = String(request.targetAspect || request.aspectRatio || "16:9");
                const rawCount = request.targetCount || (request.count ? `x${request.count}` : "x1");
                const targetCount = String(rawCount).toLowerCase().startsWith("x") ? String(rawCount) : `x${rawCount}`;
                const targetModelKw = String(request.targetModelKw || request.modelKw || (wantVideo ? "lite" : "pro")).toLowerCase();

                const activeAddMenu = document.querySelector("button.add-menu-trigger-active");
                if (activeAddMenu) {
                  dispatchRealClick(activeAddMenu);
                  await new Promise(r => setTimeout(r, 220));
                }
                const backdrop = document.querySelector(".cdk-overlay-backdrop");
                if (backdrop) {
                  backdrop.click();
                  await new Promise(r => setTimeout(r, 200));
                }

                const findSettingsTrigger = () => {
                  const direct = document.querySelector("button.settings-trigger-button");
                  if (direct) return direct;
                  return Array.from(document.querySelectorAll("button")).find(b => {
                    const t = (b.innerText || "").toLowerCase();
                    return (t.includes("crop_") || t.includes("16:9") || t.includes("9:16")) && (t.includes("x1") || t.includes("x2") || t.includes("x3") || t.includes("x4"));
                  });
                };

                let panel = document.querySelector("flow-prompt-box-settings");
                const trig = findSettingsTrigger();
                if (!panel && trig) {
                  dispatchRealClick(trig);
                  await new Promise(r => setTimeout(r, 420));
                  panel = document.querySelector("flow-prompt-box-settings");
                }
                if (!panel) {
                  sendResponse({ status: "ok", ok: false, reason: "no_panel", hasProseMirror: !!document.querySelector("div.ProseMirror, .ProseMirror") });
                  return;
                }

                const clickToggleMatching = async (pred) => {
                  const btns = Array.from(panel.querySelectorAll('button.mat-button-toggle-button, button[role="radio"]'));
                  const target = btns.find(b => pred((b.innerText || "").toLowerCase()));
                  if (target) {
                    const isChecked = target.getAttribute("aria-checked") === "true"
                      || target.getAttribute("aria-pressed") === "true"
                      || (target.closest("mat-button-toggle") && target.closest("mat-button-toggle").classList.contains("mat-button-toggle-checked"));
                    if (!isChecked) {
                      dispatchRealClick(target);
                      await new Promise(r => setTimeout(r, 380));
                      return true;
                    }
                  }
                  return false;
                };

                if (wantVideo) {
                  await clickToggleMatching(t => t.includes("videocam") || (t.includes("video") && !t.includes("audio")));
                  if (wantFrames) {
                    await clickToggleMatching(t => t.includes("crop_free") || t.includes("khung hình") || t.includes("frame"));
                  } else {
                    await clickToggleMatching(t => t.includes("chrome_extension") || t.includes("thành phần") || t.includes("ingredient"));
                  }
                } else {
                  await clickToggleMatching(t => t.includes("image") || t.includes("hình ảnh"));
                }

                if (targetAspect === "9:16") {
                  await clickToggleMatching(t => t.includes("9:16") || t.includes("crop_9_16") || t.includes("dọc") || t.includes("portrait"));
                } else if (targetAspect === "1:1") {
                  await clickToggleMatching(t => t.includes("1:1") || t.includes("crop_square"));
                } else if (targetAspect === "4:3") {
                  await clickToggleMatching(t => t.includes("4:3") || t.includes("crop_landscape"));
                } else if (targetAspect === "3:4") {
                  await clickToggleMatching(t => t.includes("3:4") || t.includes("crop_portrait"));
                } else {
                  await clickToggleMatching(t => t.includes("16:9") || t.includes("crop_16_9") || t.includes("ngang") || t.includes("landscape"));
                }

                await clickToggleMatching(t => t.trim() === targetCount.toLowerCase());

                const menuTrig = panel.querySelector("button.mat-mdc-menu-trigger");
                let verifiedModel = "";
                if (menuTrig) {
                  const curModelText = (menuTrig.innerText || "").replace("arrow_drop_down", "").trim();
                  const curLower = curModelText.toLowerCase();
                  let modelMatches = false;
                  if (wantVideo) {
                    if (targetModelKw === "quality" && curLower.includes("quality")) modelMatches = true;
                    else if (targetModelKw === "fast" && curLower.includes("fast")) modelMatches = true;
                    else if (targetModelKw === "lite" && curLower.includes("lite")) modelMatches = true;
                    else if (targetModelKw === "omni" && (curLower.includes("omni") || curLower.includes("flash"))) modelMatches = true;
                  } else {
                    if (targetModelKw === "pro" && curLower.includes("pro")) modelMatches = true;
                    else if (targetModelKw === "lite" && curLower.includes("lite")) modelMatches = true;
                    else if (targetModelKw === "2.1" && (curLower.includes("2.1") || (curLower.includes("banana 2") && !curLower.includes("lite")))) modelMatches = true;
                  }

                  if (!modelMatches) {
                    dispatchRealClick(menuTrig);
                    await new Promise(r => setTimeout(r, 420));
                    const items = Array.from(document.querySelectorAll('.mat-mdc-menu-panel button[role="menuitem"], .cdk-overlay-container button[role="menuitem"], .mat-mdc-menu-panel button'));
                    const matched = items.find(el => {
                      const t = (el.innerText || "").toLowerCase();
                      if (wantVideo) {
                        if (targetModelKw === "quality") return t.includes("quality");
                        if (targetModelKw === "fast") return t.includes("fast");
                        if (targetModelKw === "lite") return t.includes("lite");
                        if (targetModelKw === "omni") return t.includes("omni") || t.includes("flash");
                      } else {
                        if (targetModelKw === "pro") return t.includes("pro");
                        if (targetModelKw === "lite") return t.includes("lite");
                        if (targetModelKw === "2.1") return t.includes("2.1") || (t.includes("banana 2") && !t.includes("lite"));
                      }
                      return t.includes(targetModelKw);
                    });
                    if (matched) {
                      dispatchRealClick(matched);
                      await new Promise(r => setTimeout(r, 380));
                    }
                  }
                  const menuTrigAfter = panel.querySelector("button.mat-mdc-menu-trigger");
                  verifiedModel = menuTrigAfter ? (menuTrigAfter.innerText || "").replace("arrow_drop_down", "").trim() : curModelText;
                }

                const bdAfter = document.querySelector(".cdk-overlay-backdrop");
                if (bdAfter) {
                  bdAfter.click();
                  await new Promise(r => setTimeout(r, 200));
                }
                const trigAfter = findSettingsTrigger();
                if (trigAfter && document.querySelector("flow-prompt-box-settings")) {
                  dispatchRealClick(trigAfter);
                  await new Promise(r => setTimeout(r, 250));
                }
                const summaryTxt = trigAfter ? (trigAfter.innerText || "").replace(/\n+/g, " · ").trim() : "";
                sendResponse({
                  status: "ok",
                  ok: true,
                  modelTxt: verifiedModel,
                  summaryTxt,
                  hasProseMirror: !!document.querySelector("div.ProseMirror, .ProseMirror")
                });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "flow_clear_and_focus") {
            (async () => {
              try {
                const activeMenu = document.querySelector("button.add-menu-trigger-active");
                if (activeMenu) {
                  dispatchRealClick(activeMenu);
                  await new Promise(r => setTimeout(r, 200));
                }
                const clearBtn = document.querySelector("button.clear-button");
                if (clearBtn && !clearBtn.hasAttribute("disabled")) {
                  dispatchRealClick(clearBtn);
                  await new Promise(r => setTimeout(r, 280));
                }
                const chipCloses = Array.from(document.querySelectorAll("flow-ingredient-bar button.chip-close-btn, flow-ingredient-bar button"));
                for (const cb of chipCloses) {
                  if ((cb.innerText || "").includes("close")) {
                    dispatchRealClick(cb);
                    await new Promise(r => setTimeout(r, 120));
                  }
                }
                const editor = document.querySelector("div.ProseMirror, .ProseMirror");
                if (!editor) {
                  sendResponse({ status: "ok", cleared: false, reason: "no_editor" });
                  return;
                }
                editor.focus();
                document.execCommand("selectAll", false, null);
                document.execCommand("delete", false, null);
                if ((editor.innerText || "").trim().length > 0) {
                  editor.innerHTML = "<p><br></p>";
                }
                sendResponse({ status: "ok", cleared: true });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "flow_attach_ref") {
            (async () => {
              try {
                const refFilename = String(request.fileName || "");
                const refStem = String(request.fileStem || "");
                const shortStem = String(request.shortStem || "");
                const b64Data = String(request.b64Data || "");
                const mimeType = String(request.mimeType || "image/png");

                const chipsBefore = document.querySelectorAll("flow-ingredient-bar img.chip-image").length;
                const findAssetItem = () => {
                  const items = Array.from(document.querySelectorAll("button.asset-item"));
                  const fnLow = refFilename.toLowerCase();
                  const stemLow = refStem.toLowerCase();
                  const shortLow = shortStem.toLowerCase();
                  return items.find(b => {
                    const t = (b.innerText || "").toLowerCase();
                    return (fnLow && t.includes(fnLow)) || (stemLow && t.includes(stemLow)) || (shortLow && t.includes(shortLow));
                  });
                };

                const addBtn = document.querySelector("button.add-menu-trigger") || Array.from(document.querySelectorAll("button")).find(b => (b.innerText || "").trim() === "add" && b.closest("flow-prompt-box, .prompt-box, footer, form"));
                if (addBtn && !addBtn.classList.contains("add-menu-trigger-active")) {
                  dispatchRealClick(addBtn);
                  await new Promise(r => setTimeout(r, 550));
                }

                let matched = findAssetItem();
                if (!matched && b64Data) {
                  const uploadBtn = document.querySelector("button.sidebar-upload-btn") || Array.from(document.querySelectorAll("button")).find(b => {
                    const t = (b.innerText || "").toLowerCase();
                    return t.includes("tải") || t.includes("upload");
                  });
                  if (uploadBtn) {
                    const byteCharacters = atob(b64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const file = new File([byteArray], refFilename, { type: mimeType, lastModified: Date.now() });

                    const origClick = HTMLInputElement.prototype.click;
                    HTMLInputElement.prototype.click = function () {
                      if (this.type === "file") {
                        const dt = new DataTransfer();
                        dt.items.add(file);
                        this.files = dt.files;
                        this.dispatchEvent(new Event("change", { bubbles: true }));
                        this.dispatchEvent(new Event("input", { bubbles: true }));
                        return;
                      }
                      return origClick.apply(this, arguments);
                    };
                    try {
                      uploadBtn.click();
                      await new Promise(r => setTimeout(r, 450));
                    } finally {
                      HTMLInputElement.prototype.click = origClick;
                    }
                  }
                }

                for (let step = 0; step < 8; step++) {
                  const curAdd = document.querySelector("button.add-menu-trigger");
                  if (curAdd && !curAdd.classList.contains("add-menu-trigger-active")) {
                    dispatchRealClick(curAdd);
                    await new Promise(r => setTimeout(r, 350));
                  }
                  matched = findAssetItem();
                  if (matched) {
                    const low = (matched.innerText || "").toLowerCase();
                    const isUploading = !!matched.querySelector("mat-spinner") || low.includes("đang tải lên") || low.includes("uploading");
                    if (!isUploading) break;
                  } else if (step >= 2) {
                    break;
                  }
                  await new Promise(r => setTimeout(r, 700));
                }

                if (matched) {
                  dispatchRealClick(matched);
                  await new Promise(r => setTimeout(r, 550));
                  const confirmBtn = document.querySelector("button.detail-add-to-prompt-btn");
                  if (confirmBtn) {
                    dispatchRealClick(confirmBtn);
                    await new Promise(r => setTimeout(r, 450));
                  }
                }

                const activeTrigger = document.querySelector("button.add-menu-trigger-active");
                if (activeTrigger) {
                  dispatchRealClick(activeTrigger);
                  await new Promise(r => setTimeout(r, 200));
                }
                const chipsAfter = document.querySelectorAll("flow-ingredient-bar img.chip-image").length;
                sendResponse({
                  status: "ok",
                  attached: chipsAfter > chipsBefore,
                  chipsBefore,
                  chipsAfter
                });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "flow_snapshot_media") {
            const imgs = Array.from(document.querySelectorAll("img")).map(i => i.src).filter(Boolean);
            const vids = Array.from(document.querySelectorAll("video, video source")).map(v => v.src).filter(Boolean);
            const res = performance.getEntriesByType("resource").map(e => e.name).filter(n => n.includes("googleusercontent") || n.includes("/video/") || n.includes("/asb/") || n.includes("flow-content.google"));
            sendResponse({ status: "ok", urls: Array.from(new Set([...imgs, ...vids, ...res])) });
            return true;
          }

          if (request.op === "flow_click_generate") {
            (async () => {
              try {
                const activeMenu = document.querySelector("button.add-menu-trigger-active");
                if (activeMenu) {
                  dispatchRealClick(activeMenu);
                  await new Promise(r => setTimeout(r, 220));
                }
                const findGenBtn = () => {
                  return document.querySelector("button.generate-icon-button, .generate-icon-button")
                    || Array.from(document.querySelectorAll("button")).find(b => {
                      const aria = (b.getAttribute("aria-label") || "").toLowerCase();
                      const txt = (b.innerText || "").toLowerCase();
                      return aria.includes("tạo") || aria.includes("generate") || txt.includes("arrow_forward");
                    });
                };
                const btn = findGenBtn();
                if (!btn || btn.hasAttribute("disabled")) {
                  sendResponse({ status: "ok", ok: false, clicked: false, reason: "btn_disabled_or_missing" });
                  return;
                }
                const ed = document.querySelector("div.ProseMirror, .ProseMirror");
                if (ed) {
                  try { ed.focus(); } catch (e) {}
                }
                dispatchRealClick(btn);
                await new Promise(r => setTimeout(r, 500));
                const edAfter1 = document.querySelector("div.ProseMirror, .ProseMirror");
                const btnAfter = findGenBtn();
                if (edAfter1 && (edAfter1.innerText || "").trim().length > 5 && btnAfter && !btnAfter.disabled && !btnAfter.hasAttribute("disabled")) {
                  btnAfter.click();
                  await new Promise(r => setTimeout(r, 400));
                }
                const edAfter2 = document.querySelector("div.ProseMirror, .ProseMirror");
                if (edAfter2 && (edAfter2.innerText || "").trim().length > 5) {
                  edAfter2.focus();
                  edAfter2.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, which: 13, shiftKey: false, ctrlKey: false, metaKey: false, bubbles: true, cancelable: true, composed: true }));
                  edAfter2.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", keyCode: 13, which: 13, shiftKey: false, ctrlKey: false, metaKey: false, bubbles: true, cancelable: true, composed: true }));
                  await new Promise(r => setTimeout(r, 400));
                }
                const edFinal = document.querySelector("div.ProseMirror, .ProseMirror");
                const recentRes = performance.getEntriesByType("resource").slice(-8).map(e => ({ name: e.name.slice(0, 120), type: e.initiatorType, status: e.responseStatus }));
                const toasts = Array.from(document.querySelectorAll("mat-snack-bar-container, [role='alert'], [role='status'], .mat-mdc-snack-bar-label")).map(e => (e.innerText || "").trim()).filter(Boolean);
                sendResponse({
                  status: "ok",
                  ok: true,
                  clicked: true,
                  editorRemainingLen: edFinal ? (edFinal.innerText || "").trim().length : 0,
                  recentRes,
                  toasts
                });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "flow_poll_media") {
            (async () => {
              try {
                const oldUrls = new Set(Array.isArray(request.oldUrls) ? request.oldUrls : []);
                const stageType = String(request.stageType || "image").toLowerCase();
                if (stageType === "video") {
                  const vtiles = Array.from(document.querySelectorAll("flow-video-tile")).slice(0, 2);
                  for (const vt of vtiles) {
                    const thumb = vt.querySelector("img.thumbnail, img");
                    const hasVid = vt.querySelector("video[src]");
                    if (!hasVid && (!thumb || !oldUrls.has(thumb.src))) {
                      vt.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
                      vt.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
                      const inner = vt.querySelector(".container") || vt;
                      inner.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
                    }
                  }
                  await new Promise(r => setTimeout(r, 350));
                  const vids = Array.from(document.querySelectorAll("flow-video-tile video, video"))
                    .map(v => v.src || (v.querySelector("source") ? v.querySelector("source").src : ""))
                    .filter(s => s && !oldUrls.has(s) && (s.includes("flow.google.com") || s.includes("flow-content.google") || s.includes("googleusercontent") || s.includes("googlevideo.com") || s.startsWith("blob:")));
                  if (vids.length > 0) {
                    sendResponse({ status: "ok", ok: true, found: true, url: vids[0], detectedUrl: vids[0] });
                    return;
                  }
                  const resVids = performance.getEntriesByType("resource")
                    .map(e => e.name)
                    .filter(n => !oldUrls.has(n) && (n.includes("/video/") || n.includes(".mp4")));
                  if (resVids.length > 0) {
                    const u = resVids[resVids.length - 1];
                    sendResponse({ status: "ok", ok: true, found: true, url: u, detectedUrl: u });
                    return;
                  }
                } else {
                  const imgs = Array.from(document.querySelectorAll("img")).filter(i =>
                    i.src && !oldUrls.has(i.src) && !i.src.includes("gstatic.com") && !i.src.includes("google.com/images") &&
                    !i.src.includes("googleusercontent.com/ogw/") && !i.src.includes("=s32-") && !i.src.includes("=s64-") && !i.src.includes("=s96-") &&
                    !i.classList.contains("chip-image") && !i.classList.contains("asset-thumbnail-image") && !i.classList.contains("detail-preview-image") &&
                    !i.closest("flow-video-tile") && !i.closest("flow-ingredient-bar") && !i.closest("flow-add-menu") && !i.closest(".add-menu-popover-container") &&
                    (i.src.includes("flow.google.com/asb/") || i.src.includes("flow-content.google/image/") || (i.complete && i.naturalWidth > 350))
                  );
                  if (imgs.length > 0) {
                    sendResponse({ status: "ok", ok: true, found: true, url: imgs[0].src, detectedUrl: imgs[0].src });
                    return;
                  }
                }
                sendResponse({ status: "ok", ok: true, found: false, url: null, detectedUrl: null });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          if (request.op === "flow_fetch_blob") {
            (async () => {
              try {
                const res = await fetch(String(request.targetUrl || request.url || ""));
                const blob = await res.blob();
                const dataUrl = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
                sendResponse({ status: "ok", ok: true, dataUrl, size: blob.size });
              } catch (e) {
                sendResponse({ status: "error", error: e.message || String(e) });
              }
            })();
            return true;
          }

          try {
            const result = window.eval(request.code);
            sendResponse({ status: "ok", result: typeof result === 'object' ? JSON.stringify(result) : String(result) });
          } catch (evalErr) {
            sendResponse({ status: "error", error: evalErr.message });
          }
          break;
        }

        case "get_console_logs": {
          sendResponse({ status: "ok", logs: capturedLogs });
          break;
        }

        default:
          sendResponse({ status: "error", error: `Unknown content script action: ${action}` });
      }
    } catch (err) {
      sendResponse({ status: "error", error: err.message || String(err) });
    }
    return true;
  };

  window.__antigravity_msg_listener = messageListener;
  chrome.runtime.onMessage.addListener(messageListener);
})();
