import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

// Базовые поля документов MongoDB (timestamps: true) для Swagger-документации
export class BaseDocument {
  @ApiProperty({
    type: String,
    example: '665f1b2c8f4b2a0012abcd34',
    description: 'ID документа',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    example: '2026-10-30T12:00:00.000Z',
    description: 'Дата создания',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-10-30T12:00:00.000Z',
    description: 'Дата последнего обновления',
  })
  updatedAt: Date;
}
