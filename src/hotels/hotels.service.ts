import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, FilterQuery } from 'mongoose';
import { Hotel } from '../hotels/schemas/hotels.schema';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<Hotel>,
  ) { }

  async getHotels(params: HotelQueryDto): Promise<Hotel[]> {
    const filter: FilterQuery<Hotel> = { published: true };

    if (params.city) {
      filter['address.city'] = params.city;
    }

    // Если параметров станет много, можно добавить другие условия:
    // if (params.seaType) filter.seaType = params.seaType;

    return this.hotelModel
      .find(filter)
      .sort({ _id: -1 })
      .lean()
      .exec();
  }

  async getHotel(id: string): Promise<Hotel> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }
    const hotel = await this.hotelModel.findOne({ _id: id, published: true }).lean().exec();

    if (!hotel) {
      throw new NotFoundException('Страница не найдена');
    }

    return hotel as Hotel;
  }

  async getSeaList(): Promise<SelectItemDto[]> {
    const res = await this.hotelModel.distinct('seaType', { published: true });
    return mapToSelectItem(res);
  }

  async getCitiesList(seaType?: string): Promise<SelectItemDto[]> {
    const filter: FilterQuery<Hotel> = { published: true };
    if (seaType) {
      filter.seaType = seaType;
    }
    const res = await this.hotelModel.distinct('address.city', filter);
    return mapToSelectItem(res);
  }
}
