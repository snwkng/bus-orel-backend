import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { UserProfileDto } from './dto/user-profile.dto.js';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator.js';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiWrappedResponse(UserProfileDto)
  @Get('profile')
  getProfile(@Request() req: { user: { username: string } }) {
    return this.usersService.findOne(req.user.username);
  }
}
