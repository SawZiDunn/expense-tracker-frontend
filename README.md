# Expense Tracker - Frontend

React + TypeScript single-page app for tracking expenses: a dashboard, full CRUD and date
filtering. It talks to the
[expense-tracker-backend](https://github.com/SawZiDunn/expense-tracker-backend) API.

## Features

**Dashboard**

- Total expenses
- Category breakdown with percentage bars
- Updates as filters change

**Expenses**

- Create with amount, category, date and note
- Edit existing expenses
- Delete with confirmation

**Filtering**

- Date range filter
- Quick filters: Today, This Week, This Month
- Summary recalculates for the selected range

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Redux Toolkit · Axios · date-fns

## Run locally

Requires Node.js 18+ and the backend running (defaults to `http://localhost:5000`).

```bash
npm install
cp .env.example .env.development   # sets VITE_API_URL
npm run dev
```

Open http://localhost:5173.

| Script            | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Development server with hot reload             |
| `npm run build`   | Type-check, then build static files into `dist/` |
| `npm run preview` | Serve the production build locally             |
| `npm run lint`    | ESLint                                         |

## Environment variables

| Variable       | Meaning                                    |
| -------------- | ------------------------------------------ |
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000` |

`VITE_API_URL` is inlined into the bundle at **build time** - it cannot be changed at
runtime, so it must be correct before you build or deploy.

## Run with Docker

The image is a two-stage build: Node compiles the bundle, then nginx serves the static
files.

```bash
docker build --build-arg VITE_API_URL=http://localhost:8080 -t expense-tracker-frontend .
docker run -p 3000:80 expense-tracker-frontend
```

Open http://localhost:3000. `nginx.conf` handles the SPA fallback (so `/expenses` serves
`index.html` instead of 404 on refresh), gzip compression and long-lived caching for
hashed assets.

### What `nginx.conf` does

The file is copied to `/etc/nginx/conf.d/default.conf` in the image. Three rules matter:

| Rule                                   | Why it is there                                                                    |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| `try_files $uri $uri/ /index.html`     | Deep links and refreshes hit the React router, so unknown paths must return `index.html` rather than a 404 |
| `location /assets/` + `expires 1y`     | Vite puts a content hash in every filename, so those files can be cached forever   |
| `gzip`                                 | Smaller JavaScript and CSS payloads                                                |

The `=404` inside `location /assets/` is deliberate: a missing asset must fail as a 404
instead of falling back to HTML, otherwise the browser gets HTML where it expects
JavaScript and reports a MIME type error.

## Run the full stack (frontend + backend + MongoDB)

The backend and a local MongoDB are wired together in the deployment repository:
<https://github.com/SawZiDunn/expense-tracker-deployment>

```bash
git clone https://github.com/SawZiDunn/expense-tracker-deployment
cd expense-tracker-deployment
docker compose up -d
```

That pulls published images for both services and starts MongoDB with persistent storage -
no `.env` file and no MongoDB Atlas account needed. Frontend on http://localhost:3000,
API on http://localhost:8080.

To build the images from this source instead of pulling them:

```bash
docker compose -f docker-compose.yml -f docker-compose.build.yml up --build
```

## Deploy

`dist/` is fully static, so it can be hosted anywhere.

**Vercel** - import the repository, choose the Vite preset, build command `npm run build`,
output directory `dist`, and set `VITE_API_URL` to your deployed backend URL. Afterwards set
the backend's `FRONTEND_URL` (or `CORS_ORIGINS`) to the Vercel URL, otherwise the browser
requests fail CORS.

**Docker** - push the image built above to any container host (Render, Fly.io, Railway, a
VPS).

## Notes

- Never put secrets in `VITE_*` variables - they are embedded in the public bundle.
- Do not add a trailing slash to `VITE_API_URL`.
- The backend repository has its own docs for running and deploying the API.
