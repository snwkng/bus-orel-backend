import { ApiProperty } from '@nestjs/swagger';

export class TourAvailabilityDto {
  @ApiProperty({ example: '2025-06-01' })
  readonly startDate?: Date;

  @ApiProperty({ example: '2025-06-15' })
  readonly endDate?: Date;

  @ApiProperty({ example: 20000 })
  readonly pricePerPerson?: number;
}