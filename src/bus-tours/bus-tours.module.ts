import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { BusToursController } from './bus-tours.controller';
import { BusToursAdminController } from './bus-tours.admin.controller';
// import { BusToursService } from './bus-tours.service';
import { BusToursAdminService } from './bus-tours.admin.service';
import { BusTour, BusTourSchema } from './schemas/bus-tour.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BusTour.name, schema: BusTourSchema }]),
  ],
  controllers: [BusToursAdminController],
  providers: [BusToursAdminService],
})
export class BusToursModule {}
