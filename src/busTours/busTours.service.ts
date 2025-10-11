import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import { BusTour } from 'src/busTours/schemas/busTours.schema';
import { IBusToursQuery } from './interfaces/query.interface';

@Injectable()
export class BusToursService {
  constructor(
    @InjectModel(BusTour.name)
    private readonly hotelModel: Model<BusTour>,
  ) { }

  async getBusTours(@Query() params: IBusToursQuery): Promise<BusTour[]> {
    const query: IBusToursQuery = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'city') {
          query['address.' + key] = value;
        }
      });
    }
    // по умолчанию возвращаем только опубликованные туры
    const hotels = await this.hotelModel.find({...query, published: true}).sort({ _id: -1 }).exec();
    return hotels;
  }

  async getBusTour(id: string) {
    try {
      const hotel = await this.hotelModel.findById(id).exec();
      if (hotel === null || ('published' in hotel && !hotel.published)) {
        throw new NotFoundException({statusMessage: 'Страница не найдена'});
      }
      return hotel;
    } catch (error) {
      // все CastError будут отдавать 404
      if (error instanceof Error.CastError) {
        throw new NotFoundException({statusMessage: 'Страница не найдена'});
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
