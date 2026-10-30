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
import { CreateExcursionDto } from './dto/create-excursion.dto';
import { ExcursionsAdminService } from './excursions.admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Excursion } from './schemas/excursions.schema';
import { DeleteResult } from 'mongodb';
import { UpdateExcursionDto } from './dto/update-excursion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { ExcursionQueryDto } from './dto/excursion-query.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator';
import { DeleteResultDto } from '../common/dto/delete-result.dto';

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
