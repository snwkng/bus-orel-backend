import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { type ObjectId } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from 'src/auth/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret
    });
  }

  validate(payload: {username: string, sub: ObjectId, iat: number, exp: number}) {
    return { username: payload.username, _id: payload.sub };
  }
}