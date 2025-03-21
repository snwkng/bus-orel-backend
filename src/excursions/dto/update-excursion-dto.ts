import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class UpdateExcursionDto {
  @ApiProperty({
    example: 'название экскурсии',
    description: 'excursion name',
  })
  readonly name: string;
  @ApiProperty({
    example: '["Описание первого дня", "Описание второго дня"]',
    description: 'excursion description',
  })
  readonly descriptrion: string;
  @ApiProperty({
    example: '[imageName.webp]',
    description: 'array of string excursion images',
  })
  readonly images: [{ name: string; }];
  @ApiProperty({ example: '5', description: 'duration excursion' })
  readonly duration: number;
  @ApiProperty({ example: '10500', description: 'price excursion' })
  readonly price: number;
  @ApiProperty({ example: 'ссылка на сайт отеля', description: 'hotel link' })
  readonly hotelLink: string;
  @ApiProperty({ example: 'document.docx', description: 'price document name' })
  readonly documentName: string;
  @ApiProperty({ example: '2022-07-01', description: 'excursion start date' })
  readonly excursionStart: Date;
  @ApiProperty({ example: '[id1, id2]', description: 'excurtion cities' })
  readonly cities: ObjectId[];
  @ApiProperty({ example: 'Отель Эллиот', description: 'hotel name' })
  readonly hotelName: string;
  @ApiProperty({
    example: '["Экскурсии по программе"]',
    description: 'array of string the price includes',
  })
  readonly thePriceIncludes: string[];
}
