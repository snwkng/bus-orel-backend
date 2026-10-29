import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('App (e2e, mongodb-memory-server)', () => {
  let app: INestApplication;
  let mms: MongoMemoryServer;
  let connection: Connection;

  const admin = { username: 'admin', password: 'pass12345' };
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    mms = await MongoMemoryServer.create({
      auth: { enable: true, customRootName: 'e2e', customRootPwd: 'e2e-pass' },
    });
    const url = new URL(mms.getUri());

    Object.assign(process.env, {
      NODE_ENV: 'test',
      PORT: '3000',
      MONGODB_HOST: url.hostname,
      MONGODB_PORT: url.port,
      MONGODB_DATABASE_NAME: 'bus-orel-e2e',
      MONGODB_USERNAME: 'e2e',
      MONGODB_PASSWORD: 'e2e-pass',
      JWT_SECRET: 'e2e-jwt-secret',
      JWT_REFRESH_SECRET: 'e2e-refresh-secret',
      ALLOWED_ORIGINS: 'http://localhost:3000',
      AWS_S3_BUCKET: 'e2e',
      AWS_S3_REGION: 'ru-central1',
      AWS_S3_ENDPOINT: 'https://s3.example.com',
      AWS_ACCESS_KEY: 'e2e',
      AWS_SECRET_KEY: 'e2e',
    });

    // ConfigModule.forRoot валидирует env при импорте модуля,
    // поэтому AppModule импортируем динамически — после установки env
    const { AppModule } = await import('../src/app.module');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();

    connection = moduleRef.get(getConnectionToken());
    await connection.db!.collection('users').insertOne({
      username: admin.username,
      password: await bcrypt.hash(admin.password, 10),
    });
  });

  afterAll(async () => {
    await app?.close();
    await mms?.stop();
  });

  describe('публичные эндпоинты', () => {
    it('GET /api/hotels — пустой список в формате { success, data, meta }', async () => {
      const res = await request(app.getHttpServer()).get('/api/hotels');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.meta.pagination).toMatchObject({
        total: 0,
        page: 1,
        limit: 20,
      });
    });

    it('GET /api/hotels/:id с битым id — 400 с контрактом ошибки', async () => {
      const res = await request(app.getHttpServer()).get('/api/hotels/bad-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.data).toBeNull();
      expect(res.body.error.statusCode).toBe(400);
      expect(res.body.error.message).toEqual([
        'Некорректный формат идентификатора',
      ]);
    });

    it('GET /api/excursions — пустой список', async () => {
      const res = await request(app.getHttpServer()).get('/api/excursions');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('auth flow', () => {
    it('login с неверным паролем — 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: admin.username, password: 'wrong' });

      expect(res.status).toBe(401);
    });

    it('admin-эндпоинт без токена — 401', async () => {
      const res = await request(app.getHttpServer()).get('/api/admin/hotels');

      expect(res.status).toBe(401);
    });

    it('login — возвращает пару токенов', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(admin);

      expect(res.status).toBe(202);
      expect(res.body.data.access_token).toEqual(expect.any(String));
      expect(res.body.data.refresh_token).toEqual(expect.any(String));

      accessToken = res.body.data.access_token;
      refreshToken = res.body.data.refresh_token;
    });

    it('refresh — ротация токенов', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.access_token).toEqual(expect.any(String));
      expect(res.body.data.refresh_token).toEqual(expect.any(String));

      accessToken = res.body.data.access_token;
      refreshToken = res.body.data.refresh_token;
    });

    it('logout — refresh-токен отзывается', async () => {
      const logoutRes = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(logoutRes.status).toBe(200);

      const refreshRes = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`);
      expect(refreshRes.status).toBe(401);
    });
  });

  describe('hotels: admin CRUD + публичная видимость', () => {
    let hotelId: string;

    const hotelPayload = {
      name: 'Аврора',
      type: 'Гостиница',
      minPrice: 9100,
      registryNumber: 'CSO7772222',
      seaType: 'Черное море',
      rooms: [{ name: 'Стандарт', type: 'Стандарт', capacity: 2 }],
    };

    it('login для admin-операций', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(admin);

      expect(res.status).toBe(202);
      accessToken = res.body.data.access_token;
    });

    it('POST /api/admin/hotels — создаёт отель (published: false)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/admin/hotels')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(hotelPayload);

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Аврора');
      expect(res.body.data.published).toBe(false);

      hotelId = res.body.data._id;
    });

    it('POST /api/admin/hotels с лишним полем — 400 (forbidNonWhitelisted)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/admin/hotels')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...hotelPayload, hackerField: true });

      expect(res.status).toBe(400);
    });

    it('POST /api/admin/hotels без обязательных полей — 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/admin/hotels')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Без комнат' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('неопубликованный отель не виден в публичном списке', async () => {
      const res = await request(app.getHttpServer()).get('/api/hotels');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.meta.pagination.total).toBe(0);
    });

    it('PATCH /api/admin/hotels/published/:id — публикация', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/admin/hotels/published/${hotelId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ published: true });

      expect(res.status).toBe(200);
      expect(res.body.data.published).toBe(true);
    });

    it('опубликованный отель появляется в публичном списке и детальной', async () => {
      const listRes = await request(app.getHttpServer()).get('/api/hotels');
      expect(listRes.status).toBe(200);
      expect(listRes.body.data).toHaveLength(1);
      expect(listRes.body.data[0].name).toBe('Аврора');
      expect(listRes.body.meta.pagination.total).toBe(1);

      const oneRes = await request(app.getHttpServer()).get(
        `/api/hotels/${hotelId}`,
      );
      expect(oneRes.status).toBe(200);
      expect(oneRes.body.data.name).toBe('Аврора');
    });

    it('DELETE /api/admin/hotels/:id — удаление', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/admin/hotels/${hotelId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.deletedCount).toBe(1);

      const listRes = await request(app.getHttpServer()).get('/api/hotels');
      expect(listRes.body.meta.pagination.total).toBe(0);
    });
  });
});
