import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { UpdateExcursionDto } from './dto/update-excursion-dto';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { ExcursionQueryDto } from './dto/excursion-query.dto';

@Injectable()
export class ExcursionsAdminService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionDocument>,
  ) { }

  async createExcursion(dto: CreateExcursionDto) {
    return await this.excursionModel.create(dto);
  }

  async getAllExcursions(params: ExcursionQueryDto) {
    const filter: FilterQuery<ExcursionDocument> = {};

    if (params?.city) {
      filter['cities'] = params.city;
    }
    if (params?.search) {
      filter.name = { $regex: params.search, $options: 'i' };
    }
    return await this.excursionModel
      .find(filter)
      .sort({ _id: -1 })
      .lean()
      .exec();
  }

  async getExcursion(id: string): Promise<Excursion> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }

    const excursion = await this.excursionModel.findById(id).exec();

    if (!excursion) {
      throw new NotFoundException('Экскурсия не найдена');
    }

    return excursion;
  }

  async updateExcursion(id: string, dto: UpdateExcursionDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }

    const excursion = await this.excursionModel.findByIdAndUpdate(
      { _id: id },
      { $set: dto },
      { new: true }
    );

    if (!excursion) {
      throw new NotFoundException('Экскурсия не найдена');
    }
    return excursion;
  }

  async deleteExcursion(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }

    const result = await this.excursionModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Экскурсия не найдена, удаление невозможно');
    }

    return result;
  }

  async getCitiesList(): Promise<SelectItemDto[]> {
    const res = await this.excursionModel.distinct('cities').exec();
    return mapToSelectItem(res);
  }
}
