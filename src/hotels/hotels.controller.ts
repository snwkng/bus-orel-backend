import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HotelsService } from './hotels.service.js';
import { Hotel } from './schemas/hotels.schema.js';
import { SelectItemDto } from '../common/dto/select-item.dto.js';
import { HotelQueryDto } from './dto/hotel-query.dto.js';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe.js';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator.js';

@ApiTags('hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @ApiOperation({ summary: 'Get sea list' })
  @ApiWrappedResponse(SelectItemDto, { isArray: true })
  @Get('sea-list')
  getSeaList(): Promise<SelectItemDto[]> {
    return this.hotelsService.getSeaList();
  }

  @ApiOperation({ summary: 'Get cities list' })
  @ApiWrappedResponse(SelectItemDto, { isArray: true })
  @ApiQuery({
    name: 'seaType',
    required: false,
    description: 'Фильтр по типу моря',
  })
  @Get('cities-list')
  getCitiesList(
    @Query('seaType') seaType: string = '',
  ): Promise<SelectItemDto[]> {
    return this.hotelsService.getCitiesList(seaType);
  }

  @ApiOperation({ summary: 'Get all hotels' })
  @ApiWrappedResponse(Hotel, { isArray: true, paginated: true })
  @Get()
  getAll(@Query() params: HotelQueryDto) {
    return this.hotelsService.getHotels(params, params);
  }

  @ApiOperation({ summary: 'Get hotel' })
  @ApiWrappedResponse(Hotel)
  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Hotel> {
    return this.hotelsService.getHotel(id);
  }
}
