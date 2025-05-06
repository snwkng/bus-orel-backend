import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ExcursionCitiesDocument = ExcursionCity & Document;

@Schema()
export class ExcursionCity {
  @ApiProperty({ example: 'Орел', description: 'city name' })
  @Prop({ type: String, required: true })
  name: string;
}

export const ExcursionCitiesSchema = SchemaFactory.createForClass(ExcursionCity);