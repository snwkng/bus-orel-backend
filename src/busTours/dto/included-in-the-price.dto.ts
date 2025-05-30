import { ApiProperty } from '@nestjs/swagger';

export class IncludedInThePriceDto {
  @ApiProperty({ example: "wi-fi" })
  readonly serviceName?: string;

  @ApiProperty({ example: "" })
  readonly iconForService?: string;
}