#!/bin/bash

PORT=8080
DIR="$(cd "$(dirname "$0")/dist" && pwd)"

if [ ! -d "$DIR" ]; then
  echo "Fehler: 'dist' Ordner nicht gefunden."
  read -p "Enter druecken zum Beenden..."
  exit 1
fi

echo "App wird gestartet auf http://localhost:$PORT"
echo "Zum Beenden: Ctrl+C"
echo ""

# Browser öffnen (kurz warten bis Server läuft)
(sleep 1 && open "http://localhost:$PORT" 2>/dev/null || xdg-open "http://localhost:$PORT" 2>/dev/null) &

# Server starten — python3, dann python, dann npx
if command -v python3 &>/dev/null; then
  python3 -m http.server $PORT --directory "$DIR"
elif command -v python &>/dev/null; then
  python -m http.server $PORT --directory "$DIR"
elif command -v npx &>/dev/null; then
  npx --yes serve "$DIR" -p $PORT
else
  echo ""
  echo "FEHLER: Weder Python noch Node.js gefunden."
  echo "Bitte installiere Python (https://python.org) und starte erneut."
  read -p "Enter druecken zum Beenden..."
  exit 1
fi
