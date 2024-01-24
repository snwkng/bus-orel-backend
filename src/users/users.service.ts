import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UsersDocument } from 'src/shemas/users.schema';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  async userCreate(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    return user;
  }

  async getAllUsers() {
    const users = await this.userModel.find().exec();
    return users;
  }
}
