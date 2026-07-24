export interface MultitourRequest<T = any> {
  header: {
    token: string;
    method: string;
  };
  request: T;
}

// Базовая структура успешного ответа
export interface MultitourSuccessResponse<R = any> {
  header: {
    token: string;
    method: string;
  };
  request: any;
  response: R;
}

// Структура ответа при ошибке
export interface MultitourErrorResponse {
  header: {
    token: string;
    method: string;
  };
  request: any;
  error: {
    code: number;
    message: string;
    data?: any;
  };
}

// Объединенный тип ответа
export type MultitourResponse<T> = MultitourSuccessResponse<T> | MultitourErrorResponse;

// Интерфейс для страны (из документации)
export interface Country {
  id: number;
  name: string;
}

// Type guard для проверки типа ответа
export function isSuccessResponse<T>(
  response: MultitourResponse<T>
): response is MultitourSuccessResponse<T> {
  return 'response' in response;
}