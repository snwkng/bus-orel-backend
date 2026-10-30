import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { PaginationMetaDto } from '../dto/api-response.dto';

interface ApiWrappedResponseOptions {
  status?: number;
  isArray?: boolean;
  paginated?: boolean;
  description?: string;
  // Готовая схема для data — для случаев, когда модели нет (например, ответ AWS S3)
  dataSchema?: SchemaObject;
}

const PRIMITIVE_TYPES = new Map<unknown, string>([
  [String, 'string'],
  [Number, 'number'],
  [Boolean, 'boolean'],
]);

// Документирует ответ в едином формате ApiResponseInterceptor:
// { success, data, meta: { timestamp, path, statusCode, pagination? } }
export function ApiWrappedResponse(
  model?:
    Type<unknown> | StringConstructor | NumberConstructor | BooleanConstructor,
  options: ApiWrappedResponseOptions = {},
) {
  const {
    status = HttpStatus.OK,
    isArray = false,
    paginated = false,
    description = '',
    dataSchema,
  } = options;

  let data: SchemaObject = { nullable: true };
  const primitive = model ? PRIMITIVE_TYPES.get(model) : undefined;
  if (dataSchema) {
    data = dataSchema;
  } else if (primitive) {
    data = isArray
      ? { type: 'array', items: { type: primitive } }
      : { type: primitive };
  } else if (model) {
    data = isArray
      ? { type: 'array', items: { $ref: getSchemaPath(model) } }
      : ({ $ref: getSchemaPath(model) } as SchemaObject);
  }

  return applyDecorators(
    ApiExtraModels(
      ...(paginated ? [PaginationMetaDto] : []),
      ...(model && !primitive ? [model as Type<unknown>] : []),
    ),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        required: ['success', 'data', 'meta'],
        properties: {
          success: { type: 'boolean', example: true },
          data,
          meta: {
            type: 'object',
            required: ['timestamp', 'path', 'statusCode'],
            properties: {
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2026-10-30T12:00:00.000Z',
              },
              path: { type: 'string', example: '/api/hotels?page=1' },
              statusCode: { type: 'number', example: status },
              ...(paginated
                ? { pagination: { $ref: getSchemaPath(PaginationMetaDto) } }
                : {}),
            },
          },
        },
      },
    }),
  );
}
