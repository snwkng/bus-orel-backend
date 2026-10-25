# syntax=docker/dockerfile:1

# этап сборки
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# продакшн-образ
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY package*.json ./
# sharp и bcrypt — нативные модули: npm ci в том же образе, что и рантайм
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3001
CMD ["node", "dist/main"]
