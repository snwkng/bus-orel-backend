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
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) { }

  @ApiOperation({ summary: 'Get sea list' })
  @ApiResponse({ status: 200, type: [SelectItemDto] })
  @Get('sea-list')
  getSeaList(): Promise<SelectItemDto[]> {
    return this.hotelsService.getSeaList();
  }

  @ApiOperation({ summary: 'Get cities list' })
  @ApiResponse({ status: 200, type: [SelectItemDto] })
  @Get('cities-list')
  getCitiesList(@Query('seaType') seaType: string = ''): Promise<SelectItemDto[]> {
    return this.hotelsService.getCitiesList(seaType);
  }

  @ApiOperation({ summary: 'Get all hotels' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get()
  getAll(@Query() params: HotelQueryDto, @Query() pagination?: PaginationDto) {
    return this.hotelsService.getHotels(params, pagination);
  }

  @ApiOperation({ summary: 'Get hotel' })
  @ApiResponse({ status: 200, type: Hotel })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Hotel> {
    return this.hotelsService.getHotel(id);
  }
}
