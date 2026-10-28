@echo off
chcp 65001 >nul
title Thiết lập Môi trường Skills Antigravity cho Máy Mới
echo ==============================================================================
echo ⚡ ĐANG CÀI ĐẶT CÁC THƯ VIỆN BỔ TRỢ CHO HỆ THỐNG 8 SKILLS ANTIGRAVITY...
echo ==============================================================================
cd /d "%~dp0"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
echo ==============================================================================
echo ✅ CÀI ĐẶT HOÀN TẤT! CÁC SKILL ĐÃ SẴN SÀNG CHẠY TRÊN MÁY MỚI.
echo ==============================================================================
pause
