import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService, ValidatedUser } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh/jwt-refresh.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: { user: ValidatedUser },
  ) {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @Request() req: { user: { _id: string; refreshToken: string } },
  ) {
    return this.authService.refreshTokens(req.user._id, req.user.refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: { user: { _id: string } }) {
    await this.authService.logout(req.user._id);
    return { message: 'Выход выполнен успешно' };
  }
}
