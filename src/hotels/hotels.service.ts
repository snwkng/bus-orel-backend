import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel } from 'src/shemas/hotels.schema';
import { CreateHotelDto } from './dto/create-hotel-dto';
import { UpdateHotelDto } from './dto/update-hotel-dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<Hotel>,
  ) {}

  async hotelCreate(dto: CreateHotelDto) {
    const hotel = await this.hotelModel.create(dto);
    return hotel;
  }

  async getAllHotels() {
    const hotels = await this.hotelModel.find().exec();
    return hotels;
  }

  async getHotel(id: string) {
    const hotel = await this.hotelModel.findById(id).exec();
    return hotel;
  }

  async updateHotel(id, dto: UpdateHotelDto) {
    const hotel = await this.hotelModel.findByIdAndUpdate({ _id: id }, dto);
    return hotel;
  }

  async deleteHotel(id: string) {
    const hotel = await this.hotelModel.deleteOne({ _id: id });
    return hotel;
  }

  async getSeaList() {
    const seaList: any = await this.hotelModel.find();
    return seaList;
  }
}
