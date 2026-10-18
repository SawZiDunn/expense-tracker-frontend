# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# The backend API URL is baked into the static bundle at build time.
# Override it with: docker build --build-arg VITE_API_URL=https://api.example.com .
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies (kept as its own layer so it caches well)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build the static bundle
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

# SPA-friendly nginx config (history fallback, gzip, asset caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Serve the compiled assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
