import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
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

  async create(dto: any): Promise<T> {
    return this.model.create(dto);
  }

  async getById(id: string): Promise<T> {
    const doc = await this.model.findById(id).exec();

    if (!doc) {
      throw new NotFoundException(this.errorMessages.notFound);
    }

    return doc;
  }

  async update(id: string, dto: any): Promise<T> {
    const doc = await this.model.findByIdAndUpdate(
      { _id: id },
      { $set: dto },
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
