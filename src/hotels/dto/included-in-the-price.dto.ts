import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class IncludedInThePriceDto {
  @ApiPropertyOptional({ example: "wi-fi" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly serviceName?: string;

  @ApiPropertyOptional({ example: "icon.svg" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly iconForService?: string;
}