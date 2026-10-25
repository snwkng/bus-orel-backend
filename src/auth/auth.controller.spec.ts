import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = { login: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('login возвращает токен для пользователя из запроса', async () => {
    authService.login.mockResolvedValue({ access_token: 'token' });
    const user = { _id: '1', username: 'admin' };

    const result = await controller.login(
      { username: 'admin', password: 'secret' },
      { user } as any,
    );

    expect(authService.login).toHaveBeenCalledWith(user);
    expect(result).toEqual({ access_token: 'token' });
  });

  it('logout возвращает сообщение об успехе', async () => {
    await expect(controller.logout()).resolves.toEqual({
      message: 'Выход выполнен успешно',
    });
  });
});
