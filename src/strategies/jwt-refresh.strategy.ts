import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { type ObjectId } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.refreshSecret as string,
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: { username: string; sub: ObjectId; iat: number; exp: number },
  ) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    return { username: payload.username, _id: payload.sub, refreshToken };
  }
}
