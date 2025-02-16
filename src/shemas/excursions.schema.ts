import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ExcursionDocument = Excursion & Document;
@Schema()
export class Excursion {
  @ApiProperty({ example: 'Excursion name', description: 'Excursion name' })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    example: 'Excursion description',
    description: 'Excursion description',
  })
  @Prop({ type: [String], required: true })
  description: string[];

  @ApiProperty({
    example: '[{imageName.webp}]',
    description: 'array string',
  })
  @Prop({ type: [raw(String)], required: true })
  images: [string];

  @ApiProperty({ example: '3', description: 'excursion duration' })
  @Prop({ type: Number, required: true, default: false })
  duration: number;

  @ApiProperty({ example: '10500', description: 'price' })
  @Prop({ type: Number, required: true })
  price: number;

  @ApiProperty({ example: 'hotel name', description: 'hotel name' })
  @Prop({ type: String })
  hotel: string;

  @ApiProperty({ example: 'hotel link', description: 'hotel link' })
  @Prop({ type: String })
  hotelLink: string;

  @ApiProperty({
    example: 'excursions.docx',
    description: 'document for excursion',
  })
  @Prop({ type: String })
  documentName: string;

  @ApiProperty({ example: '2022-06-01', description: 'excursions start date' })
  @Prop({ type: Date, required: true })
  excursionStart: Date;

  @ApiProperty({ example: '["60d5e4f8a8c7b94b48d4b4e5"]', description: 'cities array of ObjectIds' })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'City' }], required: true })
  cities: MongooseSchema.Types.ObjectId[];

  @ApiProperty({
    example: '["экскурсии по программе"]',
    description: 'array of strings',
  })
  @Prop({ type: [String], required: true })
  thePriceIncludes: [];
}

export const ExcursionDocument = SchemaFactory.createForClass(Excursion);
