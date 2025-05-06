import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusToursController } from './busTours.controller';
import { BusToursService } from './busTours.service';
import { BusTour, BusTourSchema } from './schemas/busTours.schema';
import { TourCity, TourCitiesSchema } from 'src/tourCities/schemas/tourCities.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusTour.name, schema: BusTourSchema },
      { name: TourCity.name, schema: TourCitiesSchema },
    ]),
  ],
  controllers: [BusToursController],
  providers: [BusToursService],
})
export class BusToursModule {}
