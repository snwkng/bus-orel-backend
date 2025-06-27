import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { UpdateExcursionDto } from './dto/update-excursion-dto';
import { IRequestParams } from './interfaces/excursion.interface';

@Injectable()
export class ExcursionService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionDocument>,
  ) { }

  async excursionCreate(dto: CreateExcursionDto) {
    const excursion = await this.excursionModel.create(dto);
    return excursion;
  }

  async getAllExcursions(params: Partial<IRequestParams> & Record<string, any>) {
    const query = {};
    if (params?.city) {
      query['cities'] = params.city;
    }
    const excursions = await this.excursionModel.find(query).sort({ _id: -1 }).exec();
    return excursions;
  }

  async getExcursion(id: string) {
    const excursion = await this.excursionModel.findById(id).exec();
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

  async getCitiesList(): Promise<{ uniqueCities: string[]; }> {
    const cityList = await this.excursionModel.aggregate([
      { $unwind: "$cities" },
      { $group: { _id: null, uniqueCities: { $addToSet: "$cities" } } },
      { $project: { _id: 0 } }
    ]);
    return cityList[0];
  }
}
