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
  Query,
} from '@nestjs/common';
import { CreateBusTourDto } from './dto/create-busTour-dto';
import { BusToursService } from './busTours.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BusTour } from 'src/busTours/schemas/busTours.schema';
import { DeleteResult } from 'mongodb';
import { UpdateBusTourDto } from './dto/update-busTour-dto';

@ApiTags('bus-tours')
@Controller('bus-tours')
export class BusToursController {
  constructor(private readonly busToursService: BusToursService) {}

  @ApiOperation({ summary: 'Get sea list' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get('sea-list')
  @HttpCode(HttpStatus.OK)
  async getSeaList(): Promise<SelectItem[]> {
    const res: string[] = await this.busToursService.getSeaList();
    return res?.map((item: string, index: number) => ({
      id: index + 1,
      name: item,
    }));
  }

  @ApiOperation({ summary: 'Create bus tour' })
  @ApiResponse({ status: 201, type: BusTour })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() hotelDto: CreateBusTourDto) {
    return await this.busToursService.busTourCreate(hotelDto);
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get()
  async getAll(@Query() params: any): Promise<BusTour[]> {
    return this.busToursService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Get bus tour' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<BusTour> {
    return this.busToursService.getBusTour(id);
  }

  @ApiOperation({ summary: 'Update bus tour' })
  @ApiResponse({ status: 200, type: BusTour })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() hotelDto: UpdateBusTourDto,
    @Param('id') id: string,
  ): Promise<BusTour> {
    return this.busToursService.updateBusTour(id, hotelDto);
  }

  @ApiOperation({ summary: 'Delete bus tour' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.busToursService.deleteBusTour(id);
  }
}
