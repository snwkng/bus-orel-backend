import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AddressDto {
  @ApiPropertyOptional({ example: 'Краснодарский край, ул. Пушкина, д. 111' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly fullAddress?: string;

  @ApiPropertyOptional({ example: 'Анапа' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly city?: string;

  @ApiPropertyOptional({ example: 'Краснодарский край' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly region?: string;

  @ApiPropertyOptional({ example: 'Россия' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly country?: string;
}