import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ExcursionsModule } from './excursions/excursions.module';
import { HotelsModule } from './hotels/hotels.module';
import { BusToursModule } from './busTours/busTours.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE_NAME}`,
    ),
    UsersModule,
    ExcursionsModule,
    HotelsModule,
    AuthModule,
    UploadModule,
    BusToursModule
  ],
})
export class AppModule {}
