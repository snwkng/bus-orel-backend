import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  IsBoolean,
  IsObject,
  ArrayMinSize,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';

import { AddressDto } from './address.dto';
import { AdditionalInfoDto } from './additional-info.dto';
import { IncludedInThePriceDto } from './included-in-the-price.dto';
import { RoomDto } from './room.dto';

export class CreateHotelDto {
  @ApiProperty({ example: 'Аврора', description: 'Название отеля' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly name: string;

  @ApiPropertyOptional({ example: 'Гостиница', description: 'Тип жилья' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly type?: string;

  @ApiPropertyOptional({
    example: 'гостиница в живописном месте...',
    description: 'Описание отеля',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly description?: string;

  @ApiPropertyOptional({ type: AddressDto, description: 'Адрес отеля' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly address?: AddressDto;

  @ApiPropertyOptional({ example: 'Черное море', description: 'Тип моря' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly seaType?: string;

  @ApiProperty({ example: 9100, description: 'Минимальная цена за тур' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly minPrice: number;

  @ApiPropertyOptional({ type: AdditionalInfoDto, description: 'Удобства' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AdditionalInfoDto)
  readonly additionalInfo?: AdditionalInfoDto;

  @ApiPropertyOptional({
    type: IncludedInThePriceDto,
    isArray: true,
    description: 'Услуги включенные в стоимость',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncludedInThePriceDto)
  readonly includedInThePrice?: IncludedInThePriceDto[];

  @ApiPropertyOptional({ example: [], description: 'Фотографии отеля' })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly images?: string[];

  @ApiPropertyOptional({ example: '[tour.docx]', description: 'Имя документа' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly documentName?: string[];

  @ApiPropertyOptional({
    example: 'false',
    description: 'Мероприятие опубликовано',
  })
  @IsBoolean()
  @IsOptional()
  readonly published?: boolean;

  @ApiProperty({
    example: 'CSO7772222',
    description: 'Регистрационный номер отеля',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly registryNumber: string;

  @ApiProperty({ type: [RoomDto], description: 'Номера' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  readonly rooms?: RoomDto[];
}
