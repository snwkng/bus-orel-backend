import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CitiesDocument } from 'src/shemas/cities.schema';
import { CreateCityDto } from './dto/create-city-dto';
import { UpdateCityDto } from './dto/update-city-dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name)
    private readonly cityModel: Model<CitiesDocument>,
  ) {}

  async createCity(dto: CreateCityDto) {
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

  async updateCity(id: string, dto: UpdateCityDto) {
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
