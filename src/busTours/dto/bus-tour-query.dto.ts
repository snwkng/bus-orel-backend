import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class BusTourQueryDto {
  @ApiProperty({
    example: '665f1a2b3c4d5e6f7a8b9c0d',
    required: false,
    description: 'идентификатор отеля',
  })
  @IsOptional()
  @IsMongoId()
  readonly hotelId?: string;
}
