import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PublishHotelDto {
  @ApiProperty({ example: true, description: 'Флаг публикации отеля' })
  @IsBoolean()
  @IsNotEmpty()
  readonly published: boolean;
}
