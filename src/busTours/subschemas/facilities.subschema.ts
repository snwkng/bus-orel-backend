import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Facilities {
  @Prop({ type: Boolean, default: false })
  included: boolean;

  @Prop({ type: String, default: '' })
  type: string;
}

@Schema()
export class Beach {
  @Prop({type: String, default: 'Галечный'})
  type: string;

  @Prop({ type: Number })
  distanceMinutes: number;
}

@Schema()
export class CheckIn {
  @Prop()
  checkIn: string;

  @Prop()
  checkOut: string;
}

@Schema()
export class FacilitiesGroup {
  @Prop(() => Facilities)
  food: Facilities;

  @Prop(() => Beach)
  beach: Beach;

  @Prop(() => CheckIn)
  checkInOut: CheckIn;
}

export const FacilitiesSchema = SchemaFactory.createForClass(FacilitiesGroup);