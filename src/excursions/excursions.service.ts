import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error, Types } from 'mongoose';
import { Excursion, ExcursionDocument } from './schemas/excursions.schema';
import { IRequestParams } from './interfaces/excursion.interface';

@Injectable()
export class ExcursionService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionDocument>,
  ) { }

  async getAllExcursions(params: Partial<IRequestParams> & Record<string, any>) {
    const query = {};
    if (params?.city) {
      query['cities'] = params.city;
    }
    const today = new Date();
    const excursions = await this.excursionModel.aggregate([
      {
        $match: {
          excursionStartDates: {
            $elemMatch: { $gte: today }
          },
          ...query,
        }
      },
      {
        $addFields: {
          excursionStartDates: {
            $filter: {
              input: "$excursionStartDates",
              as: "date",
              cond: { $gte: ["$$date", today] }
            }
          }
        }
      }
    ]).exec();
    console.log(excursions);
    // const excursions = await this.excursionModel.find(query).sort({ _id: -1 }).exec();
    return excursions;
  }

  async getExcursion(id: string) {
    try {
      const today = new Date();
      const excursion = await this.excursionModel.findById(id).exec();
      if (!excursion || !excursion?.excursionStartDates?.some((x) => new Date(x) >= today)) {
        throw new NotFoundException({ statusMessage: 'Страница не найдена' });
      }
      if (excursion?.excursionStartDates?.length) {
        excursion.excursionStartDates = excursion?.excursionStartDates.filter((x) => new Date(x) >= today).sort((a: Date, b: Date) => a.getTime() - b.getTime());
      }
      return excursion;
    } catch (error) {
      // все CastError будут отдавать 404
      if (error instanceof Error.CastError) {
        throw new NotFoundException({ statusMessage: 'Страница не найдена' });
      }
      throw error; // Re-throw other errors
    }
  }

  async getCitiesList(): Promise<{ uniqueCities: string[]; }> {
    const uniqueCities = await this.excursionModel.distinct("cities");
    return { uniqueCities };
  }
}
