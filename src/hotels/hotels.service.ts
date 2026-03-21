import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, FilterQuery } from 'mongoose';
import { Hotel } from '../hotels/schemas/hotels.schema';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<Hotel>,
  ) { }

  async getHotels(params: HotelQueryDto, pagination?: PaginationDto): Promise<Hotel[] | PaginatedResponse<Hotel>> {
    const { page, limit } = pagination;
    const filter: FilterQuery<Hotel> = { published: true };

    if (params.city) {
      filter['address.city'] = params.city;
    }

    if (params.seaType) {
      filter.seaType = params.seaType;
    }

    if (!page || !limit) {
      return await this.hotelModel
        .find(filter)
        .sort({ _id: -1 })
        .lean()
        .exec();
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.hotelModel.find(filter).sort({ _id: -1 }).skip(skip).limit(limit).lean().exec(),
      this.hotelModel.countDocuments(filter).exec(),
    ]);

    return {
      items: data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
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
