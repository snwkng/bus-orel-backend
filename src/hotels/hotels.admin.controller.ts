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
import { Hotel } from 'src/hotels/schemas/hotels.schema';
import { DeleteResult } from 'mongodb';
import { Types } from 'mongoose';
import { UpdateHotelDto } from './dto/update-hotel-dto';
import { type IncludedInThePrice } from './subschemas/includedInThePrice.subschema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwr-auth.guard';


@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminBusTours')
@Controller('admin/hotels')
export class HotelsAdminController {
  constructor(private readonly HotelsAdminService: HotelsAdminService) {}

  @ApiOperation({ summary: 'Get sea list' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get('sea-list')
  @HttpCode(HttpStatus.OK)
  async getSeaList(): Promise<SelectItem[]> {
    const res: string[] = await this.HotelsAdminService.getSeaList();
    return res?.map((item: string, index: number) => ({
      id: index + 1,
      name: item,
    }));
  }

  @ApiOperation({ summary: 'Get tour cities list' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get('cities-list')
  @HttpCode(HttpStatus.OK)
  async getCitiesList(@Query('seaType') seaType: string = ''): Promise<SelectItem[]> {
    const res: string[] = await this.HotelsAdminService.getCitiesList(seaType);
    return res?.map((item: string, index: number) => ({
      id: index + 1,
      name: item,
    }));
  }

  @ApiOperation({ summary: 'Get tour included in the price list' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get('included-in-the-price-list')
  @HttpCode(HttpStatus.OK)
  async getIncludedInThePriceList(): Promise<IncludedInThePrice[]> {
    const res: IncludedInThePrice[] = await this.HotelsAdminService.getIncludedInThePriceList();
    return res?.map((item: IncludedInThePrice, index: number) => ({
      id: index + 1,
      serviceName: item.serviceName,
      iconForService: item.iconForService
    }));
  }

  @ApiOperation({ summary: 'Create bus tour' })
  @ApiResponse({ status: 201, type: Hotel })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() hotelDto: CreateHotelDto) {
    return await this.HotelsAdminService.busTourCreate(hotelDto);
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get()
  async getAll(@Query() params: any): Promise<Hotel[]> {
    return await this.HotelsAdminService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Get bus tour' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<Hotel> {
    return await this.HotelsAdminService.getBusTour(id);
  }

  @ApiOperation({ summary: 'Update bus tour' })
  @ApiResponse({ status: 200, type: Hotel })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() hotelDto: UpdateHotelDto,
    @Param('id') id: string,
  ): Promise<Hotel> {
    return await this.HotelsAdminService.updateBusTour(id, hotelDto);
  }

  @ApiOperation({ summary: 'Publish / unpublish bus tour' })
  @ApiResponse({ status: 200, type: Boolean })
  @Patch('published/:id')
  @HttpCode(HttpStatus.OK)
  async published(
    @Param('id') id: Types.ObjectId,
    @Body() dto: {published: boolean},
  ): Promise<Hotel> {
    return await this.HotelsAdminService.updateBusTour(id, dto);
  }

  @ApiOperation({ summary: 'Delete bus tour' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.HotelsAdminService.deleteBusTour(id);
  }
}
