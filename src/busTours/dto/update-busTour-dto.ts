import { ApiProperty } from '@nestjs/swagger';
export class UpdateBusTourDto {
  @ApiProperty({
    example: 'Аврора',
    description: 'Hotel name',
  })
  readonly name: string;

  @ApiProperty({
    example: 'гостиница',
    description: 'Hotel type',
  })
  readonly type: string;

  @ApiProperty({
    example: 'гостиница располагается с живопистном месте...',
    description: 'location description',
  })
  readonly locationDescription: string;

  @ApiProperty({
    example:
      '[type: "стандарт", roomName: "1 местный стандарт", capacity: "2", inRoom: "две односпальные кровати, шкаф, стол, стулья" [{startDate: "01.01", endDate: "02.02", price: "20000"}]]',
    description: 'tours array',
  })
  readonly tours: [
    {
      type: string;
      roomName: string;
      capacity: number;
      inRoom: string;
      datesAndPrices: {
        startDate: Date;
        endDate: Date;
        price: number;
      }[];
    },
  ];

  @ApiProperty({
    example: 'только завтраки',
    description: 'food at the hotel',
  })
  readonly food: string;

  @ApiProperty({
    example: 'городской мелко-галечный',
    description: 'beach type',
  })
  readonly beach: string;

  @ApiProperty({
    example: '10 минут хотьбы от гостиницы',
    description: 'distance to beach',
  })
  readonly distanceToBeach: string;

  @ApiProperty({
    example:
      'заселение по номерам после 12:00 в день прибытия. Освобождение номеров до 09:00 в день отъезда',
    description: 'check-in and check-out conditions',
  })
  readonly checkInConditions: string;

  @ApiProperty({
    example: 'Краснодарский край, г. Анапа, ул. Горького, 68',
    description: 'address',
  })
  readonly address: string;

  @ApiProperty({
    example: '9100',
    description: 'price',
  })
  readonly price: number;

  @ApiProperty({
    example: 'проезд, проживание и другое',
    description: 'the price includes',
  })
  readonly thePriceIncludes: string[];

  @ApiProperty({
    example: 'Анапа',
    description: 'city',
  })
  readonly city: string;

  @ApiProperty({
    example: 'Краснодарский край',
    description: 'region',
  })
  readonly region: string;

  @ApiProperty({
    example: 'Азовское море',
    description: 'seaType',
  })
  readonly seaType: string;

  @ApiProperty({
    example: 'document.docx',
    description: 'price document name'
  })
  readonly documentName: string;
}
