import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel } from '../hotels/schemas/hotels.schema';
import { CreateHotelDto } from './dto/create-hotel-dto';
import { UpdateHotelDto } from './dto/update-hotel-dto';
import { IncludedInThePrice } from './subschemas/includedInThePrice.subschema';
import { mapToSelectItem, mapToIncludedInThePriceItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';

@Injectable()
export class HotelsAdminService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<Hotel>,
  ) { }

  async busTourCreate(dto: CreateHotelDto) {
    // по умолчанию создаем не опубликованные туры
    const hotel = await this.hotelModel.create({ ...dto, published: false });
    return hotel;
  }

  async getBusTours(params: Record<string, any>): Promise<Hotel[]> {
    const filter: Record<string, any> = {};
    if (params.city) {
      filter['address.city'] = params.city;
    }
    return this.hotelModel
      .find(filter)
      .sort({ _id: -1 })
      .exec();
  }

  async getBusTour(id: string) {
    const hotel = await this.hotelModel.findById(id).exec();
    return hotel;
  }

  async updateBusTour(id, dto: UpdateHotelDto | { published: boolean; }) {
    const hotel = await this.hotelModel.findByIdAndUpdate(
      { _id: id },
      dto,
      { new: true, returnDocument: "after" }
    );
    return hotel;
  }

  async deleteBusTour(id: string) {
    return await this.hotelModel.deleteOne({ _id: id });
  }

  async getSeaList(): Promise<SelectItemDto[]> {
    const res = await this.hotelModel.distinct('seaType');
    return mapToSelectItem(res);
  }

  async getCitiesList(seaType?: string): Promise<SelectItemDto[]> {
    const filter: Record<string, any> = {};
    if (seaType) filter.seaType = seaType;
    const res = await this.hotelModel.distinct('address.city', { ...filter });
    return mapToSelectItem(res);
  }

  async getIncludedInThePriceList(): Promise<IncludedInThePrice[]> {
    const res =  await this.hotelModel.distinct('includedInThePrice');
    return mapToIncludedInThePriceItem(res);
  }
}
