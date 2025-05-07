import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CreateExcursionCityDto } from './dto/create-excursionCity-dto';
import { UpdateExcursionCityDto } from './dto/update-ExcursionCity-dto';
import { ExcursionCitiesService } from './ExcursionCities.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'mongodb';
import { ExcursionCity } from './schemas/excursionCities.schema';

@ApiTags('ExcursionCities')
@Controller('excursions/cities')
export class ExcursionCitiesController {
  constructor(private readonly ExcursionCitiesService: ExcursionCitiesService) {}

  @ApiOperation({ summary: 'Add excursion city' })
  @ApiResponse({ status: 201, type: ExcursionCity })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() cityDto: CreateExcursionCityDto) {
    try {
      return await this.ExcursionCitiesService.createCity(cityDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @ApiOperation({ summary: 'Get all excursion cities' })
  @ApiResponse({ status: 200, type: [ExcursionCity] })
  @Get()
  async getCities(): Promise<ExcursionCity[]> {
    return this.ExcursionCitiesService.getCities();
  }

  @ApiOperation({ summary: 'Get excursion city' })
  @ApiResponse({ status: 200, type: [ExcursionCity] })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ExcursionCity> {
    return this.ExcursionCitiesService.getCity(id);
  }

  @ApiOperation({ summary: 'Update excursion city' })
  @ApiResponse({ status: 200, type: ExcursionCity })
  @Put(':id')
  async update(
    @Body() cityDto: UpdateExcursionCityDto,
    @Param('id') id: string,
  ): Promise<ExcursionCity> {
    return this.ExcursionCitiesService.updateCity(id, cityDto);
  }

  @ApiOperation({ summary: 'Delete excursion city' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.ExcursionCitiesService.deleteCity(id);
  }
}

