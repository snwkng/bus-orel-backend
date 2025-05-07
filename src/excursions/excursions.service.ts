import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { ExcursionCity } from 'src/excursionCities/schemas/excursionCities.schema';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { UpdateExcursionDto } from './dto/update-excursion-dto';
import { IRequestParams } from './interfaces/excursion.interface';

@Injectable()
export class ExcursionService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionDocument>,
    @InjectModel(ExcursionCity.name)
    private readonly cityModel: Model<ExcursionCity>,
  ) { }

  async excursionCreate(dto: CreateExcursionDto) {
    const excursion = await this.excursionModel.create(dto);
    return excursion;
  }

  async getAllExcursions(params: Partial<IRequestParams> & Record<string, any>) {
    const validKeys = new Set<keyof IRequestParams>(['city']);
    let cityId: Types.ObjectId | undefined;

    if (typeof params.city === 'string') {
      const cityDoc = await this.cityModel.findOne({ name: params.city }).exec();
      if (cityDoc) {
        cityId = cityDoc._id;
      }
    }
    const filteredParams = Object.fromEntries(
      Object.entries(params)
        .filter(([key]) => validKeys.has(key as keyof IRequestParams))
        .map(([key, value]) => {
          if (key === 'city' && cityId) {
            return ['cities', cityId];
          }
          return [key, value];
        })
    ) as IRequestParams;
    const excursions = await this.excursionModel
      .find({ excursionStart: { $gt: new Date() }, ...filteredParams })
      .populate('cities')
      .sort({ _id: -1 })
      .exec();
    return excursions;
  }

  async getExcursion(id: string) {
    const excursion = await this.excursionModel.findById(id).populate('cities').exec();
    return excursion;
  }

  async updateExcursion(id, dto: UpdateExcursionDto) {
    const excursion = await this.excursionModel.findByIdAndUpdate(
      { _id: id },
      dto,
      { new: true, returnDocument: "after" }
    );
    return excursion;
  }

  async deleteExcursion(id: string) {
    const excursion = await this.excursionModel.deleteOne({ _id: id });
    return excursion;
  }
}
