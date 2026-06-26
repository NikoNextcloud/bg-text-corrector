@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo За да стартираш редактора, трябва да има инсталиран Node.js.
  echo Изтегли го от https://nodejs.org/ и после отвори този файл пак.
  pause
  exit /b 1
)
npm start
