import { ApiProperty } from '@nestjs/swagger';

export class CreateExcursionDto {
  @ApiProperty({
    example: 'название экскурсии',
    description: 'excursion name',
  })
  readonly name: string;
  @ApiProperty({
    example: '["Описание первого дня", "Описание второго дня"]',
    description: 'excursion description',
  })
  readonly descriptrion: string[];
  @ApiProperty({
    example: '[imageName.webp]',
    description: 'array of string excursion images',
  })
  readonly images: string[];
  @ApiProperty({ example: '5', description: 'duration excursion' })
  readonly duration: number;
  @ApiProperty({ example: '10500', description: 'price excursion' })
  readonly price: number;
  @ApiProperty({ example: 'document.docx', description: 'price document name' })
  readonly documentName: string;
  @ApiProperty({ example: '[2022-07-01]', description: 'excursion start date' })
  readonly excursionStartDates: Date[];
  @ApiProperty({ example: '[Москва, Орёл]', description: 'excurtion cities' })
  readonly cities: string[];
  @ApiProperty({ example: 'Отель Эллиот', description: 'hotel name' })
  readonly hotelName: string;
  @ApiProperty({
    example: '["Экскурсии по программе"]',
    description: 'array of string the price includes',
  })
  readonly thePriceIncludes: string[];
}
