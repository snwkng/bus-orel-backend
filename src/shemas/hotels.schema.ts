import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, ObjectId } from 'mongoose';

export type HotelsDocument = Hotel & Document;
@Schema()
export class Hotel {
  @ApiProperty({
    example: 'Аврора',
    description: 'Hotel name',
  })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    example: 'гостиница',
    description: 'Hotel type',
  })
  @Prop({ type: String, required: true })
  type: string;

  @ApiProperty({
    example: 'гостиница располагается с живопистном месте...',
    description: 'location description',
  })
  @Prop({ type: String, required: true })
  locationDescription: string;

  @ApiProperty({
    example:
      '[{type: "Стандарт", numberOfSeats: 2, inRoom: "wi-fi, холодильник, телевизор"}]',
    description: 'rooms array',
  })
  @Prop({ type: [Object], required: true })
  rooms: [
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
  @Prop({ type: String })
  food: string;

  @ApiProperty({
    example: 'городской мелко-галечный',
    description: 'beach type',
  })
  @Prop({ type: String })
  beach: string;

  @ApiProperty({
    example: '10 минут хотьбы от гостиницы',
    description: 'distance to beach',
  })
  @Prop({ type: String })
  distanceToBeach: string;

  @ApiProperty({
    example:
      'заселение по номерам после 12:00 в день прибытия. Освобождение номеров до 09:00 в день отъезда',
    description: 'check-in and check-out conditions',
  })
  @Prop({ type: String })
  checkInConditions: string;

  @ApiProperty({
    example: 'Краснодарский край, г. Анапа, ул. Горького, 68',
    description: 'address',
  })
  @Prop({ type: String, required: true })
  address: string;

  @ApiProperty({
    example: '9100',
    description: 'fare',
  })
  @Prop({ type: Number })
  fare: number;

  @ApiProperty({
    example: 'проезд, проживание и другое',
    description: 'the price includes',
  })
  @Prop({ type: String })
  thePriceIncludes: string;

  @ApiProperty({
    example:
      '[{startDate: "22.07.2022" endDate: "30.07.20222", rooms: [{ room: "2 местный стандарт", price: 12100 }]}]',
    description: 'the price includes',
  })
  @Prop({ type: [Object] })
  tours: [
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
  @Prop({ type: String, required: true })
  city: string;

  @ApiProperty({
    example: 'Краснодарский край',
    description: 'region',
  })
  @Prop({ type: String, required: true })
  region: string;
}
export const HotelsDocument = SchemaFactory.createForClass(Hotel);
