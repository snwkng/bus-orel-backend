import { ApiProperty } from '@nestjs/swagger';

export class CreateExcursionCityDto {
  @ApiProperty({
    example: 'Орел',
    description: 'city name',
  })
  readonly name: string;
}
