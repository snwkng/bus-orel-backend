import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({
    example: 'Орел',
    description: 'city name',
  })
  readonly name: string;
}
