import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsString, 
  IsArray, 
  IsNumber, 
  IsOptional,
  ArrayMinSize, 
  Min,
  IsDate
} from 'class-validator';

export class CreateExcursionDto {
  @ApiProperty({ example: 'Золотое кольцо', description: 'excursion name' })
  @IsString() // Обязательно для ValidationPipe
  readonly name: string;

  @ApiProperty({
    example: ["Описание первого дня", "Описание второго дня"],
    description: 'excursion description',
  })
  @IsArray()
  @IsString({ each: true }) // Проверяет, что каждый элемент массива - строка
  readonly description: string[]; // Исправил опечатку: было descriptrion

  @ApiProperty({
    example: ['imageName.webp'],
    description: 'array of string excursion images',
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly images: string[];

  @ApiProperty({ example: 5, description: 'duration excursion' })
  @IsNumber({}, {message: 'Поле Длительность экскурсии (в днях) должно быть числом'})
  @Min(1, {message: 'Длительность экскурсии должна быть больше 0'})
  @Type(() => Number)
  readonly duration: number;

  @ApiProperty({ example: 10500, description: 'price excursion' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly price: number;

  @ApiProperty({ example: ['document.docx'], description: 'document names' })
  @IsOptional() // Если поле не обязательно
  @IsArray()
  @IsString({ each: true })
  readonly documentName: string[];

  @ApiProperty({ example: ['2026-07-01'], description: 'excursion start date' })
  @IsArray()
  @Type(() => Date) // 1. Сначала конвертируем строку в объект Date
  @IsDate({ each: true })
  readonly excursionStartDates: Date[];

  @ApiProperty({ example: ['Москва', 'Орёл'], description: 'excursion cities' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  readonly cities: string[];

  @ApiProperty({ example: 'Отель Эллиот', description: 'hotel name', required: false })
  @IsOptional()
  @IsString()
  readonly hotelName: string;

  @ApiProperty({ example: 'https://hotel.com', description: 'hotel link', required: false })
  @IsOptional()
  @IsString()
  readonly hotelLink: string;

  @ApiProperty({
    example: ["Экскурсии по программе"],
    description: 'Что включено в стоимость',
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly thePriceIncludes: string[];

  @ApiProperty({
    example: ["Аренда самокатов"],
    description: 'Дополнительные услуги',
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly additionallyPaid: string[];
}
