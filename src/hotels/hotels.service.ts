import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Hotel } from '../hotels/schemas/hotels.schema';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';
import { buildSort, paginate } from '../common/utils/pagination.util';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<Hotel>,
  ) {}

  async getHotels(
    params: HotelQueryDto,
    pagination?: PaginationDto,
  ): Promise<PaginatedResponse<Hotel>> {
    const filter: QueryFilter<Hotel> = { published: true };

    if (params.city) {
      filter['address.city'] = params.city;
    }

    if (params.seaType) {
      filter.seaType = params.seaType;
    }

    return paginate(
      this.hotelModel,
      filter,
      pagination,
      buildSort(params?.sortBy, params?.sortDir),
    );
  }

  async getHotel(id: string): Promise<Hotel> {
    const hotel = await this.hotelModel
      .findOne({ _id: id, published: true })
      .lean()
      .exec();

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
    const filter: QueryFilter<Hotel> = { published: true };
    if (seaType) {
      filter.seaType = seaType;
    }
    const res = await this.hotelModel.distinct('address.city', filter);
    return mapToSelectItem(res);
  }
}
