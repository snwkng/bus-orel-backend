import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { ExcursionsService } from './excursions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Excursion } from 'src/shemas/excursions.schema';

@ApiTags('Excursions')
@Controller('excursions')
export class ExcursionsController {
  constructor(private excursionsService: ExcursionsService) {}

  @ApiOperation({ summary: 'Create excursion' })
  @ApiResponse({ status: 200, type: Excursion })
  @Post()
  async create(@Body() excursionDto: CreateExcursionDto) {
    return this.excursionsService.excursionCreate(excursionDto);
  }

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get()
  async getAll(): Promise<Excursion[]> {
    return this.excursionsService.getAllExcursions();
  }
}
