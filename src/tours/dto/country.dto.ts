import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../tours.interface';

export class CountryDto implements Country {
  @ApiProperty({ example: 1, description: 'ID страны в системе Multitour' })
  id: number;

  @ApiProperty({ example: 'Россия', description: 'Название страны' })
  name: string;
}
