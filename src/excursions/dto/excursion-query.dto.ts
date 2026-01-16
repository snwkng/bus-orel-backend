import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString } from 'class-validator';
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
  readonly count?: number = 10;

  @ApiProperty({ example: 'Название', required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly search?: string;
}