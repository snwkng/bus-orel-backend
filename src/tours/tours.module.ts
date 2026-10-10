import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ToursController } from './tours.controller';
import { TourService } from './tours.service';

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
