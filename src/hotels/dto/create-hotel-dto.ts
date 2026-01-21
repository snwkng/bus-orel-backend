import { ApiProperty } from '@nestjs/swagger';
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
  IsNotEmpty
} from 'class-validator';

import { AddressDto } from './address.dto';
import { AdditionalInfoDto } from './additional-info.dto';
import { IncludedInThePriceDto } from './included-in-the-price.dto';
import { RoomDto } from './room.dto';


export class CreateHotelDto {
  @ApiProperty({ example: 'Аврора', description: 'Название отеля' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly name: string;

  @ApiProperty({ example: 'Гостиница', description: 'Тип жилья' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly type?: string;

  @ApiProperty({ example: 'гостиница в живописном месте...', description: 'Описание отеля' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly description?: string;

  @ApiProperty({ type: AddressDto, description: 'Адрес отеля' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly address?: AddressDto;

  @ApiProperty({ example: 'Черное море', description: 'Тип моря' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly seaType?: string;

  @ApiProperty({ example: 9100, description: 'Минимальная цена за тур' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly minPrice: number;

  @ApiProperty({ type: AdditionalInfoDto, description: 'Удобства' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AdditionalInfoDto)
  readonly additionalInfo?: AdditionalInfoDto;

  @ApiProperty({ type: [IncludedInThePriceDto], isArray: true, description: 'Услуги включенные в стоимость' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncludedInThePriceDto)
  readonly includedInThePrice?: IncludedInThePriceDto[];

  @ApiProperty({ example: [], description: 'Фотографии отеля' })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly images?: string[];

  @ApiProperty({ example: '[tour.docx]', description: 'Имя документа' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly documentName?: string[];

  @ApiProperty({ example: 'false', description: 'Мероприятие опубликовано' })
  @IsBoolean()
  @IsOptional()
  readonly published: boolean;

  @ApiProperty({ type: [RoomDto], description: 'Номера' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  readonly rooms?: RoomDto[];
}