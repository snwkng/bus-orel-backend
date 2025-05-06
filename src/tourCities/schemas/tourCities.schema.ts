import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type TourCitiesDocument = TourCity & Document;

@Schema()
export class TourCity {
  @ApiProperty({ example: 'Орел', description: 'city name' })
  @Prop({ type: String, required: true, index: true })
  name: string;
}
export const TourCitiesSchema = SchemaFactory.createForClass(TourCity);