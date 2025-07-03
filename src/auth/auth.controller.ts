import { Controller, Post, HttpCode, HttpStatus, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Public()
  // @HttpCode(HttpStatus.OK)
  // @UseGuards()
  // @Post('login')
  // signIn(@Body() signInDto: AuthPayloadDto) {
  //   return this.authService.signIn({
  //     username: signInDto.username,
  //     password: signInDto.password,
  //   });
  // }

  @HttpCode(HttpStatus.OK)
  @UseGuards()
  @Post('login')
  async login(@Request() req) {
    const token = this.authService.login(req.user.id)
    return { id: req.user.id, token }
  }
}
