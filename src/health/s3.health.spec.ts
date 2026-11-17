import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthIndicatorService } from '@nestjs/terminus';
import { S3HealthIndicator } from './s3.health.js';

describe('S3HealthIndicator', () => {
  let indicator: S3HealthIndicator;
  const configService = {
    get: vi.fn().mockReturnValue('test-value'),
    getOrThrow: vi.fn().mockReturnValue('test-value'),
  };
  const attemptBuilder = { withTimeout: vi.fn().mockReturnValue('attempt') };
  const session = { attempt: vi.fn().mockReturnValue(attemptBuilder) };
  const healthIndicatorService = { check: vi.fn().mockReturnValue(session) };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3HealthIndicator,
        { provide: HealthIndicatorService, useValue: healthIndicatorService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    indicator = module.get<S3HealthIndicator>(S3HealthIndicator);
  });

  it('строит attempt по ключу с таймаутом 3с и HeadBucket-запросом', async () => {
    const result = indicator.isHealthy('s3');

    expect(healthIndicatorService.check).toHaveBeenCalledWith('s3');
    expect(attemptBuilder.withTimeout).toHaveBeenCalledWith(3000);
    expect(result).toBe('attempt');

    const send = vi.fn().mockResolvedValue({});
    (indicator as any).s3Client.send = send;
    const fn = session.attempt.mock.calls[0][0] as () => Promise<void>;
    await fn();
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ input: { Bucket: 'test-value' } }),
    );
  });
});
