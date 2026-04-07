const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;
// When running as pkg executable, dist/ lives next to the executable
const distDir = path.join(path.dirname(process.execPath), 'dist');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let filePath = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback — serve index.html for unknown routes
      fs.readFile(path.join(distDir, 'index.html'), (err2, html) => {
        if (err2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://localhost:${PORT}`;
  console.log(`App läuft auf ${url}`);
  console.log('Fenster schliessen zum Beenden.\n');
  if (process.platform === 'darwin') exec(`open "${url}"`);
  else if (process.platform === 'win32') exec(`start "" "${url}"`);
  else exec(`xdg-open "${url}"`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\nFehler: Port ${PORT} ist bereits belegt.`);
    console.error('Bitte schliesse andere Instanzen und versuche erneut.\n');
  } else {
    console.error('Server-Fehler:', e.message);
  }
  setTimeout(() => process.exit(1), 3000);
});
