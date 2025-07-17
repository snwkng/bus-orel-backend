import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import { BusTour } from 'src/busTours/schemas/busTours.schema';

@Injectable()
export class BusToursService {
  constructor(
    @InjectModel(BusTour.name)
    private readonly hotelModel: Model<BusTour>,
  ) { }

  async getBusTours(params: Record<string, any>): Promise<BusTour[]> {
    const query = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'city') {
          query['address.' + key] = value;
        } else {
          query[key] = value;
        }
      });
    }
    const hotels = await this.hotelModel.find(query).sort({ _id: -1 }).exec();
    return hotels;
  }

  async getBusTour(id: string) {
    try {
      const hotel = await this.hotelModel.findById(id).exec();
      return hotel;
    } catch (error) {
      // все CastError будут отдавать 404
      if (error instanceof Error.CastError) {
        throw new NotFoundException(`Invalid ID format: "${id}"`);
      }
      throw error; // Re-throw other errors
    }
  }

  async getSeaList(): Promise<string[]> {
    const seaList: string[] = await this.hotelModel.distinct('seaType');
    return seaList;
  }

  async getCitiesList(seaType?: string): Promise<string[]> {
    const filter = seaType ? { seaType } : {};
    const cityList: string[] = await this.hotelModel.distinct('address.city', { ...filter });
    return cityList;
  }
}
