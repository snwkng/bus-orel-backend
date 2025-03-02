import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { UpdateExcursionDto } from './dto/update-excursion-dto';

@Injectable()
export class ExcursionService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionDocument>,
  ) {}

  async excursionCreate(dto: CreateExcursionDto) {
    const excursion = await this.excursionModel.create(dto);
    return excursion;
  }

  async getAllExcursions(params?: any) {
    const excursions = await this.excursionModel
      .find({excursionStart: {$gt: new Date()}, ...params})
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
    );
    return excursion;
  }

  async deleteExcursion(id: string) {
    const excursion = await this.excursionModel.deleteOne({ _id: id });
    return excursion;
  }

  async getCityList(): Promise<string[]> {
    const cityList: string[] = await this.excursionModel.distinct('city');
    return cityList;
  }
}
