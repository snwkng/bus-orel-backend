import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsBoolean,
  IsObject,
  ValidateNested
} from 'class-validator';
export class Food {
  @ApiPropertyOptional({ example: false, description: 'Включено ли питание' })
  @IsOptional()
  @IsBoolean()
  readonly included?: boolean;

  @ApiPropertyOptional({ example: "Только завтраки", description: 'Тип питания (завтрак, всё включено и т.д.)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly type?: string;
}

export class Beach {
  @ApiPropertyOptional({ example: "Галечный", description: 'Тип пляжа' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly type?: string;

  @ApiPropertyOptional({ example: 5, description: 'Расстояние до пляжа в минутах ходьбы' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly distanceMinutes?: number;
}

export class CheckInOut {
  @ApiPropertyOptional({ example: "14:00", description: 'Время заезда' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly checkIn?: string;

  @ApiPropertyOptional({ example: "12:00", description: 'Время выезда' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  readonly checkOut?: string;
}

export class AdditionalInfoDto {
  @ApiPropertyOptional({ type: Food, description: 'Информация о питании' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Food)
  readonly food?: Food;

  @ApiPropertyOptional({ type: Beach, description: 'Информация о пляже' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Beach)
  readonly beach?: Beach;

  @ApiPropertyOptional({ type: CheckInOut, description: 'Режим работы (заезд/выезд)' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CheckInOut)
  readonly checkInOut?: CheckInOut;
}
