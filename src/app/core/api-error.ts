import { HttpErrorResponse } from '@angular/common/http';

import { ApiErrorBody } from './api.types';

export function errorMessage(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Неизвестная ошибка.';
  // status 0: запрос не дошёл до сервера; это не отказ в доступе.
  if (err.status === 0) return 'Нет связи с сервером. Проверьте, что API запущен.';
  if (err.status === 401) return 'Сессия недействительна. Войдите снова.';
  if (err.status === 403) return 'Нет административных прав.';
  if (err.status === 429) return 'Слишком много запросов. Подождите минуту.';
  const details = (err.error as ApiErrorBody | null)?.error?.details;
  if (typeof details === 'string') return details;
  if (Array.isArray(details)) return details.join(' ');
  if (details) return Object.values(details).flat().join(' ');
  return `Ошибка сервера (${err.status}).`;
}
