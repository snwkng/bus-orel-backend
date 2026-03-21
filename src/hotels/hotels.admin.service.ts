import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, FilterQuery } from 'mongoose';
import { Hotel } from '../hotels/schemas/hotels.schema';
import { CreateHotelDto } from './dto/create-hotel-dto';
import { UpdateHotelDto } from './dto/update-hotel-dto';
import { IncludedInThePrice } from './subschemas/includedInThePrice.subschema';
import { mapToSelectItem, mapToIncludedInThePriceItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class HotelsAdminService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<Hotel>,
  ) { }

  async createHotel(dto: CreateHotelDto) {
    // по умолчанию создаем не опубликованные туры
    return await this.hotelModel.create({ ...dto, published: false });
  }

  async getHotels(params: HotelQueryDto, pagination?: PaginationDto): Promise<Hotel[] | PaginatedResponse<Hotel>> {
    const { page, limit } = pagination;
    const filter: FilterQuery<Hotel> = {};

    if (params.city) {
      filter['address.city'] = params.city;
    }

    if (params.seaType) {
      filter.seaType = params.seaType;
    }

    if (!page || !limit) {
      return await this.hotelModel.find(filter).sort({ _id: -1 }).lean().exec();
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

  async getHotel(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }
    const hotel = await this.hotelModel.findById(id).exec();

    if (!hotel) {
      throw new NotFoundException('Отель не найден');
    }

    return hotel;
  }

  async updateHotel(id: string, dto: UpdateHotelDto | { published: boolean; }) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }
    const hotel = await this.hotelModel.findByIdAndUpdate(
      { _id: id },
      { $set: dto },
      { new: true }
    );

    if (!hotel) {
      throw new NotFoundException('Отель для обновления не найден');
    }

    return hotel;
  }

  async deleteHotel(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }

    const result = await this.hotelModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Отель не найден, удаление невозможно');
    }

    return result;
  }

  async getSeaList(): Promise<SelectItemDto[]> {
    const res = await this.hotelModel.distinct('seaType').exec();
    return mapToSelectItem(res);
  }

  async getCitiesList(seaType?: string): Promise<SelectItemDto[]> {
    const filter: FilterQuery<Hotel> = {};
    if (seaType) {
      filter.seaType = seaType;
    }
    const res = await this.hotelModel.distinct('address.city', filter);
    return mapToSelectItem(res);
  }

  async getIncludedInThePriceList(): Promise<IncludedInThePrice[]> {
    const res = await this.hotelModel.distinct('includedInThePrice').exec();
    return mapToIncludedInThePriceItem(res);
  }
}
