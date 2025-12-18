import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Hotel } from 'src/hotels/schemas/hotels.schema';

@ApiTags('BusTours')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly HotelsService: HotelsService) {}

  @ApiOperation({ summary: 'Get sea list' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get('sea-list')
  @HttpCode(HttpStatus.OK)
  async getSeaList(): Promise<SelectItem[]> {
    const res: string[] = await this.HotelsService.getSeaList();
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
    const res: string[] = await this.HotelsService.getCitiesList(seaType);
    return res?.map((item: string, index: number) => ({
      id: index + 1,
      name: item,
    }));
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get()
  async getAll(@Query() params: any): Promise<Hotel[]> {
    return await this.HotelsService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Get bus tour' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<Hotel> {
    return await this.HotelsService.getBusTour(id);
  }
}
