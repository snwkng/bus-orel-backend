import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    login: vi.fn(),
    refreshTokens: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('login возвращает токены для пользователя из запроса', async () => {
    const tokens = { access_token: 'access', refresh_token: 'refresh' };
    authService.login.mockResolvedValue(tokens);
    const user = { _id: '1', username: 'admin' };

    const result = await controller.login(
      { username: 'admin', password: 'secret' },
      { user } as any,
    );

    expect(authService.login).toHaveBeenCalledWith(user);
    expect(result).toEqual(tokens);
  });

  it('refresh передаёт userId и refresh-токен из запроса в сервис', async () => {
    const tokens = { access_token: 'new-access', refresh_token: 'new-refresh' };
    authService.refreshTokens.mockResolvedValue(tokens);

    const result = await controller.refresh({
      user: { _id: '1', username: 'admin', refreshToken: 'old-refresh' },
    } as any);

    expect(authService.refreshTokens).toHaveBeenCalledWith('1', 'old-refresh');
    expect(result).toEqual(tokens);
  });

  it('logout отзывает refresh-токен и возвращает сообщение об успехе', async () => {
    const result = await controller.logout({ user: { _id: '1' } } as any);

    expect(authService.logout).toHaveBeenCalledWith('1');
    expect(result).toEqual({ message: 'Выход выполнен успешно' });
  });
});
