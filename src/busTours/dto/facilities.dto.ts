import { ApiProperty } from '@nestjs/swagger';

export class FacilitiesDto {
  @ApiProperty({ example: { "included": true, "type": "Только завтраки" } })
  readonly food?: {
    included?: boolean;
    type?: string;
  };

  @ApiProperty({ example: { "type": "Галечный", "distanceMinutes": 5 } })
  readonly beach?: {
    type?: string;
    distanceMinutes?: number;
  };

  @ApiProperty({ example: { "checkIn": "9:00", "checkOut": "12:00" } })
  readonly checkInOut?: {
    checkIn?: string;
    checkOut?: string;
  };
}