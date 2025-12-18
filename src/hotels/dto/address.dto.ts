import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({ example: 'Краснодарский край, ул. Пушкина, д. 111' })
  readonly fullAddress?: string;

  @ApiProperty({ example: 'Анапа' })
  readonly city?: string;

  @ApiProperty({ example: 'Краснодарский край' })
  readonly region?: string;

  @ApiProperty({ example: 'Россия' })
  readonly country?: string;
}