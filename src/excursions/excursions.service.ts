import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, isValidObjectId, Types } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { ExcursionQueryDto } from './dto/excursion-query.dto';
import { mapToSelectItem } from '../common/utils/mapper.util';
import { SelectItemDto } from '../common/dto/select-item.dto';

@Injectable()
export class ExcursionService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionDocument>,
  ) { }

  async getAllExcursions(params: ExcursionQueryDto) {
    const filter: FilterQuery<ExcursionDocument> = {};
    if (params?.city) {
      filter['cities'] = params.city;
    }
    const today = new Date();

    const excursions = await this.excursionModel.aggregate([
      {
        $match: {
          excursionStartDates: {
            $elemMatch: { $gte: today }
          },
          ...filter,
        }
      },
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
              sortBy: 1 // Сортировка дат от ближайшей к дальней
            }
          }
        }
      },
      { $sort: { createdAt: -1 } } // Сортировка самих экскурсий
    ]).exec();
    return excursions;
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

    console.log(res)
    return mapToSelectItem(res);
  }
}
