import { Controller, Get } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user-dto';
import { ExcursionsService } from './excursions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Excursion } from 'src/shemas/excursions.schema';

@ApiTags('Excursions')
@Controller('excursions')
export class ExcursionsController {
  constructor(private excursionsService: ExcursionsService) {}

  @ApiOperation({ summary: 'Get all excursions' })
  @ApiResponse({ status: 200, type: [Excursion] })
  @Get()
  async getAll(): Promise<Excursion[]> {
    return this.excursionsService.getAllExcursions();
  }
}
