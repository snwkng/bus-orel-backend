import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { CreateExcursionDto } from './dto/create-excursion-dto';
import { UpdateExcursionDto } from './dto/update-excursion-dto';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { ExcursionQueryDto } from './dto/excursion-query.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';
import { BaseAdminService } from '../common/services/base-admin.service';
import { buildSort, paginate } from '../common/utils/pagination.util';

@Injectable()
export class ExcursionsAdminService extends BaseAdminService<ExcursionDocument> {
  constructor(
    @InjectModel(Excursion.name)
    excursionModel: Model<ExcursionDocument>,
  ) {
    super(excursionModel, {
      notFound: 'Экскурсия не найдена',
      notFoundForUpdate: 'Экскурсия не найдена',
      notFoundForDelete: 'Экскурсия не найдена, удаление невозможно',
    });
  }

  async createExcursion(dto: CreateExcursionDto) {
    return this.create(dto);
  }

  async getAllExcursions(
    params: ExcursionQueryDto,
    pagination?: PaginationDto,
  ): Promise<PaginatedResponse<Excursion>> {
    const filter: QueryFilter<ExcursionDocument> = {};

    if (params?.city) {
      filter['cities'] = params.city;
    }
    if (params?.search) {
      const search = params.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: search, $options: 'i' };
    }

    return paginate(
      this.model,
      filter,
      pagination,
      buildSort(params?.sortBy, params?.sortDir),
    );
  }

  async getExcursion(id: string): Promise<Excursion> {
    return this.getById(id);
  }

  async updateExcursion(id: string, dto: UpdateExcursionDto) {
    return this.update(id, dto);
  }

  async deleteExcursion(id: string) {
    return this.delete(id);
  }

  async getCitiesList(): Promise<SelectItemDto[]> {
    const res = await this.model.distinct('cities').exec();
    return mapToSelectItem(res.filter(Boolean));
  }

  async getTypesList(): Promise<SelectItemDto[]> {
    const res = await this.model
      .distinct('type', {
        type: { $exists: true, $nin: [null, '', undefined] },
      })
      .exec();
    return mapToSelectItem(res);
  }
}
