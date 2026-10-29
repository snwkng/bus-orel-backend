import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, type Types } from 'mongoose';
import { User, UsersDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  async findOne(username: string): Promise<UsersDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async checkUser(username: string): Promise<UsersDocument | null> {
    return this.userModel.findOne({ username }).select('+password').exec();
  }

  async setCurrentRefreshToken(
    userId: string | Types.ObjectId,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $set: { currentHashedRefreshToken: refreshTokenHash },
      })
      .exec();
  }

  async getUserWithRefreshToken(userId: string): Promise<UsersDocument | null> {
    return this.userModel
      .findById(userId)
      .select('+currentHashedRefreshToken')
      .exec();
  }
}
