import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcursionsController } from './excursions.controller';
import { ExcursionsService } from './excursions.service';
import { Excursion, ExcursionsDocument } from '../shemas/excursions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Excursion.name, schema: ExcursionsDocument },
    ]),
  ],
  controllers: [ExcursionsController],
  providers: [ExcursionsService],
})
export class ExcursionsModule {}
