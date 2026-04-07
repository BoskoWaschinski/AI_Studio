@echo off
set PORT=8080
set DIR=%~dp0dist

if not exist "%DIR%" (
  echo Fehler: 'dist' Ordner nicht gefunden.
  pause
  exit /b 1
)

echo App wird gestartet auf http://localhost:%PORT%
echo Zum Beenden: Fenster schliessen
echo.

start "" "http://localhost:%PORT%"

:: Versuche python3, dann python, dann npx
python3 --version >nul 2>&1
if %errorlevel% == 0 (
  python3 -m http.server %PORT% --directory "%DIR%"
  goto end
)

python --version >nul 2>&1
if %errorlevel% == 0 (
  python -m http.server %PORT% --directory "%DIR%"
  goto end
)

npx --version >nul 2>&1
if %errorlevel% == 0 (
  npx --yes serve "%DIR%" -p %PORT%
  goto end
)

echo.
echo FEHLER: Weder Python noch Node.js gefunden.
echo Bitte installiere Python von https://python.org
echo Wichtig: Beim Installieren "Add Python to PATH" ankreuzen!

:end
pause
