// Servidor local para probar sin Vercel: sirve public/ y la API con datos en memoria.
// Uso: APP_PASSWORD=prueba node dev-server.mjs  → http://localhost:3000
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GET, POST } from './api/data.js';

const PORT = Number(process.env.PORT) || 3000;
const ROOT = fileURLToPath(new URL('./public/', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/api/data') {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const request = new Request(url, { method: req.method, headers: req.headers, body: req.method === 'POST' ? Buffer.concat(chunks) : undefined });
    const out = await (req.method === 'POST' ? POST : GET)(request);
    res.writeHead(out.status, Object.fromEntries(out.headers));
    return res.end(await out.text());
  }
  const file = normalize(join(ROOT, url.pathname === '/' ? 'index.html' : url.pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('No encontrado');
  }
}).listen(PORT, () => console.log(`Semáforo en http://localhost:${PORT}`));
