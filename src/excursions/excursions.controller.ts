import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ExcursionService } from './excursions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Excursion } from './schemas/excursions.schema';
import { IRequestParams } from './interfaces/excursion.interface';

@ApiTags('Excursions')
@Controller('excursions')
export class ExcursionsController {
  constructor(private readonly excursionService: ExcursionService) { }

  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, type: [String] })
  @Get('cities-list')
  @HttpCode(HttpStatus.OK)
  async getCitiesList(): Promise<SelectItem[]> {
    const res = await this.excursionService.getCitiesList();
    return res?.uniqueCities?.map((item: string, index: number) => ({
      id: index + 1,
      name: item,
    })) ?? [];
  }

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() params: Partial<IRequestParams> & Record<string, any>): Promise<Excursion[]> {
    return await this.excursionService.getAllExcursions(params);
  }

  @ApiOperation({ summary: 'Get one excursion' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Excursion> {
    return await this.excursionService.getExcursion(id);
  }
}
