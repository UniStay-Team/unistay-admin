import { DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, catchError, of, switchMap, tap } from 'rxjs';

import { errorMessage } from './api-error';
import { Page } from './api.types';

export const PAGE_SIZE = 20;

// Состояние серверной таблицы. switchMap отменяет устаревший запрос,
// поэтому поздний ответ старой страницы не перезапишет новую.
// Вызывать в контексте внедрения (поле компонента).
export function pagedList<T>(fetch: (page: number) => Observable<Page<T>>) {
  const rows = signal<T[]>([]);
  const count = signal(0);
  const page = signal(1);
  const loading = signal(false);
  const error = signal<string | null>(null);
  const requests = new Subject<number>();

  requests
    .pipe(
      tap((p) => {
        page.set(p);
        loading.set(true);
        error.set(null);
      }),
      switchMap((p) =>
        fetch(p).pipe(
          catchError((err: unknown) => {
            error.set(errorMessage(err));
            return of(null);
          }),
        ),
      ),
      takeUntilDestroyed(inject(DestroyRef)),
    )
    .subscribe((result) => {
      if (result) {
        rows.set(result.results);
        count.set(result.count);
      }
      loading.set(false);
    });

  return {
    rows: rows.asReadonly(),
    count: count.asReadonly(),
    page: page.asReadonly(),
    loading: loading.asReadonly(),
    error: error.asReadonly(),
    load: (p: number) => requests.next(p),
    reload: () => requests.next(page()),
  };
}
