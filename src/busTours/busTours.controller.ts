import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { BusToursService } from './busTours.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BusTour } from 'src/busTours/schemas/busTours.schema';

@ApiTags('BusTours')
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

  @ApiOperation({ summary: 'Get tour cities list' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get('cities-list')
  @HttpCode(HttpStatus.OK)
  async getCitiesList(@Query('seaType') seaType: string = ''): Promise<SelectItem[]> {
    const res: string[] = await this.busToursService.getCitiesList(seaType);
    return res?.map((item: string, index: number) => ({
      id: index + 1,
      name: item,
    }));
  }

  @ApiOperation({ summary: 'Get all bus tours' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get()
  async getAll(@Query() params: any): Promise<BusTour[]> {
    return await this.busToursService.getBusTours(params);
  }

  @ApiOperation({ summary: 'Get bus tour' })
  @ApiResponse({ status: 200, type: [BusTour] })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<BusTour> {
    return await this.busToursService.getBusTour(id);
  }
}
