import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { type Types } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { AuthJwtPayload } from './types/auth-jwt.payload';
import jwtConfig from './config/jwt.config';

export type ValidatedUser = Omit<User, 'password'> & { _id: Types.ObjectId };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<ValidatedUser | null> {
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

  async login(user: ValidatedUser) {
    const tokens = await this.generateTokens(user.username, user._id);
    await this.updateRefreshTokenHash(user._id, tokens.refresh_token);
    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserWithRefreshToken(userId);

    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Сессия завершена, войдите снова');
    }

    const isMatch = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Недействительный refresh-токен');
    }

    const tokens = await this.generateTokens(user.username, user._id);
    await this.updateRefreshTokenHash(user._id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.setCurrentRefreshToken(userId, null);
  }

  private async generateTokens(username: string, userId: Types.ObjectId) {
    const payload: AuthJwtPayload = { username, sub: userId };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfiguration.refreshSecret,
        expiresIn: this.jwtConfiguration.refreshExpiresIn,
      }),
    ]);
    return { access_token, refresh_token };
  }

  private async updateRefreshTokenHash(
    userId: Types.ObjectId,
    refreshToken: string,
  ) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.setCurrentRefreshToken(userId, hash);
  }
}
