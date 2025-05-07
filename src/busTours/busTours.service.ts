import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusTour } from 'src/busTours/schemas/busTours.schema';
import { TourCity } from 'src/tourCities/schemas/tourCities.schema';
import { IRequestParams } from './interfaces/busTour.intarface';
import { CreateBusTourDto } from './dto/create-busTour-dto';
import { UpdateBusTourDto } from './dto/update-busTour-dto';

@Injectable()
export class BusToursService {
  constructor(
    @InjectModel(BusTour.name)
    private readonly hotelModel: Model<BusTour>,
    @InjectModel(TourCity.name)
    private readonly cityModel: Model<TourCity>,
  ) { }

  async busTourCreate(dto: CreateBusTourDto) {
    const hotel = await this.hotelModel.create(dto);
    return hotel;
  }

  async getBusTours(params: Record<string, any>): Promise<BusTour[]> {
    const validKeys = new Set<keyof IRequestParams>(['seaType', 'city']);
    let cityId: Types.ObjectId | undefined;
    if (typeof params.city === 'string') {
      const cityDoc = await this.cityModel.findOne({ name: params.city }).exec();
      if (cityDoc) {
        cityId = cityDoc._id;
      }
    }

    const filteredParams = Object.fromEntries(
      Object.entries(params)
        .filter(([key]) => validKeys.has(key as keyof IRequestParams))
        .map(([key, value]) => {
          if (key === 'city' && cityId) {
            return ['city', cityId];
          }
          return [key, value];
        })
    ) as IRequestParams;

    const hotels = await this.hotelModel.find(filteredParams).sort({ _id: -1 }).populate('city').exec();
    return hotels;
  }

  async getBusTour(id: string) {
    const hotel = await this.hotelModel.findById(id).populate('city').exec();
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
}
