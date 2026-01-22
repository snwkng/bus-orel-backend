import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcursionsController } from './excursions.controller';
import { ExcursionsAdminController } from './excursions.admin.controller';
import { ExcursionService } from './excursions.service';
import { ExcursionsAdminService } from './excursions.admin.service';
import { Excursion, ExcursionSchema } from './schemas/excursions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Excursion.name, schema: ExcursionSchema },
    ]),
  ],
  controllers: [ExcursionsController, ExcursionsAdminController],
  providers: [ExcursionService, ExcursionsAdminService],
})
export class ExcursionsModule {}
