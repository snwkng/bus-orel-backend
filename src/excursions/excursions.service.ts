import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Excursion, ExcursionsDocument } from 'src/shemas/excursions.schema';
import { CreateExcursionDto } from './dto/create-excursion-dto';

@Injectable()
export class ExcursionsService {
  constructor(
    @InjectModel(Excursion.name)
    private readonly excursionModel: Model<ExcursionsDocument>,
  ) {}

  async excursionCreate(dto: CreateExcursionDto) {
    const user = await this.excursionModel.create(dto);
    return user;
  }

  async getAllExcursions() {
    const excursions = await this.excursionModel.find().exec();
    return excursions;
  }
}
