const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
let requestCount = 0;
let errorCount = 0;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  requestCount++;

  if (req.url === '/health' || req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  }

  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('http_requests_total ' + requestCount + '\nhttp_errors_total ' + errorCount);
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'text/html';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      errorCount++;
      res.writeHead(404);
      return res.end('404 Not Found');
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
