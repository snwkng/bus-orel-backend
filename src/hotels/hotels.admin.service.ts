import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { Hotel } from '../hotels/schemas/hotels.schema';
import { BusTour } from '../busTours/schemas/busTour.schema';
import { CreateHotelDto } from './dto/create-hotel-dto';
import { UpdateHotelDto } from './dto/update-hotel-dto';
import { IncludedInThePrice } from './subschemas/includedInThePrice.subschema';
import {
  mapToSelectItem,
  mapToIncludedInThePriceItem,
} from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { PublishHotelDto } from './dto/publish-hotel.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';
import { BaseAdminService } from '../common/services/base-admin.service';
import { buildSort, paginate } from '../common/utils/pagination.util';

@Injectable()
export class HotelsAdminService extends BaseAdminService<Hotel> {
  constructor(
    @InjectModel(Hotel.name)
    hotelModel: Model<Hotel>,
    @InjectModel(BusTour.name)
    private readonly busTourModel: Model<BusTour>,
  ) {
    super(hotelModel, {
      notFound: 'Отель не найден',
      notFoundForUpdate: 'Отель для обновления не найден',
      notFoundForDelete: 'Отель не найден, удаление невозможно',
    });
  }

  async createHotel(dto: CreateHotelDto) {
    // по умолчанию создаем не опубликованные туры
    return this.create({ ...dto, published: false });
  }

  async getHotels(
    params: HotelQueryDto,
    pagination?: PaginationDto,
  ): Promise<PaginatedResponse<Hotel>> {
    const filter: QueryFilter<Hotel> = {};

    if (params.city) {
      filter['address.city'] = params.city;
    }

    if (params.seaType) {
      filter.seaType = params.seaType;
    }

    return paginate(
      this.model,
      filter,
      pagination,
      buildSort(params?.sortBy, params?.sortDir),
    );
  }

  async getHotel(id: string) {
    return this.getById(id);
  }

  async updateHotel(id: string, dto: UpdateHotelDto | PublishHotelDto) {
    return this.update(id, dto);
  }

  async deleteHotel(id: string): Promise<DeleteResult> {
    const toursCount = await this.busTourModel
      .countDocuments({ hotelId: id })
      .exec();

    if (toursCount > 0) {
      throw new ConflictException(
        `Невозможно удалить отель: с ним связано автобусных туров: ${toursCount}. Сначала удалите или переназначьте туры.`,
      );
    }

    return this.delete(id);
  }

  async getSeaList(): Promise<SelectItemDto[]> {
    const res = await this.model.distinct('seaType').exec();
    return mapToSelectItem(res);
  }

  async getCitiesList(seaType?: string): Promise<SelectItemDto[]> {
    const filter: QueryFilter<Hotel> = {};
    if (seaType) {
      filter.seaType = seaType;
    }
    const res = await this.model.distinct('address.city', filter);
    return mapToSelectItem(res);
  }

  async getIncludedInThePriceList(): Promise<IncludedInThePrice[]> {
    const res = await this.model.distinct('includedInThePrice').exec();
    return mapToIncludedInThePriceItem(res);
  }
}
