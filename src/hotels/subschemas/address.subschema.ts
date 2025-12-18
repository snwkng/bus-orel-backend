import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
@Schema()
export class Address {
  @ApiProperty({
    example: 'Краснодарский край, улица Пушкина, дом 111',
    description: 'full address',
  })
  @Prop({})
  fullAddress: string;

  @ApiProperty({
    example: 'Краснодар',
    description: 'city name',
  })
  @Prop({})
  city: string;

  @ApiProperty({
    example: 'Московская область',
    description: 'region name',
  })
  @Prop({})
  region: string;

  @ApiProperty({
    example: 'Россия',
    description: 'country name',
  })
  @Prop({ default: 'Россия' })
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);