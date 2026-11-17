# syntax=docker/dockerfile:1

# этап сборки
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# продакшн-образ
FROM node:24-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY package*.json ./
# sharp и bcrypt — нативные модули: npm ci в том же образе, что и рантайм
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/api/health" || exit 1
CMD ["node", "dist/main.js"]
