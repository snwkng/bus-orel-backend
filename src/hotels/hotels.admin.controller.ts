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
import { CreateHotelDto } from './dto/create-hotel-dto';
import { HotelsAdminService } from './hotels.admin.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Hotel } from '../hotels/schemas/hotels.schema';
import { DeleteResult } from 'mongodb';
import { Types } from 'mongoose';
import { UpdateHotelDto } from './dto/update-hotel-dto';
import { type IncludedInThePrice } from './subschemas/includedInThePrice.subschema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwr-auth.guard';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { IncludedInThePriceDto } from './dto/included-in-the-price.dto';


@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminHotels')
@Controller('admin/hotels')
export class HotelsAdminController {
  constructor(private readonly hotelsAdminService: HotelsAdminService) {}

  @ApiOperation({ summary: 'Get sea list' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get('sea-list')
  @HttpCode(HttpStatus.OK)
  async getSeaList(): Promise<SelectItemDto[]> {
    return await this.hotelsAdminService.getSeaList();
  }

  @ApiOperation({ summary: 'Get tour cities list' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get('cities-list')
  @HttpCode(HttpStatus.OK)
  async getCitiesList(@Query('seaType') seaType: string = ''): Promise<SelectItemDto[]> {
    return await this.hotelsAdminService.getCitiesList(seaType);
  }

  @ApiOperation({ summary: 'Get tour included in the price list' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get('included-in-the-price-list')
  @HttpCode(HttpStatus.OK)
  async getIncludedInThePriceList(): Promise<IncludedInThePriceDto[]> {
    return await this.hotelsAdminService.getIncludedInThePriceList();
  }

  @ApiOperation({ summary: 'Create bus tour' })
  @ApiResponse({ status: 201, type: Hotel })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() hotelDto: CreateHotelDto) {
    return await this.hotelsAdminService.busTourCreate(hotelDto);
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get()
  async getAll(@Query() params: any): Promise<Hotel[]> {
    return await this.hotelsAdminService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Get bus tour' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<Hotel> {
    return await this.hotelsAdminService.getBusTour(id);
  }

  @ApiOperation({ summary: 'Update bus tour' })
  @ApiResponse({ status: 200, type: Hotel })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() hotelDto: UpdateHotelDto,
    @Param('id') id: string,
  ): Promise<Hotel> {
    return await this.hotelsAdminService.updateBusTour(id, hotelDto);
  }

  @ApiOperation({ summary: 'Publish / unpublish bus tour' })
  @ApiResponse({ status: 200, type: Boolean })
  @Patch('published/:id')
  @HttpCode(HttpStatus.OK)
  async published(
    @Param('id') id: Types.ObjectId,
    @Body() dto: {published: boolean},
  ): Promise<Hotel> {
    return await this.hotelsAdminService.updateBusTour(id, dto);
  }

  @ApiOperation({ summary: 'Delete bus tour' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.hotelsAdminService.deleteBusTour(id);
  }
}
