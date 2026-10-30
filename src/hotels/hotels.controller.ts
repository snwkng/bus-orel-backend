import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { Hotel } from './schemas/hotels.schema';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator';

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
