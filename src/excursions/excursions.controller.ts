import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Excursion } from './schemas/excursions.schema';
import { ExcursionQueryDto } from './dto/excursion-query.dto';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';

@ApiTags('Excursions')
@Controller('excursions')
export class ExcursionsController {
  constructor(private readonly excursionsService: ExcursionsService) {}

  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, type: [SelectItemDto] })
  @Header('Cache-Control', 'public, max-age=3600')
  @Get('cities-list')
  getCitiesList(): Promise<SelectItemDto[]> {
    return this.excursionsService.getCitiesList();
  }

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get()
  getAll(@Query() params: ExcursionQueryDto) {
    return this.excursionsService.getAllExcursions(params, params);
  }

  @ApiOperation({ summary: 'Get one excursion' })
  @ApiResponse({ status: 200, type: Excursion })
  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Excursion> {
    return this.excursionsService.getExcursion(id);
  }
}
