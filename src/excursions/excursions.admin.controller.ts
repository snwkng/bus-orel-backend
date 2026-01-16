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
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { ExcursionsAdminService } from './excursions.admin.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Excursion } from './schemas/excursions.schema';
import { DeleteResult } from 'mongodb';
import { UpdateExcursionDto } from './dto/update-excursion-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwr-auth.guard';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { ExcursionQueryDto } from './dto/excursion-query.dto';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminExcursions')
@Controller('admin/excursions')
export class ExcursionsAdminController {
  constructor(private readonly excursionAdminService: ExcursionsAdminService) { }

  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, type: [SelectItemDto] })
  @Get('cities-list')
  getCitiesList(): Promise<SelectItemDto[]> {
    return this.excursionAdminService.getCitiesList();
  }

  @ApiOperation({ summary: 'Create excursion' })
  @ApiResponse({ status: 201, type: Excursion })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() excursionDto: CreateExcursionDto) {
      return this.excursionAdminService.createExcursion(excursionDto);
  }

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get()
  getAll(@Query() params: ExcursionQueryDto): Promise<Excursion[]> {
    return this.excursionAdminService.getAllExcursions(params);
  }

  @ApiOperation({ summary: 'Get one excursion' })
  @ApiResponse({ status: 200, type: Excursion })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Excursion> {
    return this.excursionAdminService.getExcursion(id);
  }

  @ApiOperation({ summary: 'Update excursion' })
  @ApiResponse({ status: 200, type: Excursion })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() excursionDto: UpdateExcursionDto,
  ): Promise<Excursion> {
    return this.excursionAdminService.updateExcursion(id, excursionDto);
  }

  @ApiOperation({ summary: 'Delete excursion' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.excursionAdminService.deleteExcursion(id);
  }
}
