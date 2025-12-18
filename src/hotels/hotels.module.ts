import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsController } from './hotels.controller';
import { HotelsAdminController } from './hotels.admin.controller';
import { HotelsService } from './hotels.service';
import { HotelsAdminService } from './hotels.admin.service';
import { Hotel, HotelSchema } from './schemas/hotels.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
    ]),
  ],
  controllers: [HotelsController, HotelsAdminController],
  providers: [HotelsService, HotelsAdminService],
})
export class HotelsModule {}
