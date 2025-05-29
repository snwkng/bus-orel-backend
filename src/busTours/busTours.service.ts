import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusTour } from 'src/busTours/schemas/busTours.schema';
import { CreateBusTourDto } from './dto/create-busTour-dto';
import { UpdateBusTourDto } from './dto/update-busTour-dto';

@Injectable()
export class BusToursService {
  constructor(
    @InjectModel(BusTour.name)
    private readonly hotelModel: Model<BusTour>,
  ) { }

  async busTourCreate(dto: CreateBusTourDto) {
    const hotel = await this.hotelModel.create(dto);
    return hotel;
  }

  async getBusTours(params: Record<string, any>): Promise<BusTour[]> {
    const hotels = await this.hotelModel.find(params).sort({ _id: -1 }).exec();
    return hotels;
  }

  async getBusTour(id: string) {
    const hotel = await this.hotelModel.findById(id).exec();
    return hotel;
  }

  async updateBusTour(id, dto: UpdateBusTourDto) {
    const hotel = await this.hotelModel.findByIdAndUpdate(
      { _id: id },
      dto,
      { new: true, returnDocument: "after" }
    );
    return hotel;
  }

  async deleteBusTour(id: string) {
    const hotel = await this.hotelModel.deleteOne({ _id: id });
    return hotel;
  }

  async getSeaList(): Promise<string[]> {
    const seaList: string[] = await this.hotelModel.distinct('seaType');
    return seaList;
  }

  async getCitiesList(): Promise<string[]> {
    const cityList: string[] = await this.hotelModel.distinct('address.city');
    return cityList;
  }
}
