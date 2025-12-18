import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { BusToursController } from './busTours.controller';
import { BusToursAdminController } from './busTours.admin.controller';
// import { BusToursService } from './busTours.service';
import { BusToursAdminService } from './busTours.admin.service';
import { BusTour, BusTourSchema } from './schemas/busTour.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusTour.name, schema: BusTourSchema },
    ]),
  ],
  controllers: [BusToursAdminController],
  providers: [BusToursAdminService],
})
export class BusToursModule {}
