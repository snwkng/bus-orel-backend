import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TourCity, TourCitiesDocument } from './schemas/tourCities.schema';
import { CreateTourCityDto } from './dto/create-TourCity-dto';
import { UpdateTourCityDto } from './dto/update-TourCity-dto';

@Injectable()
export class TourCitiesService {
  constructor(
    @InjectModel(TourCity.name)
    private readonly cityModel: Model<TourCitiesDocument>,
  ) {}

  async createCity(dto: CreateTourCityDto) {
    const city = await this.cityModel.create(dto);
    return city;
  }

  async getCities() {
    const cities = await this.cityModel
      .find()
      .sort({ _id: -1 })
      .exec();
    return cities;
  }

  async getCity(id: string) {
    const city = await this.cityModel.findById(id).exec();
    return city;
  }

  async updateCity(id: string, dto: UpdateTourCityDto) {
    const city = await this.cityModel.findByIdAndUpdate(
      { _id: id },
      dto,
    );
    return city;
  }

  async deleteCity(id: string) {
    const city = await this.cityModel.deleteOne({ _id: id });
    return city;
  }
}
