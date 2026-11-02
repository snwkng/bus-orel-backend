import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserProfileDto } from './dto/user-profile.dto';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator';

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
