import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TourCitiesController } from './tourCities.controller';
import { TourCitiesService } from './tourCities.service';
import { TourCity, TourCitiesDocument } from './schemas/tourCities.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: TourCity.name, schema: TourCitiesDocument },
      ]),
    ],
  controllers: [TourCitiesController],
  providers: [TourCitiesService]
})
export class TourCitiesModule {}
