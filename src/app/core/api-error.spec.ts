import { HttpErrorResponse } from '@angular/common/http';

import { errorMessage } from './api-error';

function httpError(status: number, error: unknown = null): HttpErrorResponse {
  return new HttpErrorResponse({ status, error });
}

describe('errorMessage', () => {
  it('reports a network failure, not missing rights, for status 0', () => {
    expect(errorMessage(httpError(0))).toContain('Нет связи с сервером');
  });

  it('reports missing admin rights for 403', () => {
    expect(errorMessage(httpError(403))).toBe('Нет административных прав.');
  });

  it('uses string details from the API error body', () => {
    const body = { error: { status: 404, details: 'Страница не найдена.' } };
    expect(errorMessage(httpError(404, body))).toBe('Страница не найдена.');
  });

  it('joins field details from the API error body', () => {
    const body = { error: { status: 400, details: { email: ['Некорректный email.'], password: ['Обязательно.'] } } };
    expect(errorMessage(httpError(400, body))).toBe('Некорректный email. Обязательно.');
  });
});
