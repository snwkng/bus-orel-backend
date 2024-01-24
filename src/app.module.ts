import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ExcursionsModule } from './excursions/excursions.module';
import { HotelsModule } from './hotels/hotels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/nest-test`,
    ),
    UsersModule,
    ExcursionsModule,
    HotelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
