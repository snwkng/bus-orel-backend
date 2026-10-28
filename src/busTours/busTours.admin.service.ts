import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model, isValidObjectId } from 'mongoose';
import { BusTour } from './schemas/busTour.schema';
import { CreateBusTourDto } from './dto/create-bus-tour-dto';
import { UpdateBusTourDto } from './dto/update-bus-tour-dto';
import { BusTourQueryDto } from './dto/bus-tour-query.dto';

@Injectable()
export class BusToursAdminService {
  constructor(
    @InjectModel(BusTour.name)
    private readonly busTourModel: Model<BusTour>,
  ) {}

  async createBusTour(dto: CreateBusTourDto) {
    // по умолчанию создаем не опубликованные туры
    const busTour = await this.busTourModel.create({ ...dto });
    return busTour;
  }

  async getBusTours(params: BusTourQueryDto): Promise<BusTour[]> {
    const filter: QueryFilter<BusTour> = {};

    if (params?.hotelId) {
      filter.hotelId = params.hotelId;
    }

    const sort: Record<string, 1 | -1> = params?.sortBy
      ? { [params.sortBy]: params.sortDir === 'asc' ? 1 : -1 }
      : { _id: -1 };

    const busTours = await this.busTourModel
      .find(filter)
      .sort(sort)
      .lean()
      .exec();
    return busTours as BusTour[];
  }

  async updateBusTour(id: string, dto: UpdateBusTourDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }
    const busTour = await this.busTourModel.findByIdAndUpdate(
      { _id: id },
      { $set: dto },
      { new: true },
    );

    if (!busTour) {
      throw new NotFoundException('Автобусный тур для обновления не найден');
    }

    return busTour;
  }

  async deleteBusTour(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }

    const result = await this.busTourModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        'Автобусный тур не найден, удаление невозможно',
      );
    }

    return result;
  }
}
