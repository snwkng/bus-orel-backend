import { ApiProperty } from '@nestjs/swagger';

export class IncludedInThePriceDto {
  @ApiProperty({ example: 1, description: 'Идентификатор' })
  id: number;

  @ApiProperty({
    example: "wi-fi",
    description: 'service are included in the price',
  })
  serviceName: string;

  @ApiProperty({
    example: "wi-fi.svg",
    description: 'icon for service',
  })
  iconForService: string;
}