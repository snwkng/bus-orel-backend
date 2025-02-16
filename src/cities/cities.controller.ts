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
import { CreateCityDto } from './dto/create-city-dto';
import { UpdateCityDto } from './dto/update-city-dto';
import { CitiesService } from './cities.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'mongodb';
import { City } from 'src/shemas/cities.schema';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @ApiOperation({ summary: 'Create excursion' })
  @ApiResponse({ status: 201, type: City })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() cityDto: CreateCityDto) {
    try {
      return await this.citiesService.createCity(cityDto);
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

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiResponse({ status: 200, type: [City] })
  @Get()
  async getCities(): Promise<City[]> {
    return this.citiesService.getCities();
  }

  @ApiOperation({ summary: 'Get one excursion' })
  @ApiResponse({ status: 200, type: [City] })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<City> {
    return this.citiesService.getCity(id);
  }

  @ApiOperation({ summary: 'Update excursion' })
  @ApiResponse({ status: 200, type: City })
  @Put(':id')
  async update(
    @Body() cityDto: UpdateCityDto,
    @Param('id') id: string,
  ): Promise<City> {
    return this.citiesService.updateCity(id, cityDto);
  }

  @ApiOperation({ summary: 'Delete excursion' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.citiesService.deleteCity(id);
  }
}

