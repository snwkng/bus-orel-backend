import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export const HOTEL_SORT_FIELDS = [
  'createdAt',
  'name',
  'minPrice',
  'type',
  'seaType',
] as const;

export class HotelQueryDto extends PaginationDto {
  @ApiProperty({ example: 'Москва', required: false })
  @IsString()
  @IsOptional()
  readonly city?: string;

  @ApiProperty({ example: 'Азовское море', required: false })
  @IsString()
  @IsOptional()
  readonly seaType?: string;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly count?: number = 10;

  @ApiPropertyOptional({
    example: 'createdAt',
    enum: HOTEL_SORT_FIELDS,
    description: 'Поле сортировки',
  })
  @IsOptional()
  @IsString()
  @IsIn(HOTEL_SORT_FIELDS)
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
