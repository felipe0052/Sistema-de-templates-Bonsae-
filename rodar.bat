@echo off
echo Limpando processos antigos...
taskkill /F /IM php.exe /IM node.exe /FI "STATUS eq RUNNING" 2>nul

echo Iniciando Backend (Laravel) na porta 8000...
start "Backend - Laravel" cmd /k "cd back-end && C:\xampp\php\php.exe artisan serve --port=8000 --host=127.0.0.1"

echo Iniciando Frontend (Next.js) na porta 3000...
start "Frontend - Next.js" cmd /k "cd front-end && npm.cmd run dev"

echo ------------------------------------------------------------
echo Tudo pronto! Aguarde alguns segundos e acesse:
echo http://localhost:3000
echo ------------------------------------------------------------
pause
