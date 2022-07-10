import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.test', description: 'email' })
  readonly email: string;
  @ApiProperty({ example: '123456', description: 'password' })
  readonly password: string;
}
