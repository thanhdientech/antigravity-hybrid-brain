document.addEventListener('DOMContentLoaded', () => {
  if (window.location.search && window.location.search.includes('reload=1')) {
    setTimeout(() => {
      try { chrome.runtime.reload(); } catch (e) {}
    }, 200);
    return;
  }
  const dot = document.getElementById('status-dot');
  const label = document.getElementById('status-label');
  const reconnectBtn = document.getElementById('reconnect-btn');
  const logsBox = document.getElementById('recent-logs');
  const profileInput = document.getElementById('profile-input');
  const saveProfileBtn = document.getElementById('save-profile-btn');

  function updateStatus(connected) {
    if (connected) {
      dot.className = 'dot connected';
      label.textContent = 'ĐÃ KẾT NỐI (Live)';
      label.style.color = '#22c55e';
    } else {
      dot.className = 'dot disconnected';
      label.textContent = 'CHƯA KẾT NỐI';
      label.style.color = '#ef4444';
    }
  }

  function addLog(text) {
    const time = new Date().toLocaleTimeString();
    logsBox.innerHTML += `<br>[${time}] ${text}`;
    logsBox.scrollTop = logsBox.scrollHeight;
  }

  // Load saved profile name without overwriting to '67'
  chrome.storage.local.get(['profile_name'], (res) => {
    if (res && res.profile_name) {
      profileInput.value = res.profile_name;
    } else {
      profileInput.value = 'default';
    }
  });

  // Save profile name
  saveProfileBtn.addEventListener('click', () => {
    const name = profileInput.value.trim() || 'default';
    chrome.storage.local.set({ profile_name: name }, () => {
      addLog(`💾 Đã đổi tên profile thành: "${name}"`);
      chrome.runtime.sendMessage({ type: "SET_PROFILE", profile: name });
    });
  });

  // Query background for status
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    if (response) {
      updateStatus(response.connected);
      if (response.profile) profileInput.value = response.profile;
    }
  });

  // Reconnect button
  reconnectBtn.addEventListener('click', () => {
    addLog("Đang gửi yêu cầu kết nối lại...");
    chrome.runtime.sendMessage({ type: "RECONNECT" }, () => {
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: "GET_STATUS" }, (res) => {
          if (res) updateStatus(res.connected);
        });
      }, 1000);
    });
  });

  // Listen for background updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "STATUS_CHANGE") {
      updateStatus(message.connected);
      addLog(message.connected ? "✅ Đã thông mạch với Antigravity!" : "⚠️ Mất kết nối tới máy chủ!");
    } else if (message.type === "COMMAND_RECEIVED") {
      addLog(`👉 Lệnh: ${message.command}`);
    }
  });
});
