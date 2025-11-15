@echo off
REM PixelCode Scanner - Deploy Helper
REM Este script copia o arquivo minificado para upload

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     PixelCode Scanner - Deploy Helper                      ║
echo ║     Preparando arquivo para upload...                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Criar pasta de deploy
if not exist "deploy" mkdir deploy

REM Copiar arquivo minificado
copy "index.min.html" "deploy\index.html" >nul

REM Copiar README
copy "DEPLOY.md" "deploy\README.md" >nul

echo ✅ Arquivo preparado com sucesso!
echo.
echo 📁 Pasta de deploy criada: ./deploy/
echo 📄 Arquivo pronto: deploy\index.html
echo 📖 Guia de upload: deploy\README.md
echo.
echo 🚀 Próximos passos:
echo    1. Abra a pasta "deploy"
echo    2. Faça upload do arquivo "index.html" para seu servidor
echo    3. Acesse via navegador
echo.
echo 💡 Dica: Você pode usar Netlify, Vercel ou GitHub Pages
echo         para fazer upload sem pagar nada!
echo.
pause
