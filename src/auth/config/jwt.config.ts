import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: (process.env.JWT_EXPIRE_IN ||
      '1h') as JwtSignOptions['expiresIn'],
  },
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRE_IN ||
    '7d') as JwtSignOptions['expiresIn'],
}));

export type JwtConfig = JwtModuleOptions & {
  refreshSecret?: string;
  refreshExpiresIn?: JwtSignOptions['expiresIn'];
};
