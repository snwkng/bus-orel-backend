import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Address } from '../subschemas/address.subschema';
import { AdditionalInfo } from '../subschemas/additionalInfo.subschema';
import { IncludedInThePrice } from '../subschemas/includedInThePrice.subschema';
import { Room } from '../subschemas/rooms.subschema';
export type HotelsDocument = Hotel & Document;
@Schema({ timestamps: true })
export class Hotel {
  @ApiProperty({
    example: 'Аврора',
    description: 'Hotel name',
  })
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @ApiProperty({
    example: 'гостиница',
    description: 'Hotel type',
  })
  @Prop({ type: String, index: true })
  type: string;

  @ApiProperty({
    example: 'гостиница располагается с живопистном месте...',
    description: 'location description',
  })
  @Prop({ type: String })
  description: string;

  @ApiProperty({
    description: 'location description',
  })
  @Prop({ type: () => Address })
  address: Address;

  @Prop({ type: String, index: true })
  seaType: string;

  @ApiProperty({
    example: '20211',
    description: 'minimal tour to hotel price',
  })
  @Prop({ type: Number, index: true })
  minPrice: number;

  @Prop({ type: () => AdditionalInfo })
  additionalInfo: AdditionalInfo;

  @Prop({ type: () => [IncludedInThePrice], default: [] })
  includedInThePrice: IncludedInThePrice[];

  @ApiProperty({
    example: ['123.webp', '456.webp'],
    description: 'hotel images',
  })
  @Prop({ type: [String], default: [] })
  images?: string[];

  @ApiProperty({
    example: ['contract.pdf'],
    description: 'document for hotel',
  })
  @Prop({ type: [String], default: [] })
  documentName?: string[];

  @ApiProperty({
    example: false,
    description: 'hotel publish',
  })
  @Prop({ type: Boolean, required: true })
  published: boolean;

  @Prop({ type: () => [Room], default: [], validate: [v => Array.isArray(v) && v.length > 0, 'Hotel must have at least one room'] })
  rooms: Room[];

}
export const HotelSchema = SchemaFactory.createForClass(Hotel);

// Составной индекс для оптимизации поиска в публичной части
HotelSchema.index({ published: 1, 'address.city': 1, seaType: 1 });
