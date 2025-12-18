import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class TourAvailability {
  @ApiProperty({
    example: '2025-07-12',
    description: 'startDate',
  })
  @Prop({type: Date})
  startDate: Date;

  @ApiProperty({
    example: '2025-07-22',
    description: 'endDate',
  })
  @Prop({type: Date})
  endDate: Date;

  @ApiProperty({
    example: '18000',
    description: 'price',
  })
  @Prop({ min: 0 })
  pricePerPerson: number;
}

export const TourAvailabilitySchema = SchemaFactory.createForClass(TourAvailability);