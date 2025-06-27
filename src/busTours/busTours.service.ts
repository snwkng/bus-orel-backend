import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusTour } from 'src/busTours/schemas/busTours.schema';
import { CreateBusTourDto } from './dto/create-busTour-dto';
import { UpdateBusTourDto } from './dto/update-busTour-dto';
import { type IncludedInThePrice } from './subschemas/includedInThePrice.subschema';

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
    const query = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'city') {
          query['address.'+key] = value
        } else {
          query[key] = value
        }
      });
    }
    const hotels = await this.hotelModel.find(query).sort({ _id: -1 }).exec();
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

  async getCitiesList(seaType: string): Promise<string[]> {
    const cityList: string[] = await this.hotelModel.distinct('address.city', { seaType });
    return cityList;
  }

  async getIncludedInThePriceList(): Promise<IncludedInThePrice[]> {
    const includedInThePrice: IncludedInThePrice[] = await this.hotelModel.distinct('includedInThePrice');
    return includedInThePrice;
  }
}
