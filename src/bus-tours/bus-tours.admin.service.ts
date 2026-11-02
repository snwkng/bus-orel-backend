import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { BusTour } from './schemas/bus-tour.schema';
import { CreateBusTourDto } from './dto/create-bus-tour.dto';
import { UpdateBusTourDto } from './dto/update-bus-tour.dto';
import { BusTourQueryDto } from './dto/bus-tour-query.dto';
import { BaseAdminService } from '../common/services/base-admin.service';
import { buildSort } from '../common/utils/pagination.util';

@Injectable()
export class BusToursAdminService extends BaseAdminService<BusTour> {
  constructor(
    @InjectModel(BusTour.name)
    busTourModel: Model<BusTour>,
  ) {
    super(busTourModel, {
      notFound: 'Автобусный тур не найден',
      notFoundForUpdate: 'Автобусный тур для обновления не найден',
      notFoundForDelete: 'Автобусный тур не найден, удаление невозможно',
    });
  }

  async createBusTour(dto: CreateBusTourDto) {
    return this.create(dto);
  }

  async getBusTours(params: BusTourQueryDto): Promise<BusTour[]> {
    const filter: QueryFilter<BusTour> = {};

    if (params?.hotelId) {
      filter.hotelId = params.hotelId;
    }

    const busTours = await this.model
      .find(filter)
      .sort(buildSort(params?.sortBy, params?.sortDir))
      .lean()
      .exec();
    return busTours as BusTour[];
  }

  async updateBusTour(id: string, dto: UpdateBusTourDto) {
    return this.update(id, dto);
  }

  async deleteBusTour(id: string) {
    return this.delete(id);
  }
}
