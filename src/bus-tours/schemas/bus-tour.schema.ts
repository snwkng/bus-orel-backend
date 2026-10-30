import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import {
  TourAvailabilitySchema,
  TourAvailability,
} from '../subschemas/tour-availability.subschema';
import { BaseDocument } from '../../common/schemas/base-document.schema';
export type BusToursDocument = BusTour & Document;
@Schema({ timestamps: true })
export class BusTour extends BaseDocument {
  @ApiProperty({
    type: String,
    example: '665f1b2c8f4b2a0012abcd34',
    description: 'Hotel id',
  })
  @Prop({ type: Types.ObjectId, ref: 'Hotel', required: true })
  hotelId: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: '665f1b2c8f4b2a0012abcd34',
    description: 'room id',
  })
  @Prop({ type: Types.ObjectId, required: true })
  roomId: Types.ObjectId;

  @ApiProperty({
    type: () => [TourAvailability],
    description: 'available tour dates and prices',
  })
  @Prop({
    type: [raw(TourAvailabilitySchema)],
    default: [],
  })
  tours: TourAvailability[];
}
export const BusTourSchema = SchemaFactory.createForClass(BusTour);
BusTourSchema.index({ hotelId: 1 });
