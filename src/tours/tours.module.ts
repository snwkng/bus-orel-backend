import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ToursController } from './tours.controller.js';
import { TourService } from './tours.service.js';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
    }),
  ],
  controllers: [ToursController],
  providers: [TourService],
})
export class ToursModule {}
