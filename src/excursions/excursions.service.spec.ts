import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { ExcursionService } from './excursions.service';
import { Excursion } from './schemas/excursions.schema';

describe('ExcursionService', () => {
  let service: ExcursionService;
  const excursionModel = { aggregate: jest.fn() };

  const validId = '507f1f77bcf86cd799439011';

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExcursionService,
        { provide: getModelToken(Excursion.name), useValue: excursionModel },
      ],
    }).compile();

    service = module.get<ExcursionService>(ExcursionService);
  });

  describe('getExcursion', () => {
    it('бросает NotFound, если экскурсия не найдена', async () => {
      excursionModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await expect(service.getExcursion(validId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('возвращает экскурсию с пустым массивом дат, если все даты в прошлом', async () => {
      const excursion = { _id: validId, name: 'Тур', excursionStartDates: [] };
      excursionModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([excursion]),
      });

      await expect(service.getExcursion(validId)).resolves.toEqual(excursion);
    });

    it('возвращает экскурсию с будущими датами', async () => {
      const excursion = {
        _id: validId,
        name: 'Тур',
        excursionStartDates: [new Date('2099-01-01')],
      };
      excursionModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([excursion]),
      });

      await expect(service.getExcursion(validId)).resolves.toEqual(excursion);
    });
  });
});
