import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { buildSwaggerDocument } from './config/swagger.config.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors(
    allowedOrigins.length > 0
      ? { origin: allowedOrigins, credentials: true }
      : { origin: false },
  );
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public/',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  if (process.env.NODE_ENV !== 'production') {
    const document = buildSwaggerDocument(app);
    SwaggerModule.setup('/api/docs', app, document);
  }
  await app.listen(PORT);
  new Logger('Bootstrap').log(`Server start on port - ${PORT}`);
}
bootstrap();
