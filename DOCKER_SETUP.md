# Docker Setup - Expense Tracker Frontend

How the frontend is containerized and how to build/run it locally.

## Files

| File                    | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `Dockerfile`            | Multi-stage build (Node build stage → Nginx runtime stage)    |
| `nginx.conf`            | Nginx config with SPA fallback, gzip and asset caching        |
| `.dockerignore`         | Keeps `node_modules`, `dist`, git and docs out of the context |
| `../docker-compose.yml` | Runs the frontend together with the backend                  |

## How the image is built

1. **Build stage** (`node:20-alpine`)
    - Installs dependencies with `npm ci` (uses `package-lock.json`)
    - Builds the static bundle with `npm run build` (`tsc && vite build`)
    - `VITE_API_URL` is baked into the bundle at this point

2. **Runtime stage** (`nginx:1.27-alpine`)
    - Serves `/app/dist` from `/usr/share/nginx/html`
    - Uses `nginx.conf` for SPA routing (unknown paths → `index.html`)
    - Listens on port `80`

> Because Vite inlines `VITE_API_URL` at build time, changing the backend URL
> requires rebuilding the image. Pass it with `--build-arg`.

## About `nginx.conf`

The frontend build output is only static files (`index.html`, JS, CSS), and static
files can't serve themselves - something has to answer HTTP requests for them. That
is what nginx does here, and `nginx.conf` is its configuration.

The backend has no equivalent file because ASP.NET Core (Kestrel) **is** the HTTP
server, so it needs no extra server layer.

`nginx.conf` replaces the image's default config (`/etc/nginx/conf.d/default.conf`)
and adds three things:

| Setting                            | Why it's there                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| `try_files $uri $uri/ /index.html` | SPA history fallback - unknown paths serve `index.html` so refreshing a route won't 404 |
| `gzip on`                          | The stock config ships gzip **commented out**; enabling it cuts the JS bundle from ~242 kB to ~79 kB |
| `expires 1y` + `immutable`         | Vite emits content-hashed filenames, so `/assets/*` can be cached forever            |

Things to know:

- **The SPA fallback currently does nothing** - the app has no router yet. It's there
  for when one is added; without it, deep links would 404 on refresh.
- `listen 80;` is the container-side port referenced by `3000:80` in Compose.
- The `/assets/` block assumes Vite's default `build.assetsDir`. If you change that in
  `vite.config.ts`, update this file too.

Deleting `nginx.conf` (and its `COPY` line in the `Dockerfile`) still produces a
working app served by the default config - you would just lose gzip, caching and the
routing fallback.

## Build the image

```bash
cd expense-tracker-frontend

docker build \
  --build-arg VITE_API_URL=http://localhost:8080 \
  -t expense-tracker-frontend .
```

## Run the container

```bash
docker run -p 3000:80 expense-tracker-frontend
```

The app is available at http://localhost:3000

## Run with Docker Compose (recommended)

From the repository root:

```bash
docker compose up --build
```

No `.env` file is needed - Compose also starts a `mongo` container, so the stack is
self-contained.

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8080 |

Compose passes `VITE_API_URL=http://localhost:8080` at build time. Override it if your
backend runs elsewhere:

```bash
VITE_API_URL=https://api.example.com docker compose up --build
```

## Useful commands

```bash
docker compose logs -f frontend   # follow frontend logs
docker compose down               # stop and remove containers
docker compose build --no-cache   # rebuild from scratch
```

## Troubleshooting

- **Blank page or 404 on refresh** - check that `nginx.conf` is copied to
  `/etc/nginx/conf.d/default.conf` and contains `try_files ... /index.html`.
- **API calls fail with CORS** - make sure the backend's `FRONTEND_URL` matches
  the origin you open in the browser (e.g. `http://localhost:3000`).
- **Wrong API URL baked in** - rebuild with the correct `VITE_API_URL` build arg.
