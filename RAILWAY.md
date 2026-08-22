# Deploying this repo on Railway

Build: `npm run build` (runs automatically)
Start: `npm start` → `node serve.js` (static-serves `dist/`, reverse-proxies `/api/*` to the API service)

## Required environment variable

| Variable | Value |
|---|---|
| `API_INTERNAL_URL` | Private-network address of the `inpact_services` API service, e.g. `http://<api-service-name>.railway.internal:<port>` |

No other configuration needed — Railway's default Nixpacks Node build (`npm install` → `npm run build` → `npm start`) handles this repo with zero extra config files.

The app uses `HashRouter` (client-side routes live after `#`, e.g. `/#/apply`), so no SPA path-rewrite fallback is needed server-side — `serve.js` only needs to serve static files plus `/`.
