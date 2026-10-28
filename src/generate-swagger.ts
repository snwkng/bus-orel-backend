import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { buildSwaggerConfig } from './config/swagger.config';

// Генерирует swagger.json в корне проекта без запуска HTTP-сервера.
// Требует запущенную MongoDB и заполненный .env (поднимается весь AppModule).
async function generateSwagger() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
  });
  app.setGlobalPrefix('api');
  await app.init();

  const document = SwaggerModule.createDocument(app, buildSwaggerConfig());
  const outputPath = join(process.cwd(), 'swagger.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`Swagger JSON сохранён: ${outputPath}`);

  await app.close();
}

generateSwagger();
