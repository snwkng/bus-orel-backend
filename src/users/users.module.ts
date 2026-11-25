import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { User, UsersDocument } from './schemas/users.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersDocument }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
