import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { AdditionalInfoDto } from './additional-info.dto';
import { IncludedInThePriceDto } from './included-in-the-price.dto';

export class CreateHotelDto {
  @ApiProperty({ example: 'Аврора', description: 'Название отеля' })
  readonly name: string;

  @ApiProperty({ example: 'Гостиница', description: 'Тип жилья' })
  readonly type?: string;

  @ApiProperty({ example: 'гостиница в живописном месте...', description: 'Описание отеля' })
  readonly description?: string;

  @ApiProperty({ type: AddressDto, description: 'Адрес отеля' })
  readonly address?: AddressDto;

  @ApiProperty({ example: 'Черное море', description: 'Тип моря' })
  readonly seaType?: string;

  @ApiProperty({ example: 9100, description: 'Минимальная цена за тур' })
  readonly minPrice?: number;

  @ApiProperty({ type: AdditionalInfoDto, description: 'Удобства' })
  readonly additionalInfo?: AdditionalInfoDto;

  @ApiProperty({ type: [IncludedInThePriceDto], description: 'Услуги включенные в стоимость' })
  readonly  includedInThePrice?: IncludedInThePriceDto[];

  @ApiProperty({ example: [], description: 'Фотографии отеля' })
  readonly images?: string[];

  @ApiProperty({ example: '[tour.docx]', description: 'Имя документа' })
  readonly documentName?: string[];

  @ApiProperty({ example: 'false', description: 'Мероприятие опубликовано' })
  readonly published: boolean;
}