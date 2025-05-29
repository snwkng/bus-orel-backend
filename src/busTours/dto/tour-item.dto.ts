import { ApiProperty } from '@nestjs/swagger';
import { TourAvailabilityDto } from './tour-availability.dto';

export class TourItemDto {
  @ApiProperty({ example: 'standard' })
  readonly type?: string;

  @ApiProperty({ example: 'single' })
  readonly roomType?: string;

  @ApiProperty({ example: '1 местный стандарт' })
  readonly roomName?: string;

  @ApiProperty({ example: 2 })
  readonly beds?: number;

  @ApiProperty({ example: 'Две односпальные кровати...' })
  readonly description?: string;

  @ApiProperty({ type: [TourAvailabilityDto], description: 'Доступные периоды' })
  readonly availability?: TourAvailabilityDto[];
}