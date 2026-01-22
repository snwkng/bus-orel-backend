import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ExcursionDocument = Excursion & Document;
@Schema({ timestamps: true, versionKey: false })
export class Excursion {
  @ApiProperty({ example: 'Золотое кольцо России', description: 'Название экскурсии' })
  @Prop({ type: String, required: true, trim: true, index: true })
  name: string;

  @ApiProperty({
    example: ['Посещение храмов', 'Обед в трапезной'],
    description: 'Описание экскурсии (массив этапов или параграфов)',
  })
  @Prop({ type: [String], required: true })
  description: string[];

  @ApiProperty({
    example: ['image1.webp', 'image2.webp'],
    description: 'Массив имен файлов изображений',
  })
  @Prop({ type: [String], required: true, default: [] })
  images: string[];

  @ApiProperty({ example: 3, description: 'Продолжительность (в днях)' })
  @Prop({ type: Number, required: true, default: 1 })
  duration: number;

  @ApiProperty({ example: 10500, description: 'Стоимость' })
  @Prop({ type: Number, required: true, index: true })
  price: number;

  @ApiProperty({ example: 'Отель Аврора', description: 'Название отеля проживания' })
  @Prop({ type: String })
  hotelName: string;

  @ApiProperty({ example: 'https://hotel-link.test', description: 'Ссылка на отель' })
  @Prop({ type: String })
  hotelLink: string;

  @ApiProperty({
    example: ['program.docx'],
    description: 'Документы экскурсии',
  })
  @Prop({ type: [String], default: [] })
  documentName: string[];

  @ApiProperty({ example: ['2022-06-01', '2025-01-01'], description: 'Даты начала экскурсий' })
  @Prop({ type: [Date], required: true })
  excursionStartDates: Date[];

  @ApiProperty({ example: ["Москва", "Орёл"], description: 'Города маршрута' })
  @Prop({ type: [String], required: true, index: true })
  cities: string[];

 @ApiProperty({
    example: ["Экскурсии по программе", "Транспорт"],
    description: 'Что включено в стоимость',
  })
  @Prop({ type: [String], required: true, default: [] })
  thePriceIncludes: string[];

    @ApiProperty({
    example: ["Аренда самокатов", "Проживание в отеле"],
    description: 'Оплачивается отдельно',
  })
  @Prop({ type: [String], required: true, default: [] })
  additionallyPaid: string[];
}

export const ExcursionSchema = SchemaFactory.createForClass(Excursion);

ExcursionSchema.index({ createdAt: -1 });
