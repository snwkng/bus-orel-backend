import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { HotelsAdminService } from './hotels.admin.service';
import { Hotel } from './schemas/hotels.schema';
import { BusTour } from '../bus-tours/schemas/bus-tour.schema';

describe('HotelsAdminService', () => {
  let service: HotelsAdminService;
  const hotelModel = { deleteOne: vi.fn() };
  const busTourModel = { countDocuments: vi.fn() };

  const validId = '507f1f77bcf86cd799439011';

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelsAdminService,
        { provide: getModelToken(Hotel.name), useValue: hotelModel },
        { provide: getModelToken(BusTour.name), useValue: busTourModel },
      ],
    }).compile();

    service = module.get<HotelsAdminService>(HotelsAdminService);
  });

  describe('deleteHotel', () => {
    it('бросает Conflict, если с отелем связаны туры, и не удаляет отель', async () => {
      busTourModel.countDocuments.mockReturnValue({
        exec: vi.fn().mockResolvedValue(3),
      });

      await expect(service.deleteHotel(validId)).rejects.toThrow(
        ConflictException,
      );
      expect(hotelModel.deleteOne).not.toHaveBeenCalled();
    });

    it('бросает NotFound, если отель не найден', async () => {
      busTourModel.countDocuments.mockReturnValue({
        exec: vi.fn().mockResolvedValue(0),
      });
      hotelModel.deleteOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(service.deleteHotel(validId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('удаляет отель, если связанных туров нет', async () => {
      busTourModel.countDocuments.mockReturnValue({
        exec: vi.fn().mockResolvedValue(0),
      });
      const deleteResult = { deletedCount: 1 };
      hotelModel.deleteOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(deleteResult),
      });

      await expect(service.deleteHotel(validId)).resolves.toEqual(deleteResult);
      expect(hotelModel.deleteOne).toHaveBeenCalledWith({ _id: validId });
    });
  });
});
