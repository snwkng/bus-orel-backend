import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { Hotel } from './schemas/hotels.schema';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { HotelQueryDto } from './dto/hotel-query.dto';

@ApiTags('hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) { }

  @ApiOperation({ summary: 'Get sea list' })
  @ApiResponse({ status: 200, type: [SelectItemDto] })
  @Get('sea-list')
  async getSeaList(): Promise<SelectItemDto[]> {
    return await this.hotelsService.getSeaList();
  }

  @ApiOperation({ summary: 'Get tour cities list' })
  @ApiResponse({ status: 200, type: [SelectItemDto] })
  @Get('cities-list')
  async getCitiesList(@Query('seaType') seaType: string = ''): Promise<SelectItemDto[]> {
    return await this.hotelsService.getCitiesList(seaType);
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get()
  async getAll(@Query() params: HotelQueryDto): Promise<Hotel[]> {
    return await this.hotelsService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Get bus tour' })
  @ApiResponse({ status: 200, type: Hotel })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Hotel> {
    return await this.hotelsService.getBusTour(id);
  }
}
