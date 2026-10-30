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
import { CreateBusTourDto } from './dto/create-bus-tour.dto';
import { BusToursAdminService } from './bus-tours.admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusTour } from './schemas/bus-tour.schema';
import { DeleteResult } from 'mongodb';
import { UpdateBusTourDto } from './dto/update-bus-tour.dto';
import { BusTourQueryDto } from './dto/bus-tour-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator';
import { DeleteResultDto } from '../common/dto/delete-result.dto';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminBusTours')
@Controller('admin/bus-tours')
export class BusToursAdminController {
  constructor(private readonly busToursAdminService: BusToursAdminService) {}

  @ApiOperation({ summary: 'Create bus tour' })
  @ApiWrappedResponse(BusTour, { status: 201 })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() busTourDto: CreateBusTourDto) {
    return await this.busToursAdminService.createBusTour(busTourDto);
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiWrappedResponse(BusTour, { isArray: true })
  @Get()
  async getAll(@Query() params: BusTourQueryDto): Promise<BusTour[]> {
    return await this.busToursAdminService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Update bus tour' })
  @ApiWrappedResponse(BusTour)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() busTourDto: UpdateBusTourDto,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<BusTour> {
    return await this.busToursAdminService.updateBusTour(id, busTourDto);
  }

  @ApiOperation({ summary: 'Delete bus tour' })
  @ApiWrappedResponse(DeleteResultDto)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<DeleteResult> {
    return await this.busToursAdminService.deleteBusTour(id);
  }
}
