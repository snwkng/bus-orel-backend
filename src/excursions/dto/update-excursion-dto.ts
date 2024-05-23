import { ApiProperty } from '@nestjs/swagger';

export class UpdateExcursionDto {
  @ApiProperty({
    example: 'название экскурсии',
    description: 'excursion name',
  })
  readonly name: string;
  @ApiProperty({
    example: 'описание экскурсии',
    description: 'excursion description',
  })
  readonly descriptrion: string;
  @ApiProperty({
    example: '[{name: sea.jpg}]',
    description: 'array of objects excursion images',
  })
  readonly images: [{ name: string }];
  @ApiProperty({ example: '5', description: 'duration excursion' })
  readonly duration: number;
  @ApiProperty({ example: '10500', description: 'price excursion' })
  readonly price: number;
  @ApiProperty({ example: 'название отеля', description: 'hotel name' })
  readonly hotel: string;
  @ApiProperty({ example: 'ссылка на сайт отеля', description: 'hotel link' })
  readonly hotelLink: string;
  @ApiProperty({ example: 'document.docx', description: 'price document name' })
  readonly documentName: string;
  @ApiProperty({ example: '2022-07-01', description: 'excursion start date' })
  readonly excursionStart: Date;
  @ApiProperty({ example: 'Москва', description: 'excurtion city' })
  readonly city: string;
  @ApiProperty({
    example: '["Экскурсии по программе"]',
    description: 'array of string the price includes',
  })
  readonly thePriceIncludes: string[];
}
