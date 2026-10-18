# Deployment Guide - Expense Tracker Frontend

The frontend is a static Vite build, so it can be hosted anywhere that serves
files. This guide covers the two supported targets: **Vercel** and **Docker (Nginx)**.

## Prerequisites

- The backend deployed and reachable over HTTPS
- The backend's `FRONTEND_URL` set to the final frontend URL (for CORS)
- Node.js 18+ (for local builds) or Docker

## Environment Variables

| Variable       | Description                 | Example                   |
| -------------- | --------------------------- | ------------------------- |
| `VITE_API_URL` | Base URL of the backend API | `https://api.example.com` |

`VITE_API_URL` is inlined into the bundle at **build time**, so it must be set
before building or deploying - it cannot be changed at runtime.

---

## Option A - Vercel (recommended for the static build)

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import the `expense-tracker-frontend` Git repository
3. Configure the project:

    - **Framework Preset**: `Vite`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`

4. Add an environment variable:
    - `VITE_API_URL` = your deployed backend URL
      (e.g. `https://expense-tracker-backend.onrender.com`)
5. Click **Deploy**

Vercel serves the `dist/` folder and rewrites unknown routes to `index.html`
automatically, so client-side routing works.

**After deploying:** set the backend's `FRONTEND_URL` to your Vercel URL
(`https://<project>.vercel.app`) and redeploy the backend.

---

## Option B - Docker + Nginx

The project ships a multi-stage `Dockerfile` (Node build → Nginx runtime).
See `DOCKER_SETUP.md` for the full explanation.

```bash
docker build \
  --build-arg VITE_API_URL=https://expense-tracker-backend.onrender.com \
  -t expense-tracker-frontend .

docker run -p 80:80 expense-tracker-frontend
```

You can push that image to any container host (Render, Fly.io, Railway, a VPS, …).

### Deploy on Render

1. **New +** → **Web Service** → connect the repository
2. **Runtime**: `Docker`
3. Add a build argument / environment variable `VITE_API_URL` = your backend URL
4. **Create Web Service**

---

## Troubleshooting

| Symptom                        | Likely cause / fix                                                            |
| ------------------------------ | ----------------------------------------------------------------------------- |
| App loads but shows no data    | `VITE_API_URL` is wrong or unset at build time - rebuild and redeploy          |
| `CORS` errors in the console   | Backend `FRONTEND_URL` doesn't match this site's origin                        |
| 404 when refreshing a route    | Static host isn't rewriting to `index.html` (the provided Nginx config does)   |
| Requests still hit `localhost` | The `.env.production` placeholder was used - set `VITE_API_URL` properly       |

## Notes

- Never put secrets in `VITE_*` variables - they are embedded in the public bundle.
- Keep `VITE_API_URL` free of a trailing slash (e.g. `https://api.example.com`).
