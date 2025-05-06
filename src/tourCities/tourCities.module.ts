import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TourCitiesController } from './tourCities.controller';
import { TourCitiesService } from './tourCities.service';
import { TourCity, TourCitiesSchema } from './schemas/tourCities.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: TourCity.name, schema: TourCitiesSchema },
      ]),
    ],
  controllers: [TourCitiesController],
  providers: [TourCitiesService]
})
export class TourCitiesModule {}
