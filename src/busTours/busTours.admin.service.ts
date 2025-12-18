import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusTour } from './schemas/busTour.schema';
import { CreateBusTourDto } from './dto/create-bus-tour-dto';
import { UpdateBusTourDto } from './dto/update-bus-tour-dto';

@Injectable()
export class BusToursAdminService {
  constructor(
    @InjectModel(BusTour.name)
    private readonly busTourModel: Model<BusTour>,
  ) { }

  async createBusTour(dto: CreateBusTourDto) {
    // по умолчанию создаем не опубликованные туры
    const tour = await this.busTourModel.create({...dto});
    return tour;
  }

  async getBusTours(params: {hotelId: Types.ObjectId}): Promise<BusTour[]> {
    const tours = await this.busTourModel.find(params).sort({ _id: -1 }).exec();
    return tours;
  }

  async updateBusTour(id, dto: UpdateBusTourDto) {
    const hotel = await this.busTourModel.findByIdAndUpdate(
      { _id: id },
      dto,
      { new: true, returnDocument: "after" }
    );
    return hotel;
  }

  async deleteBusTour(id: Types.ObjectId) {
    const hotel = await this.busTourModel.deleteOne({ _id: id });
    return hotel;
  }
}
