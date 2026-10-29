# bus-orel-backend

Бэкенд сайта [bus-orel.ru](https://bus-orel.ru) — REST API для бронирования автобусных туров, экскурсий и отелей.

## Стек

- **Node.js 24 + NestJS 11** (Express 5), TypeScript
- **MongoDB + Mongoose 9** (`@nestjs/mongoose`)
- **Аутентификация**: JWT (access + refresh с ротацией), `bcrypt`
- **Файлы**: AWS S3 (`@aws-sdk/client-s3`), обработка изображений `sharp` (конвертация в WebP)
- **Безопасность**: `helmet`, CORS-whitelist, rate limiting (`@nestjs/throttler`: 100/мин глобально, 5/мин на login/refresh)
- **Валидация**: `class-validator` + глобальный `ValidationPipe`, env — через Joi при старте
- **Тесты**: Vitest (unit + e2e на `mongodb-memory-server`)
- **Документация**: Swagger (`/api/docs` при `NODE_ENV !== 'production'`)

## Требования

- Node.js 24 (npm 11) — **не ниже**: lockfile записан npm 11, `npm ci` под npm 10 (Node 22) падает
- MongoDB 8 (локально или в Docker)

## Установка и запуск

```bash
npm install          # установка зависимостей

npm run start:dev    # dev-режим с watch
npm run start        # обычный запуск (требует dist/)
npm run start:prod   # продакшн (NODE_ENV=production)

npm run build        # сборка в dist/
```

Либо в Docker (app + mongo): `docker compose up --build`.

## Переменные окружения

Валидируются при старте (Joi, `src/config/env.validation.ts`) — приложение не поднимется без обязательных.

| Переменная | Обязательная | По умолчанию | Описание |
|---|---|---|---|
| `MONGODB_HOST` | да | — | хост MongoDB |
| `MONGODB_PORT` | да | — | порт MongoDB |
| `MONGODB_DATABASE_NAME` | да | — | имя БД |
| `MONGODB_USERNAME` | да | — | пользователь MongoDB (`authSource=admin`) |
| `MONGODB_PASSWORD` | да | — | пароль MongoDB |
| `JWT_SECRET` | да | — | секрет access-токена |
| `JWT_EXPIRE_IN` | нет | `1h` | TTL access-токена |
| `JWT_REFRESH_SECRET` | да | — | секрет refresh-токена |
| `JWT_REFRESH_EXPIRE_IN` | нет | `7d` | TTL refresh-токена |
| `AWS_S3_BUCKET` | да | — | бакет S3 |
| `AWS_S3_REGION` | да | — | регион S3 |
| `AWS_S3_ENDPOINT` | да | — | endpoint S3 (URL) |
| `AWS_ACCESS_KEY` | да | — | ключ доступа S3 |
| `AWS_SECRET_KEY` | да | — | секретный ключ S3 |
| `ALLOWED_ORIGINS` | да | — | CORS-whitelist, через запятую |
| `PORT` | нет | `3000` | порт приложения |
| `NODE_ENV` | нет | `development` | `development` / `production` / `test` |
| `MULTI_URL` | нет | — | URL внешнего API Multitour |
| `MULTI_TOKEN` | нет | — | токен Multitour |

## Тесты

```bash
npm run test         # unit (Vitest, src/**/*.spec.ts)
npm run test:watch   # watch-режим
npm run test:cov     # покрытие (v8)
npm run test:e2e     # e2e на mongodb-memory-server — внешняя MongoDB не нужна
```

## Линт и форматирование

```bash
npm run lint         # ESLint (--fix)
npm run format       # Prettier --write по src/ и test/
```

## Swagger

Интерактивная документация — на `/api/docs` при `NODE_ENV !== 'production'`.

```bash
npm run swagger:generate   # сгенерировать swagger.json в корне (нужны .env и запущенная MongoDB)
```

## Структура

```
src/
  auth/        # JWT-аутентификация (login/refresh/logout), гварды
  strategies/  # passport-стратегии (local, jwt, jwt-refresh)
  users/       # пользователи
  hotels/      # отели (public + admin)
  bus-tours/   # автобусные туры (связь с отелями, цены)
  excursions/  # экскурсии
  tours/       # интеграция с внешним API Multitour (RPC)
  upload/      # загрузка файлов в S3
  common/      # dto, interceptors, filters, pipes, utils
```

Конвенции: `*.admin.controller.ts` — защищённые JWT эндпоинты админки; публичные контроллеры отдают только `published: true`. Ответы оборачиваются в `{ success, data, meta }`, ошибки — в `{ success: false, error: { code, message[], statusCode } }`.

## CI/CD

GitHub Actions (`.github/workflows/node.js.yml`): на push в `master`/`develop` и PR — проверки (lint → unit → e2e → build) на GitHub-hosted раннере; деплой на VPS (`pm2 restart backend`) — только на push в `master` после успешных проверок.
