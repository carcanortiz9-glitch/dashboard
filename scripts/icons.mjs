// Genera los íconos PNG de la app (semáforo negro sobre durazno) sin dependencias.
// Uso: node scripts/icons.mjs
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const PEACH = [0xfb, 0xe1, 0xd1], INK = [0x17, 0x19, 0x1c];
const DOTS = [[0xe2, 0x66, 0x5b], [0xe7, 0xa7, 0x4a], [0x5c, 0xb0, 0x7f]];

// Figuras en coordenadas de 0 a 1. `scale` encoge el dibujo para el ícono "maskable".
function colorAt(x, y, scale) {
  const cx = 0.5 + (x - 0.5) / scale, cy = 0.5 + (y - 0.5) / scale;
  const pw = 0.72, ph = 0.28, r = ph / 2;
  for (let i = 0; i < 3; i++) {
    const dx = cx - (0.5 + (i - 1) * 0.215), dy = cy - 0.5;
    if (dx * dx + dy * dy <= 0.078 * 0.078) return DOTS[i];
  }
  const qx = Math.max(Math.abs(cx - 0.5) - (pw / 2 - r), 0), qy = Math.abs(cy - 0.5);
  if (qx * qx + qy * qy <= r * r) return INK;
  return PEACH;
}

function png(size, scale = 1) {
  const SS = 4, raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const acc = [0, 0, 0];
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const c = colorAt((x + (sx + 0.5) / SS) / size, (y + (sy + 0.5) / SS) / size, scale);
        acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2];
      }
      const o = y * (size * 3 + 1) + 1 + x * 3;
      for (let k = 0; k < 3; k++) raw[o + k] = Math.round(acc[k] / (SS * SS));
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ]);
}

const TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const out = new URL('../public/', import.meta.url);
writeFileSync(new URL('icon-192.png', out), png(192));
writeFileSync(new URL('icon-512.png', out), png(512));
writeFileSync(new URL('icon-maskable-512.png', out), png(512, 0.8));
writeFileSync(new URL('apple-touch-icon.png', out), png(180));
console.log('Íconos listos en public/');
