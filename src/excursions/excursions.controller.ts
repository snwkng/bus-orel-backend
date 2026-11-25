import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { ExcursionsService } from './excursions.service.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Excursion } from './schemas/excursions.schema.js';
import { ExcursionQueryDto } from './dto/excursion-query.dto.js';
import { SelectItemDto } from '../common/dto/select-item.dto.js';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe.js';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator.js';

@ApiTags('Excursions')
@Controller('excursions')
export class ExcursionsController {
  constructor(private readonly excursionsService: ExcursionsService) {}

  @ApiOperation({ summary: 'Get all cities' })
  @ApiWrappedResponse(SelectItemDto, { isArray: true })
  @Header('Cache-Control', 'public, max-age=3600')
  @Get('cities-list')
  getCitiesList(): Promise<SelectItemDto[]> {
    return this.excursionsService.getCitiesList();
  }

  @ApiOperation({ summary: 'Get all types' })
  @ApiWrappedResponse(SelectItemDto, { isArray: true })
  @Header('Cache-Control', 'public, max-age=3600')
  @Get('types-list')
  getTypesList(): Promise<SelectItemDto[]> {
    return this.excursionsService.getTypesList();
  }

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiWrappedResponse(Excursion, { isArray: true, paginated: true })
  @Get()
  getAll(@Query() params: ExcursionQueryDto) {
    return this.excursionsService.getAllExcursions(params, params);
  }

  @ApiOperation({ summary: 'Get one excursion' })
  @ApiWrappedResponse(Excursion)
  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Excursion> {
    return this.excursionsService.getExcursion(id);
  }
}
