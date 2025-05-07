import { ApiProperty } from '@nestjs/swagger';

export class CreateTourCityDto {
  @ApiProperty({
    example: 'Орел',
    description: 'city name',
  })
  readonly name: string;
}
