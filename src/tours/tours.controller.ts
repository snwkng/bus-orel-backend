import { Controller, Get } from '@nestjs/common';
import { TourService } from './tours.service.js';
import { Country } from './tours.interface.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryDto } from './dto/country.dto.js';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator.js';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: TourService) {}

  @ApiOperation({ summary: 'Get countries list' })
  @ApiWrappedResponse(CountryDto, { isArray: true })
  // @Header('Cache-Control', 'public, max-age=3600')
  @Get('countries')
  getCountriesList(): Promise<Country[]> {
    return this.tourService.getCountries();
  }
}
