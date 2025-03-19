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
import { CreateTourCityDto } from './dto/create-TourCity-dto';
import { UpdateTourCityDto } from './dto/update-TourCity-dto';
import { TourCitiesService } from './tourCities.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'mongodb';
import { TourCity } from './schemas/tourCities.schema';

@ApiTags('TourCities')
@Controller('bus-tours/cities')
export class TourCitiesController {
  constructor(private readonly tourCitiesService: TourCitiesService) {}

  @ApiOperation({ summary: 'Create tour city' })
  @ApiResponse({ status: 201, type: TourCity })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() cityDto: CreateTourCityDto) {
    try {
      return await this.tourCitiesService.createCity(cityDto);
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

  @ApiOperation({ summary: 'Get tour cities' })
  @ApiResponse({ status: 200, type: [TourCity] })
  @Get()
  async getCities(): Promise<TourCity[]> {
    return this.tourCitiesService.getCities();
  }

  @ApiOperation({ summary: 'Get tour' })
  @ApiResponse({ status: 200, type: [TourCity] })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<TourCity> {
    return this.tourCitiesService.getCity(id);
  }

  @ApiOperation({ summary: 'Update tour city' })
  @ApiResponse({ status: 200, type: TourCity })
  @Put(':id')
  async update(
    @Body() cityDto: UpdateTourCityDto,
    @Param('id') id: string,
  ): Promise<TourCity> {
    return this.tourCitiesService.updateCity(id, cityDto);
  }

  @ApiOperation({ summary: 'Delete tour city' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.tourCitiesService.deleteCity(id);
  }
}

