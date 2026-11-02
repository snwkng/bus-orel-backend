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
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService, ValidatedUser } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh/jwt-refresh.guard';
import { LoginDto } from './dto/login.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { MessageDto } from '../common/dto/message.dto';
import { ErrorResponseDto } from '../common/dto/api-response.dto';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator';

@ApiTags('Auth')
@ApiExtraModels(ErrorResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login (rate limit: 5 req/min)' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiWrappedResponse(AuthTokensDto, { status: 202 })
  @ApiResponse({
    status: 401,
    description: 'Неверный логин или пароль',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(ErrorResponseDto) },
      },
    },
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: { user: ValidatedUser },
  ) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Refresh token pair (rate limit: 5 req/min)' })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtRefreshGuard)
  @ApiWrappedResponse(AuthTokensDto)
  @Post('refresh')
  async refresh(
    @Request() req: { user: { _id: string; refreshToken: string } },
  ) {
    return this.authService.refreshTokens(req.user._id, req.user.refreshToken);
  }

  @ApiOperation({ summary: 'Logout (revokes refresh token)' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiWrappedResponse(MessageDto)
  @Post('logout')
  async logout(@Request() req: { user: { _id: string } }) {
    await this.authService.logout(req.user._id);
    return { message: 'Выход выполнен успешно' };
  }
}
