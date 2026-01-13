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
import { IRequestParams } from './interfaces/excursion.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwr-auth.guard';
import { SelectItemDto } from '../common/dto/select-item.dto';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('AdminExcursions')
@Controller('admin/excursions')
export class ExcursionsAdminController {
  constructor(private readonly excursionAdminService: ExcursionsAdminService) { }

  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, type: [SelectItemDto] })
  @Get('cities-list')
  async getCitiesList(): Promise<SelectItemDto[]> {
    return await this.excursionAdminService.getCitiesList();
  }

  @ApiOperation({ summary: 'Create excursion' })
  @ApiResponse({ status: 201, type: Excursion })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() excursionDto: CreateExcursionDto) {
      return await this.excursionAdminService.excursionCreate(excursionDto);
  }

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get()
  async getAll(@Query() params: Partial<IRequestParams> & Record<string, any>): Promise<Excursion[]> {
    return await this.excursionAdminService.getAllExcursions(params);
  }

  @ApiOperation({ summary: 'Get one excursion' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Excursion> {
    return await this.excursionAdminService.getExcursion(id);
  }

  @ApiOperation({ summary: 'Update excursion' })
  @ApiResponse({ status: 200, type: Excursion })
  @Put(':id')
  async update(
    @Body() excursionDto: UpdateExcursionDto,
    @Param('id') id: string,
  ): Promise<Excursion> {
    return await this.excursionAdminService.updateExcursion(id, excursionDto);
  }

  @ApiOperation({ summary: 'Delete excursion' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.excursionAdminService.deleteExcursion(id);
  }
}
