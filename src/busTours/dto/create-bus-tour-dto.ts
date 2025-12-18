import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { TourAvailability } from '../subschemas/tour-availability.subschema';

export class CreateBusTourDto {
  @ApiProperty({ example: '123123asd213', description: 'идентификатор отеля' })
  readonly hotelId: Types.ObjectId;

  @ApiProperty({
    example: '123123as23',
    description: 'room id',
  })
  readonly roomId: Types.ObjectId;

  @ApiProperty({ example: [], minLength: 1, description: 'даты и цены нутов' })
  readonly tours: TourAvailability[];
}