import { buildSort, paginate } from './pagination.util';

describe('buildSort', () => {
  it('возвращает сортировку по умолчанию без параметров', () => {
    expect(buildSort()).toEqual({ _id: -1 });
  });

  it('строит сортировку по полю и направлению', () => {
    expect(buildSort('name', 'asc')).toEqual({ name: 1 });
    expect(buildSort('name', 'desc')).toEqual({ name: -1 });
    expect(buildSort('name')).toEqual({ name: -1 });
  });

  it('поддерживает другое поле по умолчанию', () => {
    expect(buildSort(undefined, undefined, 'createdAt')).toEqual({
      createdAt: -1,
    });
  });
});

describe('paginate', () => {
  const exec = jest.fn();
  const chain = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec,
  };
  const model: any = {
    find: jest.fn().mockReturnValue(chain),
    countDocuments: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    model.find.mockReturnValue(chain);
    chain.sort.mockReturnThis();
    chain.skip.mockReturnThis();
    chain.limit.mockReturnThis();
    chain.lean.mockReturnThis();
  });

  it('применяет дефолтные page=1, limit=20 и считает meta', async () => {
    exec.mockResolvedValue([{ name: 'a' }]);
    model.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(21),
    });

    const result = await paginate(model, {});

    expect(chain.skip).toHaveBeenCalledWith(0);
    expect(chain.limit).toHaveBeenCalledWith(20);
    expect(result).toEqual({
      items: [{ name: 'a' }],
      meta: { total: 21, page: 1, limit: 20, lastPage: 2 },
    });
  });

  it('считает skip для переданной страницы', async () => {
    exec.mockResolvedValue([]);
    model.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    });

    await paginate(model, {}, { page: 3, limit: 10 }, { name: 1 });

    expect(chain.sort).toHaveBeenCalledWith({ name: 1 });
    expect(chain.skip).toHaveBeenCalledWith(20);
    expect(chain.limit).toHaveBeenCalledWith(10);
  });
});
