import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcursionCitiesController } from './ExcursionCities.controller';
import { ExcursionCitiesService } from './ExcursionCities.service';
import { ExcursionCity, ExcursionCitiesDocument } from './schemas/ExcursionCities.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: ExcursionCity.name, schema: ExcursionCitiesDocument },
      ]),
    ],
  controllers: [ExcursionCitiesController],
  providers: [ExcursionCitiesService]
})
export class ExcursionCitiesModule {}
