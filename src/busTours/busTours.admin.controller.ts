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
import { CreateBusTourDto } from './dto/create-busTour-dto';
import { BusToursAdminService } from './busTours.admin.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BusTour } from 'src/busTours/schemas/busTours.schema';
import { DeleteResult } from 'mongodb';
import { Types } from 'mongoose';
import { UpdateBusTourDto } from './dto/update-busTour-dto';
import { type IncludedInThePrice } from './subschemas/includedInThePrice.subschema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwr-auth.guard';


@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminBusTours')
@Controller('admin/bus-tours')
export class BusToursAdminController {
  constructor(private readonly busToursAdminService: BusToursAdminService) {}

  @ApiOperation({ summary: 'Get sea list' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get('sea-list')
  @HttpCode(HttpStatus.OK)
  async getSeaList(): Promise<SelectItem[]> {
    const res: string[] = await this.busToursAdminService.getSeaList();
    return res?.map((item: string, index: number) => ({
      id: index + 1,
      name: item,
    }));
  }

  @ApiOperation({ summary: 'Get tour cities list' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get('cities-list')
  @HttpCode(HttpStatus.OK)
  async getCitiesList(@Query('seaType') seaType: string = ''): Promise<SelectItem[]> {
    const res: string[] = await this.busToursAdminService.getCitiesList(seaType);
    return res?.map((item: string, index: number) => ({
      id: index + 1,
      name: item,
    }));
  }

  @ApiOperation({ summary: 'Get tour included in the price list' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get('included-in-the-price-list')
  @HttpCode(HttpStatus.OK)
  async getIncludedInThePriceList(): Promise<IncludedInThePrice[]> {
    const res: IncludedInThePrice[] = await this.busToursAdminService.getIncludedInThePriceList();
    return res?.map((item: IncludedInThePrice, index: number) => ({
      id: index + 1,
      serviceName: item.serviceName,
      iconForService: item.iconForService
    }));
  }

  @ApiOperation({ summary: 'Create bus tour' })
  @ApiResponse({ status: 201, type: BusTour })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() hotelDto: CreateBusTourDto) {
    return await this.busToursAdminService.busTourCreate(hotelDto);
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get()
  async getAll(@Query() params: any): Promise<BusTour[]> {
    return await this.busToursAdminService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Get bus tour' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<BusTour> {
    return await this.busToursAdminService.getBusTour(id);
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

  @ApiOperation({ summary: 'Publish / unpublish bus tour' })
  @ApiResponse({ status: 200, type: Boolean })
  @Patch('published/:id')
  @HttpCode(HttpStatus.OK)
  async published(
    @Param('id') id: Types.ObjectId,
    @Body() dto: {published: boolean},
  ): Promise<BusTour> {
    return await this.busToursAdminService.updateBusTour(id, dto);
  }

  @ApiOperation({ summary: 'Delete bus tour' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.busToursAdminService.deleteBusTour(id);
  }
}
