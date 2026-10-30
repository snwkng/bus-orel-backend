import { ApiProperty } from '@nestjs/swagger';

// Результат удаления документа (MongoDB DeleteResult)
export class DeleteResultDto {
  @ApiProperty({ example: true, description: 'Запрос обработан MongoDB' })
  acknowledged: boolean;

  @ApiProperty({ example: 1, description: 'Количество удалённых документов' })
  deletedCount: number;
}
