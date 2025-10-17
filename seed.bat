@echo off
echo Running seed endpoint...
echo.

rem Try different methods to make HTTP request
if exist "%ProgramFiles%\nodejs\node.exe" (
    "%ProgramFiles%\nodejs\node.exe" seed-runner.js
    goto :end
)

if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
    "%ProgramFiles(x86)%\nodejs\node.exe" seed-runner.js
    goto :end
)

rem Try PowerShell if available
powershell.exe -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000/api/seed?confirm=dev-seed-2024' -Method POST | Select-Object -ExpandProperty Content } catch { Write-Host 'PowerShell method failed' }"

:end
pause