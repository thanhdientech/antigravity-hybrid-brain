"""
Antigravity Omni-Browser CLI (Multi-Profile Edition)
Giao diện dòng lệnh 1-chạm điều khiển song song nhiều Chrome Profile
"""

import argparse
import sys
import json
import base64
import os
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding="utf-8")

BRIDGE_HTTP_URL = "http://127.0.0.1:8766"

def call_bridge(action_dict, timeout=65):
    url = f"{BRIDGE_HTTP_URL}/action"
    data = json.dumps(action_dict).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"[-] Lỗi kết nối tới Bridge Server ({BRIDGE_HTTP_URL}): {e}")
        print("    Vui lòng đảm bảo server đang chạy: python server.py")
        sys.exit(1)
    except Exception as e:
        print(f"[-] Lỗi: {e}")
        sys.exit(1)

def get_profiles_list():
    try:
        with urllib.request.urlopen(f"{BRIDGE_HTTP_URL}/profiles", timeout=3) as resp:
            return json.loads(resp.read().decode("utf-8")).get("profiles", [])
    except Exception:
        return []

def check_status():
    try:
        with urllib.request.urlopen(f"{BRIDGE_HTTP_URL}/status", timeout=3) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception:
        return None

def main():
    parser = argparse.ArgumentParser(description="Antigravity Omni-Browser CLI — Điều khiển đa Profile Chrome song song")
    parser.add_argument("--profile", "-p", type=str, default=None, help="Tên hoặc mã Profile cần điều khiển (ví dụ: 67, 24, suno, facebook)")
    subparsers = parser.add_subparsers(dest="command", help="Lệnh hành động")

    # status
    subparsers.add_parser("status", help="Kiểm tra trạng thái kết nối của các Chrome Profiles")

    # profiles
    subparsers.add_parser("profiles", help="Liệt kê danh sách tất cả các Chrome Profile đang kết nối trực tuyến")

    # goto / navigate
    p_goto = subparsers.add_parser("goto", help="Điều hướng tới một trang web")
    p_goto.add_argument("url", type=str, help="Địa chỉ URL (ví dụ: https://suno.com/create)")
    p_goto.add_argument("--timeout", type=int, default=30, help="Thời gian chờ tải trang")

    # click
    p_click = subparsers.add_parser("click", help="Bấm vào một nút hoặc phần tử trên web")
    p_click.add_argument("selector", nargs="?", default=None, help="CSS/XPath Selector")
    p_click.add_argument("--text", "-t", type=str, default=None, help="Tìm theo chữ hiển thị")

    # type
    p_type = subparsers.add_parser("type", help="Nhập văn bản vào ô input hoặc textarea")
    p_type.add_argument("selector", type=str, help="Selector của ô nhập")
    p_type.add_argument("text", type=str, help="Văn bản cần gõ")
    p_type.add_argument("--clear", action="store_true", help="Xóa nội dung cũ trước khi gõ")
    p_type.add_argument("--enter", action="store_true", help="Bấm Enter sau khi gõ")

    # upload
    p_upload = subparsers.add_parser("upload", help="Tải file từ máy tính lên trang web")
    p_upload.add_argument("selector", type=str, help="Selector của ô input file")
    p_upload.add_argument("file_path", type=str, help="Đường dẫn file trên máy tính cần upload")

    # eval / run-script
    p_eval = subparsers.add_parser("eval", help="Chạy một đoạn mã JavaScript trong trang web")
    p_eval.add_argument("code", type=str, help="Mã JavaScript cần thực thi")

    # screenshot
    p_screen = subparsers.add_parser("screenshot", help="Chụp ảnh màn hình tab trình duyệt đang mở")
    p_screen.add_argument("--out", "-o", type=str, default="screenshot.png", help="Đường dẫn lưu file ảnh")

    # dom
    p_dom = subparsers.add_parser("dom", help="Đọc cấu trúc DOM, text hoặc các nút bấm trên trang")
    p_dom.add_argument("--selector", "-s", type=str, default=None, help="Selector cụ thể cần trích xuất")

    # scroll
    p_scroll = subparsers.add_parser("scroll", help="Cuộn trang web")
    p_scroll.add_argument("--direction", "-d", choices=["up", "down"], default="down", help="Hướng cuộn")
    p_scroll.add_argument("--amount", "-a", type=int, default=500, help="Khoảng cách cuộn (pixels)")

    # logs
    subparsers.add_parser("logs", help="Lấy danh sách lỗi console để debug")

    # tabs
    subparsers.add_parser("tabs", help="Xem danh sách tất cả các tab đang mở trong Chrome")

    # download
    p_down = subparsers.add_parser("download", help="Tải một file về máy")
    p_down.add_argument("url", type=str, help="URL file cần tải")
    p_down.add_argument("--filename", type=str, default=None, help="Tên file lưu")

    args = parser.parse_args()

    if args.command == "status":
        st = check_status()
        if not st:
            print("[-] Bridge Server chưa chạy! Chạy lệnh: python server.py")
        elif st.get("extension_connected"):
            print(f"[+] 🟢 CÁC PROFILES ĐANG KẾT NỐI TRỰC TUYẾN ({len(st.get('active_profiles', []))} profiles):")
            for p in st.get("active_profiles", []):
                print(f"    • Profile: '{p}'")
        else:
            print("[+] 🟡 BRIDGE SERVER: Đang chạy, nhưng CHƯA THẤY Profile Chrome nào kết nối.")
            print("    Vui lòng mở Google Chrome (Profile 67 hoặc Profile khác) và bật Extension!")

    elif args.command == "profiles":
        profs = get_profiles_list()
        print(f"[+] Danh sách Profiles đang sẵn sàng ({len(profs)} profiles):")
        for idx, p in enumerate(profs, 1):
            print(f"    [{idx}] '{p}'")

    elif args.command == "goto":
        target = f" [Profile: {args.profile}]" if args.profile else ""
        print(f"[*] Đang điều hướng tới: {args.url}{target} ...")
        res = call_bridge({"action": "navigate", "url": args.url, "timeout": args.timeout, "profile": args.profile})
        if res.get("status") == "ok":
            print(f"[+] [{res.get('profile')}] Đã tải trang thành công! Tiêu đề: {res.get('title')}")
        else:
            print(f"[-] Thất bại: {res.get('error')}")

    elif args.command == "click":
        target = f" [Profile: {args.profile}]" if args.profile else ""
        print(f"[*] Đang bấm vào phần tử: {args.selector or args.text}{target} ...")
        res = call_bridge({"action": "click", "selector": args.selector, "text": args.text, "profile": args.profile})
        if res.get("status") == "ok":
            print(f"[+] [{res.get('profile')}] Bấm thành công vào thẻ <{res.get('tagName')}>: '{res.get('text', '').strip()}'")
        else:
            print(f"[-] Thất bại: {res.get('error')}")

    elif args.command == "type":
        target = f" [Profile: {args.profile}]" if args.profile else ""
        print(f"[*] Đang gõ văn bản vào '{args.selector}'{target} ...")
        res = call_bridge({
            "action": "type",
            "selector": args.selector,
            "value": args.text,
            "clear": args.clear,
            "press_enter": args.enter,
            "profile": args.profile
        })
        if res.get("status") == "ok":
            print(f"[+] [{res.get('profile')}] Đã nhập nội dung thành công!")
        else:
            print(f"[-] Thất bại: {res.get('error')}")

    elif args.command == "upload":
        if not os.path.exists(args.file_path):
            print(f"[-] Không tìm thấy file: {args.file_path}")
            return
        target = f" [Profile: {args.profile}]" if args.profile else ""
        print(f"[*] Đang upload file '{args.file_path}' vào '{args.selector}'{target} ...")
        res = call_bridge({
            "action": "upload_file",
            "selector": args.selector,
            "filePath": os.path.abspath(args.file_path),
            "profile": args.profile
        })
        if res.get("status") == "ok":
            print(f"[+] [{res.get('profile')}] Upload thành công! Tên: {res.get('fileName')}, Dung lượng: {res.get('fileSize')} bytes")
        else:
            print(f"[-] Thất bại: {res.get('error')}")

    elif args.command == "eval":
        res = call_bridge({"action": "eval", "code": args.code, "profile": args.profile})
        if res.get("status") == "ok":
            print(f"[+] [{res.get('profile')}] Kết quả thực thi:\n{res.get('result')}")
        else:
            print(f"[-] Lỗi JavaScript: {res.get('error')}")

    elif args.command == "screenshot":
        res = call_bridge({"action": "screenshot", "profile": args.profile})
        if res.get("status") == "ok" and res.get("screenshot"):
            data_url = res["screenshot"]
            header, encoded = data_url.split(",", 1)
            img_data = base64.b64decode(encoded)
            with open(args.out, "wb") as f:
                f.write(img_data)
            print(f"[+] [{res.get('profile')}] Đã lưu ảnh chụp màn hình tại: {os.path.abspath(args.out)}")
        else:
            print(f"[-] Thất bại: {res.get('error')}")

    elif args.command == "dom":
        res = call_bridge({"action": "read_dom", "selector": args.selector, "profile": args.profile})
        if res.get("status") == "ok":
            if args.selector:
                print(f"[+] [{res.get('profile')}] Text: {res.get('text')}")
            else:
                print(f"[+] [{res.get('profile')}] Tiêu đề: {res.get('title')}")
                print(f"[+] URL: {res.get('url')}")
                print(f"\n[+] Các nút bấm ({len(res.get('buttons', []))} nút):")
                for idx, b in enumerate(res.get("buttons", [])[:15], 1):
                    print(f"    [{idx}] {b}")
                print(f"\n[+] Các ô nhập ({len(res.get('inputs', []))} ô):")
                for idx, inp in enumerate(res.get("inputs", [])[:10], 1):
                    print(f"    [{idx}] type='{inp.get('type')}', placeholder='{inp.get('placeholder')}'")
        else:
            print(f"[-] Thất bại: {res.get('error')}")

    elif args.command == "scroll":
        res = call_bridge({
            "action": "scroll", 
            "direction": args.direction, 
            "y": args.amount if args.direction == 'down' else -args.amount,
            "profile": args.profile
        })
        if res.get("status") == "ok":
            print(f"[+] [{res.get('profile')}] Đã cuộn trang thành công (Vị trí: Y={res.get('scrollY')})")

    elif args.command == "logs":
        res = call_bridge({"action": "get_console_logs", "profile": args.profile})
        if res.get("status") == "ok":
            logs = res.get("logs", [])
            print(f"[+] [{res.get('profile')}] Tổng cộng: {len(logs)} logs")
            for l in logs:
                level_badge = "❌ ERROR" if l.get("level") == "error" else ("⚠️ WARN" if l.get("level") == "warn" else "ℹ️ LOG")
                print(f"  {level_badge} | {l.get('text')}")
        else:
            print(f"[-] Thất bại: {res.get('error')}")

    elif args.command == "tabs":
        res = call_bridge({"action": "get_tabs", "profile": args.profile})
        if res.get("status") == "ok":
            tabs = res.get("tabs", [])
            print(f"[+] [{res.get('profile')}] Các tab đang mở ({len(tabs)} tabs):")
            for t in tabs:
                active_flag = " ⭐ [ACTIVE]" if t.get("active") else ""
                print(f"  • Tab #{t.get('id')}: {t.get('title')} ({t.get('url')}){active_flag}")
        else:
            print(f"[-] Thất bại: {res.get('error')}")

    elif args.command == "download":
        res = call_bridge({"action": "download", "url": args.url, "filename": args.filename, "profile": args.profile})
        if res.get("status") == "ok":
            print(f"[+] [{res.get('profile')}] Đã bắt đầu tải file! Download ID: {res.get('downloadId')}")
        else:
            print(f"[-] Thất bại: {res.get('error')}")

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
