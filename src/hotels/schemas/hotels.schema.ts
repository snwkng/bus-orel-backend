import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Address } from '../subschemas/address.subschema';
import { AdditionalInfo } from '../subschemas/additionalInfo.subschema';
import { IncludedInThePrice } from '../subschemas/includedInThePrice.subschema';
export type HotelsDocument = Hotel & Document;
@Schema({ timestamps: true })
export class Hotel {
  @ApiProperty({
    example: 'Аврора',
    description: 'Hotel name',
  })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    example: 'гостиница',
    description: 'Hotel type',
  })
  @Prop({ type: String })
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

  @Prop({ type: String })
  seaType: string;

  @ApiProperty({
    example: '20211',
    description: 'minimal tour price',
  })
  @Prop({ type: Number })
  minPrice: number;

  @Prop({ type: () => AdditionalInfo })
  additionalInfo: AdditionalInfo;

  @Prop({ type: () => [IncludedInThePrice], default: [] })
  includedInThePrice: IncludedInThePrice[];

  @ApiProperty({
    example: '[123.webp, 456.webp]',
    description: 'hotel images',
  })
  @Prop({ type: [raw(String)], default: [] })
  images?: string[];

  @ApiProperty({
    example: 'tour.docx',
    description: 'document for tour',
  })
  @Prop({ type: [raw(String)], default: [] })
  documentName?: string[];

  @ApiProperty({
    example: 'false',
    description: 'Tour publish',
  })
  @Prop({ type: Boolean, required: true })
  published: boolean;



}
export const HotelSchema = SchemaFactory.createForClass(Hotel);
