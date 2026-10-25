import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { UpdateExcursionDto } from './dto/update-excursion-dto';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { ExcursionQueryDto } from './dto/excursion-query.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class ExcursionsAdminService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionDocument>,
  ) {}

  async createExcursion(dto: CreateExcursionDto) {
    return await this.excursionModel.create(dto);
  }

  async getAllExcursions(
    params: ExcursionQueryDto,
    pagination?: PaginationDto,
  ): Promise<PaginatedResponse<Excursion>> {
    const { page = 1, limit = 20 } = pagination ?? {};
    const filter: FilterQuery<ExcursionDocument> = {};

    if (params?.city) {
      filter['cities'] = params.city;
    }
    if (params?.search) {
      const search = params.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: search, $options: 'i' };
    }

    const sort: Record<string, 1 | -1> = params?.sortBy
      ? { [params.sortBy]: params.sortDir === 'asc' ? 1 : -1 }
      : { _id: -1 };

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.excursionModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.excursionModel.countDocuments(filter).exec(),
    ]);

    return {
      items: data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
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
      { new: true },
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
    return mapToSelectItem(res.filter(Boolean));
  }

  async getTypesList(): Promise<SelectItemDto[]> {
    const res = await this.excursionModel
      .distinct('type', {
        type: { $exists: true, $nin: [null, '', undefined] },
      })
      .exec();
    return mapToSelectItem(res);
  }
}
