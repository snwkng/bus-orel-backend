import { ApiProperty } from '@nestjs/swagger';

export class UpdateCityDto {
  @ApiProperty({
    example: 'Орел',
    description: 'city name',
  })
  readonly name: string;
}