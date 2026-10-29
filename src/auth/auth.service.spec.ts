import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import jwtConfig from './config/jwt.config';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = {
    checkUser: vi.fn(),
    setCurrentRefreshToken: vi.fn(),
    getUserWithRefreshToken: vi.fn(),
  };
  const jwtService = { signAsync: vi.fn() };
  const jwtConfiguration = {
    secret: 'secret',
    refreshSecret: 'refresh-secret',
    refreshExpiresIn: '7d',
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: jwtConfig.KEY, useValue: jwtConfiguration },
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
        toObject: vi.fn(),
      });

      await expect(service.validateUser('admin', 'wrong')).resolves.toBeNull();
    });

    it('мигрирует legacy-пароль из открытого текста в bcrypt при успешном логине', async () => {
      const save = vi.fn().mockResolvedValue(undefined);
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
      const save = vi.fn();
      usersService.checkUser.mockResolvedValue({
        username: 'admin',
        password: 'plain',
        save,
        toObject: vi.fn(),
      });

      await expect(service.validateUser('admin', 'nope')).resolves.toBeNull();
      expect(save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('возвращает пару токенов и сохраняет хэш refresh-токена', async () => {
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const userObjectId = new Types.ObjectId();
      const result = await service.login({
        _id: userObjectId,
        username: 'admin',
      });

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, {
        username: 'admin',
        sub: userObjectId,
      });
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { username: 'admin', sub: userObjectId },
        { secret: 'refresh-secret', expiresIn: '7d' },
      );
      expect(result).toEqual({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      });

      const [userId, hash] = usersService.setCurrentRefreshToken.mock.calls[0];
      expect(userId).toBe(userObjectId);
      expect(hash).toMatch(/^\$2/);
      await expect(bcrypt.compare('refresh-token', hash)).resolves.toBe(true);
    });
  });

  describe('refreshTokens', () => {
    it('бросает Unauthorized, если refresh-токен не сохранён (logout)', async () => {
      usersService.getUserWithRefreshToken.mockResolvedValue({
        _id: '1',
        username: 'admin',
        currentHashedRefreshToken: null,
      });

      await expect(service.refreshTokens('1', 'token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('бросает Unauthorized при несовпадении refresh-токена', async () => {
      usersService.getUserWithRefreshToken.mockResolvedValue({
        _id: '1',
        username: 'admin',
        currentHashedRefreshToken: await bcrypt.hash('other-token', 10),
      });

      await expect(service.refreshTokens('1', 'token')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.setCurrentRefreshToken).not.toHaveBeenCalled();
    });

    it('ротирует токены при валидном refresh-токене', async () => {
      usersService.getUserWithRefreshToken.mockResolvedValue({
        _id: '1',
        username: 'admin',
        currentHashedRefreshToken: await bcrypt.hash('old-refresh', 10),
      });
      jwtService.signAsync
        .mockResolvedValueOnce('new-access')
        .mockResolvedValueOnce('new-refresh');

      const result = await service.refreshTokens('1', 'old-refresh');

      expect(result).toEqual({
        access_token: 'new-access',
        refresh_token: 'new-refresh',
      });
      const [, hash] = usersService.setCurrentRefreshToken.mock.calls[0];
      await expect(bcrypt.compare('new-refresh', hash)).resolves.toBe(true);
    });
  });

  describe('logout', () => {
    it('обнуляет сохранённый refresh-токен', async () => {
      await service.logout('1');

      expect(usersService.setCurrentRefreshToken).toHaveBeenCalledWith(
        '1',
        null,
      );
    });
  });
});
