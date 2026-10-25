import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export const EXCURSION_SORT_FIELDS = [
  'createdAt',
  'name',
  'price',
  'type',
  'duration',
] as const;

export class ExcursionQueryDto extends PaginationDto {
  @ApiProperty({ example: 'Москва', required: false })
  @IsString()
  @IsOptional()
  readonly city?: string;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  readonly count?: number = 10;

  @ApiProperty({ example: 'Название', required: false })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    enum: EXCURSION_SORT_FIELDS,
    description: 'Поле сортировки',
  })
  @IsOptional()
  @IsString()
  @IsIn(EXCURSION_SORT_FIELDS)
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
