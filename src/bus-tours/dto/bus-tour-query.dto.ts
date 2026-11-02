import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';

export const BUS_TOUR_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'hotelId',
] as const;

export class BusTourQueryDto {
  @ApiProperty({
    example: '665f1a2b3c4d5e6f7a8b9c0d',
    required: false,
    description: 'идентификатор отеля',
  })
  @IsOptional()
  @IsMongoId()
  readonly hotelId?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    enum: BUS_TOUR_SORT_FIELDS,
    description: 'Поле сортировки',
  })
  @IsOptional()
  @IsString()
  @IsIn(BUS_TOUR_SORT_FIELDS)
  readonly sortBy?: string;

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Направление сортировки',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  readonly sortDir?: 'asc' | 'desc';
}
