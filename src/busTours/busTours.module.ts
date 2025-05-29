import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusToursController } from './busTours.controller';
import { BusToursService } from './busTours.service';
import { BusTour, BusTourSchema } from './schemas/busTours.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusTour.name, schema: BusTourSchema },
    ]),
  ],
  controllers: [BusToursController],
  providers: [BusToursService],
})
export class BusToursModule {}
