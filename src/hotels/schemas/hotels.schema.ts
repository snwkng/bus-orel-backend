import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Address } from '../subschemas/address.subschema';
import { AdditionalInfo } from '../subschemas/additionalInfo.subschema';
import { IncludedInThePrice } from '../subschemas/includedInThePrice.subschema';
import { Room } from '../subschemas/rooms.subschema';
import { BaseDocument } from '../../common/schemas/base-document.schema';
export type HotelsDocument = Hotel & Document;
@Schema({ timestamps: true })
export class Hotel extends BaseDocument {
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
    type: () => Address,
    description: 'hotel address',
  })
  @Prop({ type: () => Address })
  address: Address;

  @ApiProperty({
    example: 'Чёрное море',
    description: 'sea type',
  })
  @Prop({ type: String, index: true })
  seaType: string;

  @ApiProperty({
    example: '20211',
    description: 'minimal tour to hotel price',
  })
  @Prop({ type: Number, index: true })
  minPrice: number;

  @ApiProperty({
    type: () => AdditionalInfo,
    description: 'additional hotel info (food, beach, check-in/out)',
  })
  @Prop({ type: () => AdditionalInfo })
  additionalInfo: AdditionalInfo;

  @ApiProperty({
    type: () => [IncludedInThePrice],
    description: 'services included in the price',
  })
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

  @ApiProperty({
    example: 'CSO777121323',
    description: 'Регистрационный номер отеля',
  })
  @Prop({ type: String, required: true })
  registryNumber: string;

  @ApiProperty({
    type: () => [Room],
    description: 'hotel rooms (at least one)',
  })
  @Prop({
    type: () => [Room],
    default: [],
    validate: [
      (v: unknown) => Array.isArray(v) && v.length > 0,
      'Hotel must have at least one room',
    ],
  })
  rooms: Room[];
}
export const HotelSchema = SchemaFactory.createForClass(Hotel);

// Составной индекс для оптимизации поиска в публичной части
HotelSchema.index({ published: 1, 'address.city': 1, seaType: 1 });
