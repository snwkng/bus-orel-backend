import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusToursAdminController } from './bus-tours.admin.controller.js';
import { BusToursAdminService } from './bus-tours.admin.service.js';
import { BusTour, BusTourSchema } from './schemas/bus-tour.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BusTour.name, schema: BusTourSchema }]),
  ],
  controllers: [BusToursAdminController],
  providers: [BusToursAdminService],
})
export class BusToursModule {}
