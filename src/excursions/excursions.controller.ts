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
} from '@nestjs/common';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { ExcursionsService } from './excursions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Excursion } from 'src/shemas/excursions.schema';
import { DeleteResult } from 'mongodb';
import { UpdateExcursionDto } from './dto/update-excursion-dto';

@ApiTags('Excursions')
@Controller('excursions')
export class ExcursionsController {
  constructor(private excursionsService: ExcursionsService) {}

  @ApiOperation({ summary: 'Create excursion' })
  @ApiResponse({ status: 201, type: Excursion })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() excursionDto: CreateExcursionDto) {
    return this.excursionsService.excursionCreate(excursionDto);
  }

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get()
  async getAll(): Promise<Excursion[]> {
    return this.excursionsService.getAllExcursions();
  }

  @ApiOperation({ summary: 'Get one excursion' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Excursion> {
    return this.excursionsService.getExcursion(id);
  }

  @ApiOperation({ summary: 'Update excursion' })
  @ApiResponse({ status: 200, type: Excursion })
  @Put(':id')
  async update(
    @Body() excursionDto: UpdateExcursionDto,
    @Param('id') id: string,
  ): Promise<Excursion> {
    return this.excursionsService.updateExcursion(id, excursionDto);
  }

  @ApiOperation({ summary: 'Delete excursion' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.excursionsService.deleteExcursion(id);
  }
}
