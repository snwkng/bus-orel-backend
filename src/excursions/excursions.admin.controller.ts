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
  UseGuards,
} from '@nestjs/common';
import { CreateExcursionDto } from './dto/create-excursion.dto.js';
import { ExcursionsAdminService } from './excursions.admin.service.js';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Excursion } from './schemas/excursions.schema.js';
import { DeleteResult } from 'mongodb';
import { UpdateExcursionDto } from './dto/update-excursion.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { SelectItemDto } from '../common/dto/select-item.dto.js';
import { ExcursionQueryDto } from './dto/excursion-query.dto.js';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe.js';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator.js';
import { DeleteResultDto } from '../common/dto/delete-result.dto.js';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminExcursions')
@Controller('admin/excursions')
export class ExcursionsAdminController {
  constructor(private readonly excursionAdminService: ExcursionsAdminService) {}

  @ApiOperation({ summary: 'Get all cities' })
  @ApiWrappedResponse(SelectItemDto, { isArray: true })
  @Get('cities-list')
  getCitiesList(): Promise<SelectItemDto[]> {
    return this.excursionAdminService.getCitiesList();
  }

  @ApiOperation({ summary: 'Get all types' })
  @ApiWrappedResponse(SelectItemDto, { isArray: true })
  @Get('types-list')
  getTypesList(): Promise<SelectItemDto[]> {
    return this.excursionAdminService.getTypesList();
  }

  @ApiOperation({ summary: 'Create excursion' })
  @ApiWrappedResponse(Excursion, { status: 201 })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() excursionDto: CreateExcursionDto) {
    return this.excursionAdminService.createExcursion(excursionDto);
  }

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiWrappedResponse(Excursion, { isArray: true, paginated: true })
  @Get()
  getAll(@Query() params: ExcursionQueryDto) {
    return this.excursionAdminService.getAllExcursions(params, params);
  }

  @ApiOperation({ summary: 'Get one excursion' })
  @ApiWrappedResponse(Excursion)
  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Excursion> {
    return this.excursionAdminService.getExcursion(id);
  }

  @ApiOperation({ summary: 'Update excursion' })
  @ApiWrappedResponse(Excursion)
  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() excursionDto: UpdateExcursionDto,
  ): Promise<Excursion> {
    return this.excursionAdminService.updateExcursion(id, excursionDto);
  }

  @ApiOperation({ summary: 'Delete excursion' })
  @ApiWrappedResponse(DeleteResultDto)
  @Delete(':id')
  delete(@Param('id', ParseObjectIdPipe) id: string): Promise<DeleteResult> {
    return this.excursionAdminService.deleteExcursion(id);
  }
}
