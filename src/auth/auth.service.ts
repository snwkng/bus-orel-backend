import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({ username, password }: AuthPayloadDto): Promise<any> {
    const user = await this.usersService.findOne(username, password);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(userId: number) {
    const payload:AuthJwtPayload = { sub: userId} 
    return this.jwtService.sign(payload)
  }
}
