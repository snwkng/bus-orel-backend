// tours.service.ts

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  MultitourRequest,
  MultitourResponse,
  Country,
  isSuccessResponse
} from './tours.interface';

@Injectable()
export class TourService {
  private readonly logger = new Logger(TourService.name);
  private readonly apiUrl = process.env.MULTI_URL;
  private readonly token = process.env.MULTI_TOKEN;

  constructor(private readonly httpService: HttpService) {}

  /**
   * Приватный универсальный метод для отправки запросов
   */
  private async sendRequest<TParams, TResponse>(
    method: string,
    params: TParams = {} as TParams
  ): Promise<TResponse> {
    if (!this.token) {
      throw new HttpException(
        'Multitour API token is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const requestBody: MultitourRequest<TParams> = {
      header: {
        token: this.token,
        method: method,
      },
      request: params,
    };

    try {
      const response = await this.httpService.axiosRef.post<MultitourResponse<TResponse>>(
        this.apiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const rpcData = response.data;

      // Проверяем, вернул ли сервер ошибку
      if (!isSuccessResponse(rpcData)) {
        this.logger.error(
          `Multitour API Error [${method}]: ${rpcData.error.message}`,
          JSON.stringify(rpcData.error)
        );
        throw new HttpException(
          `Multitour API Error: ${rpcData.error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }

      return rpcData.response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to connect to Multitour API [${method}]: ${(error as any)?.message}`,
        (error as any)?.stack
      );
      throw new HttpException(
        'Multitour service temporarily unavailable',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  /**
   * Получение списка стран
   */
  async getCountries(): Promise<Country[]> {
    return this.sendRequest<{}, Country[]>('Geo.Country', {});
  }

  /**
   * Пример: Получение курортов по стране
   */
  async getResorts(countryId: number): Promise<any[]> {
    return this.sendRequest<{ country_id: number }, any[]>('Geo.Resort', {
      country_id: countryId,
    });
  }
}