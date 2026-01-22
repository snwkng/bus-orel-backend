import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ExcursionQueryDto {
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
}