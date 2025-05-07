import { ApiProperty } from '@nestjs/swagger';

export class UpdateExcursionCityDto {
  @ApiProperty({
    example: 'Орел',
    description: 'city name',
  })
  readonly name: string;
}