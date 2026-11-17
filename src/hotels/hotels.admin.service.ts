import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { Hotel } from '../hotels/schemas/hotels.schema.js';
import { BusTour } from '../bus-tours/schemas/bus-tour.schema.js';
import { CreateHotelDto } from './dto/create-hotel.dto.js';
import { UpdateHotelDto } from './dto/update-hotel.dto.js';
import { IncludedInThePrice } from './subschemas/includedInThePrice.subschema.js';
import {
  mapToSelectItem,
  mapToIncludedInThePriceItem,
} from '../common/utils/mapper.util.js';
import { SelectItemDto } from '../common/dto/select-item.dto.js';
import { HotelQueryDto } from './dto/hotel-query.dto.js';
import { PublishHotelDto } from './dto/publish-hotel.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { PaginatedResponse } from '../common/interfaces/pagination.interface.js';
import { BaseAdminService } from '../common/services/base-admin.service.js';
import { buildSort, paginate } from '../common/utils/pagination.util.js';

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
      // тяжёлые поля не нужны в таблице админки (images нужен целиком — счётчик +N)
      { description: 0, rooms: 0 },
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
