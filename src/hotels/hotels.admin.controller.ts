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
import { UpdateHotelDto } from './dto/update-hotel-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwr-auth.guard';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { IncludedInThePriceDto } from './dto/included-in-the-price.dto';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminHotels')
@Controller('admin/hotels')
export class HotelsAdminController {
  constructor( private readonly hotelsAdminService: HotelsAdminService ) {}

  @ApiOperation({ summary: 'Get sea list' })
  @ApiResponse({ status: 200, type: [SelectItemDto] })
  @Get('sea-list')
  getSeaList(): Promise<SelectItemDto[]> {
    return this.hotelsAdminService.getSeaList();
  }

  @ApiOperation({ summary: 'Get cities list' })
  @ApiResponse({ status: 200, type: [SelectItemDto] })
  @Get('cities-list')
  getCitiesList(@Query('seaType') seaType: string = ''): Promise<SelectItemDto[]> {
    return this.hotelsAdminService.getCitiesList(seaType);
  }

  @ApiOperation({ summary: 'Get included in the price list' })
  @ApiResponse({ status: 200, type: [IncludedInThePriceDto] })
  @Get('included-in-the-price-list')
  getIncludedInThePriceList(): Promise<IncludedInThePriceDto[]> {
    return this.hotelsAdminService.getIncludedInThePriceList();
  }

  @ApiOperation({ summary: 'Create new hotel' })
  @ApiResponse({ status: 201, type: Hotel })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() hotelDto: CreateHotelDto) {
    return this.hotelsAdminService.createHotel(hotelDto);
  }

  @ApiOperation({ summary: 'Get all hotels' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get()
  getAll(@Query() params: HotelQueryDto, @Query() pagination?: PaginationDto) {
    return this.hotelsAdminService.getHotels(params, pagination);
  }

  @ApiOperation({ summary: 'Get hotel by ID' })
  @ApiResponse({ status: 200, type: Hotel })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Hotel> {
    return this.hotelsAdminService.getHotel(id);
  }

  @ApiOperation({ summary: 'Update hotel' })
  @ApiResponse({ status: 200, type: Hotel })
  @Put(':id')
  update(
    @Body() hotelDto: UpdateHotelDto,
    @Param('id') id: string,
  ): Promise<Hotel> {
    return this.hotelsAdminService.updateHotel(id, hotelDto);
  }

  @ApiOperation({ summary: 'Change hotel visibility (publish/unpublish)' })
  @ApiResponse({ status: 200, type: Hotel })
  @Patch('published/:id')
  published(
    @Param('id') id: string,
    @Body() dto: {published: boolean},
  ): Promise<Hotel> {
    return this.hotelsAdminService.updateHotel(id, dto);
  }

  @ApiOperation({ summary: 'Delete bus tour' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.hotelsAdminService.deleteHotel(id);
  }
}
