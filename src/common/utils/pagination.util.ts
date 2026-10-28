import { Model, QueryFilter } from 'mongoose';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResponse } from '../interfaces/pagination.interface';

export function buildSort(
  sortBy?: string,
  sortDir?: 'asc' | 'desc',
  defaultField = '_id',
): Record<string, 1 | -1> {
  if (sortBy) {
    return { [sortBy]: sortDir === 'asc' ? 1 : -1 };
  }
  return { [defaultField]: -1 };
}

export async function paginate<T>(
  model: Model<T>,
  filter: QueryFilter<T>,
  pagination?: PaginationDto,
  sort: Record<string, 1 | -1> = buildSort(),
): Promise<PaginatedResponse<T>> {
  const { page = 1, limit = 20 } = pagination ?? {};
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
    model.countDocuments(filter).exec(),
  ]);

  return {
    items: data as T[],
    meta: {
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    },
  };
}
