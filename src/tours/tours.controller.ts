import { Controller, Get } from '@nestjs/common';
import { TourService } from './tours.service';
import { Country } from './tours.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryDto } from './dto/country.dto';
import { ApiWrappedResponse } from '../common/decorators/api-wrapped-response.decorator';

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
