import { ApiProperty } from '@nestjs/swagger';

export class UpdateTourCityDto {
  @ApiProperty({
    example: 'Орел',
    description: 'city name',
  })
  readonly name: string;
}