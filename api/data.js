// API del tablero: guarda cada documento ("coleccion/id") como un campo del hash
// "semaforo:docs" en Upstash Redis. Todas las llamadas piden la contraseña
// APP_PASSWORD en el encabezado x-pass.
import { createHash, timingSafeEqual } from 'node:crypto';
import { SEED } from './_seed.js';

const KEY = 'semaforo:docs';
const COLLECTIONS = new Set(['clients', 'results', 'days', 'sessions', 'config']);
const PATH_RE = /^([a-z]+)\/([A-Za-z0-9_.-]{1,120})$/;
const MAX_BODY = 200_000;

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Sin Redis configurado fuera de Vercel (pruebas locales) se usa memoria.
const memory = new Map();
const useMemory = !REDIS_URL && !process.env.VERCEL;

async function redis(cmd) {
  if (useMemory) return memoryCmd(cmd);
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

function memoryCmd([op, , ...args]) {
  if (op === 'HGETALL') return [...memory].flat();
  if (op === 'HSET') { for (let i = 0; i < args.length; i += 2) memory.set(args[i], args[i + 1]); return args.length / 2; }
  if (op === 'HDEL') { args.forEach(f => memory.delete(f)); return args.length; }
  throw new Error('Comando no soportado: ' + op);
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

function authorized(req) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return 'missing';
  const given = req.headers.get('x-pass') || '';
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b) ? 'ok' : 'denied';
}

function guard(req) {
  if (!useMemory && !REDIS_URL) return json({ error: 'Falta conectar Upstash Redis al proyecto en Vercel.' }, 500);
  const auth = authorized(req);
  if (auth === 'missing') return json({ error: 'Falta la variable APP_PASSWORD en Vercel.' }, 500);
  if (auth === 'denied') return json({ error: 'Contraseña incorrecta.' }, 401);
  return null;
}

async function readAll() {
  const flat = (await redis(['HGETALL', KEY])) || [];
  if (!flat.length) {
    const fields = Object.entries(SEED).flatMap(([k, v]) => [k, JSON.stringify(v)]);
    await redis(['HSET', KEY, ...fields]);
    return { ...SEED };
  }
  const docs = {};
  for (let i = 0; i < flat.length; i += 2) {
    try { docs[flat[i]] = JSON.parse(flat[i + 1]); } catch { /* documento dañado: se ignora */ }
  }
  return docs;
}

export async function GET(req) {
  const blocked = guard(req);
  if (blocked) return blocked;
  try {
    return json({ docs: await readAll() });
  } catch (e) {
    return json({ error: 'No se pudo leer la base de datos.' }, 502);
  }
}

export async function POST(req) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const text = await req.text();
  if (text.length > MAX_BODY) return json({ error: 'El documento es demasiado grande.' }, 413);
  let body;
  try { body = JSON.parse(text); } catch { return json({ error: 'JSON inválido.' }, 400); }
  const { op, path, data } = body || {};
  const m = PATH_RE.exec(path || '');
  if (!m || !COLLECTIONS.has(m[1])) return json({ error: 'Ruta inválida.' }, 400);
  try {
    if (op === 'set') {
      if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ error: 'Datos inválidos.' }, 400);
      await redis(['HSET', KEY, path, JSON.stringify(data)]);
    } else if (op === 'delete') {
      await redis(['HDEL', KEY, path]);
    } else {
      return json({ error: 'Operación inválida.' }, 400);
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: 'No se pudo guardar.' }, 502);
  }
}
