import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsController } from './hotels.controller.js';
import { HotelsAdminController } from './hotels.admin.controller.js';
import { HotelsService } from './hotels.service.js';
import { HotelsAdminService } from './hotels.admin.service.js';
import { Hotel, HotelSchema } from './schemas/hotels.schema.js';
import {
  BusTour,
  BusTourSchema,
} from '../bus-tours/schemas/bus-tour.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: BusTour.name, schema: BusTourSchema },
    ]),
  ],
  controllers: [HotelsController, HotelsAdminController],
  providers: [HotelsService, HotelsAdminService],
})
export class HotelsModule {}
