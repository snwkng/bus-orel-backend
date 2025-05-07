import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExcursionCity, ExcursionCitiesDocument } from './schemas/excursionCities.schema';
import { CreateExcursionCityDto } from './dto/create-excursionCity-dto';
import { UpdateExcursionCityDto } from './dto/update-ExcursionCity-dto';

@Injectable()
export class ExcursionCitiesService {
  constructor(
    @InjectModel(ExcursionCity.name)
    private readonly cityModel: Model<ExcursionCitiesDocument>,
  ) {}

  async createCity(dto: CreateExcursionCityDto) {
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

  async updateCity(id: string, dto: UpdateExcursionCityDto) {
    const city = await this.cityModel.findByIdAndUpdate(
      { _id: id },
      dto,
      { new: true, returnDocument: "after" }
    );
    return city;
  }

  async deleteCity(id: string) {
    const city = await this.cityModel.deleteOne({ _id: id });
    return city;
  }
}
