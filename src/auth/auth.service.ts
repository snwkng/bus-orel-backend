import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthJwtPayload } from './types/auth-jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.checkUser(username);
    if (!user) {
      return null;
    }
    let isMatch: boolean;
    if (user.password?.startsWith('$2')) {
      isMatch = await bcrypt.compare(pass, user.password);
    } else {
      isMatch = user.password === pass;
      if (isMatch) {
        user.password = await bcrypt.hash(pass, 10);
        await user.save();
      }
    }
    if (!isMatch) {
      return null;
    }
    const { password, ...result } = user.toObject();
    return result;
  }

  async login(user: any) {
    const payload: AuthJwtPayload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
