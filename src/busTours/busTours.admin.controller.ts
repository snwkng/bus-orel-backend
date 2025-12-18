import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBusTourDto } from './dto/create-bus-tour-dto';
import { BusToursAdminService } from './busTours.admin.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BusTour } from './schemas/busTour.schema';
import { DeleteResult } from 'mongodb';
import { Types } from 'mongoose';
import { UpdateBusTourDto } from './dto/update-bus-tour-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwr-auth.guard';


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
  async create(@Body() hotelDto: CreateBusTourDto) {
    return await this.busToursAdminService.createBusTour(hotelDto);
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get()
  async getAll(@Query() params: {hotelId: Types.ObjectId}): Promise<BusTour[]> {
    return await this.busToursAdminService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Update bus tour' })
  @ApiResponse({ status: 200, type: BusTour })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() hotelDto: UpdateBusTourDto,
    @Param('id') id: string,
  ): Promise<BusTour> {
    return await this.busToursAdminService.updateBusTour(id, hotelDto);
  }

  @ApiOperation({ summary: 'Delete bus tour' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: Types.ObjectId): Promise<DeleteResult> {
    return await this.busToursAdminService.deleteBusTour(id);
  }
}
