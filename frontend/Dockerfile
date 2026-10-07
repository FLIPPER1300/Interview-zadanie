# ---- Stage 1: build the Angular app into static files ----
FROM node:24-alpine AS build
WORKDIR /src

# Install dependencies first (cached until package*.json changes).
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npx ng build --configuration production

# ---- Stage 2: serve the static files with nginx ----
FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist/phonebook/browser /usr/share/nginx/html

EXPOSE 80
