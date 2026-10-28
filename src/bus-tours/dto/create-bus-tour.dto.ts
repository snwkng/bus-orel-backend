import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { TourAvailabilityDto } from './tour-availability.dto';

export class CreateBusTourDto {
  @ApiProperty({
    example: '665f1a2b3c4d5e6f7a8b9c0d',
    description: 'идентификатор отеля',
  })
  @IsMongoId()
  readonly hotelId: string;

  @ApiProperty({
    example: '665f1a2b3c4d5e6f7a8b9c0e',
    description: 'идентификатор номера',
  })
  @IsMongoId()
  readonly roomId: string;

  @ApiProperty({
    type: [TourAvailabilityDto],
    description: 'даты и цены туров',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TourAvailabilityDto)
  readonly tours: TourAvailabilityDto[];
}
