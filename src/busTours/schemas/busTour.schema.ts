import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { TourAvailabilitySchema, TourAvailability } from '../subschemas/tour-availability.subschema';
export type BusToursDocument = BusTour & Document;
@Schema({ timestamps: true })
export class BusTour {
  @ApiProperty({
    example: '123123as23',
    description: 'Hotel id',
  })
  @Prop({ type: Types.ObjectId, required: true })
  hoteId: Types.ObjectId;

  @ApiProperty({
    example: '123123as23',
    description: 'room id',
  })
  @Prop({ type: Types.ObjectId, required: true })
  roomId: Types.ObjectId;

  @Prop({
    type: [raw(TourAvailabilitySchema)], default: []
  })
  tours: TourAvailability[]

}
export const BusTourSchema = SchemaFactory.createForClass(BusTour);
