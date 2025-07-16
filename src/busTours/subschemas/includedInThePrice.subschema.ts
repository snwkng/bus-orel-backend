import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class IncludedInThePrice {
  @ApiProperty({
    example: "wi-fi",
    description: 'service are included in the price',
  })
  @Prop({})
  serviceName: string;

   @ApiProperty({
    example: "wi-fi.svg",
    description: 'icon for service',
  })
  @Prop({})
  iconForService: string;
}

export const IncludedInThePriceSchema = SchemaFactory.createForClass(IncludedInThePrice);