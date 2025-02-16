import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type CitiesDocument = City & Document;

@Schema()
export class City {
  @ApiProperty({ example: 'Орел', description: 'city name' })
  @Prop({ type: String, required: true })
  name: string;
}

export const CitiesDocument = SchemaFactory.createForClass(City);