import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcursionCitiesController } from './excursionCities.controller';
import { ExcursionCitiesService } from './excursionCities.service';
import { ExcursionCity, ExcursionCitiesSchema } from './schemas/excursionCities.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: ExcursionCity.name, schema: ExcursionCitiesSchema },
      ]),
    ],
  controllers: [ExcursionCitiesController],
  providers: [ExcursionCitiesService]
})
export class ExcursionCitiesModule {}
