import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
export class CreateHotelDto {
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
      '[{type: "Стандарт", numberOfSeats: 2, inRoom: "wi-fi, холодильник, телевизор"}]',
    description: 'rooms array',
  })
  readonly rooms: [
    {
      type: string;
      numberOfSeats: number;
      inRoom: string;
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
    description: 'fare',
  })
  readonly fare: number;

  @ApiProperty({
    example: 'проезд, проживание и другое',
    description: 'the price includes',
  })
  readonly thePriceIncludes: string;

  @ApiProperty({
    example:
      '[{startDate: "22.07.2022" endDate: "30.07.20222", rooms: [{ room: "2 местный стандарт", price: 12100 }]}]',
    description: 'the price includes',
  })
  readonly tours: [
    {
      startDate: string;
      endDate: string;
      rooms: [
        {
          room: ObjectId;
          price: number;
        },
      ];
    },
  ];

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
}
