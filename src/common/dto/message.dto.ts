import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ example: 'Выход выполнен успешно' })
  message: string;
}
