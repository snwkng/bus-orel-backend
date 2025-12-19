import { ApiProperty } from '@nestjs/swagger';

export class RoomDto {
  @ApiProperty({ example: 'Номер с видом на море' })
  readonly name: string;

  @ApiProperty({ example: 'Стандарт' })
  readonly type: string;

  @ApiProperty({ example: 1 })
  readonly capacity: number;

  @ApiProperty({ example: 'Телевизор, кондиционер' })
  readonly inRoom?: string;
}