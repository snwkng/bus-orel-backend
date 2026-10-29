import { NotFoundException } from '@nestjs/common';
import { AnyObject, Model, UpdateQuery } from 'mongoose';
import { DeleteResult } from 'mongodb';

export interface EntityErrorMessages {
  notFound: string;
  notFoundForUpdate: string;
  notFoundForDelete: string;
}

export abstract class BaseAdminService<T> {
  constructor(
    protected readonly model: Model<T>,
    private readonly errorMessages: EntityErrorMessages,
  ) {}

  async create(dto: AnyObject): Promise<T> {
    const doc = new this.model(dto);
    return (await doc.save()) as T;
  }

  async getById(id: string): Promise<T> {
    const doc = await this.model.findById(id).exec();

    if (!doc) {
      throw new NotFoundException(this.errorMessages.notFound);
    }

    return doc;
  }

  async update(id: string, dto: AnyObject): Promise<T> {
    const doc = await this.model.findByIdAndUpdate(
      { _id: id },
      { $set: dto } as UpdateQuery<T>,
      { new: true },
    );

    if (!doc) {
      throw new NotFoundException(this.errorMessages.notFoundForUpdate);
    }

    return doc;
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.model.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(this.errorMessages.notFoundForDelete);
    }

    return result;
  }
}
