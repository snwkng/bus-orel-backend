import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusToursController } from './busTours.controller';
import { BusToursAdminController } from './busTours.admin.controller';
import { BusToursService } from './busTours.service';
import { BusToursAdminService } from './busTours.admin.service';
import { BusTour, BusTourSchema } from './schemas/busTours.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusTour.name, schema: BusTourSchema },
    ]),
  ],
  controllers: [BusToursController, BusToursAdminController],
  providers: [BusToursService, BusToursAdminService],
})
export class BusToursModule {}
