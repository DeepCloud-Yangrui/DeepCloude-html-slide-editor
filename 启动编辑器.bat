@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 🚀 正在启动口播演示编辑器...
echo.
call npm run dev
pause
