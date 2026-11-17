import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './health.controller.js';
import { S3HealthIndicator } from './s3.health.js';

describe('HealthController', () => {
  let controller: HealthController;
  const healthCheckService = { check: vi.fn() };
  const mongooseHealthIndicator = { pingCheck: vi.fn() };
  const s3HealthIndicator = { isHealthy: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: healthCheckService },
        { provide: MongooseHealthIndicator, useValue: mongooseHealthIndicator },
        { provide: S3HealthIndicator, useValue: s3HealthIndicator },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('запускает проверки mongo и s3 и возвращает результат', async () => {
    const expected = {
      status: 'ok',
      info: { mongo: { status: 'up' }, s3: { status: 'up' } },
      error: {},
      details: {},
    };
    healthCheckService.check.mockResolvedValue(expected);
    mongooseHealthIndicator.pingCheck.mockReturnValue('mongo-attempt');
    s3HealthIndicator.isHealthy.mockReturnValue('s3-attempt');

    const result = await controller.check();

    const indicators = healthCheckService.check.mock
      .calls[0][0] as (() => unknown)[];
    expect(indicators).toHaveLength(2);
    expect(indicators[0]()).toBe('mongo-attempt');
    expect(indicators[1]()).toBe('s3-attempt');
    expect(mongooseHealthIndicator.pingCheck).toHaveBeenCalledWith('mongo');
    expect(s3HealthIndicator.isHealthy).toHaveBeenCalledWith('s3');
    expect(result).toEqual(expected);
  });
});
