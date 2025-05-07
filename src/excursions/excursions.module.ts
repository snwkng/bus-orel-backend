import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcursionsController } from './excursions.controller';
import { ExcursionService } from './excursions.service';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { ExcursionCity, ExcursionCitiesSchema } from 'src/excursionCities/schemas/ExcursionCities.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Excursion.name, schema: ExcursionDocument },
      { name: ExcursionCity.name, schema: ExcursionCitiesSchema },
    ]),
  ],
  controllers: [ExcursionsController],
  providers: [ExcursionService],
})
export class ExcursionsModule {}
