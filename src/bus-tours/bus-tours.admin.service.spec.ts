import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BusToursAdminService } from './bus-tours.admin.service';
import { BusTour } from './schemas/bus-tour.schema';

describe('BusToursAdminService', () => {
  let service: BusToursAdminService;
  const busTourModel = { find: vi.fn() };

  const validHotelId = '507f1f77bcf86cd799439011';

  const mockFindChain = (result: unknown[]) => ({
    sort: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(result),
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusToursAdminService,
        { provide: getModelToken(BusTour.name), useValue: busTourModel },
      ],
    }).compile();

    service = module.get<BusToursAdminService>(BusToursAdminService);
  });

  describe('getBusTours', () => {
    it('фильтрует по hotelId и сортирует по _id desc по умолчанию', async () => {
      const chain = mockFindChain([]);
      busTourModel.find.mockReturnValue(chain);

      const result = await service.getBusTours({ hotelId: validHotelId });

      expect(busTourModel.find).toHaveBeenCalledWith({
        hotelId: validHotelId,
      });
      expect(chain.sort).toHaveBeenCalledWith({ _id: -1 });
      expect(chain.lean).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('без hotelId возвращает все туры с пустым фильтром', async () => {
      const chain = mockFindChain([]);
      busTourModel.find.mockReturnValue(chain);

      await service.getBusTours({});

      expect(busTourModel.find).toHaveBeenCalledWith({});
    });

    it('применяет sortBy/sortDir из запроса', async () => {
      const chain = mockFindChain([]);
      busTourModel.find.mockReturnValue(chain);

      await service.getBusTours({ sortBy: 'hotelId', sortDir: 'asc' });

      expect(chain.sort).toHaveBeenCalledWith({ hotelId: 1 });
    });
  });
});
