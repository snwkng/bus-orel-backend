import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBusTourDto } from './dto/create-bus-tour-dto';
import { BusToursAdminService } from './busTours.admin.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BusTour } from './schemas/busTour.schema';
import { DeleteResult } from 'mongodb';
import { UpdateBusTourDto } from './dto/update-bus-tour-dto';
import { BusTourQueryDto } from './dto/bus-tour-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminBusTours')
@Controller('admin/bus-tours')
export class BusToursAdminController {
  constructor(private readonly busToursAdminService: BusToursAdminService) {}

  @ApiOperation({ summary: 'Create bus tour' })
  @ApiResponse({ status: 201, type: BusTour })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() busTourDto: CreateBusTourDto) {
    return await this.busToursAdminService.createBusTour(busTourDto);
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get()
  async getAll(@Query() params: BusTourQueryDto): Promise<BusTour[]> {
    return await this.busToursAdminService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Update bus tour' })
  @ApiResponse({ status: 200, type: BusTour })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() busTourDto: UpdateBusTourDto,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<BusTour> {
    return await this.busToursAdminService.updateBusTour(id, busTourDto);
  }

  @ApiOperation({ summary: 'Delete bus tour' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<DeleteResult> {
    return await this.busToursAdminService.deleteBusTour(id);
  }
}
