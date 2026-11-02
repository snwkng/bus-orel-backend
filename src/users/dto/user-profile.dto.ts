import { ApiProperty } from '@nestjs/swagger';

// Публичное представление пользователя (без password и refresh-токена)
export class UserProfileDto {
  @ApiProperty({
    example: '665f1b2c8f4b2a0012abcd34',
    description: 'ID пользователя',
  })
  _id: string;

  @ApiProperty({ example: 'admin', description: 'Имя пользователя' })
  username: string;
}
