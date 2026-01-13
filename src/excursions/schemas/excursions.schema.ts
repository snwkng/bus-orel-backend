import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ExcursionDocument = Excursion & Document;
@Schema({ versionKey: false, autoIndex: false })
export class Excursion {
  @ApiProperty({ example: 'Excursion name', description: 'Excursion name' })
  @Prop({ type: String, required: true, trim: true, index: true })
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
  @Prop({ type: [String], required: true })
  images: [string];

  @ApiProperty({ example: 3, description: 'excursion duration' })
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
  @Prop({ type: [String] })
  documentName: [string];

  @ApiProperty({ example: ['2022-06-01', '2025-01-01'], description: 'excursions start dates' })
  @Prop({ type: [Date], required: true })
  excursionStartDates: Date[];

  @ApiProperty({ example: ["Москва", "Орёл"], description: 'cities array of string' })
  @Prop({ type: [String], required: true, index: true })
  cities: string[];

  @ApiProperty({
    example: ["экскурсии по программе"],
    description: 'массив строк',
  })
  @Prop({ type: [String], required: true })
  thePriceIncludes: [];

  @ApiProperty({
    example: ["Аренда самокатов", "Проживание в отеле"],
    description: 'массив строк',
  })
  @Prop({ type: [String], required: true })
  additionallyPaid: [];
}

export const ExcursionSchema = SchemaFactory.createForClass(Excursion);

// Составной индекс для оптимизации поиска в публичной части
ExcursionSchema.index({ name: 1 });
