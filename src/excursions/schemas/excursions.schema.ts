import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types, } from 'mongoose';

export type ExcursionDocument = Excursion & Document;
@Schema({versionKey: false, autoIndex: false})
export class Excursion {
  @ApiProperty({ example: 'Excursion name', description: 'Excursion name' })
  @Prop({ type: String, required: true, index: true })
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
  hotelName: string;

  @ApiProperty({ example: 'hotel link', description: 'hotel link' })
  @Prop({ type: String })
  hotelLink: string;

  @ApiProperty({
    example: 'excursions.docx',
    description: 'document for excursion',
  })
  @Prop({ type: [raw(String)] })
  documentName: [string];

  @ApiProperty({ example: '[2022-06-01, 2025-01-01]', description: 'excursions start date' })
  @Prop({ type: [Date], required: true })
  excursionStartDates: Date[];

  @ApiProperty({ example: '["Москва", "Орёл"]', description: 'cities array of string' })
  @Prop({ type: [String], required: true, index: true })
  cities: string[];

  @ApiProperty({
    example: '["экскурсии по программе"]',
    description: 'array of strings',
  })
  @Prop({ type: [String], required: true })
  thePriceIncludes: [];
}

export const ExcursionDocument = SchemaFactory.createForClass(Excursion);
