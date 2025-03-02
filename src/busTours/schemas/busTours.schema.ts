import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BusToursDocument = BusTour & Document;
@Schema()
export class BusTour {
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
    example: '[123.webp, 456.webp]',
    description: 'hotel images',
  })
  @Prop({ type: [raw(String)] })
  images: [string];

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
  @Prop({ type: String })
  address: string;

  @ApiProperty({
    example: '9100',
    description: 'price',
  })
  @Prop({ type: Number })
  price: number;

  @ApiProperty({
    example: 'проезд, проживание и другое',
    description: 'the price includes',
  })
  @Prop({ type: [String] })
  thePriceIncludes: [];

  @ApiProperty({
    example:
      '[type: "стандарт", roomName: "1 местный стандарт", numberOfSeats: "2", inRoom: "две односпальные кровати, шкаф, стол, стулья" [{startDate: "01.01", endDate: "02.02", price: "20000"}]]',
    description: 'the price includes',
  })
  @Prop({ type: [Object] })
  tours: [
    {
      type: string;
      roomName: string;
      numberOfSeats: number;
      inRoom: string;
      datesAndPrices: {
        startDate: Date;
        endDate: Date;
        price: number;
      }[];
    },
  ];

  @ApiProperty({ example: '{ _id: 60d5e4f8a8c7b94b48d4b4e5, name: "Геленджик"}', description: 'bus tour city object' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TourCity', required: true })
  city: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: 'Краснодарский край',
    description: 'region',
  })
  @Prop({ type: String })
  region: string;

  @ApiProperty({
    example: 'Азовское море',
    description: 'seaType',
  })
  @Prop({ type: String })
  seaType: string;

  @ApiProperty({
    example: 'tour.docx',
    description: 'document for tour',
  })
  @Prop({ type: String })
  documentName: string;
}
export const BusTourSchema = SchemaFactory.createForClass(BusTour);
