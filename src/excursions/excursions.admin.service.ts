import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { UpdateExcursionDto } from './dto/update-excursion-dto';
import { IRequestParams } from './interfaces/excursion.interface';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';

@Injectable()
export class ExcursionsAdminService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionDocument>,
  ) { }

  async excursionCreate(dto: CreateExcursionDto) {
    const excursion = await this.excursionModel.create(dto);
    return excursion;
  }

  async getAllExcursions(params: Partial<IRequestParams> & Record<string, any>) {
    const filter: Record<string, any> = {};
    
    if (params?.city) {
      filter['cities'] = params.city;
    }
    if (params?.search) {
      filter['name'] = params.search;
    }
    return await this.excursionModel
      .find(filter)
      .sort({ _id: -1 })
      .exec();
  }

  async getExcursion(id: string): Promise<Excursion> {
    return await this.excursionModel.findById(id).exec();
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

  async getCitiesList(): Promise<SelectItemDto[]> {
    const res = await this.excursionModel.distinct('cities');
    return mapToSelectItem(res);
  }
}
