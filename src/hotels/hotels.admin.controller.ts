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
import { CreateHotelDto } from './dto/create-hotel.dto.js';
import { HotelsAdminService } from './hotels.admin.service.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Hotel } from '../hotels/schemas/hotels.schema.js';
import { DeleteResult } from 'mongodb';
import { UpdateHotelDto } from './dto/update-hotel.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { SelectItemDto } from '../common/dto/select-item.dto.js';
import { IncludedInThePriceDto } from './dto/included-in-the-price.dto.js';
import { HotelQueryDto } from './dto/hotel-query.dto.js';
import { PublishHotelDto } from './dto/publish-hotel.dto.js';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe.js';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator.js';
import { DeleteResultDto } from '../common/dto/delete-result.dto.js';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminHotels')
@Controller('admin/hotels')
export class HotelsAdminController {
  constructor(private readonly hotelsAdminService: HotelsAdminService) {}

  @ApiOperation({ summary: 'Get sea list' })
  @ApiWrappedResponse(SelectItemDto, { isArray: true })
  @Get('sea-list')
  getSeaList(): Promise<SelectItemDto[]> {
    return this.hotelsAdminService.getSeaList();
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
    return this.hotelsAdminService.getCitiesList(seaType);
  }

  @ApiOperation({ summary: 'Get included in the price list' })
  @ApiWrappedResponse(IncludedInThePriceDto, { isArray: true })
  @Get('included-in-the-price-list')
  getIncludedInThePriceList(): Promise<IncludedInThePriceDto[]> {
    return this.hotelsAdminService.getIncludedInThePriceList();
  }

  @ApiOperation({ summary: 'Create new hotel' })
  @ApiWrappedResponse(Hotel, { status: 201 })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() hotelDto: CreateHotelDto) {
    return this.hotelsAdminService.createHotel(hotelDto);
  }

  @ApiOperation({ summary: 'Get all hotels' })
  @ApiWrappedResponse(Hotel, { isArray: true, paginated: true })
  @Get()
  getAll(@Query() params: HotelQueryDto) {
    return this.hotelsAdminService.getHotels(params, params);
  }

  @ApiOperation({ summary: 'Get hotel by ID' })
  @ApiWrappedResponse(Hotel)
  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Hotel> {
    return this.hotelsAdminService.getHotel(id);
  }

  @ApiOperation({ summary: 'Update hotel' })
  @ApiWrappedResponse(Hotel)
  @Put(':id')
  update(
    @Body() hotelDto: UpdateHotelDto,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<Hotel> {
    return this.hotelsAdminService.updateHotel(id, hotelDto);
  }

  @ApiOperation({ summary: 'Change hotel visibility (publish/unpublish)' })
  @ApiWrappedResponse(Hotel)
  @Patch('published/:id')
  published(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: PublishHotelDto,
  ): Promise<Hotel> {
    return this.hotelsAdminService.updateHotel(id, dto);
  }

  @ApiOperation({ summary: 'Delete hotel' })
  @ApiWrappedResponse(DeleteResultDto)
  @Delete(':id')
  delete(@Param('id', ParseObjectIdPipe) id: string): Promise<DeleteResult> {
    return this.hotelsAdminService.deleteHotel(id);
  }
}
