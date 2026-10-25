import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  @MinLength(3, {
    message: 'Имя пользователя должно содержать минимум 3 символа',
  })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsString()
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;
}
