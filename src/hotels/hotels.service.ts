import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import { Hotel } from 'src/hotels/schemas/hotels.schema';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from 'src/common/dto/select-item.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<Hotel>,
  ) { }

  async getBusTours(params: HotelQueryDto): Promise<Hotel[]> {
    const filter: Record<string, any> = { published: true };

    if (params.city) {
      filter['address.city'] = params.city;
    }

    // Если параметров станет много, можно добавить другие условия:
    // if (params.seaType) filter.seaType = params.seaType;

    return this.hotelModel
      .find(filter)
      .sort({ _id: -1 })
      .exec();
  }

  async getBusTour(id: string): Promise<Hotel> {
    const hotel = await this.hotelModel.findOne({ _id: id, published: true }).exec();

    if (!hotel) {
      throw new NotFoundException('Страница не найдена');
    }

    return hotel;
  }

  async getSeaList(): Promise<SelectItemDto[]> {
    const res = await this.hotelModel.distinct('seaType');
    return mapToSelectItem(res);
  }

  async getCitiesList(seaType?: string): Promise<SelectItemDto[]> {
    const filter: Record<string, any> = { published: true };
    if (seaType) filter.seaType = seaType;
    const res = await this.hotelModel.distinct('address.city', { ...filter });
    return mapToSelectItem(res);
  }
}
