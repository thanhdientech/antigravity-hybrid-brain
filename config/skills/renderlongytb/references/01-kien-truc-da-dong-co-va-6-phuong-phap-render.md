# 01. Kiến Trúc Đa Động Cơ, Quy Trình Tham Chiếu `B2 -> B3 -> B5` & 6 Phương Pháp Render (`renderlongytb`)

Tài liệu tham chiếu kỹ thuật cho công cụ **OmniFlow Timeline Studio (`v3.5.3`)** đặt tại `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video`.

---

## 1. Sơ Đồ 6 Dịch Vụ Cục Bộ Chạy Phối Hợp

| Cổng (Port) | Dịch Vụ / File Thực Thi Tại Ổ E | Vai Trò Cốt Lõi |
| :--- | :--- | :--- |
| **`:8500`** | **Timeline Studio Server** (`timeline_studio/server.py`) | Trung tâm điều phối 5 Không gian làm việc (Kịch bản, Prompt, Storyboard & Motion 2D, Bàn dựng 4-Track, Auto-Post) + Cổng HTTP MCP `/api/mcp/call`. |
| **`:8100` / WS `:8222`** | **FlowKit Extension Daemon** (`omniflash/flowkit-main/agent/main.py`) | Động cơ RPC ngầm kết nối Google Flow tạo ảnh (`GEM_PIX_2`, `BELUGA` Nano Banana 2.1, `HARBOR_SEAL`) & video **Veo 3.1** kèm `Smart Human Delay` + `180s Circuit Breaker`. |
| **`127.0.0.1:8000`** | **Muse.ai Local OpenAI-Compatible API** (`muse_api/muse_local_api.py`) | Động cơ miễn phí 100% đăng nhập chung Chrome Profile với Google Flow; tự động kích hoạt `< 1s` khi Flow gặp cờ tài khoản, tự ép lệnh `8.0s` đầu prompt & đính kèm đủ `SCENE_XX.png` + `uidXX_*`. |
| **`:8766` / WS `:8765`** | **Antigravity Browser Bridge** (`timeline_studio/auto post/antigravity-browser-bridge/server.py`) | Điều khiển DOM trực quan như người thật trên `flow.google.com`, `muse.ai`, `suno.com`, `facebook.com` đa Profile Chrome/Cốc Cốc. |
| **`:9334`** | **Chrome CDP (`flow_cdp_bridge.py`)** | Giao thức Chrome DevTools Protocol dự phòng và đồng bộ trạng thái phiên. |
| **GPU Local** | **Remotion 2D Studio Engine** (`omniflash/video-ai-workflow/pro-text-to-video/`) | Kết xuất đồ họa chuyển động 2D 100% GPU (`--gl=angle`) + Bản đồ vệ tinh Esri/Carto/OSM (`satellite_map_service.py`). |

---

## 2. Quy Trình Tham Chiếu 3 Bước Khép Kín Bắt Buộc (`B2 -> B3 -> B5`)

Khi chạy ở chế độ có tham chiếu (`ref_mode = "with_reference"`), mọi lệnh của Agent phải đi đúng thứ tự phụ thuộc vật lý:

1. **Bước 1 — Ảnh Nhân Vật Gốc (`stage = "2"` / `1 prompt nhan vat/B2_Nhan_Vat.csv`):**
   - Sinh ảnh chân dung/toàn thân khóa ngoại hình lưu tại `{project_dir}/1 prompt nhan vat/UID01.png`, `UID02.png`...
2. **Bước 2 — Ảnh Phân Cảnh (`stage = "3"` / `2 prompt anh canh/B3_Prompt_Anh_Canh.csv`):**
   - Tự động quét cột `characters_used` / mã `UID01..UIDNN` trong prompt. Nếu thiếu `UIDXX.png` sẽ tự render bù Bước 1 trước.
   - Đính kèm trực tiếp `1 prompt nhan vat/UIDXX.png` làm Reference Image cho Google Flow hoặc Muse.ai để xuất `{project_dir}/2 prompt anh canh/SCENE_XX.png` đồng nhất 100% mặt và trang phục.
3. **Bước 3 — Video Phân Cảnh (`stage = "4"` / `3 prompt video/B5_Prompt_Video.csv`):**
   - Nếu thiếu `SCENE_XX.png` sẽ tự chạy bù Bước 2.
   - **Nguyên tắc bất biến:** Khi tạo `{project_dir}/3 prompt video/SCENE_XX.mp4`, hệ thống **CHỈ ĐÍNH KÈM DUY NHẤT 1 FILE `2 prompt anh canh/SCENE_XX.png` LÀM FIRST FRAME** — tuyệt đối không đính kèm lại ảnh nhân vật rời `UIDXX.png` vào bước tạo video.

---

## 3. Bảng 6 Phương Pháp Render Đồng Bộ Toàn Hệ Thống (`engine`)

| STT | Giá trị `engine` | `imodel` | `vmodel` | Khi Nào Sử Dụng |
| :---: | :--- | :---: | :---: | :--- |
| **1** | `antigravity_ext` ⭐ | `pro` | `veo-3.1-lite` | Điều khiển trực quan trên trình duyệt qua `:8765`, nhìn thấy rõ từng thao tác chọn ảnh, dán prompt, tải video. |
| **2** | `flowboard` | `pro` | `veo-3.1-lite` | Gửi lệnh RPC chạy ngầm tốc độ cao qua FlowKit Extension (`:8100`) kèm bảo vệ tài khoản 5 lớp. |
| **3** | `muse_web` | `muse` | `muse` | Tạo cả Nhân vật (`B2`), Ảnh cảnh (`B3`) và Video (`B5`) hoàn toàn miễn phí qua `Muse.ai (:8000)`. |
| **4** | `remotion_2d` | `pro` | `remotion` | Kết xuất 100% đồ họa chuyển động 2D bằng GPU từ file `3 prompt video/B5_Motion2D.json`. |
| **5** | `hybrid_veo_remotion` | `pro` | `hybrid` | Phối hợp cảnh điện ảnh 3D/người thật bằng **Google Veo 3.1** xen kẽ cảnh bản đồ/biểu đồ bằng **Remotion 2D**. |
| **6** | `hybrid_muse_remotion` | `muse` | `hybrid_muse` | Phối hợp cảnh điện ảnh bằng **Muse.ai (`:8000`)** xen kẽ cảnh số liệu/bản đồ bằng **Remotion 2D** (100% miễn phí). |

---

## 4. Payload REST API & Mẫu Code Python Điều Khiển Từ A–Z

- **Endpoint kích hoạt Stage:** `POST http://127.0.0.1:8500/api/omniflash/run-stage`
- **Endpoint theo dõi tiến độ:** `GET http://127.0.0.1:8500/api/omniflash/stage-status/{job_id}`

```python
# -*- coding: utf-8 -*-
import time
import requests

STUDIO_URL = "http://127.0.0.1:8500"

def run_youtube_3stage_pipeline(project_dir: str, engine: str = "flowboard", scenes: str = "1-30", duration: int = 8):
    for stage_num, label in [("2", "B2 Nhân vật"), ("3", "B3 Ảnh cảnh"), ("4", "B5 Video cảnh")]:
        resp = requests.post(f"{STUDIO_URL}/api/omniflash/run-stage", json={
            "project_dir": project_dir,
            "stage": stage_num,
            "engine": engine,
            "imodel": "muse" if "muse" in engine else "pro",
            "vmodel": "muse" if engine == "muse_web" else "veo-3.1-lite",
            "scenes": "" if stage_num == "2" else scenes,
            "render_mode": "missing",
            "ref_mode": "with_reference",
            "aspect": "16:9",
            "duration": duration,  # Hỗ trợ 8, 10, 20, 30 giây
            "strict_lock": True
        }, timeout=30).json()
        job_id = resp.get("job_id")
        while job_id:
            st = requests.get(f"{STUDIO_URL}/api/omniflash/stage-status/{job_id}", timeout=15).json()
            if st.get("status") in ("done", "failed", "stopped", "paused_error"):
                print(f"[{label}] -> {st.get('status')}")
                break
            time.sleep(3)
```
