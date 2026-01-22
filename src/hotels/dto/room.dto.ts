import { ApiPropertyOptional, ApiProperty  } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class RoomDto {
  @ApiProperty({ example: 'Номер с видом на море' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly name: string;

  @ApiProperty({ example: 'Стандарт' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly type: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly capacity: number;

  @ApiPropertyOptional({ example: 'Телевизор, кондиционер' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly inRoom?: string;
}