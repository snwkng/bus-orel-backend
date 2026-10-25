import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = { checkUser: jest.fn() };
  const jwtService = { sign: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('возвращает null, если пользователь не найден', async () => {
      usersService.checkUser.mockResolvedValue(undefined);

      await expect(service.validateUser('ghost', 'pass')).resolves.toBeNull();
    });

    it('проверяет bcrypt-хэш и возвращает пользователя без пароля', async () => {
      const password = await bcrypt.hash('secret', 10);
      const user = {
        username: 'admin',
        password,
        toObject() {
          return { _id: '1', username: 'admin', password };
        },
      };
      usersService.checkUser.mockResolvedValue(user);

      const result = await service.validateUser('admin', 'secret');

      expect(result).toEqual({ _id: '1', username: 'admin' });
    });

    it('возвращает null при неверном пароле (bcrypt)', async () => {
      const password = await bcrypt.hash('secret', 10);
      usersService.checkUser.mockResolvedValue({
        username: 'admin',
        password,
        toObject: jest.fn(),
      });

      await expect(service.validateUser('admin', 'wrong')).resolves.toBeNull();
    });

    it('мигрирует legacy-пароль из открытого текста в bcrypt при успешном логине', async () => {
      const save = jest.fn().mockResolvedValue(undefined);
      const user = {
        username: 'admin',
        password: 'plain',
        save,
        toObject() {
          return { _id: '1', username: 'admin', password: this.password };
        },
      };
      usersService.checkUser.mockResolvedValue(user);

      const result = await service.validateUser('admin', 'plain');

      expect(result.username).toBe('admin');
      expect(user.password).toMatch(/^\$2/);
      expect(save).toHaveBeenCalled();
    });

    it('не мигрирует legacy-пароль при неверном пароле', async () => {
      const save = jest.fn();
      usersService.checkUser.mockResolvedValue({
        username: 'admin',
        password: 'plain',
        save,
        toObject: jest.fn(),
      });

      await expect(service.validateUser('admin', 'nope')).resolves.toBeNull();
      expect(save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('подписывает JWT с username и sub', async () => {
      jwtService.sign.mockReturnValue('token');

      const result = await service.login({ _id: '1', username: 'admin' });

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'admin',
        sub: '1',
      });
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
