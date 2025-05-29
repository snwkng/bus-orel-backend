import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { FacilitiesDto } from './facilities.dto';
import { TourItemDto } from './tour-item.dto';

export class CreateBusTourDto {
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

  @ApiProperty({ type: FacilitiesDto, description: 'Удобства' })
  readonly facilities?: FacilitiesDto;

  @ApiProperty({ type: [TourItemDto], description: 'Доступные номера и даты' })
  readonly tours?: TourItemDto[];

  @ApiProperty({ example: [], description: 'Фотографии отеля' })
  readonly images?: string[];

  @ApiProperty({ example: 'tour.docx', description: 'Имя документа' })
  readonly documentName?: string;
}