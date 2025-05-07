import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcursionCitiesController } from './ExcursionCities.controller';
import { ExcursionCitiesService } from './ExcursionCities.service';
import { ExcursionCity, ExcursionCitiesSchema } from './schemas/ExcursionCities.schema';

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
