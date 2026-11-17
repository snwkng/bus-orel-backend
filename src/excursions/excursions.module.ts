import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcursionsController } from './excursions.controller.js';
import { ExcursionsAdminController } from './excursions.admin.controller.js';
import { ExcursionsService } from './excursions.service.js';
import { ExcursionsAdminService } from './excursions.admin.service.js';
import { Excursion, ExcursionSchema } from './schemas/excursions.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Excursion.name, schema: ExcursionSchema },
    ]),
  ],
  controllers: [ExcursionsController, ExcursionsAdminController],
  providers: [ExcursionsService, ExcursionsAdminService],
})
export class ExcursionsModule {}
