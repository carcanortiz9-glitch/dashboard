# Semáforo de Clientes

Tablero personal de trafficker: calificación mensual por cliente, semáforo de metas,
captura manual de resultados, histórico y calendario de días de enfoque con bitácora.
Se instala como app en iPhone y Mac.

## Cómo está armado

- `public/` — la app (una sola página), el manifest, el service worker y los íconos.
- `api/data.js` — API en Vercel que guarda los datos en Upstash Redis. Pide la contraseña `APP_PASSWORD`.
- `api/_seed.js` — clientes y semana base con los que arranca una base vacía.

## Variables en Vercel

| Variable | De dónde sale |
|---|---|
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Se crean solas al conectar Upstash Redis desde el Marketplace de Vercel |
| `APP_PASSWORD` | La contraseña que tú elijas para entrar |

## Probar en local

```bash
npm run dev
```

Abre http://localhost:3000 y entra con la contraseña `prueba`. Los datos locales viven en memoria y se borran al cerrar.

## Regenerar íconos

```bash
npm run icons
```
