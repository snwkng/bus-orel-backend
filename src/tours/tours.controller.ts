import { Controller, Get } from '@nestjs/common';
import { TourService } from './tours.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
  constructor(private readonly tourService: TourService) {}

  @ApiOperation({ summary: 'Get countries list' })
  @ApiResponse({ status: 200 })
  // @Header('Cache-Control', 'public, max-age=3600')
  @Get('countries')
  getCountriesList(): Promise<any> {
    return this.tourService.getCountries();
  }
}
