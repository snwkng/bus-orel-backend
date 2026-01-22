import { ApiProperty } from '@nestjs/swagger';

export class SelectItemDto {
  @ApiProperty({ example: 1, description: 'Идентификатор' })
  id: number;

  @ApiProperty({ example: 'Анталия', description: 'Имя' })
  name: string;
}