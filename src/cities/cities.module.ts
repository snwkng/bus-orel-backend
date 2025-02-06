import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City, CitiesDocument } from '../shemas/cities.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: City.name, schema: CitiesDocument },
      ]),
    ],
  controllers: [CitiesController],
  providers: [CitiesService]
})
export class CitiesModule {}
