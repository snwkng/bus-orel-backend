import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  getSchemaPath,
  OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ErrorResponseDto } from '../common/dto/api-response.dto';

export function buildSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('bus-orel.ru')
    .setDescription('REST API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
}

// Собирает документ и добавляет глобальные ответы ошибок (AllExceptionsFilter):
// 400/429/500 — всем операциям, 401 — защищённым (security), 404 — путям с параметрами
export function buildSwaggerDocument(app: INestApplication): OpenAPIObject {
  const document = SwaggerModule.createDocument(app, buildSwaggerConfig(), {
    extraModels: [ErrorResponseDto],
  });
  applyGlobalErrorResponses(document);
  return document;
}

function errorResponse(description: string) {
  return {
    description,
    content: {
      'application/json': { schema: { $ref: getSchemaPath(ErrorResponseDto) } },
    },
  };
}

const HTTP_METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'head',
] as const;

function applyGlobalErrorResponses(document: OpenAPIObject) {
  for (const [path, pathItem] of Object.entries(document.paths)) {
    for (const method of HTTP_METHODS) {
      const operation: OperationObject | undefined = pathItem[method];
      if (!operation) {
        continue;
      }
      operation.responses['400'] ??= errorResponse(
        'Ошибка валидации или некорректные параметры запроса',
      );
      operation.responses['429'] ??= errorResponse(
        'Превышен лимит запросов (100 req/мин, на /api/auth/login и /api/auth/refresh — 5 req/мин)',
      );
      operation.responses['500'] ??= errorResponse('Внутренняя ошибка сервера');
      if (operation.security && operation.security.length > 0) {
        operation.responses['401'] ??= errorResponse(
          'Не авторизован: отсутствует или недействителен JWT-токен',
        );
      }
      if (path.includes('{')) {
        operation.responses['404'] ??= errorResponse('Ресурс не найден');
      }
    }
  }
}
