@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo За да стартираш редактора, трябва да има инсталиран Node.js.
  echo Изтегли го от https://nodejs.org/ и после отвори този файл пак.
  pause
  exit /b 1
)
echo Стартирам редактора...
echo Ако браузърът не се отвори сам, отвори: http://localhost:8787
start "" "http://localhost:8787"
node server.js
pause
