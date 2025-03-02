import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcursionsController } from './excursions.controller';
import { ExcursionService } from './excursions.service';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Excursion.name, schema: ExcursionDocument },
    ]),
  ],
  controllers: [ExcursionsController],
  providers: [ExcursionService],
})
export class ExcursionsModule {}
