import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Food {
  @ApiProperty({
    example: false,
    description: 'included food flag',
  })
  @Prop({ type: Boolean, default: false })
  included: boolean;

  @ApiProperty({
    example: 'Только завтраки',
    description: 'food included type',
  })
  @Prop({ type: String, default: '' })
  type: string;
}

@Schema()
export class Beach {
  @ApiProperty({
    example: 'Галечный',
    description: 'beach type',
  })
  @Prop({ type: String, default: 'Галечный' })
  type: string;

  @ApiProperty({
    example: 5,
    description: 'distance to the beach in minutes',
  })
  @Prop({ type: Number })
  distanceMinutes: number;
}

@Schema()
export class CheckIn {
  @ApiProperty({
    example: '12:00',
    description: 'check in time',
  })
  @Prop()
  checkIn: string;

  @ApiProperty({
    example: '14:00',
    description: 'check out time',
  })
  @Prop()
  checkOut: string;
}

@Schema()
export class AdditionalInfo {
  @Prop(() => Food)
  food: Food;

  @Prop(() => Beach)
  beach: Beach;

  @Prop(() => CheckIn)
  checkInOut: CheckIn;
}

export const AdditionalInfoSchema = SchemaFactory.createForClass(AdditionalInfo);