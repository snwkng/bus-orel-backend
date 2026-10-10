import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, isValidObjectId, Types } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { ExcursionQueryDto } from './dto/excursion-query.dto';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class ExcursionService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionDocument>,
  ) { }

  async getAllExcursions(params: ExcursionQueryDto, pagination?: PaginationDto): Promise<Excursion[] | PaginatedResponse<Excursion>> {
    const page = pagination?.page;
    const limit = pagination?.limit;
    const today = new Date();

    const matchFilter: FilterQuery<ExcursionDocument> = {
      excursionStartDates: { $elemMatch: { $gte: today } },
      ...(params?.city ? { cities: params.city } : {}),
    };

    const pipeline: any[] = [
      { $match: matchFilter },
      {
        $addFields: {
          excursionStartDates: {
            $sortArray: {
              input: {
                $filter: {
                  input: "$excursionStartDates",
                  as: "date",
                  cond: { $gte: ["$$date", today] }
                }
              },
              sortBy: 1
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ];

    if (!page || !limit) {
      return await this.excursionModel.aggregate(pipeline).exec();
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.excursionModel.aggregate([
        ...pipeline,
        { $skip: skip },
        { $limit: limit }
      ]).exec(),
      this.excursionModel.countDocuments(matchFilter).exec(),
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

  async getExcursion(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некорректный формат идентификатора');
    }

    const today = new Date();
    const result = await this.excursionModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $addFields: {
          excursionStartDates: {
            $sortArray: {
              input: {
                $filter: {
                  input: "$excursionStartDates",
                  as: "date",
                  cond: { $gte: ["$$date", today] }
                }
              },
              sortBy: 1
            }
          }
        }
      }
    ]).exec();

    const excursion = result[0];

    if (!excursion || !excursion.excursionStartDates?.length) {
      throw new NotFoundException('Экскурсия не найдена или уже завершена');
    }

    return excursion;
  }

  async getCitiesList(): Promise<SelectItemDto[]> {
    const today = new Date();

    // Возвращаем только те города, где есть актуальные экскурсии
    const res = await this.excursionModel.distinct("cities", {
      excursionStartDates: { $elemMatch: { $gte: today } }
    }).exec();
    return mapToSelectItem(res);
  }
}
