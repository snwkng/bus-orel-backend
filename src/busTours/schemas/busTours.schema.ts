import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Address } from '../subschemas/address.subschema';
import { FacilitiesGroup } from '../subschemas/facilities.subschema';
import { TourAvailabilitySchema, TourAvailability } from '../subschemas/tour-availability.subschema';
export type BusToursDocument = BusTour & Document;
@Schema({ timestamps: true })
export class BusTour {
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

  @Prop({ type: () => FacilitiesGroup })
  facilities: FacilitiesGroup;

  @Prop({
    type: [{
      type: {
        type: { type: String },
        roomType: { type: String },
        roomName: { type: String },
        beds: { type: Number },
        description: { type: String },
        availability: {
          type: [raw(TourAvailabilitySchema)],
          default: []
        }
      }
    }], default: []
  })
  tours: Array<{
    type: string;
    roomType: string;
    roomName: string;
    beds: number;
    description: string;
    availability: TourAvailability[];
  }>;

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
  @Prop({ type: String, default: '' })
  documentName?: string;





}
export const BusTourSchema = SchemaFactory.createForClass(BusTour);
