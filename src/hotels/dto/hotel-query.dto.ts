import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class HotelQueryDto {
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
}