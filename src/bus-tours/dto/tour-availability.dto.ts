import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, Min } from 'class-validator';

export class TourAvailabilityDto {
  @ApiProperty({ example: '2025-07-12', description: 'Дата начала тура' })
  @IsDate()
  @Type(() => Date)
  readonly startDate: Date;

  @ApiProperty({ example: '2025-07-22', description: 'Дата окончания тура' })
  @IsDate()
  @Type(() => Date)
  readonly endDate: Date;

  @ApiProperty({ example: 18000, description: 'Цена за человека' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly pricePerPerson: number;
}
