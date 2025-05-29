import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TourAvailability {
  @Prop({})
  startDate: Date;

  @Prop({})
  endDate: Date;

  @Prop({ min: 0 })
  pricePerPerson: number;
}

export const TourAvailabilitySchema = SchemaFactory.createForClass(TourAvailability);