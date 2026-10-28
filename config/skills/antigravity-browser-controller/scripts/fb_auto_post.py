# -*- coding: utf-8 -*-
"""
======================================================================
⚡ ANTIGRAVITY FACEBOOK AUTO-POSTER (1-TOUCH CLI & MODULE)
Tự động hóa 100% đăng bài viết kèm ẢNH hoặc VIDEO lên Facebook
qua trình duyệt Cốc Cốc / Google Chrome (Omni-Browser Bridge)
======================================================================
Cú pháp dòng lệnh:
  1. Đăng bài viết có Ảnh:
     python fb_auto_post.py -i "anh_dep.jpg" -c "Caption ở đây..." -p "profile_01"

  2. Đăng bài viết có Video:
     python fb_auto_post.py -v "video.mp4" -c "Caption ở đây..." -p "profile_01"

  3. Đăng bài viết thuần chữ (Text only):
     python fb_auto_post.py -c "Nội dung status..." -p "profile_01"
======================================================================
"""

import argparse
import base64
import json
import os
import sys
import time
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding="utf-8")

BRIDGE_HTTP_URL = "http://127.0.0.1:8766"

def call_bridge(action_dict, timeout=60):
    url = f"{BRIDGE_HTTP_URL}/action"
    data = json.dumps(action_dict).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"status": "error", "error": str(e)}

def get_fb_tab(profile):
    """Tìm tab Facebook đang mở trong profile mục tiêu"""
    res = call_bridge({"profile": profile, "action": "get_tabs"})
    tabs = res.get("tabs", [])
    for t in tabs:
        if "facebook.com" in t.get("url", ""):
            return t.get("id")
    return None

def cdp_send(profile, tab_id, method, params=None):
    return call_bridge({
        "profile": profile,
        "tabId": tab_id,
        "action": "cdp_send",
        "method": method,
        "params": params or {}
    })

def cdp_eval(profile, tab_id, expr):
    return cdp_send(profile, tab_id, "Runtime.evaluate", {
        "expression": expr,
        "returnByValue": True
    })

def post_to_facebook(profile="default", media_path=None, is_video=False, caption=None, screenshot_out=None):
    print("=" * 65)
    media_type = "VIDEO" if is_video else ("ẢNH" if media_path else "VĂN BẢN")
    print(f"🚀 ANTIGRAVITY FACEBOOK AUTO-POSTER [{media_type}]")
    print(f"• Profile: {profile}")
    if media_path:
        print(f"• File đính kèm: {media_path} (Tồn tại: {os.path.exists(media_path)})")
    if caption:
        print(f"• Caption: {caption[:60]}...")
    print("=" * 65)

    # 1. Xác định Tab Facebook
    print("\n[1/5] Định vị tab Facebook...")
    tab_id = get_fb_tab(profile)
    if not tab_id:
        print(f"  -> Tab Facebook chưa mở. Đang chuyển hướng...")
        call_bridge({"profile": profile, "action": "goto", "url": "https://www.facebook.com"})
        time.sleep(4)
        tab_id = get_fb_tab(profile)
        if not tab_id:
            print("[!] LỖI: Không thể mở tab Facebook!")
            return False

    print(f"  -> Đã kết nối Tab Facebook (ID: {tab_id})")

    # 2. Dọn dẹp modal cũ
    print("\n[2/5] Dọn dẹp các modal/chat popup cũ...")
    cdp_eval(profile, tab_id, """
    (() => {
        const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
        dialogs.forEach(d => {
            const closeBtn = d.querySelector('[aria-label="Đóng"], [aria-label="Đóng đoạn chat"]');
            if (closeBtn) closeBtn.click();
            else d.remove();
        });
    })()
    """)
    time.sleep(1.0)

    # 3. Mở khung Tạo bài viết
    print("\n[3/5] Mở modal 'Tạo bài viết'...")
    cdp_eval(profile, tab_id, """
    (() => {
        // Ưu tiên bấm nút 'Ảnh/video' trên bảng tin để nạp luôn dropzone
        const feedButtons = Array.from(document.querySelectorAll('div[role="button"], span')).filter(el => {
            const t = el.innerText || '';
            const aria = el.getAttribute('aria-label') || '';
            return (t.trim() === 'Ảnh/video' || aria.includes('Ảnh/video')) && !el.closest('div[role="dialog"]');
        });

        if (feedButtons.length > 0) {
            feedButtons[0].click();
            return { openedViaFeed: true };
        }

        // Fallback: bấm vào 'Kent ơi, bạn đang nghĩ gì thế?'
        const trigger = Array.from(document.querySelectorAll('span, div')).find(el => el.innerText && el.innerText.trim().includes('nghĩ gì thế'));
        if (trigger) {
            (trigger.closest('[role="button"]') || trigger).click();
            return { openedViaTrigger: true };
        }

        return { error: "Không tìm thấy nút tạo bài" };
    })()
    """)
    time.sleep(2.0)

    # 4. Đính kèm File Ảnh hoặc Video (nếu có)
    if media_path and os.path.exists(media_path):
        abs_media = os.path.abspath(media_path)
        print(f"\n[4/5] Đính kèm file {media_type}: '{abs_media}'...")

        doc = cdp_send(profile, tab_id, "DOM.getDocument")
        root_id = doc.get("result", {}).get("root", {}).get("nodeId")
        file_node = cdp_send(profile, tab_id, "DOM.querySelector", {
            "nodeId": root_id,
            "selector": 'div[role="dialog"] input[type="file"], input[type="file"][accept*="image"], input[type="file"][accept*="video"], input[type="file"]'
        })
        node_id = file_node.get("result", {}).get("nodeId")

        if node_id:
            cdp_send(profile, tab_id, "DOM.setFileInputFiles", {
                "files": [abs_media],
                "nodeId": node_id
            })
            print("  -> Đã nạp file qua CDP DOM.setFileInputFiles thành công.")

            # Trigger change event
            cdp_eval(profile, tab_id, """
            (() => {
                const inp = document.querySelector('div[role="dialog"] input[type="file"]') || document.querySelector('input[type="file"]');
                if (inp) {
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    inp.dispatchEvent(new Event('change', { bubbles: true }));
                }
            })()
            """)

            # Chờ xác thực preview (ảnh blob hoặc video player)
            print("  -> Chờ Facebook xử lý file và hiển thị thumbnail preview...")
            preview_verified = False
            for attempt in range(12):
                time.sleep(1.5)
                check = cdp_eval(profile, tab_id, """
                (() => {
                    const dialog = Array.from(document.querySelectorAll('div[role="dialog"]')).find(d => (d.innerText || '').includes('Tạo bài viết'));
                    if (!dialog) return { ready: false };

                    const hasVideo = !!dialog.querySelector('video');
                    const hasBlobImg = Array.from(dialog.querySelectorAll('img')).some(img => img.src.startsWith('blob:') || (img.width > 120 && img.height > 120));
                    const text = dialog.innerText || '';
                    const hasMediaText = text.includes('Chỉnh sửa') || text.includes('Tùy chọn video');

                    const postBtn = Array.from(dialog.querySelectorAll('[role="button"]')).find(b => (b.innerText || '').trim() === 'Đăng');
                    const canPost = postBtn && postBtn.getAttribute('aria-disabled') !== 'true';

                    return { ready: hasVideo || hasBlobImg || hasMediaText, canPost };
                })()
                """)
                val = check.get("result", {}).get("result", {}).get("value", {})
                if val.get("ready"):
                    print(f"  [+] XÁC NHẬN: Preview {media_type} đã hiển thị trong modal!")
                    preview_verified = True
                    break

            if not preview_verified:
                print("  [!] Cảnh báo: Chưa phát hiện preview rõ ràng, nhưng tiếp tục thử đăng...")
        else:
            print("[!] CẢNH BÁO: Không tìm thấy input[type=file] trong modal!")

    # 5. Gõ Caption & Đăng bài
    if caption:
        print(f"\n[5/5] Gõ nội dung bài viết...")
        cdp_eval(profile, tab_id, """
        (() => {
            const dialog = Array.from(document.querySelectorAll('div[role="dialog"]')).find(d => (d.innerText || '').includes('Tạo bài viết'));
            if (!dialog) return;
            const editor = dialog.querySelector('[contenteditable="true"]');
            if (editor) editor.focus();
        })()
        """)
        time.sleep(0.5)
        cdp_send(profile, tab_id, "Input.insertText", {"text": caption})
        print(f"  -> Đã nhập caption.")
        time.sleep(1.5)

    # Bấm nút Đăng
    print("  -> Bấm nút 'Đăng'...")
    post_res = cdp_eval(profile, tab_id, """
    (() => {
        const dialog = Array.from(document.querySelectorAll('div[role="dialog"]')).find(d => (d.innerText || '').includes('Tạo bài viết'));
        if (!dialog) return { error: "Không tìm thấy modal tạo bài" };

        const btn = Array.from(dialog.querySelectorAll('[role="button"]')).find(b => (b.innerText || '').trim() === 'Đăng');
        if (!btn) return { error: "Không tìm thấy nút Đăng" };
        if (btn.getAttribute('aria-disabled') === 'true') return { error: "Nút Đăng đang disabled" };

        btn.click();
        return { clicked: true };
    })()
    """)
    print("  -> Kết quả click Đăng:", post_res.get("result", {}).get("result", {}).get("value"))

    wait_time = 12 if is_video else 6
    print(f"  -> Chờ {wait_time}s để Facebook hoàn tất xuất bản...")
    time.sleep(wait_time)

    # Chụp ảnh nghiệm thu
    if screenshot_out:
        shot = cdp_send(profile, tab_id, "Page.captureScreenshot", {"format": "png"})
        b64 = shot.get("result", {}).get("data")
        if b64:
            with open(screenshot_out, "wb") as f:
                f.write(base64.b64decode(b64))
            print(f"[+] 📸 Đã lưu ảnh chụp nghiệm thu: {screenshot_out}")

    print(f"\n[+] 🎉 HOÀN TẤT ĐĂNG {media_type} LÊN FACEBOOK THÀNH CÔNG!")
    return True

def main():
    parser = argparse.ArgumentParser(description="Antigravity Omni-Browser Facebook Auto-Poster (Photo/Video/Text)")
    parser.add_argument("--image", "-i", type=str, default=None, help="Đường dẫn file ảnh (.jpg, .png, .webp)")
    parser.add_argument("--video", "-v", type=str, default=None, help="Đường dẫn file video (.mp4, .mov, .mkv)")
    parser.add_argument("--caption", "-c", type=str, default=None, help="Nội dung status bài viết")
    parser.add_argument("--profile", "-p", type=str, default="default", help="Tên profile trình duyệt kết nối (mặc định: default)")
    parser.add_argument("--out", "-o", type=str, default=None, help="Đường dẫn lưu ảnh chụp màn hình nghiệm thu")

    args = parser.parse_args()

    media = args.video if args.video else args.image
    is_vid = bool(args.video)

    post_to_facebook(
        profile=args.profile,
        media_path=media,
        is_video=is_vid,
        caption=args.caption,
        screenshot_out=args.out
    )

if __name__ == "__main__":
    main()
