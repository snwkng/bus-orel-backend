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
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel-dto';
import { HotelsService } from './hotels.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Hotel } from 'src/shemas/hotels.schema';
import { DeleteResult } from 'mongodb';
import { UpdateHotelDto } from './dto/update-hotel-dto';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @ApiOperation({ summary: 'Get all hotels' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get('list')
  async getSeaList(): Promise<{ id: number; name: string }[]> {
    const res: Hotel[] = await this.hotelsService.getSeaList();
    return res?.map((item: Hotel, index: number) => ({
      id: index + 1,
      name: item.seaType,
    }));
  }

  @ApiOperation({ summary: 'Create hotel' })
  @ApiResponse({ status: 201, type: Hotel })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() hotelDto: CreateHotelDto) {
    return await this.hotelsService.hotelCreate(hotelDto);
  }

  @ApiOperation({ summary: 'Get all hotels' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get()
  async getAll(): Promise<Hotel[]> {
    return this.hotelsService.getAllHotels();
  }

  @ApiOperation({ summary: 'Get one hotel' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Hotel> {
    return this.hotelsService.getHotel(id);
  }

  @ApiOperation({ summary: 'Update hotel' })
  @ApiResponse({ status: 200, type: Hotel })
  @Put(':id')
  async update(
    @Body() hotelDto: UpdateHotelDto,
    @Param('id') id: string,
  ): Promise<Hotel> {
    return this.hotelsService.updateHotel(id, hotelDto);
  }

  @ApiOperation({ summary: 'Delete hotel' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.hotelsService.deleteHotel(id);
  }
}
